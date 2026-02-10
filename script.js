/* ============================================
   ShellNest - Agency-Level Animation System
   GSAP + ScrollTrigger + Lenis + SplitType
   ============================================ */

(function() {
  'use strict';

  // ---- PRELOADER ----
  const preloader = document.querySelector('.preloader');
  const preloaderIcon = document.querySelector('.preloader-icon');
  const preloaderLogo = document.querySelector('.preloader-logo');
  const preloaderCounter = document.querySelector('.preloader-counter');
  const preloaderBar = document.querySelector('.preloader-bar');
  const preloaderBarFill = document.querySelector('.preloader-bar-fill');

  if (preloader && typeof gsap !== 'undefined') {
    const tl = gsap.timeline();

    // Animate SVG logo icon (clean scale + fade using the img)
    tl.to(preloaderIcon, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' })
      .to(preloaderLogo, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.2')
      .to(preloaderBar, { opacity: 1, duration: 0.3 }, '-=0.2')
      .to(preloaderCounter, { opacity: 1, duration: 0.3 }, '-=0.2');

    // Animate progress bar
    let counter = { val: 0 };
    gsap.to(counter, {
      val: 100,
      duration: 1.8,
      delay: 0.6,
      ease: 'power2.inOut',
      onUpdate: function() {
        if (preloaderBarFill) preloaderBarFill.style.width = Math.round(counter.val) + '%';
        if (preloaderCounter) preloaderCounter.textContent = Math.round(counter.val) + '%';
      },
      onComplete: function() {
        // Scale up logo slightly before exit
        gsap.to(preloaderIcon, { scale: 1.15, duration: 0.3, ease: 'power2.in' });
        gsap.to(preloader, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.8,
          delay: 0.3,
          ease: 'power4.inOut',
          onComplete: function() {
            preloader.style.display = 'none';
            document.body.style.overflow = '';
            initAnimations();
          }
        });
      }
    });
  } else {
    // No preloader, init immediately
    if (preloader) preloader.style.display = 'none';
    document.addEventListener('DOMContentLoaded', initAnimations);
  }

  function initAnimations() {
    initLenis();
    initCursor();
    initNav();
    initHeroAnimations();
    initScrollAnimations();
    initCounters();
    initMagneticButtons();
    initImageReveals();
    initMobileMenu();
    initFormAnimations();
  }

  // ---- LENIS SMOOTH SCROLL ----
  let lenis;

  function initLenis() {
    if (typeof Lenis === 'undefined') return;

    lenis = new Lenis({
      duration: 1.2,
      easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on('scroll', function() {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.update();
      }
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Scroll to top button
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', function() {
        lenis.scrollTo(0, { duration: 1.5 });
      });
    }
  }

  // ---- CUSTOM CURSOR ----
  function initCursor() {
    if (window.innerWidth < 768) return;

    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      // Dot follows mouse directly
      dotX += (mouseX - dotX) * 0.35;
      dotY += (mouseY - dotY) * 0.35;
      dot.style.left = dotX + 'px';
      dot.style.top = dotY + 'px';

      // Ring follows with delay
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect on interactive elements
    var hoverEls = document.querySelectorAll('a, button, .product-card, .why-card, .step-item, .contact-card, .gallery-item, .value-chain-card, .timeline-card, .h-info-card, .practice-card, .trade-step, input, textarea, select');
    hoverEls.forEach(function(el) {
      el.addEventListener('mouseenter', function() {
        dot.classList.add('hover');
        ring.classList.add('hover');
      });
      el.addEventListener('mouseleave', function() {
        dot.classList.remove('hover');
        ring.classList.remove('hover');
      });
    });
  }

  // ---- NAVIGATION ----
  function initNav() {
    var nav = document.getElementById('nav');
    if (!nav) return;

    // Check if it's the home page (has full-height hero)
    var isHome = document.querySelector('.hero') !== null;

    if (!isHome) {
      nav.classList.add('scrolled');
    }

    window.addEventListener('scroll', function() {
      if (isHome) {
        if (window.scrollY > 80) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      }
    }, { passive: true });

    // Force check on load
    if (isHome && window.scrollY > 80) {
      nav.classList.add('scrolled');
    }
  }

  // ---- MOBILE MENU ----
  function initMobileMenu() {
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.querySelector('.mobile-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function() {
      toggle.classList.toggle('open');
      menu.classList.toggle('open');
      if (menu.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
        if (lenis) lenis.stop();
      } else {
        document.body.style.overflow = '';
        if (lenis) lenis.start();
      }
    });

    menu.querySelectorAll('.nav-link').forEach(function(link) {
      link.addEventListener('click', function() {
        toggle.classList.remove('open');
        menu.classList.remove('open');
        document.body.style.overflow = '';
        if (lenis) lenis.start();
      });
    });
  }

  // ---- HERO ANIMATIONS ----
  function initHeroAnimations() {
    if (typeof gsap === 'undefined') return;

    // Home hero
    var heroTitle = document.querySelector('.hero-title');
    var heroBadge = document.querySelector('.hero-badge');
    var heroSubtitle = document.querySelector('.hero-subtitle');
    var heroActions = document.querySelector('.hero-actions');
    var heroScroll = document.querySelector('.hero-scroll');
    var heroBg = document.querySelector('.hero-bg img');

    if (heroTitle && typeof SplitType !== 'undefined') {
      var split = new SplitType(heroTitle, { types: 'chars' });

      var tl = gsap.timeline({ delay: 0.3 });

      if (heroBadge) {
        tl.to(heroBadge, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
      }

      tl.fromTo(split.chars,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.02, ease: 'power4.out' },
        '-=0.3');

      if (heroSubtitle) {
        tl.to(heroSubtitle, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4');
      }

      if (heroActions) {
        tl.to(heroActions, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');
      }

      if (heroScroll) {
        tl.fromTo(heroScroll, { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.1');
      }
    }

    // Hero parallax
    if (heroBg && typeof ScrollTrigger !== 'undefined') {
      gsap.to(heroBg, {
        y: '20%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5
        }
      });
    }

    // Page hero image reveal (inner pages)
    var pageHeroReveal = document.querySelector('.page-hero-image .img-reveal');
    if (pageHeroReveal) {
      gsap.to(pageHeroReveal, {
        scaleX: 0,
        duration: 1.2,
        delay: 0.5,
        ease: 'power4.inOut'
      });
    }

    // Homepage hero image reveal (split layout)
    var heroImageReveal = document.querySelector('.hero-image-panel .img-reveal');
    if (heroImageReveal) {
      gsap.to(heroImageReveal, {
        scaleX: 0,
        duration: 1.2,
        delay: 0.8,
        ease: 'power4.inOut'
      });
    }
  }

  // ---- SCROLL ANIMATIONS ----
  function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // General fade-up animations
    var animateEls = document.querySelectorAll('[data-animate]');
    animateEls.forEach(function(el) {
      var type = el.getAttribute('data-animate');
      var delay = parseFloat(el.getAttribute('data-delay') || 0);

      var from = { opacity: 0 };
      if (type === 'fade-up') from.y = 50;
      else if (type === 'fade-left') from.x = -50;
      else if (type === 'fade-right') from.x = 50;
      else if (type === 'scale-in') from.scale = 0.9;

      var to = { opacity: 1, duration: 1.2, delay: delay, ease: 'power4.out' };
      if (type === 'fade-up') to.y = 0;
      else if (type === 'fade-left') to.x = 0;
      else if (type === 'fade-right') to.x = 0;
      else if (type === 'scale-in') to.scale = 1;

      gsap.fromTo(el, from, Object.assign(to, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        }
      }));
    });

    // Staggered grid items
    var staggerGroups = document.querySelectorAll('[data-stagger]');
    staggerGroups.forEach(function(group) {
      var children = group.children;
      gsap.fromTo(children,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: group, start: 'top 80%', once: true }
        });
    });

    // Character split headings
    if (typeof SplitType !== 'undefined') {
      var splitHeadings = document.querySelectorAll('[data-split]');
      splitHeadings.forEach(function(heading) {
        var split = new SplitType(heading, { types: 'words' });
        gsap.fromTo(split.words,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.04, ease: 'power3.out',
            scrollTrigger: { trigger: heading, start: 'top 82%', once: true }
          });
      });
    }

    // Parallax elements
    var parallaxEls = document.querySelectorAll('[data-parallax]');
    parallaxEls.forEach(function(el) {
      var speed = parseFloat(el.getAttribute('data-parallax') || 0.2);
      gsap.to(el, {
        y: function() { return -100 * speed; },
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5
        }
      });
    });

    // Section labels animation
    var labels = document.querySelectorAll('.section-label');
    labels.forEach(function(label) {
      gsap.fromTo(label,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: label, start: 'top 88%', once: true }
        });
    });
  }

  // ---- COUNTER ANIMATIONS ----
  function initCounters() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    var stats = document.querySelectorAll('[data-count]');
    stats.forEach(function(stat) {
      var target = stat.getAttribute('data-count');
      var suffix = stat.getAttribute('data-suffix') || '';
      var prefix = stat.getAttribute('data-prefix') || '';
      var isNum = !isNaN(parseFloat(target));

      if (isNum) {
        var counter = { val: 0 };
        var targetNum = parseFloat(target);

        ScrollTrigger.create({
          trigger: stat,
          start: 'top 85%',
          once: true,
          onEnter: function() {
            gsap.to(counter, {
              val: targetNum,
              duration: 2,
              ease: 'power2.out',
              onUpdate: function() {
                var display = targetNum % 1 === 0 ? Math.round(counter.val) : counter.val.toFixed(1);
                stat.textContent = prefix + display + suffix;
              }
            });
          }
        });
      }
    });
  }

  // ---- MAGNETIC BUTTONS ----
  function initMagneticButtons() {
    if (window.innerWidth < 768) return;

    var magnets = document.querySelectorAll('.magnetic');
    magnets.forEach(function(magnet) {
      magnet.addEventListener('mousemove', function(e) {
        var rect = magnet.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        var strength = 0.3;

        if (typeof gsap !== 'undefined') {
          gsap.to(magnet, {
            x: x * strength,
            y: y * strength,
            duration: 0.4,
            ease: 'power3.out'
          });
        }
      });

      magnet.addEventListener('mouseleave', function() {
        if (typeof gsap !== 'undefined') {
          gsap.to(magnet, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.4)'
          });
        }
      });
    });
  }

  // ---- IMAGE REVEALS ----
  function initImageReveals() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    var masks = document.querySelectorAll('.img-mask');
    masks.forEach(function(mask) {
      var overlay = mask.querySelector('.mask-overlay');
      var img = mask.querySelector('img');

      if (overlay) {
        gsap.to(overlay, {
          scaleX: 0,
          duration: 1.2,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: mask,
            start: 'top 75%',
            once: true,
            onEnter: function() {
              mask.classList.add('revealed');
            }
          }
        });
      } else if (img) {
        // Simple scale + fade reveal
        gsap.fromTo(img,
          { scale: 1.2, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.4, ease: 'power3.out',
            scrollTrigger: {
              trigger: mask, start: 'top 80%', once: true,
              onEnter: function() { mask.classList.add('revealed'); }
            }
          });
      }
    });
  }

  // ---- FORM ANIMATIONS ----
  function initFormAnimations() {
    var inputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
    inputs.forEach(function(input) {
      input.addEventListener('focus', function() {
        var label = this.parentElement.querySelector('label');
        if (label) label.style.color = 'var(--gold)';
      });
      input.addEventListener('blur', function() {
        var label = this.parentElement.querySelector('label');
        if (label) label.style.color = '';
      });
    });
  }

})();
