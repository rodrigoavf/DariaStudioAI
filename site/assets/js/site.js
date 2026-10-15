/* DARIA website. Progressive enhancement only: with JS off the pages
   still read, the films play through native controls and the slides
   show in order. */
(function () {
  /* Set this once the studio has an Instagram account. Every Instagram
     link on the site takes its address from here. */
  var INSTAGRAM = 'https://www.instagram.com/';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var play = function (v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); };

  $$('[data-instagram]').forEach(function (a) { a.href = INSTAGRAM; });

  /* ---- the studio's address ----
     Never written into the pages, so harvesters that read the HTML find
     nothing. It is put together here, only when a person asks for it. */
  function address() {
    var flip = function (s) { return s.split('').reverse().join(''); };
    return flip('rdv.airad') + String.fromCharCode(64) + flip('moc.liamg');
  }
  function mailTo(subject, body) {
    var q = [];
    if (subject) q.push('subject=' + encodeURIComponent(subject));
    if (body) q.push('body=' + encodeURIComponent(body));
    location.href = 'mai' + 'lto:' + address() + (q.length ? '?' + q.join('&') : '');
  }
  $$('[data-mail]').forEach(function (btn) {
    btn.addEventListener('click', function () { mailTo(btn.dataset.mail || ''); });
  });
  $$('[data-mail-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var label = btn.textContent;
      var done = function (text) { btn.textContent = text; setTimeout(function () { btn.textContent = label; }, 2200); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(address()).then(function () { done('Copied'); }, function () { done('Could not copy'); });
      } else {
        done('Could not copy');
      }
    });
  });

  /* ---- mobile menu ---- */
  var toggle = $('.nav-toggle');
  var nav = $('#nav');
  if (toggle && nav) {
    var setMenu = function (open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close' : 'Menu';
    };
    toggle.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* ---- soft rise as sections arrive ---- */
  var reveals = $$('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var rise = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); rise.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    reveals.forEach(function (el) { rise.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---- one film with sound at a time ---- */
  function quietOthers(current) {
    $$('video').forEach(function (v) {
      if (v === current) return;
      if (v.closest('[data-reel]')) v.muted = true;
      else v.pause();
    });
  }

  /* ---- home: the showreel ----
     It starts by itself, muted, with the browser's own player controls.
     It rests while it is off screen and picks up again when it returns,
     unless the visitor paused it. */
  var reel = $('[data-reel]');
  var reelVideo = reel && $('video', reel);
  if (reelVideo) {
    var rested = false; // paused by us, not by the visitor
    if (calm || (navigator.connection && navigator.connection.saveData)) {
      reelVideo.autoplay = false;
      reelVideo.pause();
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting && !reelVideo.paused) { rested = true; reelVideo.pause(); }
          else if (e.isIntersecting && rested) { rested = false; play(reelVideo); }
        });
      }, { threshold: 0.2 }).observe(reel);
    }
    reelVideo.addEventListener('volumechange', function () {
      if (!reelVideo.muted && reelVideo.volume > 0) quietOthers(reelVideo);
    });
  }

  /* ---- click-to-play films ---- */
  $$('.film').forEach(function (film) {
    var video = $('video', film);
    var button = $('.film__play', film);
    if (!video || !button) return;
    video.removeAttribute('controls');
    button.addEventListener('click', function () {
      film.classList.add('is-playing');
      video.setAttribute('controls', '');
      quietOthers(video);
      play(video);
      video.focus();
    });
    video.addEventListener('play', function () { quietOthers(video); });
  });

  /* ---- "you send / we deliver": moves through the projects ----
     The bar under the current name is the clock: when it fills, the next
     project comes in. It waits while the pointer or keyboard is on the
     names, while a film there is playing, and while it is off screen.
     Choosing a project by hand stops the rotation. */
  var rotator = $('[data-rotator]');
  if (rotator) {
    var list = $('[role="tablist"]', rotator);
    var tabs = $$('[role="tab"]', list);
    var panelOf = function (tab) { return document.getElementById(tab.getAttribute('aria-controls')); };
    var holds = { hover: false, focus: false, film: false, away: true };

    var select = function (tab, byHand) {
      tabs.forEach(function (t) {
        var on = t === tab;
        var panel = panelOf(t);
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        panel.classList.toggle('is-active', on);
        if (on) { panel.removeAttribute('inert'); panel.removeAttribute('aria-hidden'); }
        else {
          panel.setAttribute('inert', ''); panel.setAttribute('aria-hidden', 'true');
          var v = $('video', panel); if (v) v.pause();
        }
      });
      /* keep the current name in view on a phone, without moving the page */
      list.scrollTo({ left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2, behavior: calm ? 'auto' : 'smooth' });
      if (byHand) list.classList.add('is-manual');
    };
    var sync = function () {
      list.classList.toggle('is-paused', holds.hover || holds.focus || holds.film || holds.away);
    };

    select(tabs[0]);
    if (calm) list.classList.add('is-manual');

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab, true); });
      tab.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var next = tabs[(i + d + tabs.length) % tabs.length];
        select(next, true);
        next.focus();
      });
      /* the filling bar has run out: bring in the next project */
      tab.addEventListener('animationend', function () {
        if (tab.getAttribute('aria-selected') === 'true') select(tabs[(i + 1) % tabs.length]);
      });
    });

    /* only the names and the films hold it: resting the pointer on the
       section to watch must not stop the thing being watched */
    [list].concat($$('.film', rotator)).forEach(function (el) {
      el.addEventListener('mouseenter', function () { holds.hover = true; sync(); });
      el.addEventListener('mouseleave', function () { holds.hover = false; sync(); });
    });
    list.addEventListener('focusin', function () { holds.focus = true; sync(); });
    list.addEventListener('focusout', function () { holds.focus = false; sync(); });
    $$('video', rotator).forEach(function (v) {
      v.addEventListener('play', function () { holds.film = true; sync(); });
      v.addEventListener('pause', function () { holds.film = false; sync(); });
      v.addEventListener('ended', function () { holds.film = false; sync(); });
    });
    if ('IntersectionObserver' in window) {
      var warmed = false;
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          holds.away = !e.isIntersecting;
          /* fetch the waiting projects' images now, so each one arrives whole */
          if (e.isIntersecting && !warmed) {
            warmed = true;
            $$('img[loading="lazy"]', rotator).forEach(function (img) { img.loading = 'eager'; });
          }
          sync();
        });
      }, { threshold: 0.3 }).observe($('.proof-stage', rotator));
    } else {
      holds.away = false;
    }
    sync();
  }

  /* ---- portfolio: films inside the slides ---- */
  $$('button.slide-film').forEach(function (button) {
    button.addEventListener('click', function () {
      var holder = document.createElement('div');
      holder.className = button.className;
      holder.style.cssText = button.style.cssText;
      var video = document.createElement('video');
      video.src = button.dataset.film;
      video.controls = true;
      video.playsInline = true;
      video.setAttribute('aria-label', button.getAttribute('aria-label').replace('Play the ', ''));
      video.addEventListener('play', function () { quietOthers(video); });
      holder.appendChild(video);
      button.replaceWith(holder);
      quietOthers(video);
      play(video);
      video.focus();
    });
  });

  /* ---- portfolio: move through the deck, and present it ---- */
  var deck = $('#deck');
  var slides = deck ? $$('.slide', deck) : [];
  if (slides.length) {
    var at = 0;
    var count = $('.present-bar__count');
    var presenting = function () { return document.body.classList.contains('is-presenting'); };

    var show = function (i) {
      at = Math.max(0, Math.min(slides.length - 1, i));
      slides.forEach(function (s, n) {
        s.classList.toggle('is-active', n === at);
        if (n !== at && presenting()) { var v = $('video', s); if (v) v.pause(); }
      });
      if (count) count.textContent = (at + 1) + ' / ' + slides.length;
      var focused = document.activeElement;
      if (focused && focused.tagName === 'VIDEO' && !slides[at].contains(focused)) focused.blur();
      if (!presenting()) slides[at].scrollIntoView({ block: 'center', behavior: calm ? 'auto' : 'smooth' });
    };

    var setPresent = function (on) {
      document.body.classList.toggle('is-presenting', on);
      if (on) {
        var el = document.documentElement;
        if (el.requestFullscreen) { var p = el.requestFullscreen(); if (p && p.catch) p.catch(function () {}); }
      } else if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen();
      }
      show(at);
      if (!on) slides[at].scrollIntoView({ block: 'center' });
    };

    /* which slide is on screen while scrolling */
    if ('IntersectionObserver' in window) {
      var seen = new IntersectionObserver(function (entries) {
        if (presenting()) return;
        entries.forEach(function (e) { if (e.isIntersecting) at = slides.indexOf(e.target); });
      }, { threshold: 0.6 });
      slides.forEach(function (s) { seen.observe(s); });
    }

    $$('[data-present]').forEach(function (b) {
      b.addEventListener('click', function () { setPresent(!presenting()); });
    });
    $$('.present-bar [data-step]').forEach(function (b) {
      b.addEventListener('click', function () { show(at + Number(b.dataset.step)); });
    });
    document.addEventListener('fullscreenchange', function () {
      if (!document.fullscreenElement && presenting()) setPresent(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      var el = document.activeElement;
      // a focused player keeps its own arrow and space keys, but Esc still leaves the show
      if (el && el.tagName === 'VIDEO' && e.key !== 'Escape') return;
      switch (e.key) {
        case 'ArrowRight': case 'PageDown': e.preventDefault(); show(at + 1); break;
        case 'ArrowLeft': case 'PageUp': e.preventDefault(); show(at - 1); break;
        case ' ': if (presenting()) { e.preventDefault(); show(at + 1); } break;
        case 'Home': if (presenting()) { e.preventDefault(); show(0); } break;
        case 'End': if (presenting()) { e.preventDefault(); show(slides.length - 1); } break;
        case 'Escape': if (presenting()) setPresent(false); break;
      }
    });

    /* in present mode, a click on the slide itself moves on */
    deck.addEventListener('click', function (e) {
      if (!presenting() || e.target.closest('.slide-film')) return;
      show(at + 1);
    });
  }

  /* ---- contact form ----
     Posts the brief to /api/contact, which emails it to the studio
     (see api/contact.js). Nothing leaves the page until the visitor
     presses Send brief. */
  var form = $('#brief');
  if (form) {
    var status = $('.form-status', form);
    var send = $('button[type="submit"]', form);
    var label = send.textContent;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var brief = {};
      data.forEach(function (v, k) { brief[k] = String(v).trim(); });

      send.disabled = true;
      send.textContent = 'Sending…';
      status.textContent = '';
      fetch(form.dataset.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(brief)
      })
        .then(function (r) {
          return r.json().catch(function () { return {}; }).then(function (j) {
            if (!r.ok || !j.ok) throw new Error(j.error || String(r.status));
          });
        })
        .then(function () {
          form.reset();
          status.textContent = 'Thank you. Your brief is with us, and we will reply by email.';
        })
        .catch(function (err) {
          status.textContent = err.message === 'invalid'
            ? 'Please add your name, a valid email and a few words about the product.'
            : 'Your brief could not be sent just now. Please try again, or use Email us at the top of the page.';
        })
        .then(function () { send.disabled = false; send.textContent = label; });
    });
  }
})();
