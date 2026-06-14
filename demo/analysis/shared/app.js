/* aiCRO shared behavior — vanilla, file:// safe, enhancement-only.
   Everything works without JS; this adds polish. */
(function () {
  'use strict';

  /* reading progress hairline (any page with #progress) */
  var bar = document.getElementById('progress');
  if (bar) {
    var onScroll = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* TOC scrollspy — highlights .toc a[href^="#"] for the section in view */
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.toc a[href^="#"]'));
  if (tocLinks.length) {
    var map = {};
    var targets = tocLinks
      .map(function (a) {
        var el = document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));
        if (el) map[el.id] = a;
        return el;
      })
      .filter(Boolean);
    var setOn = function (id) {
      tocLinks.forEach(function (a) { a.classList.remove('on'); });
      if (map[id]) {
        map[id].classList.add('on');
        var toc = map[id].closest('.toc');
        if (toc) {
          /* scroll the TOC rail directly — scrollIntoView cancels an
             in-flight smooth anchor scroll of the document, so long TOC
             jumps stall mid-page. Found in browser QA 2026-06-11. */
          var r = map[id].getBoundingClientRect(), tr = toc.getBoundingClientRect();
          if (r.top < tr.top + 60 || r.bottom > tr.bottom - 60) {
            toc.scrollTo({ top: toc.scrollTop + (r.top - tr.top) - tr.height / 2 + r.height / 2, behavior: 'smooth' });
          }
        }
      }
    };
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) setOn(e.target.id); });
    }, { rootMargin: '-12% 0px -78% 0px' });
    targets.forEach(function (t) { spy.observe(t); });
  }

  /* deck dots double as scrollspy (gtm decks) */
  var dots = Array.prototype.slice.call(document.querySelectorAll('.deck-head .dots a'));
  if (dots.length) {
    var dotMap = {};
    dots.forEach(function (a) {
      var el = document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));
      if (el) dotMap[el.id] = a;
    });
    var dspy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          dots.forEach(function (a) { a.classList.remove('on'); });
          if (dotMap[e.target.id]) dotMap[e.target.id].classList.add('on');
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    Object.keys(dotMap).forEach(function (id) { dspy.observe(document.getElementById(id)); });

    /* arrow keys advance slides */
    var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
    addEventListener('keydown', function (ev) {
      if (ev.key !== 'ArrowDown' && ev.key !== 'ArrowUp' && ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft') return;
      if (/INPUT|TEXTAREA/.test(document.activeElement.tagName)) return;
      var fwd = ev.key === 'ArrowDown' || ev.key === 'ArrowRight';
      var y = scrollY + 10;
      var next = null;
      for (var i = 0; i < slides.length; i++) {
        var top = slides[i].offsetTop;
        if (fwd && top > y + 50) { next = slides[i]; break; }
        if (!fwd && top < y - 50) next = slides[i];
      }
      if (next) { ev.preventDefault(); next.scrollIntoView({ behavior: 'smooth' }); }
    });
  }

  /* copy buttons — .copyblock gets one injected */
  document.querySelectorAll('.copyblock').forEach(function (block) {
    if (block.querySelector('button.copy')) return;
    var btn = document.createElement('button');
    btn.className = 'copy';
    btn.type = 'button';
    btn.textContent = 'Copy';
    btn.addEventListener('click', function () {
      var body = block.querySelector('pre, .cb-body');
      if (!body) return;
      var text = body.innerText;
      var done = function () {
        btn.textContent = 'Copied ✓';
        btn.classList.add('done');
        setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('done'); }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallback(text, done); });
      } else fallback(text, done);
    });
    block.appendChild(btn);
    function fallback(text, done) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); } catch (e) {}
      document.body.removeChild(ta);
    }
  });

  /* persistent checklists — any [data-checklist] scope; key per checkbox index or value */
  document.querySelectorAll('[data-checklist]').forEach(function (scope) {
    var key = 'aicro:' + (document.body.dataset.doc || location.pathname) + ':' + scope.dataset.checklist;
    var state = {};
    try { state = JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) {}
    var boxes = scope.querySelectorAll('input[type="checkbox"]');
    boxes.forEach(function (box, i) {
      var id = box.value || String(i);
      if (state[id]) { box.checked = true; box.closest('li') && box.closest('li').classList.add('done'); }
      box.addEventListener('change', function () {
        state[id] = box.checked;
        box.closest('li') && box.closest('li').classList.toggle('done', box.checked);
        try { localStorage.setItem(key, JSON.stringify(state)); } catch (e) {}
        var counter = document.querySelector('[data-checklist-count="' + scope.dataset.checklist + '"]');
        if (counter) {
          var done = scope.querySelectorAll('input:checked').length;
          counter.textContent = done + ' / ' + boxes.length;
        }
      });
    });
    var counter = document.querySelector('[data-checklist-count="' + scope.dataset.checklist + '"]');
    if (counter) counter.textContent = scope.querySelectorAll('input:checked').length + ' / ' + boxes.length;
  });

  /* glossary live filter — input.gsearch filters .gitem by text */
  var gs = document.querySelector('.gsearch');
  if (gs) {
    var items = Array.prototype.slice.call(document.querySelectorAll('.gitem'));
    gs.addEventListener('input', function () {
      var q = gs.value.trim().toLowerCase();
      items.forEach(function (it) {
        it.style.display = !q || it.textContent.toLowerCase().indexOf(q) !== -1 ? '' : 'none';
      });
    });
  }

  /* term hover preview — a.term shows the glossary plain-gloss as title */
  document.querySelectorAll('a.term').forEach(function (a) {
    var id = (a.getAttribute('href') || '').split('#')[1];
    if (!id) return;
    var entry = document.getElementById(id);
    if (entry) {
      var plain = entry.querySelector('.plain');
      if (plain && !a.title) a.title = plain.textContent;
    }
  });
})();
