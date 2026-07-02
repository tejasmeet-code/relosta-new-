document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu ---
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileBtn.classList.toggle('open');

            // Toggle Icon
            const icon = mobileBtn.querySelector('i');
            if (mobileBtn.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when a link is clicked
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileBtn.classList.remove('open');

                const icon = mobileBtn.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            });
        });
    }

    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Scroll Animations (Safe) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before element is fully in view
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);

    // List of selectors to animate
    const selectorsToAnimate = [
        '.hero-content > *', // Animate title, subtitle, buttons separately
        '.hero-image',
        '.section-title',
        '.service-card',
        '.work-card',
        '.review-card', // Note: Marquee might conflict if using this, but it's fine
        '.about-story',
        '.team-member',
        '.value-card',
        '.contact-form',
        '.contact-info-box',
        '.stat-box',
        '.video-card'
    ];

    const animateElements = document.querySelectorAll(selectorsToAnimate.join(', '));

    animateElements.forEach((el, index) => {
        // Add the class that prepares the animation (opacity: 0)
        // We do this in JS so if JS fails, CSS default is visible.
        el.classList.add('animate-ready');
        observer.observe(el);
    });

    // Handle Active Link Highlighting
    const currentPath = window.location.pathname;
    const navLinksArr = document.querySelectorAll('.nav-links a');
    navLinksArr.forEach(link => {
        if (link.getAttribute('href') === currentPath.split('/').pop() || (currentPath === '/' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active-link');
        }
    });

    // --- Special Reveal Animation for FordMC / New Elements ---
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });

        revealElements.forEach(el => revealObserver.observe(el));
    }

});
