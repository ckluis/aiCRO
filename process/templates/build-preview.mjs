#!/usr/bin/env node
/**
 * aiCRO preview assembler — deterministic, zero deps.
 *
 *   node build-preview.mjs <websiteDir> [--shell <path>] [--js <path>]
 *
 * Expects in <websiteDir>:
 *   annotations.json   {subject,domain,date,accent,pages:[{id,file,title,path,intro:{audience,job},notes:[{section,what,why,bookRef,bookLabel}]}]}
 *   site/<file>        the standalone proposed-website pages
 * Writes <websiteDir>/preview.html and prints a JSON manifest to stdout.
 *
 * For each page: reads site/<file>, inlines its <link rel="stylesheet">
 * (shadow DOM can't follow relative links), embeds the page + notes as JSON.
 * Validates both directions: every note has a matching data-note section in
 * the page, and every data-note section has a note.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const dir = resolve(args[0] || '.');
const tdir = dirname(fileURLToPath(import.meta.url));
const opt = (flag, dflt) => { const i = args.indexOf(flag); return i !== -1 ? resolve(args[i + 1]) : dflt; };
const shellPath = opt('--shell', join(tdir, 'preview-shell.html'));
const jsPath = opt('--js', join(tdir, 'preview.js'));

const die = (m) => { console.error('FAIL: ' + m); process.exit(1); };
const warn = (m) => console.error('warn: ' + m);

const annPath = join(dir, 'annotations.json');
if (!existsSync(annPath)) die('no annotations.json in ' + dir);
const ann = JSON.parse(readFileSync(annPath, 'utf8'));
for (const k of ['subject', 'domain', 'pages']) if (!ann[k]) die('annotations.json missing "' + k + '"');
if (!ann.pages.length) die('annotations.json has no pages');

let problems = 0;
const pages = ann.pages.map((p) => {
  const f = join(dir, 'site', p.file);
  if (!existsSync(f)) { die(`page file missing: site/${p.file}`); }
  let html = readFileSync(f, 'utf8');

  /* inline stylesheets for shadow-DOM rendering */
  html = html.replace(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g, (m, href) => {
    const cssPath = join(dir, 'site', dirname(p.file), href);
    if (!existsSync(cssPath)) { warn(`${p.file}: stylesheet not found: ${href}`); problems++; return ''; }
    return '<style>\n' + readFileSync(cssPath, 'utf8') + '\n</style>';
  });

  /* cross-validate notes ↔ data-note sections */
  const inPage = [...html.matchAll(/data-note="([^"]+)"/g)].map((m) => m[1]);
  const inNotes = (p.notes || []).map((n) => n.section);
  for (const s of inNotes) if (!inPage.includes(s)) { warn(`${p.file}: note "${s}" has no data-note section`); problems++; }
  for (const s of inPage) if (!inNotes.includes(s)) { warn(`${p.file}: section "${s}" has no sidebar note`); problems++; }
  const dup = inPage.filter((s, i) => inPage.indexOf(s) !== i);
  if (dup.length) { warn(`${p.file}: duplicate data-note ids: ${[...new Set(dup)].join(', ')}`); problems++; }

  /* resolve each note's bookRef anchor → a href relative to THIS preview
     (the standalone preview sits in website/, so the book is ../book/…) */
  const notes = (p.notes || []).map((n) => {
    const out = { ...n };
    if (n.bookRef) out.bookHref = '../book/index.html#' + String(n.bookRef).replace(/^#/, '');
    return out;
  });

  return { id: p.id, file: p.file, title: p.title, path: p.path || '/' + p.file,
           intro: p.intro || null, notes, html };
});

/* assemble — escape closing tags so embedded JSON can't break the script */
const payload = ('window.AICRO_DOMAIN = ' + JSON.stringify(ann.domain) + ';\n' +
  'window.AICRO_PAGES = ' + JSON.stringify(pages) + ';')
  .replace(/<\//g, '<\\/');

let html = readFileSync(shellPath, 'utf8');
const tokens = { SUBJECT: ann.subject, DOMAIN: ann.domain, DATE: ann.date || '', ACCENT: ann.accent || '#B3471D' };
html = html.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in tokens ? tokens[k] : (warn('unknown token ' + m), m)));
html = html.replace('<!-- @DATA -->', '<script>\n' + payload + '\n</script>');
html = html.replace('<!-- @JS -->', '<script>\n' + readFileSync(jsPath, 'utf8') + '\n</script>');
if (html.includes('@DATA') || html.includes('@JS')) die('shell markers not replaced');

writeFileSync(join(dir, 'preview.html'), html);
console.log(JSON.stringify({
  file: join(dir, 'preview.html'),
  bytes: Buffer.byteLength(html),
  pages: pages.map((p) => `${p.title} (${p.notes.length} notes)`),
  problems,
}, null, 2));
if (problems) console.error(problems + ' annotation problem(s) — fix before shipping.');
