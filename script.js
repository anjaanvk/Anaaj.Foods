// Main JavaScript file
document.addEventListener('DOMContentLoaded', function () {
    // ===== HAMBURGER MENU =====
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a nav link
        document.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // ===== SCROLL ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to sections and cards
    const animateElements = document.querySelectorAll(
        '.featured-card, .testimonial-card, .philosophy-card, .chef-card, .contact-card, .menu-item, .intro-grid, .section-header, .values-banner, .stat-item'
    );
    animateElements.forEach(function (el) {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // ===== COUNTER ANIMATION =====
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    if (statNumbers.length > 0) {
        const counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    animateCounter(entry.target, target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(function (num) {
            counterObserver.observe(num);
        });
    }

    function animateCounter(element, target) {
        let current = 0;
        const duration = 2000;
        const increment = target / (duration / 16);

        function update() {
            current += increment;
            if (current >= target) {
                element.textContent = formatNumber(target);
                return;
            }
            element.textContent = formatNumber(Math.floor(current));
            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    function formatNumber(num) {
        if (num >= 1000) {
            return num.toLocaleString('en-IN');
        }
        return num.toString();
    }

    // ===== MENU FILTER =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuCategories = document.querySelectorAll('.menu-category');

    if (filterBtns.length > 0 && menuCategories.length > 0) {
        filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                // Update active button
                filterBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');

                const category = btn.getAttribute('data-category');

                menuCategories.forEach(function (cat) {
                    if (category === 'all') {
                        cat.style.display = 'block';
                    } else if (cat.id === category) {
                        cat.style.display = 'block';
                    } else {
                        cat.style.display = 'none';
                    }
                });

                // Re-trigger animations for visible items
                const visibleItems = document.querySelectorAll('.menu-item');
                visibleItems.forEach(function (item) {
                    item.classList.remove('visible');
                    void item.offsetWidth; // trigger reflow
                    observer.observe(item);
                });
            });
        });
    }

    // ===== RESERVATION FORM =====
    const reservationForm = document.getElementById('reservationForm');
    const formSuccess = document.getElementById('formSuccess');

    if (reservationForm && formSuccess) {
        // Set minimum date to today
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        reservationForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Basic validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const guests = document.getElementById('guests').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;

            if (!name || !email || !phone || !guests || !date || !time) {
                showFormError('Please fill in all required fields.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormError('Please enter a valid email address.');
                return;
            }

            // Phone validation (basic)
            const phoneRegex = /^[\d\s+\-()]{10,}$/;
            if (!phoneRegex.test(phone)) {
                showFormError('Please enter a valid phone number.');
                return;
            }

            // Show success message
            reservationForm.style.display = 'none';
            formSuccess.style.display = 'block';
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    function showFormError(message) {
        // Remove existing error
        const existingError = document.querySelector('.form-error');
        if (existingError) existingError.remove();

        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.style.cssText = 'background: #fef2f2; color: #dc2626; padding: 12px 16px; border-radius: 8px; font-size: 14px; margin-bottom: 16px; border: 1px solid #fecaca;';
        errorDiv.textContent = message;

        if (reservationForm) {
            reservationForm.insertBefore(errorDiv, reservationForm.firstChild);
            setTimeout(function () {
                errorDiv.remove();
            }, 4000);
        }
    }

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
