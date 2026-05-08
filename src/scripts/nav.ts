const STICK_AT = 80;
const HOVER_CLOSE_DELAY = 150;
const ANIM_MS = 240;

function initStickyHeader(): void {
  const header = document.querySelector<HTMLElement>('[data-nirvana-header]');
  if (!header) return;
  const onScroll = (): void => {
    header.dataset.stuck = window.scrollY > STICK_AT ? 'true' : 'false';
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initDropdowns(): void {
  const triggers = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-menu-trigger]'));
  const panels = Array.from(document.querySelectorAll<HTMLElement>('[data-menu-panel]'));
  const chevrons = Array.from(document.querySelectorAll<HTMLElement>('[data-menu-chevron]'));
  if (triggers.length === 0 || panels.length === 0) return;

  let openVariant: string | null = null;
  let closeTimer: number | null = null;

  const setExpandedState = (variant: string | null): void => {
    triggers.forEach((t) => {
      const matches = t.dataset.menuTrigger === variant;
      t.setAttribute('aria-expanded', matches ? 'true' : 'false');
    });
    chevrons.forEach((c) => {
      c.dataset.open = c.dataset.menuChevron === variant ? 'true' : 'false';
    });
  };

  const open = (variant: string): void => {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    openVariant = variant;
    setExpandedState(variant);
    panels.forEach((p) => {
      if (p.dataset.menuPanel === variant) {
        p.hidden = false;
        requestAnimationFrame(() => {
          p.dataset.open = 'true';
        });
      } else {
        p.dataset.open = 'false';
        window.setTimeout(() => {
          if (p.dataset.open === 'false') p.hidden = true;
        }, ANIM_MS);
      }
    });
  };

  const closeAll = (immediate = false): void => {
    openVariant = null;
    setExpandedState(null);
    panels.forEach((p) => {
      p.dataset.open = 'false';
      if (immediate) {
        p.hidden = true;
      } else {
        window.setTimeout(() => {
          if (p.dataset.open === 'false') p.hidden = true;
        }, ANIM_MS);
      }
    });
  };

  const scheduleClose = (): void => {
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => closeAll(), HOVER_CLOSE_DELAY);
  };

  triggers.forEach((t) => {
    const variant = t.dataset.menuTrigger as string;
    t.addEventListener('mouseenter', () => open(variant));
    t.addEventListener('focus', () => open(variant));
    t.addEventListener('click', () => (openVariant === variant ? closeAll() : open(variant)));
    t.addEventListener('mouseleave', scheduleClose);
  });

  panels.forEach((p) => {
    p.addEventListener('mouseenter', () => {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
    });
    p.addEventListener('mouseleave', scheduleClose);
  });

  document.addEventListener('click', (e) => {
    if (!openVariant) return;
    const target = e.target as Node;
    const insideTrigger = triggers.some((t) => t.contains(target));
    const insidePanel = panels.some((p) => p.contains(target));
    if (!insideTrigger && !insidePanel) closeAll();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && openVariant) closeAll();
  });
}

function initDrawer(): void {
  const trigger = document.querySelector<HTMLButtonElement>('[data-drawer-trigger]');
  const drawer = document.querySelector<HTMLElement>('[data-drawer]');
  if (!trigger || !drawer) return;

  const backdrop = drawer.querySelector<HTMLElement>('[data-drawer-backdrop]');
  const panel = drawer.querySelector<HTMLElement>('[data-drawer-panel]');
  const closeBtn = drawer.querySelector<HTMLButtonElement>('[data-drawer-close]');
  if (!backdrop || !panel) return;

  const open = (): void => {
    drawer.hidden = false;
    requestAnimationFrame(() => {
      backdrop.dataset.open = 'true';
      panel.dataset.open = 'true';
    });
    trigger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    const firstFocusable = panel.querySelector<HTMLElement>('a, button');
    firstFocusable?.focus();
  };

  const close = (): void => {
    backdrop.dataset.open = 'false';
    panel.dataset.open = 'false';
    trigger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    window.setTimeout(() => {
      drawer.hidden = true;
      trigger.focus();
    }, ANIM_MS);
  };

  trigger.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !drawer.hidden) close();
  });
}

initStickyHeader();
initDropdowns();
initDrawer();

export {};
