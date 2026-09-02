// Add future exams here. Each object automatically receives its own navigation tab.
const exams = [
  {
    shortName: 'IBPS SO MAINS',
    title: 'IBPS SO IT Officer Mains',
    target: 'IBPS SO<br /><strong>IT Officer</strong>',
    date: '2026-11-01T09:00:00+05:30',
    startDate: '2026-01-01T00:00:00+05:30'
  },
  {
    shortName: 'RRB SO MAINS',
    title: 'RRB SO IT Officer Mains',
    target: 'RRB SO<br /><strong>IT Officer</strong>',
    date: '2026-12-27T09:00:00+05:30',
    startDate: '2026-01-01T00:00:00+05:30'
  },
  // Add future exams here:
  // { shortName: 'EXAM 3', title: 'Your third exam', target: 'Exam<br /><strong>Three</strong>', date: '2027-03-15T09:00:00+05:30', startDate: '2026-11-02T00:00:00+05:30' },
];

let activeExam = 0;
const units = { days: 86400000, hours: 3600000, minutes: 60000, seconds: 1000 };

function pad(value, length = 2) { return String(value).padStart(length, '0'); }

function updateCountdown() {
  const exam = exams[activeExam];
  const examDate = new Date(exam.date);
  const startDate = new Date(exam.startDate);
  const now = new Date();
  let remaining = Math.max(0, examDate - now);
  const total = examDate - startDate;
  const elapsed = Math.min(total, Math.max(0, now - startDate));

  Object.entries(units).forEach(([name, size]) => {
    const amount = Math.floor(remaining / size);
    remaining %= size;
    document.getElementById(name).textContent = pad(amount, 2);
  });

  document.getElementById('progress-bar').style.width = `${(elapsed / total) * 100}%`;
  document.getElementById('progress-label').textContent = `${Math.round((elapsed / total) * 100)}% OF THE RUNWAY`;
}

function renderTabs() {
  const tabs = document.getElementById('exam-tabs');
  tabs.innerHTML = exams.map((exam, index) => `<button class="exam-tab" role="tab" aria-selected="${index === activeExam}" aria-controls="countdown-title" data-index="${index}">${exam.shortName}</button>`).join('');
  tabs.querySelectorAll('.exam-tab').forEach(tab => tab.addEventListener('click', () => {
    activeExam = Number(tab.dataset.index);
    const exam = exams[activeExam];
    document.getElementById('countdown-title').textContent = `TIME UNTIL ${exam.shortName}`;
    document.getElementById('target-date').textContent = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' }).format(new Date(exam.date)).toUpperCase() + ' IST';
    document.getElementById('target-name').innerHTML = exam.target;
    renderTabs();
    updateCountdown();
  }));
}

document.getElementById('today').textContent = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date()).toUpperCase();
renderTabs();
updateCountdown();
setInterval(updateCountdown, 1000);
