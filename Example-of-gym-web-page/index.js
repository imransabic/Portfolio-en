/* ============================================================
   1. PRELOADER
   ============================================================ */
(function () {
  const preloader = document.getElementById('preloader');
  const bar = document.getElementById('preloaderBar');
  let progress = 0;

  document.body.classList.add('is-locked');

  const tick = setInterval(() => {
    progress += Math.random() * 16 + 6;
    if (progress >= 100) {
      progress = 100;
      clearInterval(tick);
      finish();
    }
    bar.style.width = progress + '%';
  }, 130);

  function finish() {
    setTimeout(() => {
      preloader.classList.add('done');
      document.body.classList.remove('is-locked');
      document.body.classList.add('loaded');
      setTimeout(() => preloader.remove(), 800);
    }, 320);
  }

  // Sigurnosna mreža — maksimalno 3.5s
  setTimeout(() => {
    if (document.body.contains(preloader)) {
      clearInterval(tick);
      bar.style.width = '100%';
      finish();
    }
  }, 3500);
})();

/* ============================================================
   2. NAVIGACIJA — scroll stanje + mobilni meni
   ============================================================ */
(function () {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const links = mobileMenu.querySelectorAll('a');

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function toggleMenu(force) {
    const open = force !== undefined ? force : !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', open);
    burger.classList.toggle('active', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('is-locked', open);
  }

  burger.addEventListener('click', () => toggleMenu());
  links.forEach(a => a.addEventListener('click', () => toggleMenu(false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') toggleMenu(false);
  });
})();

/* ============================================================
   3. SCROLL REVEAL (IntersectionObserver)
   ============================================================ */
(function () {
  const elements = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('in'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -70px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();

/* ============================================================
   4. BROJAČI
   ============================================================ */
(function () {
  const counters = document.querySelectorAll('[data-count]');

  const easeOutExpo = t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

  function animate(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1900;
    const start = performance.now();

    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const value = Math.round(easeOutExpo(t) * target);

      el.innerHTML = value.toLocaleString('hr-HR') +
        (suffix ? '<em>' + suffix + '</em>' : '');

      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animate);
    return;
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => obs.observe(el));
})();

/* ============================================================
   5. PARALLAX NA HERO POZADINI
   ============================================================ */
(function () {
  const heroBg = document.getElementById('heroBg');
  if (!heroBg) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  let ticking = false;

  function update() {
    const y = window.scrollY;
    if (y < window.innerHeight * 1.3) {
      heroBg.style.transform = `translate3d(0, ${y * 0.28}px, 0) scale(1.06)`;
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
})();

/* ============================================================
   6. SLIDER TESTIMONIJALA
   ============================================================ */
(function () {
  const track = document.getElementById('sliderTrack');
  const slides = track ? Array.from(track.children) : [];
  const dotsWrap = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const slider = document.getElementById('slider');

  if (!track || slides.length === 0) return;

  let index = 0;
  let autoplay;

  // Dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', 'Slajd ' + (i + 1));
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle('active', di === index));
  }

  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  nextBtn.addEventListener('click', () => { next(); restart(); });
  prevBtn.addEventListener('click', () => { prev(); restart(); });

  function start() { autoplay = setInterval(next, 6500); }
  function stop()  { clearInterval(autoplay); }
  function restart() { stop(); start(); }

  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);

  // Swipe podrška
  let startX = 0, dragging = false;
  slider.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    dragging = true;
    stop();
  }, { passive: true });

  slider.addEventListener('touchend', e => {
    if (!dragging) return;
    const delta = e.changedTouches[0].clientX - startX;
    if (Math.abs(delta) > 45) delta < 0 ? next() : prev();
    dragging = false;
    start();
  }, { passive: true });

  start();
})();

/* ============================================================
   7. FORMA — validacija i potvrda
   ============================================================ */
(function () {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const ime = form.ime.value.trim();
    const email = form.email.value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!ime) {
      form.ime.focus();
      form.ime.style.borderColor = '#ff5a5a';
      setTimeout(() => form.ime.style.borderColor = '', 1800);
      return;
    }
    if (!emailOk) {
      form.email.focus();
      form.email.style.borderColor = '#ff5a5a';
      setTimeout(() => form.email.style.borderColor = '', 1800);
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = 'Šaljem...';
    btn.disabled = true;

    setTimeout(() => {
      success.classList.add('show');
      form.reset();
      btn.innerHTML = original;
      btn.disabled = false;

      setTimeout(() => success.classList.remove('show'), 6000);
    }, 900);
  });
})();

/* ============================================================
   8. NEWSLETTER
   ============================================================ */
(function () {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input');
    const btn = form.querySelector('button');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
      input.style.borderColor = '#ff5a5a';
      setTimeout(() => input.style.borderColor = '', 1800);
      return;
    }

    btn.textContent = '✓';
    input.value = '';
    input.placeholder = 'Hvala na prijavi!';
    setTimeout(() => {
      btn.textContent = 'Prijava';
      input.placeholder = 'tvoj@email.com';
    }, 3200);
  });
})();

/* ============================================================
   9. BACK TO TOP
   ============================================================ */
(function () {
  const btn = document.getElementById('toTop');

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 700);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   10. GODINA U FOOTERU
   ============================================================ */
document.getElementById('year').textContent = new Date().getFullYear();