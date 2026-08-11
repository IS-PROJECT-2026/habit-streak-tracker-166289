// ---------- State ----------
let habitsArray = [];

// ---------- DOM references ----------
const habitForm = document.getElementById('habitForm');
const habitNameInput = document.getElementById('habitNameInput');

// ---------- Utilities ----------
function generateId() {
  return 'h_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ---------- Habit creation ----------
function addHabit(name, frequency) {
  habitsArray.push({
    id: generateId(),
    name: name.trim(),
    frequency,
    completions: []
  });
  renderHabitList(); //
}


function renderHabitList() {
  const habitList = document.getElementById('habitList');
  habitList.innerHTML = habitsArray.map(h => `<li>${h.name} (${h.frequency})</li>`).join('');
}

// ---------- Event listeners ----------
habitForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = habitNameInput.value.trim();
  if (!name) return;
  const frequency = habitForm.querySelector('input[name="frequency"]:checked').value;
  addHabit(name, frequency);
  habitForm.reset();
  habitNameInput.focus();
});

//Issue 7

const habitList = document.getElementById('habitList');
const emptyState = document.getElementById('emptyState');
const totalHabitsValue = document.getElementById('totalHabitsValue');

function deleteHabit(habitId) {
  habitsArray = habitsArray.filter(h => h.id !== habitId);
  renderHabitList();
  renderSummary();
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderHabitList() {
  habitList.innerHTML = '';

  if (habitsArray.length === 0) {
    emptyState.style.display = 'block';
    return;
  }
  emptyState.style.display = 'none';

  habitsArray.forEach((habit) => {
    const item = document.createElement('li');
    item.className = 'habit-item';
    item.innerHTML = `
      <button class="check-stitch" data-habit-id="${habit.id}" aria-label="Mark ${escapeHtml(habit.name)} complete for today"></button>
      <div class="habit-info">
        <p class="habit-name">${escapeHtml(habit.name)}</p>
        <p class="habit-meta">${habit.frequency === 'daily' ? 'Daily' : 'Weekly'}</p>
      </div>
      <button class="habit-delete" data-delete-id="${habit.id}" aria-label="Delete ${escapeHtml(habit.name)}">&times;</button>
    `;
    habitList.appendChild(item);
  });
}

function renderSummary() {
  totalHabitsValue.textContent = habitsArray.length;
}

habitList.addEventListener('click', (e) => {
  const deleteBtn = e.target.closest('.habit-delete');
  if (deleteBtn) {
    deleteHabit(deleteBtn.dataset.deleteId);
  }
});

//Issue 8
function toDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function todayStr() {
  return toDateStr(new Date());
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function toggleCompletion(habitId, dateStr) {
  const habit = habitsArray.find(h => h.id === habitId);
  if (!habit) return;

  const index = habit.completions.indexOf(dateStr);
  if (index === -1) {
    habit.completions.push(dateStr);
  } else {
    habit.completions.splice(index, 1);
  }
  habit.completions.sort();
  renderHabitList();
}