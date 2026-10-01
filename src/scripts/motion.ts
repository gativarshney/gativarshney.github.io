import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const html = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;
const EASE = 'power4.out';

/* ------------------------------------------------------------------ */
/* Smooth scroll (one instance for the whole session)                  */
/* ------------------------------------------------------------------ */
let lenis: Lenis | null = null;

function initLenis() {
  if (reduced || lenis) return;
  lenis = new Lenis({ autoRaf: false, lerp: 0.12, smoothWheel: true, anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ------------------------------------------------------------------ */
/* Custom cursor (created once, persists across page swaps)            */
/* ------------------------------------------------------------------ */
let cursorReady = false;

function initCursor() {
  if (cursorReady || reduced || !finePointer) return;
  const root = document.querySelector<HTMLElement>('.cursor');
  const dot = document.querySelector<HTMLElement>('.cursor-dot');
  const ring = document.querySelector<HTMLElement>('.cursor-ring');
  const label = ring?.querySelector<HTMLElement>('span');
  if (!root || !dot || !ring || !label) return;
  cursorReady = true;
  html.classList.add('has-cursor');

  const dx = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' });
  const dy = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' });
  const rx = gsap.quickTo(ring, 'x', { duration: 0.38, ease: 'power3.out' });
  const ry = gsap.quickTo(ring, 'y', { duration: 0.38, ease: 'power3.out' });

  let shown = false;
  window.addEventListener('mousemove', (e) => {
    if (!shown) { shown = true; gsap.to(root, { opacity: 1, duration: 0.4 }); }
    dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    const t = e.target as HTMLElement | null;
    const labelTarget = t?.closest<HTMLElement>('[data-cursor]');
    const hoverTarget = t?.closest('a, button, summary, [data-magnetic]');
    if (labelTarget && labelTarget.dataset.cursor) {
      label.textContent = labelTarget.dataset.cursor;
      html.classList.add('cursor-label');
      html.classList.remove('cursor-hover');
    } else {
      html.classList.remove('cursor-label');
      html.classList.toggle('cursor-hover', !!hoverTarget);
    }
  }, { passive: true });
  window.addEventListener('mousedown', () => html.classList.add('cursor-down'));
  window.addEventListener('mouseup', () => html.classList.remove('cursor-down'));
  document.addEventListener('mouseleave', () => gsap.to(root, { opacity: 0, duration: 0.3 }));
  document.addEventListener('mouseenter', () => gsap.to(root, { opacity: 1, duration: 0.3 }));
}

/* ------------------------------------------------------------------ */
/* Text splitting                                                      */
/* ------------------------------------------------------------------ */
function splitToChars(el: HTMLElement): HTMLElement[] {
  if (el.dataset.split === 'done') return Array.from(el.querySelectorAll<HTMLElement>('.char'));
  el.setAttribute('aria-label', el.textContent?.replace(/\s+/g, ' ').trim() ?? '');
  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent ?? '';
        if (!text.trim()) return;
        const frag = document.createDocumentFragment();
        text.split(/(\s+)/).forEach((piece) => {
          if (!piece) return;
          if (/^\s+$/.test(piece)) { frag.appendChild(document.createTextNode(' ')); return; }
          const word = document.createElement('span');
          word.className = 'word';
          word.setAttribute('aria-hidden', 'true');
          Array.from(piece).forEach((ch) => {
            const c = document.createElement('span');
            c.className = 'char';
            c.textContent = ch;
            word.appendChild(c);
          });
          frag.appendChild(word);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === Node.ELEMENT_NODE && (child as HTMLElement).tagName !== 'BR') {
        walk(child);
      }
    });
  };
  walk(el);
  el.dataset.split = 'done';
  return Array.from(el.querySelectorAll<HTMLElement>('.char'));
}

function splitToWords(el: HTMLElement): HTMLElement[] {
  if (el.dataset.split === 'done') return Array.from(el.querySelectorAll<HTMLElement>('.w'));
  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent ?? '';
        if (!text.trim()) return;
        const frag = document.createDocumentFragment();
        text.split(/(\s+)/).forEach((piece) => {
          if (!piece) return;
          if (/^\s+$/.test(piece)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span');
          w.className = 'w';
          w.textContent = piece;
          frag.appendChild(w);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === Node.ELEMENT_NODE && (child as HTMLElement).tagName !== 'BR') {
        walk(child);
      }
    });
  };
  walk(el);
  el.dataset.split = 'done';
  return Array.from(el.querySelectorAll<HTMLElement>('.w'));
}

