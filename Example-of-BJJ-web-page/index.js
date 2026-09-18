/* ============================================================
   1. PRELOADER
============================================================ */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('is-done'), 500);
});

/* ============================================================
   2. NAVIGACIJA — scroll state
============================================================ */
const nav = document.getElementById('nav');
const toTop = document.getElementById('toTop');

const onScroll = () => {
  const y = window.scrollY;
  nav.classList.toggle('is-scrolled', y > 40);
  toTop.classList.toggle('is-shown', y > 700);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ============================================================
   3. MOBILNI MENU
============================================================ */
const burger = document.getElementById('burger');
const drawer = document.getElementById('drawer');

const toggleDrawer = (open) => {
  burger.classList.toggle('is-open', open);
  drawer.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
};

burger.addEventListener('click', () => toggleDrawer(!drawer.classList.contains('is-open')));
drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleDrawer(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleDrawer(false); });

/* ============================================================
   4. REVEAL ON SCROLL
============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   5. BROJAČI (COUNTERS)
============================================================ */
const animateCount = (el) => {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1800;
  const start = performance.now();

  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 4);           // easeOutQuart
    el.textContent = Math.round(eased * target).toLocaleString('hr-HR');
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ============================================================
   6. RASPORED — TABOVI
============================================================ */
const tabs = document.querySelectorAll('.tab');
const days = document.querySelectorAll('.schedule-day');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('is-active'));
    tab.classList.add('is-active');

    days.forEach(day => {
      day.classList.toggle('is-active', day.dataset.day === tab.dataset.day);
    });
  });
});

/* ============================================================
   7. PARALLAX NA HERO ORBOVIMA
============================================================ */
const parallaxEls = document.querySelectorAll('[data-parallax]');
let mouseX = 0, mouseY = 0, currentX = 0, currentY = 0;

if (window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  const raf = () => {
    currentX += (mouseX - currentX) * 0.06;
    currentY += (mouseY - currentY) * 0.06;

    parallaxEls.forEach(el => {
      const depth = parseFloat(el.dataset.parallax) * 100;
      el.style.transform = `translate3d(${currentX * depth}px, ${currentY * depth}px, 0)`;
    });
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}

/* ============================================================
   8. AKTIVNI NAV LINK NA SCROLL
============================================================ */
const navLinks = document.querySelectorAll('#navLinks a');
const sections = [...document.querySelectorAll('section[id]')];

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ============================================================
   9. FORMA
============================================================ */
const form = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const btn = form.querySelector('button[type="submit"]');
  const original = btn.innerHTML;

  btn.innerHTML = 'Šaljem...';
  btn.style.pointerEvents = 'none';

  setTimeout(() => {
    btn.innerHTML = original;
    btn.style.pointerEvents = '';
    success.classList.add('is-shown');
    form.reset();
    setTimeout(() => success.classList.remove('is-shown'), 6000);
  }, 1100);
});

/* ============================================================
   10. GODINA U FOOTERU
============================================================ */
document.getElementById('year').textContent = new Date().getFullYear();