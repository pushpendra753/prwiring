// Toggle mobile nav
function toggleNav() {
  document.getElementById('navLinks').classList.toggle('open');
}
// Close nav on link click
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'));
});

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.1 });
reveals.forEach(r => obs.observe(r));

// Nav scroll glow
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  if (nav) nav.style.borderBottomColor = window.scrollY > 40 ? 'rgba(245,197,24,0.3)' : 'rgba(245,197,24,0.15)';
});

// ─── FORMSPREE UNIVERSAL HANDLER ───
// Usage: <form onsubmit="handleFormspree(event,'formId','successDivId')">
async function handleFormspree(e, formId, successId) {
  e.preventDefault();
  const form = document.getElementById(formId);
  const btn  = form.querySelector('[type="submit"]');
  const successEl = document.getElementById(successId);
  if (!form || !btn) return;

  btn.textContent = 'Sending...';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  try {
    const res = await fetch('https://formspree.io/f/xpqbqoyo', {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      form.reset();
      btn.style.display = 'none';
      if (successEl) successEl.style.display = 'block';
    } else {
      btn.textContent = '❌ Error – Please try again';
      btn.disabled = false;
      btn.style.opacity = '1';
    }
  } catch (err) {
    btn.textContent = '❌ Network error – Try again';
    btn.disabled = false;
    btn.style.opacity = '1';
  }
}

// Legacy handler — kept for backward compat (non-Formspree demo)
function handleSubmit(btn, label) {
  const card = btn.closest('form, .form-card');
  const inputs = card ? card.querySelectorAll('input, select, textarea') : [];
  let ok = true;
  inputs.forEach(i => {
    if (!i.value.trim()) { i.style.borderColor = '#E63946'; ok = false; }
    else i.style.borderColor = 'rgba(245,197,24,0.12)';
  });
  if (!ok) return;
  const orig = btn.textContent;
  btn.textContent = '✅ ' + label + ' Sent!';
  btn.style.background = '#4CAF50';
  btn.disabled = true;
  inputs.forEach(i => i.value = '');
  setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.disabled = false; }, 3500);
}

// Tab switcher
function showTab(id, btn) {
  document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.style.display = 'block';
  if (btn) btn.classList.add('active');
}

// Counter animation
function animateCounters() {
  document.querySelectorAll('.count-up').forEach(el => {
    const target = parseInt(el.dataset.target);
    let current = 0; const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current + (el.dataset.suffix || '');
      if (current >= target) clearInterval(timer);
    }, 25);
  });
}
const statsEl = document.querySelector('.stats-bar');
if (statsEl) {
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounters(); counterObs.disconnect(); } });
  }, { threshold: 0.3 });
  counterObs.observe(statsEl);
}