/* ------------------------------------------------------------------ */
/* Per-page animations                                                 */
/* ------------------------------------------------------------------ */
let ctx: gsap.Context | null = null;

function show(els: Element | Element[] | NodeListOf<Element>) {
  gsap.set(els, { visibility: 'visible' });
}

async function initPage() {
  ctx?.revert();
  ScrollTrigger.getAll().forEach((t) => t.kill());

  if (reduced) {
    document.querySelectorAll('[data-anim]').forEach((el) => (el as HTMLElement).style.visibility = 'visible');
    return;
  }

  ctx = gsap.context(() => {
    /* hero ------------------------------------------------------- */
    const hero = document.querySelector<HTMLElement>('[data-hero]');
    if (hero) {
      const title = hero.querySelector<HTMLElement>('[data-hero-title]');
      const lede = hero.querySelector<HTMLElement>('[data-hero-lede]');
      const eyebrow = hero.querySelector<HTMLElement>('[data-hero-eyebrow]');
      const ctas = hero.querySelectorAll<HTMLElement>('[data-hero-cta] > *');
      const portrait = hero.querySelector<HTMLElement>('[data-hero-portrait]');
      const orb = hero.querySelector<HTMLElement>('[data-hero-orb]');
      const strip = document.querySelectorAll<HTMLElement>('[data-hero-strip] > *');

      // If the script arrived late (slow network or device), skip the entrance: content first.
      const late = performance.now() > 1100;
      const tl = gsap.timeline({ defaults: { ease: EASE }, paused: late });
      if (late) tl.progress(1);

      if (eyebrow) { show(eyebrow); tl.from(eyebrow, { y: 12, autoAlpha: 0, duration: 0.6 }, 0); }
      if (title) {
        const chars = splitToChars(title);
        show(title);
        gsap.set(chars, { y: '1.1em', rotate: 5 });
        tl.to(chars, { y: 0, rotate: 0, duration: 0.85, stagger: 0.011 }, 0.04);
      }
      if (lede) {
        const words = splitToWords(lede);
        show(lede);
        gsap.set(words, { y: '0.5em', autoAlpha: 0 });
        tl.to(words, { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.007 }, 0.3);
      }
      if (ctas.length) { show(ctas); tl.from(ctas, { y: 14, autoAlpha: 0, duration: 0.6, stagger: 0.06 }, 0.55); }
      if (orb) { show(orb); tl.from(orb, { autoAlpha: 0, scale: 0.85, duration: 1.6, ease: 'power2.out' }, 0.1); }
      if (portrait) {
        show(portrait);
        tl.fromTo(portrait,
          { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 18px 18px)', scale: 1.12 },
          { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 18px 18px)', scale: 1, duration: 1.1, ease: 'expo.out' }, 0.2);
        gsap.to(portrait, {
          y: 60, ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
        });
      }
      if (strip.length) { show(strip); tl.from(strip, { y: 14, autoAlpha: 0, duration: 0.6, stagger: 0.06 }, 0.65); }

      if (late) { tl.progress(1).pause(); }

      // cursor parallax on the portrait stage
      const stage = hero.querySelector<HTMLElement>('[data-hero-stage]');
      if (stage && finePointer) {
        const layers = Array.from(stage.querySelectorAll<HTMLElement>('[data-depth]')).map((el) => ({
          el, d: Number(el.dataset.depth || 0),
          x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' }),
          y: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3.out' }),
        }));
        const rx = gsap.quickTo(stage, 'rotationX', { duration: 1.1, ease: 'power3.out' });
        const ry = gsap.quickTo(stage, 'rotationY', { duration: 1.1, ease: 'power3.out' });
        hero.addEventListener('mousemove', (e) => {
          const r = hero.getBoundingClientRect();
          const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
          const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
          layers.forEach((l) => { l.x(nx * l.d); l.y(ny * l.d); });
          ry(nx * 4); rx(-ny * 4);
        });
        hero.addEventListener('mouseleave', () => { layers.forEach((l) => { l.x(0); l.y(0); }); rx(0); ry(0); });
      }

      // subtle exit of headline as you scroll away
      if (title) {
        gsap.to(title, { y: '-0.4em', autoAlpha: 0.15, ease: 'none',
          scrollTrigger: { trigger: hero, start: '40% top', end: 'bottom top', scrub: true } });
      }
    }

    /* everything below the fold is wired up after the hero has painted */
    const later = () => ctx!.add(() => {
    /* reveals ------------------------------------------------------
       Subtle for readers, invisible to skimmers: every reveal starts
       before the element enters the viewport, runs short, and is
       skipped entirely when the page is being scrolled fast.        */
    const FAST = 1800; // px/s; above this a reveal completes instantly
    const reveal = (trigger: Element, tween: gsap.core.Tween, start = 'top 100%') => {
      ScrollTrigger.create({
        trigger, start, once: true,
        onEnter: (self) => { if (Math.abs(self.getVelocity()) > FAST) tween.progress(1); else tween.play(); },
      });
    };

    document.querySelectorAll<HTMLElement>('[data-split-words]').forEach((el) => {
      ScrollTrigger.create({
        trigger: el, start: 'top 110%', once: true,
        onEnter: (self) => {
          const words = splitToWords(el);
          show(el);
          if (Math.abs(self.getVelocity()) > FAST) return;
          gsap.set(words, { y: '0.9em', autoAlpha: 0 });
          gsap.to(words, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.028, ease: EASE });
        },
      });
    });

    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      const delay = Number(el.dataset.reveal || 0) * 0.6;
      show(el);
      reveal(el, gsap.fromTo(el, { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, delay, ease: EASE, paused: true }));
    });
    document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
      const items = Array.from(group.children) as HTMLElement[];
      show(group); show(items);
      reveal(group, gsap.fromTo(items, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: Math.min(0.06, Number(group.dataset.revealGroup || 0.06)), ease: EASE, paused: true }));
    });

    document.querySelectorAll<HTMLElement>('[data-line]').forEach((el) => {
      reveal(el, gsap.fromTo(el, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.9, ease: EASE, paused: true }), 'top 105%');
    });

    /* parallax --------------------------------------------------- */
    document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
      const amount = Number(el.dataset.parallax || 40);
      gsap.fromTo(el, { y: -amount }, {
        y: amount, ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });

    /* counters --------------------------------------------------- */
    document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
      const end = Number(el.dataset.count);
      const decimals = Number(el.dataset.decimals || 0);
      const suffix = el.dataset.suffix || '';
      const obj = { v: 0 };
      gsap.to(obj, {
        v: end, duration: 1.6, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: () => {
          el.textContent = obj.v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
        },
      });
    });

    /* magnetic ---------------------------------------------------- */
    if (finePointer) {
      document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
        const strength = Number(el.dataset.magnetic || 0.3);
        const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
        const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
        el.addEventListener('mousemove', (e) => {
          const r = el.getBoundingClientRect();
          x((e.clientX - (r.left + r.width / 2)) * strength);
          y((e.clientY - (r.top + r.height / 2)) * strength);
        });
        el.addEventListener('mouseleave', () => {
          gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' });
        });
      });

      /* tilt ------------------------------------------------------ */
      document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
        const max = Number(el.dataset.tilt || 5);
        const rx = gsap.quickTo(el, 'rotationX', { duration: 0.7, ease: 'power3.out' });
        const ry = gsap.quickTo(el, 'rotationY', { duration: 0.7, ease: 'power3.out' });
        el.addEventListener('mousemove', (e) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          ry(px * max * 2); rx(-py * max * 2);
        });
        el.addEventListener('mouseleave', () => { rx(0); ry(0); });
      });
    }

    /* timeline rail ----------------------------------------------- */
    document.querySelectorAll<HTMLElement>('[data-rail]').forEach((wrap) => {
      const nums = Array.from(wrap.querySelectorAll<HTMLElement>('[data-node]'));
      if (!nums.length) return;
      const rail = wrap.querySelector<HTMLElement>('.rail');
      const place = () => {
        const wr = wrap.getBoundingClientRect();
        const first = nums[0].getBoundingClientRect();
        const last = nums[nums.length - 1].getBoundingClientRect();
        wrap.style.setProperty('--rail-top', `${first.top - wr.top + 19}px`);
        wrap.style.setProperty('--rail-bottom', `${wr.bottom - (last.top + 19)}px`);
      };
      place();
      const fractions = () => {
        if (!rail) return nums.map(() => 0);
        const rr = rail.getBoundingClientRect();
        return nums.map((n) => Math.min(1, Math.max(0, (n.getBoundingClientRect().top + 19 - rr.top) / Math.max(1, rr.height))));
      };
      let fr = fractions();
      ScrollTrigger.create({
        trigger: rail ?? wrap, start: 'top 58%', end: 'bottom 58%', scrub: 0.5,
        onRefresh: () => { place(); fr = fractions(); },
        onUpdate: (self) => {
          wrap.style.setProperty('--p', self.progress.toFixed(4));
          nums.forEach((n, i) => n.classList.toggle('is-on', self.progress >= fr[i] - 0.001));
        },
      });
    });

    /* header show/hide ------------------------------------------- */
    const header = document.querySelector<HTMLElement>('[data-header]');
    if (header) {
      ScrollTrigger.create({
        start: 'top -60',
        onUpdate: (self) => {
          header.classList.toggle('is-scrolled', self.scroll() > 60);
          header.classList.toggle('is-hidden', self.direction === 1 && self.scroll() > 400);
        },
      });
    }

    /* section progress in header --------------------------------- */
    const progress = document.querySelector<HTMLElement>('[data-progress]');
    if (progress) {
      gsap.to(progress, { scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 } });
    }
      document.querySelectorAll<HTMLElement>('[data-anim]').forEach((el) => {
        if (getComputedStyle(el).visibility === 'hidden') el.style.visibility = 'visible';
      });
      ScrollTrigger.refresh();
      if (location.hash) setTimeout(() => scrollToHash(location.hash), 150);
    });
    if ('requestIdleCallback' in window) (window as any).requestIdleCallback(later, { timeout: 700 });
    else setTimeout(later, 120);
  });

}

