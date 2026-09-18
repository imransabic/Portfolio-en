   // ===== GODINA U FOOTERU =====
        document.getElementById('year').textContent = new Date().getFullYear();

        // ===== NAVIGACIJA NA SCROLL =====
        const navbar = document.getElementById('navbar');
        const backToTop = document.getElementById('backToTop');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            if (window.scrollY > 400) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }

            updateActiveNav();
        });

        // ===== MOBILNI IZBORNIK =====
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Zatvori izbornik na klik linka
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // ===== AKTIVNI LINK NA SCROLL =====
        function updateActiveNav() {
            const sections = document.querySelectorAll('section[id], header[id]');
            let current = 'hero';

            sections.forEach(section => {
                const sectionTop = section.offsetTop - 120;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }

        // ===== GLATKO SKROLANJE =====
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // ===== SCROLL REVEAL ANIMACIJE =====
        const revealElements = document.querySelectorAll('.reveal');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach(el => revealObserver.observe(el));

        // ===== BROJAČI STATISTIKE =====
        const statNumbers = document.querySelectorAll('.stat-number');
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-target'));
                    let current = 0;
                    const increment = Math.ceil(target / 60); // 60 frames ~ 1 sekunda
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        el.textContent = current.toLocaleString('hr-HR');
                    }, 16);
                    statObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(el => statObserver.observe(el));

        // ===== TESTIMONIAL SLIDER =====
        const slides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.dot');
        let currentSlide = 0;
        let slideInterval;

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        }

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                showSlide(parseInt(dot.getAttribute('data-index')));
                resetSlideInterval();
            });
        });

        function nextSlide() {
            showSlide((currentSlide + 1) % slides.length);
        }

        function startSlideInterval() {
            slideInterval = setInterval(nextSlide, 5000);
        }

        function resetSlideInterval() {
            clearInterval(slideInterval);
            startSlideInterval();
        }

        startSlideInterval();

        // ===== FAQ HARMONIKA =====
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                // Zatvori sve
                faqItems.forEach(i => i.classList.remove('active'));
                // Otvori kliknuti ako nije bio aktivan
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });

        // ===== KONTAKT FORMA =====
        const contactForm = document.getElementById('contactForm');
        const formSuccess = document.getElementById('formSuccess');

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const ime = this.querySelector('input[placeholder*="Ime"]').value.trim();
            const email = this.querySelector('input[type="email"]').value.trim();

            if (!ime || !email) {
                alert('Molimo ispunite obavezna polja (ime i email).');
                return;
            }

            if (!email.includes('@') || !email.includes('.')) {
                alert('Unesite ispravnu email adresu.');
                return;
            }

            formSuccess.classList.add('show');
            this.reset();

            setTimeout(() => {
                formSuccess.classList.remove('show');
            }, 5000);
        });

        // ===== BACK TO TOP =====
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });