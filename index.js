       // ---- Mobile Menu Toggle ----
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');

        function toggleMenu() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        }

        function closeMenu() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        }

        // ---- Navbar Scroll Effect ----
        const navbar = document.getElementById('navbar');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // ---- Typing Effect ----
        const roles = [
            'Web Developer',
            'Frontend Developer',
            'UI/UX Dizajner',
            'Full Stack Developer',
            'Freelancer'
        ];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingElement = document.getElementById('typingText');

        function typeEffect() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                charIndex--;
                typingElement.textContent = currentRole.substring(0, charIndex);
            } else {
                charIndex++;
                typingElement.textContent = currentRole.substring(0, charIndex);
            }

            let typeSpeed = isDeleting ? 40 : 90;

            if (!isDeleting && charIndex === currentRole.length) {
                typeSpeed = 1800;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500;
            }

            setTimeout(typeEffect, typeSpeed);
        }

        // Start typing effect
        typeEffect();

        // ---- Reveal on Scroll (Intersection Observer) ----
        const revealElements = document.querySelectorAll('.reveal');

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Don't unobserve so elements can re-reveal if scrolled away and back
                    // But for better performance, you can unobserve after reveal
                    // revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));

        // ---- Skill Bars Animation ----
        const skillBars = document.querySelectorAll('.skill-bar-fill');
        let skillsAnimated = false;

        function animateSkills() {
            const skillsSection = document.getElementById('skills');
            const sectionTop = skillsSection.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (sectionTop < windowHeight * 0.8 && !skillsAnimated) {
                skillsAnimated = true;
                skillBars.forEach(bar => {
                    const percent = bar.getAttribute('data-percent');
                    bar.style.width = percent + '%';
                });
            }
        }

        window.addEventListener('scroll', animateSkills);
        // Check on load too
        window.addEventListener('load', animateSkills);

        function filterPortfolio(category, btn) {
            const filterButtons = document.querySelectorAll('.filter-btn');
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const cards = document.querySelectorAll('.portfolio-card');
                cards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'block';
                    setTimeout(() => card.classList.add('active'), 50);
                } else {
                    card.style.display = 'none';
                    card.classList.remove('active');
                }
            });
        }

        // ---- Smooth scroll for anchor links (fallback for browsers) ----
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // ---- Parallax effect on hero image ----
        window.addEventListener('scroll', () => {
            const heroImage = document.querySelector('.hero-image-wrapper');
            if (heroImage && window.scrollY < window.innerHeight) {
                const scrollY = window.scrollY;
                heroImage.style.transform = `translateY(${scrollY * 0.15}px)`;
            }
        });

        // ---- Console greeting ----
        console.log('%c🚀 DevStudio Portfolio',
            'font-size: 24px; font-weight: bold; color: #8b5cf6; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);');
        console.log('%c💼 Tražite web developera? Javite se!', 'font-size: 16px; color: #a0a0b8;');