/* ------------------------------------------------------------------ */
/* Theme toggle with circular wipe                                     */
/* ------------------------------------------------------------------ */
function initTheme() {
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', (e) => {
      const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
      const apply = () => {
        html.dataset.theme = next;
        try { localStorage.setItem('theme', next); } catch {}
        document.querySelectorAll('[data-theme-toggle]').forEach((b) => b.setAttribute('aria-pressed', String(next === 'dark')));
      };
      const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> } };
      if (!doc.startViewTransition || reduced) { apply(); return; }
      const x = e.clientX, y = e.clientY;
      const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      html.dataset.vt = 'theme';
      const vt = doc.startViewTransition(apply);
      vt.ready.then(() => {
        html.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
          { duration: 700, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' },
        );
      });
      vt.finished.finally(() => { delete html.dataset.vt; });
    });
  });
}

/* ------------------------------------------------------------------ */
/* Copy-to-clipboard for the email link                                */
/* ------------------------------------------------------------------ */
function initCopy() {
  document.querySelectorAll<HTMLElement>('[data-copy]').forEach((el) => {
    if (el.dataset.bound) return;
    el.dataset.bound = '1';
    el.addEventListener('click', async (e) => {
      if (!navigator.clipboard) return;
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(el.dataset.copy!);
        const prev = el.dataset.cursor;
        el.dataset.cursor = 'Copied';
        const note = el.querySelector<HTMLElement>('[data-copy-note]');
        if (note) { note.textContent = 'copied to clipboard'; note.classList.add('is-on'); }
        setTimeout(() => { if (prev) el.dataset.cursor = prev; note?.classList.remove('is-on'); }, 1600);
      } catch { location.href = el.getAttribute('href') || '#'; }
    });
  });
}

