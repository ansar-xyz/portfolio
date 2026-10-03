(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-control');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const storageKey = 'mohammed-ansar-theme';
  const systemPreference = window.matchMedia('(prefers-color-scheme: dark)');

  const setTheme = (theme, persist = false) => {
    const dark = theme === 'dark';
    root.dataset.theme = dark ? 'dark' : 'light';
    themeButton.setAttribute('aria-pressed', String(dark));
    themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
    themeMeta.setAttribute('content', dark ? '#0d0f13' : '#ffffff');
    if (persist) {
      try { localStorage.setItem(storageKey, theme); } catch (_) { /* Theme still works without persistent storage. */ }
    }
  };

  let savedTheme = null;
  try { savedTheme = localStorage.getItem(storageKey); } catch (_) { /* Storage may be unavailable in private contexts. */ }
  setTheme(savedTheme || (systemPreference.matches ? 'dark' : 'light'));

  themeButton.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
    themeButton.classList.remove('pulse');
    void themeButton.offsetWidth;
    themeButton.classList.add('pulse');
    window.setTimeout(() => themeButton.classList.remove('pulse'), 850);
  });

  if (!savedTheme) {
    systemPreference.addEventListener('change', (event) => setTheme(event.matches ? 'dark' : 'light'));
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    document.documentElement.classList.add('js-ready');
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -48px 0px', threshold: 0.08 });
    revealItems.forEach((item) => observer.observe(item));
  }

  const resumeModal = document.getElementById('resumeModal');
  const resumeFrame = resumeModal?.querySelector('iframe[data-src]');
  resumeModal?.addEventListener('show.bs.modal', () => {
    if (resumeFrame && !resumeFrame.src) resumeFrame.src = resumeFrame.dataset.src;
  });
})();
