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
  document.body.style.overflow = open ? 'hidden' : '';
});
drawer.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    drawer.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── SCROLL REVEAL ── */
const srObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('up'); });
}, { threshold: 0.1 });
document.querySelectorAll('.sr').forEach(el => srObs.observe(el));

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

/* ── STAT COUNTERS ── */
function counter(el, target, suffix, dur) {
  if (!el) return;
  let v = 0; const step = target / (dur / 16);
  const go = () => { v = Math.min(v + step, target); el.textContent = Math.round(v) + suffix; if (v < target) requestAnimationFrame(go); };
  go();
}
const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      counter(document.getElementById('s1'), 9, '', 800);
      counter(document.getElementById('s2'), 11, '', 900);
      counter(document.getElementById('s3'), 0, '%', 300);
      statsObs.disconnect();
    }
  });
}, { threshold: 0.5 });
const statsEl = document.querySelector('.stats-belt');
if (statsEl) statsObs.observe(statsEl);

/* ── EXPENSE LIST CYCLING ── */
const liveData = [
  { note:'Morning coffee', cat:'Food & Dining', color:'#ff6b6b', amt:'$5.50' },
  { note:'Adobe CC', cat:'Software & Tools', color:'#60a5fa', amt:'$54.99' },
  { note:'Gym membership', cat:'Health', color:'#fbbf24', amt:'$30.00' },
  { note:'Metro pass', cat:'Transport', color:'#00d4c8', amt:'$3.20' },
  { note:'Udemy course', cat:'Education', color:'#34d399', amt:'$14.99' },
  { note:'Amazon order', cat:'Shopping', color:'#f97316', amt:'$42.00' },
];
let liveIdx = 0;
setInterval(() => {
  const list = document.getElementById('exp-list');
  if (!list) return;
  const rows = list.querySelectorAll('.exp-row');
  const first = rows[0];
  if (!first || !first.classList.contains('in')) return;
  first.classList.remove('in');
  setTimeout(() => {
    const d = liveData[liveIdx % liveData.length];
    first.querySelector('.exp-dot').style.background = d.color;
    first.querySelector('.exp-note').textContent = d.note;
    first.querySelector('.exp-cat').textContent = d.cat;
    first.querySelector('.exp-amt').textContent = d.amt;
    list.appendChild(first);
    setTimeout(() => { const last = list.querySelectorAll('.exp-row'); last[last.length-1].classList.add('in'); }, 60);
    liveIdx++;
  }, 380);
}, 2800);

/* ── FAQ ACCORDION ── */
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});