/* ------------------------------------------------------------------ */
/* Lightbox for certificates and images                                */
/* ------------------------------------------------------------------ */
function initLightbox() {
  const dlg = document.querySelector<HTMLDialogElement>('[data-lightbox-dialog]');
  if (!dlg || dlg.dataset.bound) return;
  dlg.dataset.bound = '1';
  const img = dlg.querySelector('img')!;
  const cap = dlg.querySelector('figcaption')!;
  document.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-lightbox]');
    if (!t) return;
    e.preventDefault();
    img.src = t.dataset.lightbox!;
    img.alt = t.dataset.lightboxAlt || '';
    cap.textContent = t.dataset.lightboxCaption || '';
    dlg.showModal();
    html.classList.add('lb-open');
    lenis?.stop();
  });
  dlg.addEventListener('click', (e) => {
    const el = e.target as HTMLElement;
    if (el.closest('[data-lightbox-close]') || el === dlg || el.tagName === 'FIGURE') dlg.close();
  });
  dlg.addEventListener('close', () => {
    html.classList.remove('lb-open');
    lenis?.start();
    img.removeAttribute('src');
  });
}

/* ------------------------------------------------------------------ */
/* Scaled live-page frames and cursor handling over iframes            */
/* ------------------------------------------------------------------ */
function initFrames() {
  const coarse = matchMedia('(pointer: coarse), (max-width: 860px)').matches;
  const lazy = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries, obs) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const f = en.target.querySelector<HTMLIFrameElement>('iframe[data-src]');
          const hasStatic = !!en.target.querySelector('.static-only');
          if (f && !(coarse && hasStatic)) { f.src = f.dataset.src!; f.removeAttribute('data-src'); }
          obs.unobserve(en.target);
        });
      }, { rootMargin: '400px 0px' })
    : null;
  document.querySelectorAll<HTMLElement>('[data-scale-frame]').forEach((el) => {
    if (el.dataset.bound) return;
    el.dataset.bound = '1';
    const base = Number(el.dataset.scaleFrame || 1280);
    const set = () => el.style.setProperty('--s', String(el.clientWidth / base));
    set();
    new ResizeObserver(set).observe(el);
    if (lazy) lazy.observe(el);
    else { const f = el.querySelector<HTMLIFrameElement>('iframe[data-src]'); if (f) f.src = f.dataset.src!; }
  });
  const root = document.querySelector<HTMLElement>('.cursor');
  if (!root) return;
  document.querySelectorAll<HTMLElement>('[data-cursor-hide]').forEach((el) => {
    if (el.dataset.boundCursor) return;
    el.dataset.boundCursor = '1';
    el.addEventListener('mouseenter', () => gsap.to(root, { opacity: 0, duration: 0.25 }));
    el.addEventListener('mouseleave', () => gsap.to(root, { opacity: 1, duration: 0.25 }));
  });
}

