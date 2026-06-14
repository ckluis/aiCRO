/* aiCRO preview runtime — inlined into preview.html by build-preview.mjs.
   Renders site pages into a shadow root (style isolation, file:// safe),
   draws numbered annotation pins on the live page, and scroll-syncs a
   guidance sidebar of consulting notes (principle · what · why · was · book). */
(function () {
  'use strict';
  var PAGES = window.AICRO_PAGES;   /* [{id,file,title,path,intro,notes:[{section,label,principle,what,why,before,bookHref,bookLabel}],html}] */
  if (!PAGES || !PAGES.length) return;

  var host = document.getElementById('host');
  var vp = document.getElementById('vp');
  var tabs = document.getElementById('tabs');
  var pathEl = document.getElementById('path');
  var guideTitle = document.getElementById('guide-title');
  var guideBody = document.getElementById('guide-body');
  var backBtn = document.getElementById('back');
  var fwdBtn = document.getElementById('fwd');
  var shadow = host.attachShadow({ mode: 'open' });
  var AC = (getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#B3471D').trim();
  var io = null, spyLock = null, curSections = [];
  var hist = [], histIx = -1;
  var byFile = {}, byId = {};
  PAGES.forEach(function (p) { byFile[p.file] = p; byId[p.id] = p; });

  PAGES.forEach(function (p) {
    var b = document.createElement('button');
    b.className = 'tab'; b.textContent = p.title; b.dataset.page = p.id;
    b.addEventListener('click', function () { go(p.id); });
    tabs.appendChild(b);
  });

  document.querySelectorAll('.devices button').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.devices button').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      vp.className = b.dataset.dev;
      vp.classList.toggle('pad', b.dataset.dev !== 'desktop');
      if (b.dataset.dev !== 'desktop') vp.classList.add(b.dataset.dev);
    });
  });

  backBtn.addEventListener('click', function () { if (histIx > 0) { histIx--; render(hist[histIx]); } });
  fwdBtn.addEventListener('click', function () { if (histIx < hist.length - 1) { histIx++; render(hist[histIx]); } });

  function go(id) {
    if (hist[histIx] === id) return;
    hist = hist.slice(0, histIx + 1); hist.push(id); histIx++;
    render(id);
  }

  function render(id) {
    var page = byId[id] || PAGES[0];
    document.querySelectorAll('.tab').forEach(function (t) { t.classList.toggle('on', t.dataset.page === page.id); });
    pathEl.textContent = page.path;
    backBtn.disabled = histIx <= 0;
    fwdBtn.disabled = histIx >= hist.length - 1;

    var doc = new DOMParser().parseFromString(page.html, 'text/html');
    shadow.innerHTML = '';
    doc.querySelectorAll('style').forEach(function (s) { shadow.appendChild(s.cloneNode(true)); });

    /* annotation chrome injected into the shadow root: section outline + numbered pins */
    var sync = document.createElement('style');
    sync.textContent =
      '[data-note]{position:relative;}' +
      '[data-note].aicro-on{outline:2px solid ' + AC + ';outline-offset:-2px;border-radius:2px;}' +
      '[data-note].flash{outline:3px solid ' + AC + ';outline-offset:-3px;}' +
      '.aicro-pin{position:absolute;top:12px;right:12px;z-index:99990;min-width:26px;height:26px;padding:0 7px;' +
      'border:2px solid #fff;border-radius:99px;cursor:pointer;font:800 13px/1 system-ui,-apple-system,sans-serif;' +
      'color:#fff;background:' + AC + ';box-shadow:0 2px 8px rgba(0,0,0,.28);display:inline-flex;align-items:center;' +
      'gap:4px;opacity:.62;transition:opacity .15s,transform .15s;}' +
      '.aicro-pin:hover,.aicro-pin.on{opacity:1;transform:scale(1.08);}' +
      '.aicro-pin.on::after{content:attr(data-label);font:700 11px/1 system-ui,sans-serif;white-space:nowrap;}' +
      '@media print{.aicro-pin{display:none}}';
    shadow.appendChild(sync);

    var bodyWrap = document.createElement('div');
    Array.prototype.slice.call(doc.body.childNodes).forEach(function (n) {
      if (n.tagName === 'SCRIPT') return;
      bodyWrap.appendChild(document.importNode(n, true));
    });
    shadow.appendChild(bodyWrap);
    vp.scrollTop = 0;

    /* one numbered pin per annotated section, in page order matching the cards */
    var noteOrder = (page.notes || []).map(function (n) { return n.section; });
    curSections = [];
    (page.notes || []).forEach(function (note, i) {
      var sec = shadow.querySelector('[data-note="' + cssEsc(note.section) + '"]');
      if (!sec) return;
      curSections.push(sec);
      if (!sec.querySelector(':scope > .aicro-pin')) {
        var pin = document.createElement('button');
        pin.className = 'aicro-pin'; pin.type = 'button';
        pin.textContent = (i + 1);
        pin.setAttribute('data-label', note.label || 'why');
        pin.setAttribute('aria-label', 'Annotation ' + (i + 1) + (note.label ? ': ' + note.label : ''));
        pin.addEventListener('click', function (ev) { ev.stopPropagation(); activate(note.section, { jump: true, scrollGuide: true }); });
        sec.appendChild(pin);
      }
    });

    shadow.addEventListener('click', function (ev) {
      var a = ev.target && ev.target.closest && ev.target.closest('a[href]');
      if (!a) return;
      var href = a.getAttribute('href');
      if (/^(mailto:|tel:|https?:)/.test(href)) return;
      ev.preventDefault();
      var file = href.split('#')[0].replace(/^\.\//, ''), hash = href.split('#')[1];
      if (file && byFile[file]) {
        go(byFile[file].id);
        if (hash) requestAnimationFrame(function () { scrollToEl(shadow.getElementById(hash)); });
      } else if (!file && hash) { scrollToEl(shadow.getElementById(hash)); }
    });

    renderGuide(page);
    watchSections();
  }

  function cssEsc(s) { return (window.CSS && CSS.escape) ? CSS.escape(s) : s.replace(/"/g, '\\"'); }

  function scrollToEl(el) {
    if (!el) return;
    var top = el.getBoundingClientRect().top - vp.getBoundingClientRect().top + vp.scrollTop;
    vp.scrollTo({ top: Math.max(top - 20, 0), behavior: 'smooth' });
  }

  function renderGuide(page) {
    guideTitle.textContent = page.title;
    guideBody.innerHTML = '';
    if (page.intro) {
      var pi = document.createElement('div');
      pi.className = 'pageintro';
      pi.innerHTML = '<p><b>Who it’s for:</b> ' + esc(page.intro.audience) + '</p>' +
                     '<p><b>Its one job:</b> ' + esc(page.intro.job) + '</p>';
      guideBody.appendChild(pi);
    }
    var total = (page.notes || []).length;
    (page.notes || []).forEach(function (note, i) {
      var card = document.createElement('div');
      card.className = 'note';
      card.dataset.section = note.section;
      card.innerHTML =
        '<div class="note-head"><span class="note-n">' + (i + 1) + '</span>' +
        '<span class="note-label">' + esc(note.label || 'Section ' + (i + 1)) + '</span>' +
        '<span class="note-of">' + (i + 1) + '/' + total + '</span></div>' +
        (note.principle ? '<span class="note-principle">' + esc(note.principle) + '</span>' : '') +
        '<p class="note-what">' + esc(note.what) + '</p>' +
        '<p class="note-why">' + esc(note.why) + '</p>' +
        (note.before ? '<p class="note-was"><b>On the old site:</b> ' + esc(note.before) + '</p>' : '') +
        (note.bookHref ? '<a class="note-book" href="' + note.bookHref + '" target="_blank" rel="noopener">' + esc(note.bookLabel || 'From the book') + '</a>' : '');
      card.addEventListener('click', function (ev) {
        if (ev.target.closest('a')) return;
        activate(note.section, { jump: true, scrollGuide: false });
      });
      guideBody.appendChild(card);
    });
  }

  function activate(sectionId, opts) {
    opts = opts || {};
    if (opts.jump) {
      var el = shadow.querySelector('[data-note="' + cssEsc(sectionId) + '"]');
      if (el) { scrollToEl(el); el.classList.add('flash'); setTimeout(function () { el.classList.remove('flash'); }, 1300); }
    }
    clearTimeout(spyLock && spyLock.t);
    spyLock = { section: sectionId };
    spyLock.t = setTimeout(function () { spyLock = null; }, 1200);
    setActive(sectionId, !!opts.scrollGuide);
  }

  function setActive(sectionId, scrollGuide) {
    guideBody.querySelectorAll('.note').forEach(function (c) { c.classList.toggle('on', c.dataset.section === sectionId); });
    curSections.forEach(function (sec) {
      var on = sec.getAttribute('data-note') === sectionId;
      sec.classList.toggle('aicro-on', on);
      var pin = sec.querySelector(':scope > .aicro-pin'); if (pin) pin.classList.toggle('on', on);
    });
    if (scrollGuide) {
      var on = guideBody.querySelector('.note.on'), g = guideBody.closest('.guide');
      if (on && g) {
        var r = on.getBoundingClientRect(), gr = g.getBoundingClientRect();
        if (r.top < gr.top + 40 || r.bottom > gr.bottom - 40)
          g.scrollTo({ top: g.scrollTop + (r.top - gr.top) - gr.height / 2 + r.height / 2, behavior: 'smooth' });
      }
    }
  }

  function watchSections() {
    if (io) io.disconnect();
    if (!curSections.length) return;
    io = new IntersectionObserver(function (entries) {
      if (spyLock) { setActive(spyLock.section, false); return; }
      var best = null;
      entries.forEach(function (e) { if (e.isIntersecting && (!best || e.intersectionRatio > best.intersectionRatio)) best = e; });
      if (best) setActive(best.target.getAttribute('data-note'), true);
    }, { root: vp, rootMargin: '-15% 0px -55% 0px', threshold: [0, .2, .5] });
    curSections.forEach(function (s) { io.observe(s); });
  }

  vp.addEventListener('scroll', function () {
    if (spyLock || !curSections.length) return;
    if (vp.scrollTop + vp.clientHeight >= vp.scrollHeight - 4)
      setActive(curSections[curSections.length - 1].getAttribute('data-note'), true);
  }, { passive: true });

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  go(PAGES[0].id);
})();
