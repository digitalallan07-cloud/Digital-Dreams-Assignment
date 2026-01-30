/* ========================================
   Digital Dreams — Main JavaScript
   Enhanced with Financial Animations
   ======================================== */

(function () {
    'use strict';

    // --- Navbar scroll effect ---
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    function handleNavScroll() {
        const scrollY = window.scrollY;
        if (scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = scrollY;
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // --- Mobile menu ---
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', function () {
            mobileMenu.classList.toggle('active');
        });

        mobileMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                mobileMenu.classList.remove('active');
            });
        });
    }

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- Scroll reveal animations ---
    function revealElements() {
        var elements = document.querySelectorAll('[data-animate]');
        elements.forEach(function (el) {
            var rect = el.getBoundingClientRect();
            var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
            if (rect.top < window.innerHeight - 80) {
                setTimeout(function () {
                    el.classList.add('visible');
                }, delay);
            }
        });
    }

    window.addEventListener('scroll', revealElements, { passive: true });
    window.addEventListener('load', revealElements);

    // --- Stat items visibility (for CSS animations) ---
    function revealStatItems() {
        var statItems = document.querySelectorAll('.stat-item');
        statItems.forEach(function (item) {
            var rect = item.getBoundingClientRect();
            if (rect.top < window.innerHeight - 80) {
                item.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', revealStatItems, { passive: true });
    window.addEventListener('load', revealStatItems);

    // --- Count-up animation for stats ---
    var statsCounted = false;

    function animateStats() {
        if (statsCounted) return;
        var statsSection = document.getElementById('stats');
        if (!statsSection) return;
        var rect = statsSection.getBoundingClientRect();
        if (rect.top > window.innerHeight - 100) return;

        statsCounted = true;
        var counters = statsSection.querySelectorAll('[data-count]');

        counters.forEach(function (counter) {
            var target = parseInt(counter.getAttribute('data-count'), 10);
            var duration = 2000;
            var start = 0;
            var startTime = null;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                // Ease out cubic
                var eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.floor(eased * target);
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(step);
        });
    }

    window.addEventListener('scroll', animateStats, { passive: true });

    // --- Founders slider (auto-scroll + drag) ---
    var slider = document.getElementById('foundersSlider');
    var track = document.getElementById('foundersTrack');

    if (slider && track) {
        var isDown = false;
        var startX;
        var scrollLeft;
        var autoScrollSpeed = 0.5;
        var autoScrollRAF;
        var isPaused = false;

        // Clone cards for infinite loop effect
        var cards = track.innerHTML;
        track.innerHTML = cards + cards;

        function autoScroll() {
            if (!isPaused && !isDown) {
                slider.scrollLeft += autoScrollSpeed;
                // Reset scroll position for seamless loop
                if (slider.scrollLeft >= track.scrollWidth / 2) {
                    slider.scrollLeft = 0;
                }
            }
            autoScrollRAF = requestAnimationFrame(autoScroll);
        }

        autoScrollRAF = requestAnimationFrame(autoScroll);

        // Pause on hover
        slider.addEventListener('mouseenter', function () {
            isPaused = true;
        });

        slider.addEventListener('mouseleave', function () {
            isPaused = false;
        });

        // Drag functionality
        slider.addEventListener('mousedown', function (e) {
            isDown = true;
            slider.style.cursor = 'grabbing';
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', function () {
            isDown = false;
            slider.style.cursor = 'grab';
        });

        slider.addEventListener('mouseup', function () {
            isDown = false;
            slider.style.cursor = 'grab';
        });

        slider.addEventListener('mousemove', function (e) {
            if (!isDown) return;
            e.preventDefault();
            var x = e.pageX - slider.offsetLeft;
            var walk = (x - startX) * 1.5;
            slider.scrollLeft = scrollLeft - walk;
        });

        // Touch support
        slider.addEventListener('touchstart', function (e) {
            isDown = true;
            isPaused = true;
            startX = e.touches[0].pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        }, { passive: true });

        slider.addEventListener('touchend', function () {
            isDown = false;
            isPaused = false;
        });

        slider.addEventListener('touchmove', function (e) {
            if (!isDown) return;
            var x = e.touches[0].pageX - slider.offsetLeft;
            var walk = (x - startX) * 1.5;
            slider.scrollLeft = scrollLeft - walk;
        }, { passive: true });
    }

    // --- Mouse parallax on hero ---
    var heroSection = document.getElementById('hero');
    var parallaxElements = document.querySelectorAll('[data-parallax]');

    if (heroSection && parallaxElements.length > 0) {
        heroSection.addEventListener('mousemove', function (e) {
            var rect = heroSection.getBoundingClientRect();
            var x = (e.clientX - rect.left) / rect.width - 0.5;
            var y = (e.clientY - rect.top) / rect.height - 0.5;

            parallaxElements.forEach(function (el) {
                var speed = parseFloat(el.getAttribute('data-parallax'));
                var moveX = x * speed * 100;
                var moveY = y * speed * 100;
                el.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
            });
        });
    }

    // --- Confetti + dollar sign celebration ---
    function createConfetti() {
        var container = document.createElement('div');
        container.className = 'confetti-container';
        document.body.appendChild(container);

        var colors = ['#00C896', '#C9A24D', '#10B981', '#3B82F6', '#F59E0B'];
        var symbols = ['$', 'AED', '$', '$', '$'];

        for (var i = 0; i < 40; i++) {
            var piece = document.createElement('span');
            piece.className = 'confetti';

            // Mix confetti shapes and dollar signs
            if (i % 4 === 0) {
                piece.textContent = symbols[i % symbols.length];
                piece.style.fontSize = '14px';
                piece.style.fontFamily = 'Space Grotesk, monospace';
                piece.style.fontWeight = '700';
                piece.style.color = colors[i % colors.length];
                piece.style.width = 'auto';
                piece.style.height = 'auto';
            } else {
                piece.style.background = colors[i % colors.length];
                piece.style.borderRadius = i % 2 === 0 ? '50%' : '2px';
                piece.style.width = (6 + Math.random() * 8) + 'px';
                piece.style.height = (6 + Math.random() * 8) + 'px';
            }

            piece.style.left = Math.random() * 100 + '%';
            piece.style.animationDelay = Math.random() * 1 + 's';
            piece.style.animationDuration = (2 + Math.random() * 2) + 's';
            container.appendChild(piece);
        }

        setTimeout(function () {
            container.remove();
        }, 4000);
    }

    // --- Form submissions with confetti ---
    function handleFormSubmit(formId) {
        var form = document.getElementById(formId);
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var button = form.querySelector('button[type="submit"]');
            var originalText = button.innerHTML;

            button.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px;">Submitting<span class="spinner"></span></span>';
            button.disabled = true;

            // Simulate submission
            setTimeout(function () {
                button.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10L8 14L16 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Application Received!</span>';
                button.style.background = '#10B981';
                button.style.color = '#FFFFFF';

                // Launch confetti
                createConfetti();

                setTimeout(function () {
                    button.innerHTML = originalText;
                    button.disabled = false;
                    button.style.background = '';
                    button.style.color = '';
                    form.reset();
                }, 3000);
            }, 1500);
        });
    }

    handleFormSubmit('quickApplyForm');
    handleFormSubmit('applyForm');

})();
