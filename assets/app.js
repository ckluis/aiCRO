/* aiCRO landing-page interaction layer — one shared, dependency-free script.
   Progressive enhancement: with JS off, the page is fully readable; only the
   live hero-browser preview is JS-only. Opens from file:// with zero network
   requests. Every behavior is guarded so a missing element never throws.

   Three behaviors:
     1. The hero-browser runtime — renders window.AICRO_HERO into a shadow root,
        scroll-syncs the guidance sidebar both ways, toggles device width, and
        routes the demo site's internal links through the hero (switch tab).
     2. Topnav hamburger — collapses the nav on narrow screens.
     3. Scroll-reveal — fades [data-reveal] sections in on entry (reduced-motion
        respected: rendered final-state, no animation, no observer). */
(function () {
  'use strict';

  var REDUCED = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- site base-path trick -------------------------------------------------
     Derive the directory the page lives in from this script's own src so any
     URLs we build resolve on root, subpath (GH Pages project page), and
     file:// deploys alike. Kept for parity with the house style even though the
     hero routes by page id, not absolute URL. */
  var SITE_BASE = (function () {
    try {
      var s = document.querySelector('script[src$="assets/app.js"]') ||
        document.currentScript;
      if (s && s.getAttribute('src')) {
        var src = s.getAttribute('src');
        return src.replace(/assets\/app\.js.*$/, '');
      }
    } catch (e) {}
    return '';
  })();
  void SITE_BASE;

  /* ==========================================================================
     1. HERO-BROWSER RUNTIME
     ========================================================================== */
  (function hero() {
    var DATA = window.AICRO_HERO;
    if (!DATA || !DATA.pages || !DATA.pages.length) return;

    var host = document.getElementById('hbHost');
    var vp = document.getElementById('hbViewport');
    var tabs = document.getElementById('hbTabs');
    var guide = document.getElementById('hbGuide');
    var domainEl = document.getElementById('hbDomain');
    var pathEl = document.getElementById('hbPath');
    /* host + viewport + guide are load-bearing; bail cleanly if absent. */
    if (!host || !vp || !host.attachShadow) return;

    var PAGES = DATA.pages;
    var byId = {}, byFile = {};
    PAGES.forEach(function (p) {
      byId[p.id] = p;
      if (p.file) byFile[normFile(p.file)] = p;
    });

    if (domainEl && DATA.domain) domainEl.textContent = DATA.domain;

    var shadow = host.attachShadow({ mode: 'open' });
    var io = null;            /* per-page IntersectionObserver */
    var curSections = [];     /* this page's [data-note] elements, for bottom-pin */
    var spyLock = null;       /* {section,t}: pins active card during a click-scroll */
    var activeId = null;

    var ACCENT = (getComputedStyle(document.documentElement)
      .getPropertyValue('--accent') || '#B3471D').trim() || '#B3471D';

    /* --- tabs: one button.hb-tab[data-page] per page ----------------------- */
    if (tabs) {
      tabs.innerHTML = '';
      PAGES.forEach(function (p) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'hb-tab';
        b.textContent = p.title || p.id;
        b.setAttribute('data-page', p.id);
        b.addEventListener('click', function () { go(p.id); });
        tabs.appendChild(b);
      });
    }

    /* --- device toggle: resize the viewport -------------------------------- */
    var devButtons = document.querySelectorAll('.hb-dev');
    var DEV_WIDTH = { desktop: '', tablet: '820px', phone: '390px' };
    Array.prototype.forEach.call(devButtons, function (b) {
      b.addEventListener('click', function () {
        var dev = b.getAttribute('data-dev') || 'desktop';
        Array.prototype.forEach.call(devButtons, function (x) {
          var on = x === b;
          x.classList.toggle('active', on);
          x.classList.toggle('on', on); /* the contract markup ships .on initially */
        });
        setDevice(dev);
      });
    });
    function setDevice(dev) {
      var frame = vp.querySelector('.hb-frame');
      var w = DEV_WIDTH.hasOwnProperty(dev) ? DEV_WIDTH[dev] : '';
      vp.setAttribute('data-dev', dev);
      vp.classList.toggle('is-narrow', dev !== 'desktop');
      if (frame) {
        frame.style.maxWidth = w || '';
        frame.style.margin = w ? '0 auto' : '';
      }
    }

    /* --- navigation -------------------------------------------------------- */
    function go(id) {
      if (id === activeId) return;
      var page = byId[id];
      if (!page) return;
      render(page);
    }

    function render(page) {
      activeId = page.id;

      /* chrome state */
      if (tabs) {
        Array.prototype.forEach.call(tabs.querySelectorAll('.hb-tab'), function (t) {
          t.classList.toggle('active', t.getAttribute('data-page') === page.id);
        });
      }
      if (pathEl) pathEl.textContent = page.path || '/';

      /* parse + mount the page into the shadow root */
      var doc;
      try {
        doc = new DOMParser().parseFromString(page.html || '', 'text/html');
      } catch (e) {
        doc = null;
      }
      shadow.innerHTML = '';

      /* carry the demo site's own styles (it ships warm, self-contained CSS) */
      if (doc) {
        doc.querySelectorAll('style, link[rel="stylesheet"]').forEach(function (s) {
          shadow.appendChild(s.cloneNode(true));
        });
      }

      /* scoped annotation chrome: click-flash, active-section outline, and the
         numbered pins drawn on the live page (so each note points at its pixel) */
      var flash = document.createElement('style');
      flash.textContent =
        '[data-note]{position:relative;}' +
        '[data-note].aicro-on{outline:2px solid ' + ACCENT + ';outline-offset:-2px;border-radius:2px;}' +
        '[data-note].hb-flash{animation:hbFlash .9s ease 1}' +
        '@keyframes hbFlash{from{background:' + ACCENT + '22}to{background:transparent}}' +
        '.aicro-pin{position:absolute;top:10px;right:10px;z-index:99990;min-width:24px;height:24px;padding:0 6px;' +
        'border:2px solid #fff;border-radius:99px;cursor:pointer;font:800 12px/1 system-ui,-apple-system,sans-serif;' +
        'color:#fff;background:' + ACCENT + ';box-shadow:0 2px 7px rgba(0,0,0,.28);display:inline-flex;align-items:center;' +
        'opacity:.6;transition:opacity .15s,transform .15s;}' +
        '.aicro-pin:hover,.aicro-pin.on{opacity:1;transform:scale(1.1);}';
      shadow.appendChild(flash);

      /* clone the body, skipping scripts (demo pages are static in the preview) */
      var wrap = document.createElement('div');
      wrap.className = 'hb-doc';
      if (doc && doc.body) {
        Array.prototype.slice.call(doc.body.childNodes).forEach(function (n) {
          if (n.tagName === 'SCRIPT') return;
          wrap.appendChild(document.importNode(n, true));
        });
      }
      shadow.appendChild(wrap);
      vp.scrollTop = 0;

      /* one numbered pin per annotated section, in card order */
      (page.notes || []).forEach(function (note, i) {
        var sec = shadow.querySelector('[data-note="' + cssEscape(note.section) + '"]');
        if (!sec || sec.querySelector(':scope > .aicro-pin')) return;
        var pin = document.createElement('button');
        pin.type = 'button';
        pin.className = 'aicro-pin';
        pin.textContent = (i + 1);
        pin.setAttribute('aria-label', 'Annotation ' + (i + 1) + (note.label ? ': ' + note.label : ''));
        pin.addEventListener('click', function (ev) {
          ev.stopPropagation();
          activate(note.section, { jump: true, scrollGuide: true });
        });
        sec.appendChild(pin);
      });

      renderGuide(page);
      watchSections();

      /* reapply current device width to the fresh frame */
      var dev = vp.getAttribute('data-dev') || 'desktop';
      setDevice(dev);
    }

    /* route the demo site's own links through the hero instead of leaving */
    shadow.addEventListener('click', function (ev) {
      var a = ev.target && ev.target.closest && ev.target.closest('a[href]');
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href) return;
      if (/^(mailto:|tel:|javascript:|https?:)/i.test(href)) return; /* external */
      ev.preventDefault();
      var parts = href.split('#');
      var file = normFile(parts[0]);
      var hash = parts[1];
      if (file && byFile[file]) {
        go(byFile[file].id);
        if (hash) requestAnimationFrame(function () {
          scrollToEl(shadow.getElementById(hash));
        });
      } else if (!file && hash) {
        scrollToEl(shadow.getElementById(hash));
      }
    });

    /* --- guidance sidebar -------------------------------------------------- */
    function renderGuide(page) {
      if (!guide) return;
      guide.innerHTML = '';
      var notes = page.notes || [];
      var total = notes.length;
      notes.forEach(function (note, i) {
        var card = document.createElement('div');
        card.className = 'note';
        card.setAttribute('data-section', note.section);
        card.innerHTML =
          '<div class="note-head"><span class="note-n">' + (i + 1) + '</span>' +
          '<span class="note-label">' + esc(note.label || sectionLabel(note.section)) + '</span>' +
          '<span class="note-of">' + (i + 1) + '/' + total + '</span></div>' +
          (note.principle ? '<span class="note-principle">' + esc(note.principle) + '</span>' : '') +
          (note.what ? '<p class="note-what">' + esc(note.what) + '</p>' : '') +
          (note.why ? '<p class="note-why">' + esc(note.why) + '</p>' : '') +
          (note.before ? '<p class="note-was"><b>On the old site:</b> ' + esc(note.before) + '</p>' : '') +
          (note.bookHref ? '<a class="note-book" href="' + note.bookHref + '" target="_blank" rel="noopener">' + esc(note.bookLabel || 'From the book') + '</a>' : '');
        card.addEventListener('click', function (ev) {
          if (ev.target && ev.target.closest && ev.target.closest('a')) return;
          activate(note.section, { jump: true, scrollGuide: false });
        });
        guide.appendChild(card);
      });
    }

    /* unified: card click + pin click route here */
    function activate(section, opts) {
      opts = opts || {};
      if (opts.jump) {
        var el = shadow.querySelector('[data-note="' + cssEscape(section) + '"]');
        if (el) {
          scrollToEl(el);
          el.classList.add('hb-flash');
          setTimeout(function () { el.classList.remove('hb-flash'); }, 1300);
        }
      }
      if (spyLock) clearTimeout(spyLock.t);
      spyLock = { section: section };
      spyLock.t = setTimeout(function () { spyLock = null; }, 1200);
      setActive(section, !!opts.scrollGuide);
    }

    function setActive(section, scrollGuide) {
      if (!guide) return;
      var cards = guide.querySelectorAll('.note');
      Array.prototype.forEach.call(cards, function (c) {
        c.classList.toggle('on', c.getAttribute('data-section') === section);
      });
      curSections.forEach(function (sec) {
        var on = sec.getAttribute('data-note') === section;
        sec.classList.toggle('aicro-on', on);
        var pin = sec.querySelector(':scope > .aicro-pin'); if (pin) pin.classList.toggle('on', on);
      });
      if (scrollGuide && !REDUCED) {
        var on = guide.querySelector('.note.on');
        if (on) {
          /* scroll the guide pane only — scrollIntoView would also scroll the
             window and hide the chrome. */
          var r = on.getBoundingClientRect(), gr = guide.getBoundingClientRect();
          if (r.top < gr.top + 40 || r.bottom > gr.bottom - 40) {
            guide.scrollTo({
              top: guide.scrollTop + (r.top - gr.top) - gr.height / 2 + r.height / 2,
              behavior: 'smooth'
            });
          }
        }
      }
    }

    /* --- scroll-sync: viewport → active card ------------------------------- */
    function watchSections() {
      if (io) { io.disconnect(); io = null; }
      curSections = Array.prototype.slice.call(shadow.querySelectorAll('[data-note]'));
      if (!curSections.length) return;
      /* highlight the first card up front */
      setActive(curSections[0].getAttribute('data-note'), false);

      if (!('IntersectionObserver' in window)) return;
      io = new IntersectionObserver(function (entries) {
        if (spyLock) { setActive(spyLock.section, false); return; }
        var best = null;
        entries.forEach(function (e) {
          if (e.isIntersecting &&
            (!best || e.intersectionRatio > best.intersectionRatio)) best = e;
        });
        if (best) setActive(best.target.getAttribute('data-note'), true);
      }, { root: vp, rootMargin: '-15% 0px -55% 0px', threshold: [0, 0.2, 0.5] });
      curSections.forEach(function (s) { io.observe(s); });
    }

    /* the IO band never reaches the last (footer) section — pin it when the
       viewport bottoms out. Registered once; reads the live section list. */
    vp.addEventListener('scroll', function () {
      if (spyLock || !curSections.length) return;
      if (vp.scrollTop + vp.clientHeight >= vp.scrollHeight - 4) {
        setActive(curSections[curSections.length - 1].getAttribute('data-note'), true);
      }
    }, { passive: true });

    /* --- helpers ----------------------------------------------------------- */
    function scrollToEl(el) {
      if (!el) return;
      /* rect math, not offsetParent walking — offsetParent never equals a
         shadowRoot, so a walk escapes into the host page and overshoots. */
      var top = el.getBoundingClientRect().top -
        vp.getBoundingClientRect().top + vp.scrollTop;
      vp.scrollTo({ top: Math.max(top - 24, 0), behavior: REDUCED ? 'auto' : 'smooth' });
    }

    function normFile(f) {
      return (f || '').split('?')[0].replace(/^\.?\//, '');
    }

    /* "home:hero" -> "Hero"; "projects:helical-stair" -> "Helical Stair" */
    function sectionLabel(section) {
      var raw = String(section || '');
      var tail = raw.indexOf(':') >= 0 ? raw.slice(raw.indexOf(':') + 1) : raw;
      return tail.split(/[-_]/).filter(Boolean).map(function (w) {
        return w.charAt(0).toUpperCase() + w.slice(1);
      }).join(' ') || raw;
    }

    function cssEscape(s) {
      if (window.CSS && CSS.escape) return CSS.escape(s);
      return String(s).replace(/["\\\]]/g, '\\$&');
    }

    function esc(s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    /* boot: first page + its guide cards, desktop width */
    setDevice('desktop');
    render(PAGES[0]);
  })();

  /* ==========================================================================
     2. TOPNAV HAMBURGER
     ========================================================================== */
  (function nav() {
    var btn = document.querySelector('.topnav-hamburger');
    var links = document.getElementById('topnav-links');
    if (!btn || !links) return;

    btn.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    /* close the menu after any nav link is tapped */
    links.addEventListener('click', function (ev) {
      var a = ev.target && ev.target.closest && ev.target.closest('a');
      if (!a) return;
      links.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Open menu');
    });
  })();

  /* ==========================================================================
     3. SCROLL-REVEAL
     ========================================================================== */
  (function reveal() {
    var els = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');
    if (!els.length) return;

    /* reduced motion (or no IO support): render everything final-state now */
    if (REDUCED || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(els, function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          obs.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(els, function (el) { io.observe(el); });
  })();

})();
