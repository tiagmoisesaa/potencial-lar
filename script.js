/**
 * Potencial Lar e Construção
 * Main JavaScript - Animations, Navigation & Interactions
 */

(function () {
  'use strict';

  // ============================================
  // Header Scroll Effect
  // ============================================
  const header = document.getElementById('header');
  let lastScrollY = 0;
  let ticking = false;

  function updateHeader() {
    const scrollY = window.scrollY;

    if (scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

  // ============================================
  // Mobile Menu Toggle
  // ============================================
  const hamburger = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';

      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
    });

    // Close menu when clicking a nav link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ============================================
  // Scroll Animation (Intersection Observer)
  // ============================================
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(function (el, index) {
      // Stagger the animation delay based on the element's position within its parent
      const siblings = el.parentElement ? Array.from(el.parentElement.children).filter(function (c) {
        return c.classList.contains('animate-on-scroll');
      }) : [];
      const siblingIndex = siblings.indexOf(el);

      if (siblingIndex > 0) {
        el.style.transitionDelay = (siblingIndex * 0.1) + 's';
      }

      observer.observe(el);
    });
  } else {
    // Fallback for older browsers
    animatedElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // Active Navigation Highlight
  // ============================================
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

  function highlightNavOnScroll() {
    const scrollY = window.scrollY + 100;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navItems.forEach(function (item) {
          item.classList.remove('active');
          if (item.getAttribute('href') === '#' + sectionId) {
            item.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  // ============================================
  // WhatsApp Float Visibility
  // ============================================
  const whatsappFloat = document.getElementById('whatsapp-float');

  if (whatsappFloat) {
    // Initially hide and show after slight scroll
    whatsappFloat.style.opacity = '0';
    whatsappFloat.style.transform = 'translateY(20px) scale(0.8)';
    whatsappFloat.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';

    function showWhatsAppFloat() {
      if (window.scrollY > 300) {
        whatsappFloat.style.opacity = '1';
        whatsappFloat.style.transform = 'translateY(0) scale(1)';
      }
    }

    window.addEventListener('scroll', showWhatsAppFloat, { passive: true });

    // Also show after 3 seconds regardless of scroll
    setTimeout(function () {
      whatsappFloat.style.opacity = '1';
      whatsappFloat.style.transform = 'translateY(0) scale(1)';
    }, 3000);
  }

  // ============================================
  // Counter Animation for Stats
  // ============================================
  function animateCounter(el, target, suffix) {
    suffix = suffix || '';
    var current = 0;
    var increment = target / 40;
    var timer = setInterval(function () {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, 30);
  }

  // ============================================
  // Preload Critical Images
  // ============================================
  var heroImg = document.querySelector('.hero-bg img');
  if (heroImg) {
    heroImg.addEventListener('load', function () {
      heroImg.style.opacity = '0.85';
    });
  }

  // ============================================
  // Year Auto-Update in Footer
  // ============================================
  var yearElements = document.querySelectorAll('.footer-bottom p');
  if (yearElements.length > 0) {
    var currentYear = new Date().getFullYear();
    yearElements[0].innerHTML = yearElements[0].innerHTML.replace(/2025/, currentYear);
  }

  // ============================================
  // Keyboard Accessibility
  // ============================================
  document.addEventListener('keydown', function (e) {
    // Close mobile menu on Escape
    if (e.key === 'Escape') {
      if (navMenu && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.focus();
      }
    }
  });

  // ============================================
  // Performance: Lazy Load Google Maps
  // ============================================
  var mapContainer = document.querySelector('.map-container');
  if (mapContainer) {
    var mapIframe = mapContainer.querySelector('iframe');
    if (mapIframe && 'IntersectionObserver' in window) {
      var originalSrc = mapIframe.getAttribute('src');
      mapIframe.removeAttribute('src');

      var mapObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            mapIframe.setAttribute('src', originalSrc);
            mapObserver.unobserve(entry.target);
          }
        });
      }, { rootMargin: '200px' });

      mapObserver.observe(mapContainer);
    }
  }

  // ============================================
  // Console Branding
  // ============================================
  console.log(
    '%c🏗️ Potencial Lar e Construção',
    'font-size: 20px; font-weight: bold; color: #f97316; background: #1f2937; padding: 10px 20px; border-radius: 8px;'
  );
  console.log(
    '%cSite desenvolvido com ❤️',
    'font-size: 12px; color: #6b7280;'
  );

})();
