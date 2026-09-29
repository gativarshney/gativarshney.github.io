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
  lenis = new Lenis({ autoRaf: false, lerp: 0.09, smoothWheel: true, anchors: true });
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

  await document.fonts.ready;

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

      const tl = gsap.timeline({ defaults: { ease: EASE } });

      if (eyebrow) { show(eyebrow); tl.from(eyebrow, { y: 14, autoAlpha: 0, duration: 0.9 }, 0.05); }
      if (title) {
        const chars = splitToChars(title);
        show(title);
        gsap.set(chars, { yPercent: 115, rotate: 6 });
        tl.to(chars, { yPercent: 0, rotate: 0, duration: 1.15, stagger: 0.016 }, 0.12);
      }
      if (lede) {
        const words = splitToWords(lede);
        show(lede);
        gsap.set(words, { yPercent: 60, autoAlpha: 0 });
        tl.to(words, { yPercent: 0, autoAlpha: 1, duration: 0.8, stagger: 0.011 }, 0.6);
      }
      if (ctas.length) { show(ctas); tl.from(ctas, { y: 18, autoAlpha: 0, duration: 0.9, stagger: 0.08 }, 0.95); }
      if (orb) { show(orb); tl.from(orb, { autoAlpha: 0, scale: 0.8, duration: 2.2, ease: 'power2.out' }, 0.2); }
      if (portrait) {
        show(portrait);
        tl.fromTo(portrait,
          { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 18px 18px)', scale: 1.12 },
          { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 18px 18px)', scale: 1, duration: 1.5, ease: 'expo.out' }, 0.35);
        gsap.to(portrait, {
          yPercent: 12, ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
        });
      }
      if (strip.length) { show(strip); tl.from(strip, { y: 16, autoAlpha: 0, duration: 0.9, stagger: 0.07 }, 1.1); }

      // subtle exit of headline as you scroll away
      if (title) {
        gsap.to(title, { yPercent: -10, autoAlpha: 0.15, ease: 'none',
          scrollTrigger: { trigger: hero, start: '40% top', end: 'bottom top', scrub: true } });
      }
    }

    /* section headings: words rise -------------------------------- */
    document.querySelectorAll<HTMLElement>('[data-split-words]').forEach((el) => {
      const words = splitToWords(el);
      show(el);
      gsap.set(words, { yPercent: 110, autoAlpha: 0 });
      gsap.to(words, {
        yPercent: 0, autoAlpha: 1, duration: 1.1, stagger: 0.045, ease: EASE,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });

    /* generic reveals -------------------------------------------- */
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      const delay = Number(el.dataset.reveal || 0);
      show(el);
      gsap.fromTo(el, { y: 40, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, duration: 1.1, delay, ease: EASE,
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      });
    });
    document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
      const items = Array.from(group.children) as HTMLElement[];
      show(group); show(items);
      gsap.fromTo(items, { y: 36, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, duration: 1, stagger: Number(group.dataset.revealGroup || 0.08), ease: EASE,
        scrollTrigger: { trigger: group, start: 'top 88%', once: true },
      });
    });

    /* hairline draw --------------------------------------------- */
    document.querySelectorAll<HTMLElement>('[data-line]').forEach((el) => {
      gsap.fromTo(el, { scaleX: 0, transformOrigin: 'left center' }, {
        scaleX: 1, duration: 1.4, ease: EASE,
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      });
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
      new ResizeObserver(place).observe(wrap);
      const fractions = () => {
        if (!rail) return nums.map(() => 0);
        const rr = rail.getBoundingClientRect();
        return nums.map((n) => Math.min(1, Math.max(0, (n.getBoundingClientRect().top + 19 - rr.top) / Math.max(1, rr.height))));
      };
      ScrollTrigger.create({
        trigger: rail ?? wrap, start: 'top 58%', end: 'bottom 58%', scrub: 0.5,
        onUpdate: (self) => {
          wrap.style.setProperty('--p', self.progress.toFixed(4));
          const fr = fractions();
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
  });

  // anything still hidden (no animation matched) becomes visible
  document.querySelectorAll<HTMLElement>('[data-anim]').forEach((el) => {
    if (getComputedStyle(el).visibility === 'hidden') el.style.visibility = 'visible';
  });

  ScrollTrigger.refresh();
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
  document.querySelectorAll<HTMLElement>('[data-scale-frame]').forEach((el) => {
    if (el.dataset.bound) return;
    el.dataset.bound = '1';
    const base = Number(el.dataset.scaleFrame || 1280);
    const set = () => el.style.setProperty('--s', String(el.clientWidth / base));
    set();
    new ResizeObserver(set).observe(el);
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
function boot() {
  initLenis();
  initCursor();
  initTheme();
  initCopy();
  initLightbox();
  initFrames();
  initPage();
}

document.addEventListener('astro:page-load', boot);
document.addEventListener('astro:before-swap', () => { ctx?.revert(); ScrollTrigger.getAll().forEach((t) => t.kill()); });
document.addEventListener('astro:after-swap', () => { lenis?.scrollTo(0, { immediate: true }); });
