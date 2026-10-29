/**
 * The Visionary Vault - NIET Technical Club Website
 * JavaScript Functions & Interactions
 * ===================================================
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initHeroSlider();
    initStickyHeader();
    initScrollToTop();
    initSmoothScroll();
    initCounterAnimation();
    initGalleryFilter();
    initDropdowns();
    initFadeAnimations();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const mainNav = document.querySelector('.main-nav');
    const body = document.body;

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    body.appendChild(overlay);

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            overlay.classList.toggle('active');
            body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
        });

        overlay.addEventListener('click', function() {
            mobileToggle.classList.remove('active');
            mainNav.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
        });

        // Close menu when clicking nav links
        const navLinks = mainNav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    mobileToggle.classList.remove('active');
                    mainNav.classList.remove('active');
                    overlay.classList.remove('active');
                    body.style.overflow = '';
                }
            });
        });
    }
}

/**
 * Hero Slider
 */
function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const dotsContainer = document.getElementById('sliderDots');
    
    if (!slides.length || !dotsContainer) return;

    let currentSlide = 0;
    let autoSlideInterval;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `slider-dot${index === 0 ? ' active' : ''}`;
        dot.setAttribute('data-index', index);
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.slider-dot');

    function showSlide(index) {
        // Handle wrapping
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;

        // Update slides
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        currentSlide = index;
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
        });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            showSlide(parseInt(dot.getAttribute('data-index')));
            startAutoSlide();
        });
    });

    // Touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    const slider = document.querySelector('.hero-slider');

    if (slider) {
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoSlide();
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            startAutoSlide();
        }, { passive: true });
    }

    // Start auto sliding
    startAutoSlide();

    // Pause on hover
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', stopAutoSlide);
        heroSection.addEventListener('mouseleave', startAutoSlide);
    }
}

/**
 * Sticky Header with Shadow
 */
function initStickyHeader() {
    const header = document.getElementById('mainHeader');
    
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

/**
 * Scroll to Top Button
 */
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/**
 * Counter Animation for Stats
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    if (!counters.length) return;

    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    };

    // Intersection Observer for triggering animation
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

/**
 * Gallery Filter
 */
function initGalleryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (!filterBtns.length || !galleryItems.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/**
 * Dropdown Menus for Desktop
 */
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav-link');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        // For mobile: toggle on click
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && !e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown').forEach(d => {
                d.classList.remove('active');
            });
        }
    });
}

/**
 * Fade-in Animations on Scroll
 */
function initFadeAnimations() {
    // Add fade-in class to elements
    const animateElements = document.querySelectorAll(
        '.objective-card, .benefit-item, .project-card, .gallery-item, .cta-card'
    );

    animateElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${index % 3 * 0.1}s`;
    });

    // Intersection Observer for fade-in animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    animateElements.forEach(el => observer.observe(el));
}

/**
 * Mobile Navigation Close on Resize
 */
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        const mainNav = document.querySelector('.main-nav');
        const mobileToggle = document.getElementById('mobileToggle');
        const overlay = document.querySelector('.mobile-overlay');
        const body = document.body;

        if (mainNav) mainNav.classList.remove('active');
        if (mobileToggle) mobileToggle.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        body.style.overflow = '';
    }
});

/**
 * Preloader (Optional - Add HTML for preloader to enable)
 */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });
    }
}

/**
 * Current Year in Copyright
 */
function updateCopyrightYear() {
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(el => {
        el.textContent = currentYear;
    });
}

// Call copyright update
updateCopyrightYear();

/**
 * Keyboard Navigation Support
 */
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const mainNav = document.querySelector('.main-nav');
        const mobileToggle = document.getElementById('mobileToggle');
        const overlay = document.querySelector('.mobile-overlay');
        
        if (mainNav && mainNav.classList.contains('active')) {
            mobileToggle.classList.remove('active');
            mainNav.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});