/* ------------------------------------------------------------------ */
/* Boot                                                                */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* Same-page anchors: route through Lenis so hash links always scroll  */
/* ------------------------------------------------------------------ */
function scrollToHash(hash: string, immediate = false) {
  const id = decodeURIComponent(hash.replace(/^#/, ''));
  if (!id) return false;
  const el = document.getElementById(id);
  if (!el) return false;
  const offset = -72;
  if (lenis && !reduced) lenis.scrollTo(el, { offset, immediate, duration: 1.2 });
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: reduced ? 'auto' : 'smooth' });
  return true;
}
let anchorsBound = false;
function initAnchors() {
  if (anchorsBound) return;
  anchorsBound = true;
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]');
    if (!a || a.target === '_blank' || e.defaultPrevented) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    if (scrollToHash(url.hash)) { e.preventDefault(); history.pushState(null, '', url.hash); }
  }, true);
}

function initMenu() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const btn = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const panel = document.querySelector<HTMLElement>('[data-mobile-menu]');
  if (!header || !btn || !panel || btn.dataset.bound) return;
  btn.dataset.bound = '1';
  const set = (open: boolean) => {
    header.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    html.classList.toggle('menu-open', open);
    if (open) lenis?.stop(); else lenis?.start();
  };
  btn.addEventListener('click', () => set(!header.classList.contains('menu-open')));
  panel.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) set(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
  document.addEventListener('astro:before-swap', () => set(false));
  matchMedia('(min-width: 861px)').addEventListener('change', (e) => { if (e.matches) set(false); });
}

