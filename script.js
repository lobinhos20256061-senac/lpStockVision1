/* ============================================================
   STOCK VISION — LANDING PAGE
   JavaScript ES6 — interações, animações e microinterações
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 0. MODO CLARO / ESCURO ---------- */
  const htmlEl = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggle');
  const themeIconSun = document.querySelector('.theme-icon-sun');
  const themeIconMoon = document.querySelector('.theme-icon-moon');

  const setThemeButtonState = (theme) => {
    if (!themeToggleBtn) return;
    const isLight = theme === 'light';

    themeToggleBtn.setAttribute('aria-pressed', isLight ? 'true' : 'false');
    themeToggleBtn.setAttribute(
      'aria-label',
      isLight ? 'Ativar modo escuro' : 'Ativar modo claro'
    );
    themeToggleBtn.classList.toggle('is-light', isLight);
    themeToggleBtn.classList.toggle('is-dark', !isLight);

    if (themeIconSun && themeIconMoon) {
      themeIconSun.style.opacity = isLight ? '1' : '0.4';
      themeIconMoon.style.opacity = isLight ? '0.4' : '1';
    }
  };

  // Estado inicial já foi definido no <head> (evita flash); só sincroniza o botão
  const initialTheme = htmlEl.getAttribute('data-theme') || 'dark';
  setThemeButtonState(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = htmlEl.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      htmlEl.setAttribute('data-theme', next);
      localStorage.setItem('stockvision-theme', next);
      setThemeButtonState(next);
    });
  }

  /* ---------- 1. LOADING SCREEN ---------- */
  const loadingScreen = document.getElementById('loading-screen');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loadingScreen.classList.add('loaded');
    }, 500);
  });

  /* ---------- 2. NAVBAR: muda aparência no scroll ---------- */
  const navbar = document.getElementById('mainNavbar');
  const handleNavbarScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  handleNavbarScroll();
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  // Fecha o menu mobile ao clicar em um link
  const navLinks = document.querySelectorAll('#navMenu .nav-link');
  const navCollapseEl = document.getElementById('navMenu');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navCollapseEl.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navCollapseEl);
        bsCollapse.hide();
      }
    });
  });

  /* ---------- 3. SCROLL PROGRESS BAR ---------- */
  const progressBar = document.getElementById('scroll-progress');
  const updateProgressBar = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  };
  updateProgressBar();
  window.addEventListener('scroll', updateProgressBar, { passive: true });

  /* ---------- 4. BOTÃO VOLTAR AO TOPO ---------- */
  const backToTopBtn = document.getElementById('backToTop');
  const toggleBackToTop = () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };
  toggleBackToTop();
  window.addEventListener('scroll', toggleBackToTop, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- 5. SCROLL REVEAL ANIMATIONS (fade in / slide up) ---------- */
  const animatedEls = document.querySelectorAll('[data-animate]');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay ? parseInt(el.dataset.delay, 10) : 0;
        setTimeout(() => el.classList.add('in-view'), delay);
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  animatedEls.forEach(el => revealObserver.observe(el));

  /* ---------- 6. CONTADORES ANIMADOS (estatísticas do Hero) ---------- */
  const statNumbers = document.querySelectorAll('.stat-number');

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const value = Math.floor(eased * target);
      el.textContent = value.toLocaleString('pt-BR');
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('pt-BR');
      }
    };
    requestAnimationFrame(step);
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => statsObserver.observe(el));

  /* ---------- 7. ATUALIZA O ANO NO FOOTER ---------- */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});