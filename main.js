/* ── NAV SCROLL ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, {passive:true});

/* ── MOBILE HAMBURGER ── */
const hamburger = document.getElementById('hamburger');
const drawer = document.getElementById('drawer');
hamburger.addEventListener('click', () => {
  const open = drawer.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.style.overflow = open ? 'hidden' : '';
});
drawer.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    drawer.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  });
});

/* ── APP PREVIEW BARS ── */
const appObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.app-cat-bar').forEach(b => {
        setTimeout(() => { b.style.width = b.dataset.w + '%'; }, 300);
      });
      appObs.disconnect();
    }
  });
}, { threshold: 0.3 });
const appFrame = document.querySelector('.app-frame');
if (appFrame) appObs.observe(appFrame);

/* ── EXPENSE LIST ANIMATE ── */
const expObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.exp-row').forEach((row, i) => {
        setTimeout(() => row.classList.add('in'), 100 + i * 120);
      });
      expObs.disconnect();
    }
  });
}, { threshold: 0.3 });
const expList = document.getElementById('exp-list');
if (expList) expObs.observe(expList);

/* ── BUDGET BARS ── */
const bObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.bcat-fill').forEach((b, i) => {
        setTimeout(() => { b.style.width = b.dataset.w + '%'; }, 200 + i * 100);
      });
      bObs.disconnect();
    }
  });
}, { threshold: 0.3 });
const bcats = document.getElementById('bcats');
if (bcats) bObs.observe(bcats);

/* ── HEALTH RING ── */
const ringObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const arc = document.getElementById('ring-arc');
      const num = document.getElementById('ring-num');
      const score = 74;
      const offset = 276.5 - (score / 100) * 276.5;
      let n = 0; const step = score / 60;
      const tick = () => { n = Math.min(n + step, score); num.textContent = Math.round(n); if (n < score) requestAnimationFrame(tick); };
      setTimeout(() => { arc.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1)'; arc.style.strokeDashoffset = offset; tick(); }, 300);
      ringObs.disconnect();
    }
  });
}, { threshold: 0.4 });
const ringArc = document.getElementById('ring-arc');
if (ringArc) ringObs.observe(ringArc.closest('.fc'));

/* ── GOALS BARS ── */
const gObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.goal-fill').forEach((b, i) => {
        setTimeout(() => { b.style.width = b.dataset.w + '%'; }, 300 + i * 150);
      });
      gObs.disconnect();
    }
  });
}, { threshold: 0.3 });
const goalsList = document.getElementById('goals-list');
if (goalsList) gObs.observe(goalsList);

/* ── FAQ ACCORDION ── */
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      q.setAttribute('aria-expanded', 'true');
    }
  });
});

// ─── WAITLIST MODAL ───
let waitlistOpener;

function openWaitlist() {
  const overlay = document.getElementById('waitlist-overlay');
  waitlistOpener = document.activeElement;
  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    const input = document.getElementById('wl-email');
    if (input) input.focus();
  }, 250);
}

function closeWaitlist() {
  const overlay = document.getElementById('waitlist-overlay');
  if (waitlistOpener && typeof waitlistOpener.focus === 'function') {
    waitlistOpener.focus();
  }
  overlay.classList.remove('active');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

const waitlistForm = document.getElementById('wl-form');
const waitlistStatus = document.getElementById('wl-status');

waitlistForm.addEventListener('submit', async event => {
  event.preventDefault();
  const submitButton = waitlistForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  waitlistStatus.textContent = 'Sending...';
  waitlistStatus.className = 'wl-status';

  try {
    const response = await fetch(waitlistForm.action, {
      method: 'POST',
      body: new FormData(waitlistForm)
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'We could not send your request. Please try again.');
    }

    waitlistForm.reset();
    waitlistStatus.textContent = 'Thanks! We’ll be in touch soon.';
    waitlistStatus.classList.add('success');
    window.location.assign('https://cashero-ai.vercel.app/');
  } catch (error) {
    waitlistStatus.textContent = error.message || 'Something went wrong. Please try again.';
    waitlistStatus.classList.add('error');
  } finally {
    submitButton.disabled = false;
  }
});

// Close on overlay click (outside modal)
document.addEventListener('DOMContentLoaded', function () {
  const overlay = document.getElementById('waitlist-overlay');
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeWaitlist();
    });
  }
  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeWaitlist();
  });
});
