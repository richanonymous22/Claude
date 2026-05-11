/* =========================================================
   Creatix — site interactions
   ========================================================= */
(() => {
    'use strict';

    /* -------- Mobile menu toggle -------- */
    const navToggle = document.querySelector('.nav-toggle');
    const navbar = document.querySelector('.navbar');
    if (navToggle && navbar) {
        navToggle.addEventListener('click', () => {
            const open = navbar.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', String(open));
        });

        // Close on link click
        navbar.querySelectorAll('a').forEach(a =>
            a.addEventListener('click', () => {
                navbar.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            })
        );
    }

    /* -------- Animated stat counters -------- */
    const counters = document.querySelectorAll('.stat-num');
    const animateCount = (el) => {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1600;
        const start = performance.now();

        const tick = (now) => {
            const t = Math.min((now - start) / duration, 1);
            // ease-out
            const eased = 1 - Math.pow(1 - t, 3);
            const value = Math.floor(target * eased);
            el.textContent = value + suffix;
            if (t < 1) requestAnimationFrame(tick);
            else el.textContent = target + suffix;
        };
        requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    counters.forEach(c => counterObserver.observe(c));

    /* -------- Testimonial carousel -------- */
    const track = document.getElementById('testimonialTrack');
    const prev = document.getElementById('tPrev');
    const next = document.getElementById('tNext');
    if (track && prev && next) {
        const cards = track.children;
        let index = 0;
        let cardsPerView = 2;

        const setView = () => {
            cardsPerView = window.innerWidth <= 900 ? 1 : 2;
            const maxIndex = Math.max(0, cards.length - cardsPerView);
            if (index > maxIndex) index = maxIndex;
            update();
        };

        const update = () => {
            const card = cards[0];
            if (!card) return;
            const cardWidth = card.getBoundingClientRect().width;
            const gap = 24;
            const offset = index * (cardWidth + gap);
            track.style.transform = `translateX(-${offset}px)`;
        };

        prev.addEventListener('click', () => {
            index = Math.max(0, index - 1);
            update();
        });

        next.addEventListener('click', () => {
            const maxIndex = Math.max(0, cards.length - cardsPerView);
            index = Math.min(maxIndex, index + 1);
            update();
        });

        window.addEventListener('resize', setView);
        setView();

        // touch swipe
        let touchStartX = 0;
        let touchEndX = 0;
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) next.click();
                else prev.click();
            }
        }, { passive: true });

        // Auto-advance every 6 seconds
        let autoplay = setInterval(() => {
            const maxIndex = Math.max(0, cards.length - cardsPerView);
            index = index >= maxIndex ? 0 : index + 1;
            update();
        }, 6000);

        track.addEventListener('mouseenter', () => clearInterval(autoplay));
        track.addEventListener('mouseleave', () => {
            autoplay = setInterval(() => {
                const maxIndex = Math.max(0, cards.length - cardsPerView);
                index = index >= maxIndex ? 0 : index + 1;
                update();
            }, 6000);
        });
    }

    /* -------- Reveal on scroll -------- */
    const revealTargets = document.querySelectorAll(
        '.hero-card, .stats-card, .masterpieces-head, .mp-card, .services, .team-card, .testimonial-card, .contact-grid, .footer-inner'
    );
    revealTargets.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('is-visible'), i * 60);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    revealTargets.forEach(el => revealObserver.observe(el));

    /* -------- Form handlers -------- */
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('input[type="email"]');
            const button = form.querySelector('button');
            if (!input || !input.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
                input?.focus();
                if (input) {
                    input.style.outline = '2px solid #ff6b6b';
                    setTimeout(() => { input.style.outline = ''; }, 1500);
                }
                return;
            }
            const original = button.textContent;
            button.textContent = 'Thanks ✓';
            button.style.background = '#0a0a0a';
            button.style.color = '#B6F23E';
            input.value = '';
            setTimeout(() => {
                button.textContent = original;
                button.style.background = '';
                button.style.color = '';
            }, 2200);
        });
    });

    /* -------- Service item active state on hover/focus -------- */
    document.querySelectorAll('.service-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            document.querySelectorAll('.service-item').forEach(i => i.classList.remove('is-active'));
            item.classList.add('is-active');
        });
    });

    /* -------- Smooth navbar shadow on scroll -------- */
    const nav = document.querySelector('.navbar');
    if (nav) {
        const onScroll = () => {
            if (window.scrollY > 30) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* -------- Parallax on hero portrait -------- */
    const portrait = document.querySelector('.portrait-orb');
    if (portrait && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const heroLeft = document.querySelector('.hero-left');
        document.querySelector('.hero')?.addEventListener('mousemove', (e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            portrait.style.transform = `translate(${x * 8}px, ${y * 6}px)`;
            if (heroLeft) heroLeft.style.transform = `translate(${x * -4}px, ${y * -3}px)`;
        });
        document.querySelector('.hero')?.addEventListener('mouseleave', () => {
            portrait.style.transform = '';
            if (heroLeft) heroLeft.style.transform = '';
        });
    }
})();
