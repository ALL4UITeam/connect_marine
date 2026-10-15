export function initNavigation() {
  const header = document.querySelector('[data-header]');
  if (!header) return;
  const toggle = header.querySelector('.menu-toggle');
  const navigation = header.querySelector('.site-nav');
  if (!toggle || !navigation) return;

  const mobile = window.matchMedia('(max-width: 47.99rem)');
  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '닫기' : '메뉴';
    navigation.hidden = mobile.matches && !open;
  };
  const syncViewport = () => {
    toggle.hidden = !mobile.matches;
    setOpen(false);
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });
  header.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobile.matches) {
      setOpen(false);
      toggle.focus();
    }
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('click', (event) => {
    if (mobile.matches && !header.contains(event.target)) setOpen(false);
  });
  mobile.addEventListener('change', syncViewport);
  syncViewport();
}
