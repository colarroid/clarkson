/* ============================================================
   CLARKSON INSURANCE BROKERS — MAIN JAVASCRIPT
   ============================================================ */

/* --- Loader --- */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  const bar = loader.querySelector('.loader-bar');
  if (!bar) return;

  let progress = 0;
  const step = () => {
    progress += Math.random() * 18 + 4;
    if (progress > 88) progress = 88;
    bar.style.width = progress + '%';
    if (progress < 88) setTimeout(step, 120);
  };
  step();

  const finish = () => {
    bar.style.width = '100%';
    bar.style.transition = 'width 0.3s ease';
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 380);
  };

  if (document.readyState === 'complete') {
    finish();
  } else {
    window.addEventListener('load', finish, { once: true });
    setTimeout(finish, 3200);
  }
})();

/* --- Header scroll state --- */
(function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  const update = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
})();

/* --- Mobile nav toggle --- */
(function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('mobile-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    nav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close when a link is clicked
  nav.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!header.contains(e.target) && !nav.contains(e.target)) {
      toggle.classList.remove('open');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
})();

/* --- Hero Slider --- */
(function initSlider() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const track = hero.querySelector('.slider-track');
  const slides = hero.querySelectorAll('.slide');
  const dotsContainer = hero.querySelector('.slider-dots');
  const prevBtn = hero.querySelector('.slider-prev');
  const nextBtn = hero.querySelector('.slider-next');
  const progressBar = hero.querySelector('.slider-progress-bar');
  if (!track || slides.length === 0) return;

  let current = 0;
  let autoInterval;
  const INTERVAL = 5500;

  // Build dots
  if (dotsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i, true));
      dotsContainer.appendChild(dot);
    });
  }

  function updateDots() {
    dotsContainer && dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(index, resetTimer = false) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
    if (resetTimer) { clearInterval(autoInterval); startAuto(); }
    resetProgress();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); clearInterval(autoInterval); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); clearInterval(autoInterval); startAuto(); });

  // Progress bar animation
  let progressStart;
  let progressRaf;

  function resetProgress() {
    if (progressBar) {
      progressBar.style.transition = 'none';
      progressBar.style.width = '0%';
    }
    cancelAnimationFrame(progressRaf);
    progressStart = null;
    requestAnimationFrame(animateProgress);
  }

  function animateProgress(ts) {
    if (!progressStart) progressStart = ts;
    const elapsed = ts - progressStart;
    const pct = Math.min((elapsed / INTERVAL) * 100, 100);
    if (progressBar) progressBar.style.width = pct + '%';
    if (pct < 100) progressRaf = requestAnimationFrame(animateProgress);
  }

  function startAuto() {
    autoInterval = setInterval(next, INTERVAL);
  }

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { prev(); clearInterval(autoInterval); startAuto(); }
    if (e.key === 'ArrowRight') { next(); clearInterval(autoInterval); startAuto(); }
  });

  // Touch / swipe
  let touchStartX = 0;
  hero.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); clearInterval(autoInterval); startAuto(); }
  });

  // Start
  updateDots();
  startAuto();
  resetProgress();
})();

/* --- Scroll Reveal --- */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => obs.observe(el));
})();

/* --- Active nav link --- */
(function markActiveLink() {
  const path = window.location.pathname.replace(/\/$/, '');
  const filename = path.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkFile = href.replace(/^\.\//, '').replace(/\/$/, '').split('/').pop() || 'index.html';
    const isHome = (linkFile === 'index.html' || linkFile === '') &&
                   (filename === '' || filename === 'index.html');
    if (isHome || (linkFile !== 'index.html' && linkFile !== '' && filename === linkFile)) {
      link.classList.add('active');
    }
  });
})();

/* --- Contact Form --- */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Sending…';

    // Simulate send (replace with real form backend as needed)
    setTimeout(() => {
      form.style.display = 'none';
      const success = document.getElementById('form-success');
      if (success) { success.style.display = 'block'; success.classList.add('show'); }
    }, 1400);
  });
})();

/* --- Smooth anchor links --- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
