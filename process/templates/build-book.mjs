#!/usr/bin/env node
/**
 * aiCRO book assembler — deterministic, zero deps.
 *
 *   node build-book.mjs <bookDir> [--shell <path>]
 *
 * Expects in <bookDir>:
 *   meta.json     {subject,title,subtitle,date,version,thesis,accent,preparedFor}
 *   chapters/*.html   chapter fragments (see book-shell.html header for contract)
 * Writes <bookDir>/index.html and prints a JSON manifest to stdout.
 *
 * Responsibilities (so chapter agents never hand-number anything):
 *   1. Stitch fragments in filename order into the shell.
 *   2. Number exhibits globally; fill <span class="exnum"> and patch
 *      <a class="exref" href="#id"> link text to "Exhibit N".
 *   3. Generate the TOC: parts → chapters → h2 sub-links.
 *   4. Validate: duplicate ids, exref targets, h2s without ids, term links
 *      pointing at missing glossary anchors. Warnings go to stderr;
 *      hard failures exit 1.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const bookDir = resolve(args[0] || '.');
const shellIx = args.indexOf('--shell');
const shellPath = shellIx !== -1 ? resolve(args[shellIx + 1])
  : join(dirname(fileURLToPath(import.meta.url)), 'book-shell.html');

const die = (msg) => { console.error('FAIL: ' + msg); process.exit(1); };
const warn = (msg) => console.error('warn: ' + msg);

if (!existsSync(join(bookDir, 'meta.json'))) die(`no meta.json in ${bookDir}`);
const meta = JSON.parse(readFileSync(join(bookDir, 'meta.json'), 'utf8'));
for (const k of ['subject', 'title', 'date', 'version']) if (!meta[k]) die(`meta.json missing "${k}"`);

const chapterDir = join(bookDir, 'chapters');
const files = readdirSync(chapterDir).filter(f => f.endsWith('.html')).sort();
if (!files.length) die(`no chapter fragments in ${chapterDir}`);

let body = files.map(f => readFileSync(join(chapterDir, f), 'utf8').trim()).join('\n\n');

/* ---- 1. exhibit numbering ------------------------------------------- */
const exIds = [];
body = body.replace(/<figure class="exhibit"[^>]*\bid="([^"]+)"[^>]*>/g, (m, id) => {
  exIds.push(id);
  return m;
});
const exNum = new Map(exIds.map((id, i) => [id, i + 1]));
const dupEx = exIds.filter((id, i) => exIds.indexOf(id) !== i);
if (dupEx.length) die('duplicate exhibit ids: ' + [...new Set(dupEx)].join(', '));

/* fill exnum spans in document order */
let exCursor = 0;
body = body.replace(/<span class="exnum">\s*<\/span>/g, () =>
  `<span class="exnum">Exhibit ${++exCursor}</span>`);
if (exCursor !== exIds.length)
  warn(`${exIds.length} exhibits but ${exCursor} exnum spans filled — check fragments`);

/* patch cross-references */
body = body.replace(/(<a class="exref" href="#([^"]+)"[^>]*>)([\s\S]*?)(<\/a>)/g,
  (m, open, id, _txt, close) => {
    if (!exNum.has(id)) { warn(`exref to missing exhibit #${id}`); return m; }
    return `${open}Exhibit ${exNum.get(id)}${close}`;
  });

/* ---- 2. TOC ----------------------------------------------------------- */
const chapters = [];
{
  const re = /<section class="chapter"[^>]*\bid="([^"]+)"[^>]*\bdata-num="([^"]*)"[^>]*\bdata-title="([^"]+)"[^>]*\bdata-part="([^"]+)"[^>]*>([\s\S]*?)<\/section>/g;
  let m;
  while ((m = re.exec(body))) {
    const subs = [];
    const h2re = /<h2[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g;
    let h;
    while ((h = h2re.exec(m[5]))) subs.push({ id: h[1], title: h[2].replace(/<[^>]+>/g, '').trim() });
    const plainH2 = (m[5].match(/<h2(?![^>]*\bid=)/g) || []).length;
    if (plainH2) warn(`chapter ${m[1]}: ${plainH2} h2(s) without id — excluded from TOC`);
    chapters.push({ id: m[1], num: m[2], title: m[3], part: m[4], subs });
  }
}
if (!chapters.length) die('no <section class="chapter"> blocks matched the contract');

let toc = '', lastPart = '';
for (const ch of chapters) {
  if (ch.part !== lastPart) { toc += `    <div class="part">${ch.part}</div>\n`; lastPart = ch.part; }
  toc += `    <a href="#${ch.id}"><span class="n">${ch.num}</span><span>${ch.title}</span></a>\n`;
  for (const s of ch.subs) toc += `    <a class="sub" href="#${s.id}">${s.title}</a>\n`;
}

/* ---- 3. validation ---------------------------------------------------- */
const allIds = [...body.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
const dupIds = allIds.filter((id, i) => allIds.indexOf(id) !== i);
if (dupIds.length) die('duplicate ids: ' + [...new Set(dupIds)].slice(0, 10).join(', '));
const idSet = new Set(allIds);
for (const m of body.matchAll(/class="term" href="#([^"]+)"/g))
  if (!idSet.has(m[1])) warn(`a.term points at missing glossary anchor #${m[1]}`);

/* ---- 4. assemble ------------------------------------------------------ */
let html = readFileSync(shellPath, 'utf8');
const tokens = {
  TITLE: meta.title, SUBJECT: meta.subject, SUBTITLE: meta.subtitle || '',
  DATE: meta.date, VERSION: meta.version, THESIS: meta.thesis || '',
  ACCENT: meta.accent || '#B3471D', PREPAREDFOR: meta.preparedFor || meta.subject,
};
html = html.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in tokens ? tokens[k] : (warn(`unknown token ${m}`), m)));
html = html.replace('<!-- @TOC -->', '\n' + toc.trimEnd());
html = html.replace('<!-- @CHAPTERS -->', body);
if (html.includes('@TOC') || html.includes('@CHAPTERS')) die('shell markers not replaced — check shell');

writeFileSync(join(bookDir, 'index.html'), html);
console.log(JSON.stringify({
  file: join(bookDir, 'index.html'),
  bytes: Buffer.byteLength(html),
  chapters: chapters.map(c => `${c.num} ${c.title} (${c.subs.length} sections)`),
  exhibits: exIds.length,
}, null, 2));