/* ------------------------------------------------------------------ */
/* Cursor-trailing page preview over list rows (Explore index)         */
/* ------------------------------------------------------------------ */
function initHoverPreview() {
  const hp = document.querySelector<HTMLElement>('[data-hover-preview]');
  if (!hp || hp.dataset.bound || !finePointer || reduced) return;
  hp.dataset.bound = '1';
  const x = gsap.quickTo(hp, 'x', { duration: 0.55, ease: 'power3.out' });
  const y = gsap.quickTo(hp, 'y', { duration: 0.55, ease: 'power3.out' });
  const rot = gsap.quickTo(hp, 'rotation', { duration: 0.6, ease: 'power3.out' });
  let lastX = 0;
  const rows = Array.from(document.querySelectorAll<HTMLElement>('[data-preview]'));
  rows.forEach((row) => {
    row.addEventListener('mouseenter', (e) => {
      const key = row.dataset.preview!;
      hp.querySelectorAll<HTMLElement>('[data-preview-img]').forEach((im) => im.classList.toggle('is-on', im.dataset.previewImg === key));
      x((e as MouseEvent).clientX); y((e as MouseEvent).clientY); lastX = (e as MouseEvent).clientX;
      gsap.to(hp, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
    });
    row.addEventListener('mousemove', (e) => {
      x(e.clientX); y(e.clientY);
      rot(Math.max(-6, Math.min(6, (e.clientX - lastX) * 0.35)));
      lastX = e.clientX;
    });
    row.addEventListener('mouseleave', () => {
      gsap.to(hp, { autoAlpha: 0, scale: 0.9, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
      rot(0);
    });
  });
}

/* ------------------------------------------------------------------ */
/* Command palette (Ctrl/Cmd + K)                                      */
/* ------------------------------------------------------------------ */
let paletteBound = false;
function initPalette() {
  const mac = /Mac|iPhone|iPad/.test(navigator.platform);
  if (mac) document.querySelectorAll<HTMLElement>('[data-cmdk-hint]').forEach((el) => (el.textContent = '⌘K'));
  if (paletteBound) return;
  paletteBound = true;

  const dialog = () => document.querySelector<HTMLDialogElement>('[data-cmdk]');
  const shown = (dlg: HTMLElement) => Array.from(dlg.querySelectorAll<HTMLElement>('[data-cmdk-item]:not([hidden])'));
  const select = (dlg: HTMLElement, el: HTMLElement | undefined, scroll = true) => {
    dlg.querySelectorAll('[data-cmdk-item][aria-selected="true"]').forEach((i) => i.setAttribute('aria-selected', 'false'));
    if (!el) return;
    el.setAttribute('aria-selected', 'true');
    if (scroll) el.scrollIntoView({ block: 'nearest' });
  };
  const filter = (dlg: HTMLElement, q: string) => {
    const fold = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const tokens = fold(q).split(/\s+/).filter(Boolean);
    dlg.querySelectorAll<HTMLElement>('[data-cmdk-item]').forEach((it) => {
      const hay = fold(it.dataset.keys || '');
      it.hidden = !tokens.every((t) => hay.includes(t));
    });
    dlg.querySelectorAll<HTMLElement>('[data-cmdk-group]').forEach((g) => { g.hidden = !g.querySelector('[data-cmdk-item]:not([hidden])'); });
    const list = shown(dlg);
    const empty = dlg.querySelector<HTMLElement>('[data-cmdk-empty]');
    if (empty) empty.hidden = list.length > 0;
    select(dlg, list[0]);
    dlg.querySelector('.list')?.scrollTo({ top: 0 });
  };
  const cleanup = () => { html.classList.remove('cmdk-open'); lenis?.start(); };
  const shut = () => { cleanup(); const dlg = dialog(); if (dlg?.open) dlg.close(); };
  const open = () => {
    const dlg = dialog();
    if (!dlg || dlg.open) return;
    const input = dlg.querySelector<HTMLInputElement>('[data-cmdk-input]')!;
    input.value = '';
    filter(dlg, '');
    dlg.showModal();
    html.classList.add('cmdk-open');
    lenis?.stop();
    input.focus();
  };
  const run = (item: HTMLElement) => {
    const action = item.dataset.cmdkAction;
    if (action === 'theme') {
      shut();
      document.querySelector('[data-theme-toggle]')?.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: innerWidth / 2, clientY: innerHeight / 2 }));
    } else if (action === 'copy-email') {
      const hint = item.querySelector<HTMLElement>('.h');
      const done = () => { if (hint) hint.textContent = 'Copied'; setTimeout(() => { shut(); if (hint) hint.textContent = 'Action'; }, 700); };
      if (navigator.clipboard) navigator.clipboard.writeText(item.dataset.email!).then(done, shut); else location.href = `mailto:${item.dataset.email}`;
    }
  };

  document.addEventListener('keydown', (e) => {
    const dlg = dialog();
    if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (dlg?.open) shut(); else open();
      return;
    }
    if (!dlg?.open) return;
    const list = shown(dlg);
    const at = list.findIndex((i) => i.getAttribute('aria-selected') === 'true');
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!list.length) return;
      const next = e.key === 'ArrowDown' ? (at + 1) % list.length : (at - 1 + list.length) % list.length;
      select(dlg, list[next]);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      list[Math.max(0, at)]?.click();
    }
  });
  document.addEventListener('input', (e) => {
    const input = (e.target as HTMLElement).closest<HTMLInputElement>('[data-cmdk-input]');
    const dlg = dialog();
    if (input && dlg) filter(dlg, input.value);
  });
  document.addEventListener('mousemove', (e) => {
    const item = (e.target as HTMLElement).closest?.<HTMLElement>('[data-cmdk-item]');
    const dlg = dialog();
    if (item && dlg && item.getAttribute('aria-selected') !== 'true') select(dlg, item, false);
  }, { passive: true });
  // capture phase, and bound before the anchor handler: the palette must release Lenis before a hash link scrolls
  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (t.closest('[data-cmdk-open]')) { open(); return; }
    const dlg = dialog();
    if (!dlg?.open) return;
    if (t === dlg || t.closest('[data-cmdk-close]')) { shut(); return; }
    const item = t.closest<HTMLElement>('[data-cmdk-item]');
    if (!item) return;
    if (item.dataset.cmdkAction) run(item); else shut();
  }, true);
  document.addEventListener('close', (e) => { if ((e.target as HTMLElement).matches?.('[data-cmdk]')) cleanup(); }, true);
  document.addEventListener('astro:before-swap', shut);
}

function boot() {
  initPalette();
  initAnchors();
  initHoverPreview();
  initMenu();
  initLenis();
  initCursor();
  initTheme();
  initCopy();
  initLightbox();
  initFrames();
  initPage();
}

let bootedFor = '';
function bootOnce() {
  const key = location.pathname;
  if (bootedFor === key) return;
  bootedFor = key;
  boot();
}
// First paint: start as soon as the document is parsed, not on window.load
// (which waits for every font and image). Later navigations: astro:page-load.
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootOnce, { once: true });
else bootOnce();
document.addEventListener('astro:page-load', bootOnce);
document.addEventListener('astro:before-swap', () => { bootedFor = ''; });
document.addEventListener('astro:before-swap', () => { ctx?.revert(); ScrollTrigger.getAll().forEach((t) => t.kill()); });
document.addEventListener('astro:after-swap', () => { if (!scrollToHash(location.hash, true)) lenis?.scrollTo(0, { immediate: true }); });
