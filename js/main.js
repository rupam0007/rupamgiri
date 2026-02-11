/* ============================================================
   RUPAM GIRI - Portfolio JavaScript
   Theme toggle, navigation, animations, form, counters
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ========== DOM Elements ==========
    const html        = document.documentElement;
    const header      = document.getElementById('header');
    const navToggle   = document.getElementById('navToggle');
    const navMenu     = document.getElementById('navMenu');
    const navLinks    = document.querySelectorAll('.nav__link');
    const themeToggle = document.getElementById('themeToggle');
    const backToTop   = document.getElementById('backToTop');
    const contactForm = document.getElementById('contactForm');
    const sections    = document.querySelectorAll('.section, .hero');


    // ========== THEME TOGGLE ==========
    function getPreferredTheme() {
        const saved = localStorage.getItem('theme');
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    // Initialize theme on page load
    setTheme(getPreferredTheme());

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = html.getAttribute('data-theme');
            setTheme(current === 'light' ? 'dark' : 'light');
        });
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });


    // ========== MOBILE NAVIGATION TOGGLE ==========
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }


    // ========== HEADER SCROLL EFFECT ==========
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll(); // Run on load


    // ========== ACTIVE NAVIGATION LINK ON SCROLL ==========
    function updateActiveNav() {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });


    // ========== BACK TO TOP BUTTON ==========
    function handleBackToTop() {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', handleBackToTop, { passive: true });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    // ========== COUNTER ANIMATION ==========
    function animateCounters() {
        const counters = document.querySelectorAll('.hero__stat-number[data-count]');

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-count'), 10);
                    let current = 0;
                    const increment = Math.ceil(target / 40);
                    const duration = 1200;
                    const stepTime = duration / (target / increment);

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            el.textContent = target;
                            clearInterval(timer);
                        } else {
                            el.textContent = current;
                        }
                    }, stepTime);

                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    animateCounters();


    // ========== SCROLL REVEAL ANIMATION ==========
    function initScrollReveal() {
        const animatableSelectors = [
            '.about__content',
            '.skill-card',
            '.project-card',
            '.timeline__item',
            '.contact__info',
            '.contact__form',
            '.section__title',
            '.section__subtitle',
            '.section__label',
            '.hero__stats'
        ];

        animatableSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add('fade-in');
            });
        });

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }

    initScrollReveal();


    // ========== CONTACT FORM HANDLING ==========
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const name    = formData.get('name');
            const email   = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            if (!name || !email || !message) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }

            const mailtoSubject = encodeURIComponent(subject || 'Portfolio Contact');
            const mailtoBody    = encodeURIComponent(
                `Name: ${name}\nEmail: ${email}\n\n${message}`
            );
            const mailtoLink = `mailto:girirupam25@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

            window.location.href = mailtoLink;

            showFormMessage('Opening your email client...', 'success');
            contactForm.reset();
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showFormMessage(text, type) {
        const existing = contactForm.querySelector('.form__message');
        if (existing) existing.remove();

        const msg = document.createElement('p');
        msg.className = `form__message form__message--${type}`;
        msg.textContent = text;

        const isError = type === 'error';
        const theme = html.getAttribute('data-theme');
        const bgColor = isError
            ? (theme === 'dark' ? '#3b1c1c' : '#fef2f2')
            : (theme === 'dark' ? '#1c3b2a' : '#f0fdf4');
        const textColor = isError
            ? (theme === 'dark' ? '#fca5a5' : '#991b1b')
            : (theme === 'dark' ? '#86efac' : '#166534');
        const borderColor = isError
            ? (theme === 'dark' ? '#7f1d1d' : '#fecaca')
            : (theme === 'dark' ? '#14532d' : '#bbf7d0');

        msg.style.cssText = `
            padding: 0.75rem 1rem;
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 500;
            margin-top: 0.5rem;
            background-color: ${bgColor};
            color: ${textColor};
            border: 1px solid ${borderColor};
        `;

        contactForm.appendChild(msg);

        setTimeout(() => {
            if (msg.parentNode) {
                msg.style.opacity = '0';
                msg.style.transition = 'opacity 0.3s ease';
                setTimeout(() => msg.remove(), 300);
            }
        }, 4000);
    }


    // ========== SMOOTH SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });


    // ========== TYPING EFFECT ==========
    const heroTitle = document.querySelector('.hero__title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid var(--color-accent)';
        heroTitle.style.display = 'inline-block';
        heroTitle.style.minHeight = '1.5em';

        let charIndex = 0;
        function typeText() {
            if (charIndex < originalText.length) {
                heroTitle.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(typeText, 55);
            } else {
                // Blink cursor then remove
                let blinkCount = 0;
                const blinkInterval = setInterval(() => {
                    heroTitle.style.borderRightColor =
                        heroTitle.style.borderRightColor === 'transparent'
                            ? 'var(--color-accent)'
                            : 'transparent';
                    blinkCount++;
                    if (blinkCount >= 6) {
                        clearInterval(blinkInterval);
                        heroTitle.style.borderRight = 'none';
                    }
                }, 400);
            }
        }

        setTimeout(typeText, 600);
    }


    // ========== KEYBOARD NAVIGATION ==========
    document.addEventListener('keydown', (e) => {
        // Escape closes mobile menu
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

});
