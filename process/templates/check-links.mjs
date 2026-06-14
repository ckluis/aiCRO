#!/usr/bin/env node
/**
 * aiCRO mechanical QA — zero deps.
 *
 *   node check-links.mjs <companyDir>
 *
 * Over every .html under <companyDir> (excluding _work/ and book/chapters/
 * fragments, which are build inputs validated via the assembled book/index.html):
 *   · every relative href/src resolves to a file
 *   · every #anchor (same-file or cross-file) resolves to an id
 *   · external http(s)/protocol links are listed (mock-site pages may carry
 *     them legitimately — mailto:, tel:, and schema.org in JSON-LD are fine;
 *     anything fetched at render time is a failure)
 *   · banned operator jargon in client-facing files
 * Prints a JSON report; exit 1 on hard failures.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative, sep } from 'node:path';

const root = resolve(process.argv[2] || '.');
const htmlFiles = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) {
      /* book/chapters/ holds pre-assembly fragments — their links/anchors only
         resolve in the assembled book/index.html, which IS scanned. Skip them. */
      if (f === 'chapters' && d.split(sep).pop() === 'book') continue;
      if (f !== '_work' && f !== '.gstack') walk(p);
    }
    else if (f.endsWith('.html')) htmlFiles.push(p);
  }
})(root);

const JARGON = [/\bICP\b/, /\bdefund/i, /anti-fit/i, /lorem ipsum/i, /\bTODO\b/, /\[(SUBJECT|DATE|ACCENT|AUDIENCE)\]/];
/* "tier" is allowed in operator docs but not in mock-site pages */
const ids = new Map(); // file -> Set(ids)
const docs = new Map(); // file -> content
for (const f of htmlFiles) {
  const c = readFileSync(f, 'utf8');
  docs.set(f, c);
  ids.set(f, new Set([...c.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1])));
}

const broken = [], anchors = [], external = [], jargon = [], renderFetch = [];
for (const f of htmlFiles) {
  const c = docs.get(f);
  const rel = relative(root, f).split(sep).join('/');

  for (const m of c.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(mailto:|tel:|javascript:|data:)/.test(url)) continue;
    if (/^https?:\/\//.test(url)) { external.push(`${rel} → ${url}`); continue; }
    const [path, hash] = url.split('#');
    let target = f;
    if (path) {
      target = resolve(dirname(f), decodeURIComponent(path));
      if (!existsSync(target)) { broken.push(`${rel} → ${url}`); continue; }
    }
    if (hash && docs.has(target) && !ids.get(target).has(decodeURIComponent(hash)))
      anchors.push(`${rel} → ${url} (missing #${hash})`);
  }

  for (const m of c.matchAll(/<(?:link|script|img)[^>]+(?:href|src)="(https?:[^"]+)"[^>]*>/g)) {
    /* <link rel="canonical"> is SEO metadata, never fetched at render time */
    if (/^<link\b/.test(m[0]) && /\brel="canonical"/.test(m[0])) continue;
    renderFetch.push(`${rel} → ${m[1]}`);
  }

  for (const re of JARGON) {
    const m = c.match(re);
    if (m) jargon.push(`${rel}: "${m[0]}"`);
  }
  const verifies = (c.match(/verify before publishing/gi) || []).length;
  if (verifies) jargon.push(`${rel}: ${verifies} [verify before publishing] gate(s) — intentional? list for operator`);
}

const report = {
  root, files: htmlFiles.length,
  brokenLinks: broken, brokenAnchors: anchors,
  renderTimeExternalFetches: renderFetch,
  externalLinks: external.slice(0, 80),
  externalLinkCount: external.length,
  jargonAndFlags: jargon,
  pass: broken.length === 0 && anchors.length === 0 && renderFetch.length === 0,
};
console.log(JSON.stringify(report, null, 2));
process.exit(report.pass ? 0 : 1);
