#!/usr/bin/env node
/**
 * aiCRO landing assembler — zero deps.
 *
 *   node build-landing.mjs <repoRoot>
 *   e.g. node build-landing.mjs .
 *
 * Stitches assets/landing-shell.html (the head + skip-nav + topnav + <main>
 * marker + footer + script tags) with the section fragments in
 * assets/sections/*.html (sorted by filename) into index.html at the repo root.
 *
 * Marker in the shell: the literal HTML comment  <!-- @SECTIONS -->
 * Validates: shell marker replaced, no leftover {{TOKENS}} or [PLACEHOLDERS],
 * the single primary CTA "See a real engagement" appears >= 3 times, every
 * <section> carries an id. Warnings to stderr; hard failures exit 1.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(process.argv[2] || '.');
const die = (m) => { console.error('FAIL: ' + m); process.exit(1); };
const warn = (m) => console.error('warn: ' + m);

const shellPath = join(root, 'assets/landing-shell.html');
const secDir = join(root, 'assets/sections');
if (!existsSync(shellPath)) die('missing assets/landing-shell.html');
if (!existsSync(secDir)) die('missing assets/sections/');

const files = readdirSync(secDir).filter((f) => f.endsWith('.html')).sort();
if (!files.length) die('no section fragments in assets/sections/');

const sections = files.map((f) => readFileSync(join(secDir, f), 'utf8').trim()).join('\n\n');

let html = readFileSync(shellPath, 'utf8');
if (!html.includes('<!-- @SECTIONS -->')) die('shell has no <!-- @SECTIONS --> marker');
html = html.replace('<!-- @SECTIONS -->', sections);

// smartypants — curl quotes/apostrophes in PROSE only. Protects tags,
// attributes, and <script>/<style>/<code>/<kbd>/<pre> blocks. Idempotent
// (only matches straight glyphs), so sources stay plain ASCII and the build
// is the single source of typographic truth. (review A2, 2026-06-13)
function curl(s) {
  return s
    .replace(/(^|[\s(\[{—–>])"/g, '$1“')  // opening "
    .replace(/"/g, '”')                              // closing "
    .replace(/(^|[\s(\[{—–>])'/g, '$1‘')  // opening '
    .replace(/'/g, '’');                             // apostrophe / closing '
}
html = html
  .split(/(<(?:script|style|code|kbd|pre)\b[\s\S]*?<\/(?:script|style|code|kbd|pre)>|<[^>]+>)/gi)
  .map((seg, i) => (i % 2 === 1 ? seg : curl(seg)))
  .join('');

// validation
const leftover = html.match(/\{\{[A-Z_]+\}\}|\[(SUBJECT|DATE|ACCENT|AUDIENCE|TODO|PLACEHOLDER)\]/);
if (leftover) warn('leftover token/placeholder: ' + leftover[0]);
const cta = (html.match(/See a real engagement/g) || []).length;
if (cta < 3) warn(`primary CTA "See a real engagement" appears ${cta}x (want >= 3: hero, post-reveal, final)`);
const secs = [...html.matchAll(/<section\b[^>]*>/g)];
const noId = secs.filter((m) => !/\bid=/.test(m[0])).length;
if (noId) warn(`${noId} <section> without an id`);
if (/<link[^>]+href="https?:/.test(html) || /fonts\.googleapis/.test(html)) warn('external <link> detected — landing must be zero-network');

writeFileSync(join(root, 'index.html'), html);
console.log(JSON.stringify({
  file: join(root, 'index.html'),
  bytes: Buffer.byteLength(html),
  sections: files,
  ctaCount: cta,
}, null, 2));
