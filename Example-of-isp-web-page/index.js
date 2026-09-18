(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================
     1. GODINA U FOOTERU
     ========================================================== */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ==========================================================
     2. HEADER — SCROLL STATE + SKRIVANJE
     ========================================================== */
  const header = document.getElementById('header');
  let lastScroll = 0;
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;

    header.classList.toggle('scrolled', y > 30);

    // Sakrij header pri skrolanju prema dolje (samo na većim ekranima)
    if (window.innerWidth > 860 && y > 400) {
      header.classList.toggle('hidden', y > lastScroll + 4);
    } else {
      header.classList.remove('hidden');
    }

    lastScroll = y;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  /* ==========================================================
     3. MOBILNI MENI
     ========================================================== */
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');

  function toggleMenu(force) {
    const open = typeof force === 'boolean' ? force : !navLinks.classList.contains('open');
    navLinks.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  burger.addEventListener('click', function () { toggleMenu(); });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { toggleMenu(false); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) toggleMenu(false);
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 860 && navLinks.classList.contains('open')) toggleMenu(false);
  });

  /* ==========================================================
     4. SCROLL REVEAL (IntersectionObserver)
     ========================================================== */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ==========================================================
     5. ANIMIRANI BROJAČI
     ========================================================== */
  const counters = document.querySelectorAll('[data-count]');

  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1900;
    const start = performance.now();

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const value = target * easeOutExpo(progress);

      let display;
      if (decimals > 0) {
        display = value.toFixed(decimals);
      } else {
        display = Math.round(value).toLocaleString('hr-HR');
      }

      el.textContent = display + suffix;

      if (progress < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  if ('IntersectionObserver' in window && !reduceMotion) {
    const counterObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(function (el) {
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const value = parseFloat(el.dataset.count);
      el.textContent = (decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString('hr-HR')) + (el.dataset.suffix || '');
    });
  }

  /* ==========================================================
     6. 3D TILT + SVJETLOSNI EFEKT NA KARTICAMA
     ========================================================== */
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mx', x + 'px');
        card.style.setProperty('--my', y + 'px');

        if (card.classList.contains('tilt')) {
          const rx = ((y / rect.height) - 0.5) * -6;
          const ry = ((x / rect.width) - 0.5) * 6;
          card.style.transform =
            'translateY(-8px) perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
        }
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* ==========================================================
     7. MARQUEE — DUPLIRANJE SADRŽAJA ZA BESKONAČNI LOOP
     ========================================================== */
  const track = document.getElementById('marqueeTrack');
  if (track) {
    track.innerHTML += track.innerHTML;
  }

  /* ==========================================================
     8. KONTAKT FORMA
     ========================================================== */
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const required = form.querySelectorAll('[required]');
      let valid = true;

      required.forEach(function (field) {
        const ok = field.value.trim() !== '' &&
                   (field.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value));
        field.style.borderColor = ok ? '' : 'rgba(255,80,80,.7)';
        if (!ok) valid = false;
      });

      if (!valid) {
        const firstBad = form.querySelector('[style*="rgba(255, 80, 80"]');
        if (firstBad) firstBad.focus();
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;
      btn.disabled = true;
      btn.style.opacity = '.7';
      btn.innerHTML = 'Šaljem...';

      setTimeout(function () {
        btn.disabled = false;
        btn.style.opacity = '';
        btn.innerHTML = originalHTML;
        form.reset();
        success.classList.add('show');
        setTimeout(function () { success.classList.remove('show'); }, 6000);
      }, 1100);
    });

    // Ukloni crveni rub pri unosu
    form.querySelectorAll('input, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        field.style.borderColor = '';
      });
    });
  }

  /* ==========================================================
     9. ANIMIRANA MREŽA ČESTICA (CANVAS)
     ========================================================== */
  (function initNetwork() {
    const canvas = document.getElementById('network');
    if (!canvas || reduceMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles = [];
    let width = 0;
    let height = 0;
    let rafId = null;
    let running = false;

    const LINK_DIST = 140;
    const MOUSE_DIST = 190;
    const pointer = { x: -9999, y: -9999 };

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();
    }

    function buildParticles() {
      const density = Math.floor((width * height) / 17000);
      const count = Math.max(26, Math.min(90, density));

      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.32,
          vy: (Math.random() - 0.5) * 0.32,
          r: Math.random() * 1.5 + 0.7,
          hue: Math.random() > 0.55 ? '0,229,255' : '124,92,255'
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Linije između čestica
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.28;
            ctx.strokeStyle = 'rgba(0,229,255,' + alpha + ')';
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }

        // Linija prema pokazivaču
        const mdx = p.x - pointer.x;
        const mdy = p.y - pointer.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mdist < MOUSE_DIST) {
          const alpha = (1 - mdist / MOUSE_DIST) * 0.42;
          ctx.strokeStyle = 'rgba(124,92,255,' + alpha + ')';
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }

      // Točke
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.hue + ',0.72)';
        ctx.fill();

        // Blagi halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.hue + ',0.045)';
        ctx.fill();
      }
    }

    function step() {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Meko odbijanje od rubova
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > width) { p.x = width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > height) { p.y = height; p.vy *= -1; }
      }

      draw();
      rafId = requestAnimationFrame(step);
    }

    function start() {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(step);
    }

    function stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    }

    // Pauza kad hero nije vidljiv (performanse)
    if ('IntersectionObserver' in window) {
      const heroObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          entry.isIntersecting ? start() : stop();
        });
      }, { threshold: 0.02 });
      heroObserver.observe(canvas);
    } else {
      start();
    }

    // Praćenje pokazivača
    window.addEventListener('mousemove', function (e) {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    }, { passive: true });

    window.addEventListener('mouseout', function () {
      pointer.x = -9999;
      pointer.y = -9999;
    });

    // Resize s debounceom
    let resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 180);
    });

    document.addEventListener('visibilitychange', function () {
      document.hidden ? stop() : start();
    });

    resize();
    start();
  })();

  /* ==========================================================
     10. SMOOTH SCROLL ZA ANCHORE (fallback za starije browsere)
     ========================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (!id || id === '#') return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const offset = 90;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top: top,
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    });
  });

})();