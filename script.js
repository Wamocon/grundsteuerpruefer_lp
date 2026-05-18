/* =============================================
   GrundsteuerPrüfer – JavaScript
   Language Toggle + UI Interactions
   WAMOCON GmbH
   ============================================= */

(function () {
  'use strict';

  /* ------ Language State ------ */
  const STORAGE_KEY = 'gsp_lang';
  let currentLang = localStorage.getItem(STORAGE_KEY) || detectBrowserLang();

  function detectBrowserLang() {
    const lang = (navigator.language || navigator.userLanguage || 'de').toLowerCase();
    return lang.startsWith('de') ? 'de' : 'en';
  }

  /* ------ Apply Language ------ */
  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);

    // Update all bilingual elements
    document.querySelectorAll('[data-de][data-en]').forEach(function (el) {
      el.textContent = el.getAttribute('data-' + lang);
    });

    // Update placeholder attributes
    document.querySelectorAll('[data-de-placeholder][data-en-placeholder]').forEach(function (el) {
      el.setAttribute('placeholder', el.getAttribute('data-' + lang + '-placeholder'));
    });

    // Update aria-label attributes
    document.querySelectorAll('[data-de-label][data-en-label]').forEach(function (el) {
      el.setAttribute('aria-label', el.getAttribute('data-' + lang + '-label'));
    });

    // Update href attributes for links that differ by language
    document.querySelectorAll('[data-de-href][data-en-href]').forEach(function (el) {
      el.setAttribute('href', el.getAttribute('data-' + lang + '-href'));
    });

    // Update page title and meta
    const titleEl = document.querySelector('[data-page-title-de][data-page-title-en]');
    if (titleEl) {
      document.title = titleEl.getAttribute('data-page-title-' + lang);
    }
    const metaDesc = document.querySelector('meta[name="description"][data-meta-desc-de][data-meta-desc-en]');
    if (metaDesc) {
      metaDesc.setAttribute('content', metaDesc.getAttribute('data-meta-desc-' + lang));
    }

    // Update lang attribute on html element
    document.documentElement.lang = lang === 'de' ? 'de' : 'en';

    // Sync all toggle buttons
    document.querySelectorAll('.lang-toggle__btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }

  /* ------ Scroll Effects ------ */
  function handleScroll() {
    const nav = document.querySelector('.nav');
    const scrollTopBtn = document.querySelector('.scroll-top');
    const scrollY = window.scrollY || window.pageYOffset;

    if (nav) nav.classList.toggle('scrolled', scrollY > 40);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', scrollY > 400);
  }

  /* ------ Mobile Menu ------ */
  function initMobileMenu() {
    const hamburger = document.querySelector('.nav__hamburger');
    const navLinks = document.querySelector('.nav__links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      hamburger.querySelectorAll('span').forEach(function (span, i) {
        if (isOpen) {
          if (i === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
          if (i === 1) span.style.opacity = '0';
          if (i === 2) span.style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
          span.style.transform = '';
          span.style.opacity = '';
        }
      });
    });

    // Close menu on nav link click
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.querySelectorAll('span').forEach(function (span) {
          span.style.transform = '';
          span.style.opacity = '';
        });
      });
    });
  }

  /* ------ FAQ Accordion ------ */
  function initFaq() {
    document.querySelectorAll('.faq-item__question').forEach(function (question) {
      question.addEventListener('click', function () {
        const item = question.closest('.faq-item');
        const isOpen = item.classList.contains('open');

        // Close all
        document.querySelectorAll('.faq-item').forEach(function (i) {
          i.classList.remove('open');
        });

        // Toggle current
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  /* ------ Smooth Scroll for Anchors ------ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const offset = 80;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ------ Intersection Observer Animations ------ */
  function initAnimations() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-card, .step, .trust-badge').forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });

    document.addEventListener('animateIn', function () {}, false);

    // Use requestAnimationFrame to set animate-in styles
    document.querySelectorAll('.feature-card, .step, .trust-badge').forEach(function (el) {
      el.addEventListener('animateIn', function () {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  }

  // Polyfill for animate-in via class
  (function () {
    const style = document.createElement('style');
    style.textContent = '.animate-in { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);
  })();

  /* ------ Init ------ */
  document.addEventListener('DOMContentLoaded', function () {
    // Language toggles
    document.querySelectorAll('.lang-toggle__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyLang(btn.dataset.lang);
      });
    });

    // Scroll-to-top button
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Apply initial language
    applyLang(currentLang);

    // Init modules
    initMobileMenu();
    initFaq();
    initSmoothScroll();
    initAnimations();

    // Scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  });
})();
