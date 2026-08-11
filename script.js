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
  renderHabitList(); // temporary minimal version — replaced in #7
}

// Temporary placeholder, expanded in Issue #7
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