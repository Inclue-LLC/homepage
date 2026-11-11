(() => {
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js-reveal');

  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('global-nav');

  // Mobile menu
  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.visually-hidden').textContent = open ? 'メニューを閉じる' : 'メニューを開く';
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => { if (e.matches) setOpen(false); });

  // Header shadow on scroll
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Reveal on scroll
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('is-visible'));
  }

  // In-page tabs: highlight the section in view
  const tabLinks = [...document.querySelectorAll('.page-tabs a[href^="#"]')];
  if (tabLinks.length && 'IntersectionObserver' in window) {
    const map = new Map(tabLinks.map((a) => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        tabLinks.forEach((a) => a.classList.remove('is-active'));
        const link = map.get(entry.target.id);
        if (link) {
          link.classList.add('is-active');
          link.scrollIntoView({ block: 'nearest', inline: 'center' });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    map.forEach((_, id) => { const el = document.getElementById(id); if (el) spy.observe(el); });
  }

  // Contact form -> opens the visitor's mail app with the inquiry filled in
  const form = document.getElementById('contact-form');
  if (form) {
    const error = form.querySelector('.form-error');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const required = [...form.querySelectorAll('[required]')];
      let ok = true;
      required.forEach((el) => {
        const invalid = !el.value.trim() || (el.type === 'email' && !el.checkValidity());
        el.classList.toggle('is-invalid', invalid);
        el.setAttribute('aria-invalid', String(invalid));
        if (invalid) ok = false;
      });
      error.hidden = ok;
      if (!ok) { form.querySelector('.is-invalid').focus(); return; }

      const v = (name) => form.elements[name].value.trim();
      const subject = `【お問い合わせ】${v('type')}`;
      const body = [
        `お問い合わせ種別：${v('type')}`,
        `会社名・団体名：${v('company') || '-'}`,
        `お名前：${v('name')}`,
        `メールアドレス：${v('email')}`,
        '',
        '■お問い合わせ内容',
        v('message'),
      ].join('\n');
      const done = form.querySelector('.form-done');
      if (form.dataset.preview) {
        done.textContent = 'これはプレビュー版のため、送信やメールの作成は行われません。公開サイトでは、ここでメールソフトが起動します。';
        done.hidden = false;
        return;
      }
      window.location.href = `mailto:${form.dataset.mail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  // Copy buttons
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    const label = btn.querySelector('span');
    btn.addEventListener('click', () => {
      const text = btn.dataset.copy;
      const flash = (msg) => { label.textContent = msg; setTimeout(() => { label.textContent = 'コピー'; }, 1800); };
      const fallback = () => {
        const target = btn.parentElement.querySelector('.mail-text, a');
        if (target) { const r = document.createRange(); r.selectNodeContents(target); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); }
        flash('選択しました');
      };
      try {
        navigator.clipboard.writeText(text).then(() => flash('コピーしました'), fallback);
      } catch (e) { fallback(); }
    });
  });

  document.querySelectorAll('.js-year').forEach((el) => { el.textContent = String(new Date().getFullYear()); });
})();
