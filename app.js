// Add future exams here. Each object automatically receives its own navigation tab.
const exams = [
  {
    shortName: 'IBPS SO MAINS',
    title: 'IBPS SO IT Officer Mains',
    target: 'IBPS SO<br /><strong>IT Officer</strong>',
    date: '2026-11-01T09:00:00+05:30',
    startDate: '2026-08-29T00:00:00+05:30'
  },
  {
    shortName: 'RRB SO MAINS',
    title: 'RRB SO IT Officer Mains',
    target: 'RRB SO<br /><strong>IT Officer</strong>',
    date: '2026-12-27T09:00:00+05:30',
    startDate: '2026-09-01T00:00:00+05:30'
  },
  // Add future exams here as objects
];

let activeExam = 0;
const units = { days: 86400000, hours: 3600000, minutes: 60000, seconds: 1000 };

function pad(value, length = 2) {
  return String(value).padStart(length, '0');
}

function safeGet(id) {
  return document.getElementById(id) || null;
}

function updateCountdown() {
  if (!exams || exams.length === 0) return;

  const exam = exams[activeExam];
  if (!exam || !exam.date || !exam.startDate) return;

  const examDate = new Date(exam.date);
  const startDate = new Date(exam.startDate);
  const now = new Date();

  // total runway and elapsed (clamp to [0, total])
  const total = Math.max(0, examDate - startDate);
  const elapsed = Math.max(0, Math.min(total, now - startDate));

  // remaining time until exam
  let remaining = Math.max(0, examDate - now);

  // Update day/hour/minute/second elements safely
  Object.entries(units).forEach(([name, size]) => {
    const amount = Math.floor(remaining / size);
    remaining %= size;
    const el = safeGet(name);
    if (!el) return;
    // days shown as 3 digits in markup, others 2
    el.textContent = pad(amount, name === 'days' ? 3 : 2);
  });

  // Update progress bar and label safely
  const progressBar = safeGet('progress-bar');
  const progressLabel = safeGet('progress-label');
  let pct = 0;
  if (total > 0) {
    pct = Math.round((elapsed / total) * 100);
    pct = Math.max(0, Math.min(100, pct));
  } else {
    pct = 100;
  }
  if (progressBar) progressBar.style.width = `${pct}%`;
  if (progressLabel) progressLabel.textContent = `${pct}% OF THE RUNWAY`;
}

function createTabs() {
  const tabs = safeGet('exam-tabs');
  if (!tabs) return;

  tabs.innerHTML = exams.map((exam, index) => {
    const aria = index === activeExam ? 'true' : 'false';
    return `<button class="exam-tab" role="tab" aria-selected="${aria}" aria-controls="countdown" data-index="${index}">${exam.shortName}</button>`;
  }).join('');

  // attach click handlers
  tabs.querySelectorAll('.exam-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const idx = Number(tab.dataset.index);
      setActiveExam(Number.isFinite(idx) ? idx : 0);
    });
  });

  // set aria-selected state on render
  tabs.querySelectorAll('.exam-tab').forEach((tab, i) => {
    tab.setAttribute('aria-selected', i === activeExam ? 'true' : 'false');
  });
}

function setActiveExam(index) {
  if (index < 0 || index >= exams.length) index = 0;
  activeExam = index;
  const exam = exams[activeExam];
  if (!exam) return;

  const titleEl = safeGet('countdown-title');
  const targetDateEl = safeGet('target-date');
  const targetNameEl = safeGet('target-name');

  if (titleEl) titleEl.textContent = `TIME UNTIL ${exam.shortName}`;

  if (targetDateEl) {
    try {
      targetDateEl.textContent = new Intl.DateTimeFormat('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata'
      }).format(new Date(exam.date));
    } catch (e) {
      targetDateEl.textContent = '';
      // silently fallback if Intl fails
    }
  }

  if (targetNameEl) targetNameEl.innerHTML = exam.target || '';

  // update aria-selected on tabs without a full re-render
  const tabs = safeGet('exam-tabs');
  if (tabs) {
    tabs.querySelectorAll('.exam-tab').forEach((tab, i) => {
      tab.setAttribute('aria-selected', i === activeExam ? 'true' : 'false');
    });
  }

  // update countdown values immediately
  updateCountdown();
}

function initToday() {
  const todayEl = safeGet('today');
  if (!todayEl) return;
  try {
    todayEl.textContent = new Intl.DateTimeFormat('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    }).format(new Date()).toUpperCase();
  } catch (e) {
    todayEl.textContent = '';
  }
}

(function init() {
  // defensive checks
  if (!Array.isArray(exams) || exams.length === 0) return;

  createTabs();
  initToday();
  setActiveExam(activeExam);
  updateCountdown();
  setInterval(updateCountdown, 1000);
})();
