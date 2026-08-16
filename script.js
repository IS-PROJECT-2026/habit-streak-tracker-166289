// ---------- State ----------
let habitsArray = [];
let currentCalendarDate = new Date();

const STORAGE_KEY = "habitData";
const HEATMAP_WEEKS = 10;

// ---------- DOM references ----------
const habitForm = document.getElementById("habitForm");
const habitNameInput = document.getElementById("habitNameInput");
const habitList = document.getElementById("habitList");
const emptyState = document.getElementById("emptyState");
const totalHabitsValue = document.getElementById("totalHabitsValue");
const bestStreakValue = document.getElementById("bestStreakValue");
const consistencyValue = document.getElementById("consistencyValue");
const heatmapContainer = document.getElementById("heatmapContainer");
const heatmapHabitSelect = document.getElementById("heatmapHabitSelect");
const calendarGrid = document.getElementById("calendarGrid");
const currentMonthYear = document.getElementById("currentMonthYear");
const prevMonthBtn = document.getElementById("prevMonthBtn");
const nextMonthBtn = document.getElementById("nextMonthBtn");

/* ==========================================================================
   Persistence — Issue #11
   ========================================================================== */

function saveToLocal() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habitsArray));
}

function loadFromLocal() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    habitsArray = JSON.parse(data);
  }
}

/* ==========================================================================
   Date utilities
   ========================================================================== */

function toDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
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

// Returns an ISO week identifier like "2026-W32" so weekly habits
// can be compared week-to-week regardless of which day they were logged.
function getISOWeekKey(date) {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

// Given a week key, returns the Date of that ISO week's Monday.
function getMondayFromWeekKey(weekKey) {
  const [yearStr, weekStr] = weekKey.split("-W");
  const year = Number(yearStr);
  const week = Number(weekStr);
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const jan4Day = jan4.getUTCDay() || 7;
  const mondayWeek1 = addDays(jan4, 1 - jan4Day);
  return addDays(mondayWeek1, (week - 1) * 7);
}

function generateId() {
  return (
    "h_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
  );
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// Refactor (#14): small named check so frequency branching reads
// clearly at each call site instead of repeating the raw comparison.
function isDaily(habit) {
  return habit.frequency === "daily";
}

/* ==========================================================================
   Habit CRUD — Issues #6, #7
   ========================================================================== */

function addHabit(name, frequency) {
  habitsArray.push({
    id: generateId(),
    name: name.trim(),
    frequency,
    completions: [],
  });
  saveToLocal();
  renderAll();
}

function deleteHabit(habitId) {
  habitsArray = habitsArray.filter((h) => h.id !== habitId);
  saveToLocal();
  renderAll();
}

/* ==========================================================================
   Completion marking — Issue #8
   ========================================================================== */

function toggleCompletion(habitId, dateStr) {
  const habit = habitsArray.find((h) => h.id === habitId);
  if (!habit) return;

  const index = habit.completions.indexOf(dateStr);
  if (index === -1) {
    habit.completions.push(dateStr);
  } else {
    habit.completions.splice(index, 1);
  }
  habit.completions.sort();

  saveToLocal();
  renderAll();
}

/* ==========================================================================
   Streak calculation — Issue #9
   ========================================================================== */

/**
 * Returns the number of consecutive completed periods (days or weeks)
 * counting backward from today, allowing today to still be incomplete
 * without breaking the streak.
 * @param {object} habit
 * @returns {number}
 */
function calculateCurrentStreak(habit) {
  if (habit.completions.length === 0) return 0;

  if (isDaily(habit)) {
    const completedSet = new Set(habit.completions);
    let streak = 0;
    let cursor = new Date();

    // If today isn't logged yet, the streak can still be counted
    // from yesterday backwards (today just hasn't broken it yet).
    if (!completedSet.has(toDateStr(cursor))) {
      cursor = addDays(cursor, -1);
    }

    while (completedSet.has(toDateStr(cursor))) {
      streak++;
      cursor = addDays(cursor, -1);
    }
    return streak;
  }

  // Weekly habits: count consecutive ISO weeks with at least one completion.
  const completedWeeks = new Set(
    habit.completions.map((d) => getISOWeekKey(new Date(d))),
  );
  let streak = 0;
  let cursor = new Date();

  if (!completedWeeks.has(getISOWeekKey(cursor))) {
    cursor = addDays(cursor, -7);
  }

  while (completedWeeks.has(getISOWeekKey(cursor))) {
    streak++;
    cursor = addDays(cursor, -7);
  }
  return streak;
}

/**
 * Returns the longest run of consecutive completed periods (days or
 * weeks) found anywhere in the habit's history, not just the current run.
 * @param {object} habit
 * @returns {number}
 */
function calculateLongestStreak(habit) {
  if (habit.completions.length === 0) return 0;

  if (isDaily(habit)) {
    const sortedDates = [...habit.completions].sort();
    let longest = 1;
    let current = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diffDays = Math.round((curr - prev) / 86400000);

      if (diffDays === 1) {
        current++;
      } else if (diffDays > 1) {
        current = 1;
      }
      longest = Math.max(longest, current);
    }
    return longest;
  }

  // Weekly habits: compare sorted unique week keys by week distance.
  const weekKeys = [
    ...new Set(habit.completions.map((d) => getISOWeekKey(new Date(d)))),
  ].sort();
  let longest = 1;
  let current = 1;

  for (let i = 1; i < weekKeys.length; i++) {
    const prevMonday = getMondayFromWeekKey(weekKeys[i - 1]);
    const currMonday = getMondayFromWeekKey(weekKeys[i]);
    const diffWeeks = Math.round((currMonday - prevMonday) / (7 * 86400000));

    if (diffWeeks === 1) {
      current++;
    } else if (diffWeeks > 1) {
      current = 1;
    }
    longest = Math.max(longest, current);
  }
  return longest;
}

/* ==========================================================================
   Consistency score — Issue #10
   ========================================================================== */

/**
 * Returns the percentage of expected periods (days or weeks) completed
 * within the trailing window, rounded to the nearest whole percent.
 * @param {object} habit
 * @param {number} [windowDays=30]
 * @returns {number}
 */
function calculateConsistency(habit, windowDays = 30) {
  if (habit.completions.length === 0) return 0;

  const today = new Date();
  const windowStart = addDays(today, -(windowDays - 1));

  if (isDaily(habit)) {
    let completedCount = 0;
    for (let i = 0; i < windowDays; i++) {
      const day = toDateStr(addDays(windowStart, i));
      if (habit.completions.includes(day)) completedCount++;
    }
    return Math.round((completedCount / windowDays) * 100);
  }

  // Weekly habits: compare completed weeks against expected weeks in window.
  const expectedWeeks = new Set();
  for (let i = 0; i < windowDays; i++) {
    expectedWeeks.add(getISOWeekKey(addDays(windowStart, i)));
  }
  const completedWeeksInWindow = new Set(
    habit.completions
      .filter((d) => new Date(d) >= windowStart)
      .map((d) => getISOWeekKey(new Date(d))),
  );
  return Math.round((completedWeeksInWindow.size / expectedWeeks.size) * 100);
}

/* ==========================================================================
   Rendering: habit list — Issue #7
   ========================================================================== */

function renderHabitList() {
  habitList.innerHTML = "";

  if (habitsArray.length === 0) {
    emptyState.style.display = "block";
    return;
  }
  emptyState.style.display = "none";

  const today = todayStr();

  habitsArray.forEach((habit) => {
    const isDoneToday = habit.completions.includes(today);
    const currentStreak = calculateCurrentStreak(habit);
    const frequencyLabel = isDaily(habit) ? "Daily" : "Weekly";

    const item = document.createElement("li");
    item.className = "habit-item";
    item.innerHTML = `
      <button
        class="check-stitch ${isDoneToday ? "is-checked" : ""}"
        data-habit-id="${habit.id}"
        aria-pressed="${isDoneToday}"
        aria-label="Mark ${escapeHtml(habit.name)} complete for today"
      ></button>
      <div class="habit-info">
        <p class="habit-name">${escapeHtml(habit.name)}</p>
        <p class="habit-meta">${frequencyLabel} &middot; ${currentStreak} streak</p>
      </div>
      <button class="habit-delete" data-delete-id="${habit.id}" aria-label="Delete ${escapeHtml(habit.name)}">&times;</button>
    `;
    habitList.appendChild(item);
  });
}

/* ==========================================================================
   Rendering: summary badges — Issues #9, #10
   ========================================================================== */

function renderSummary() {
  totalHabitsValue.textContent = habitsArray.length;

  const longest = habitsArray.reduce(
    (max, h) => Math.max(max, calculateLongestStreak(h)),
    0,
  );
  bestStreakValue.textContent = longest;

  if (habitsArray.length === 0) {
    consistencyValue.textContent = "0%";
    return;
  }
  const avgConsistency = Math.round(
    habitsArray.reduce((sum, h) => sum + calculateConsistency(h), 0) /
      habitsArray.length,
  );
  consistencyValue.textContent = `${avgConsistency}%`;
}

/* ==========================================================================
   Rendering: heatmap dashboard — Issue #12
   ========================================================================== */

function populateHeatmapSelect() {
  const currentValue = heatmapHabitSelect.value;
  heatmapHabitSelect.innerHTML = '<option value="all">All habits</option>';

  habitsArray.forEach((habit) => {
    const option = document.createElement("option");
    option.value = habit.id;
    option.textContent = habit.name;
    heatmapHabitSelect.appendChild(option);
  });

  const stillExists = [...heatmapHabitSelect.options].some(
    (o) => o.value === currentValue,
  );
  heatmapHabitSelect.value = stillExists ? currentValue : "all";
}

function getDailyCompletionCounts(selectedId) {
  const counts = {};
  const relevantHabits =
    selectedId === "all"
      ? habitsArray
      : habitsArray.filter((h) => h.id === selectedId);

  relevantHabits.forEach((habit) => {
    habit.completions.forEach((dateStr) => {
      // For weekly habits, expand the week key to cover all 7 days of that week
      if (!isDaily(habit)) {
        const weekKey = dateStr; // dateStr for weekly habits is in format "YYYY-WXX"
        const mondayOfWeek = getMondayFromWeekKey(weekKey);
        for (let i = 0; i < 7; i++) {
          const dayInWeek = toDateStr(addDays(mondayOfWeek, i));
          counts[dayInWeek] = (counts[dayInWeek] || 0) + 1;
        }
      } else {
        // For daily habits, use the date as-is
        counts[dateStr] = (counts[dateStr] || 0) + 1;
      }
    });
  });
  return counts;
}

function intensityLevel(count, maxCount) {
  if (count === 0) return 0;
  if (maxCount === 0) return 0;
  const ratio = count / maxCount;
  if (ratio < 0.25) return 1;
  if (ratio < 0.5) return 2;
  if (ratio < 0.75) return 3;
  return 4;
}

function renderHeatmap() {
  const selectedId = heatmapHabitSelect.value || "all";
  const counts = getDailyCompletionCounts(selectedId);
  const maxCount = Math.max(1, ...Object.values(counts));

  const today = new Date();
  const totalDays = HEATMAP_WEEKS * 7;

  // Calculate the Sunday that starts the heatmap period
  // If today is Sunday (getDay() === 0), start from today
  // Otherwise, go back to the most recent Sunday
  const dayOfWeek = today.getDay();
  const daysToSunday = dayOfWeek === 0 ? 0 : dayOfWeek;
  const mostRecentSunday = addDays(today, -daysToSunday);

  // Start 10 weeks ago from the most recent Sunday
  const start = addDays(mostRecentSunday, -(HEATMAP_WEEKS * 7));

  heatmapContainer.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "heatmap-grid";

  for (let week = 0; week <= HEATMAP_WEEKS; week++) {
    const column = document.createElement("div");
    column.className = "heatmap-column";

    for (let day = 0; day < 7; day++) {
      const cellDate = addDays(start, week * 7 + day);

      if (cellDate > today) {
        column.appendChild(document.createElement("div"));
        continue;
      }

      const dateStr = toDateStr(cellDate);
      const count = counts[dateStr] || 0;
      const level = intensityLevel(count, maxCount);

      const cell = document.createElement("div");
      cell.className = `heatmap-cell level-${level}`;
      cell.title = `${dateStr}: ${count} completion${count === 1 ? "" : "s"}`;
      column.appendChild(cell);
    }
    grid.appendChild(column);
  }
  heatmapContainer.appendChild(grid);
}

/* ==========================================================================
   Master render + events
   ========================================================================== */

function showDateHabitSelector(dateStr) {
  if (habitsArray.length === 0) {
    alert("No habits to log. Add a habit first.");
    return;
  }

  // Create a modal dialog
  const modal = document.createElement("div");
  modal.className = "habit-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");

  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";

  const content = document.createElement("div");
  content.className = "modal-content";

  const header = document.createElement("div");
  header.className = "modal-header";

  const title = document.createElement("h3");
  title.textContent = `Log habits for ${dateStr}`;
  header.appendChild(title);

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "modal-close";
  closeBtn.textContent = "×";
  closeBtn.setAttribute("aria-label", "Close");
  header.appendChild(closeBtn);

  content.appendChild(header);

  const habitsList = document.createElement("div");
  habitsList.className = "modal-habits-list";

  habitsArray.forEach((habit) => {
    const isLogged = habit.completions.includes(dateStr);

    const habitRow = document.createElement("label");
    habitRow.className = "modal-habit-row";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    // For weekly habits, check by ISO week key
    if (!isDaily(habit)) {
      const dateObj = new Date(dateStr);
      const weekKey = getISOWeekKey(dateObj);
      checkbox.checked = habit.completions.includes(weekKey);
    } else {
      checkbox.checked = isLogged;
    }

    checkbox.dataset.habitId = habit.id;

    const label = document.createElement("span");
    label.textContent = habit.name;

    habitRow.appendChild(checkbox);
    habitRow.appendChild(label);
    habitsList.appendChild(habitRow);
  });

  content.appendChild(habitsList);

  const footer = document.createElement("div");
  footer.className = "modal-footer";

  const saveBtn = document.createElement("button");
  saveBtn.type = "button";
  saveBtn.className = "btn-primary modal-save-btn";
  saveBtn.textContent = "Save changes";

  footer.appendChild(saveBtn);
  content.appendChild(footer);

  modal.appendChild(backdrop);
  modal.appendChild(content);
  document.body.appendChild(modal);

  // Event listeners
  closeBtn.addEventListener("click", () => {
    modal.remove();
  });

  backdrop.addEventListener("click", () => {
    modal.remove();
  });

  saveBtn.addEventListener("click", () => {
    // Update all habits based on checkbox state
    habitsArray.forEach((habit) => {
      const checkbox = modal.querySelector(
        `input[data-habit-id="${habit.id}"]`,
      );
      const isChecked = checkbox.checked;

      // For weekly habits, convert the date to ISO week key
      let storageKey = dateStr;
      if (!isDaily(habit)) {
        const dateObj = new Date(dateStr);
        storageKey = getISOWeekKey(dateObj);
      }

      const isAlreadyLogged = habit.completions.includes(storageKey);

      if (isChecked && !isAlreadyLogged) {
        // Add the completion
        habit.completions.push(storageKey);
      } else if (!isChecked && isAlreadyLogged) {
        // Remove the completion
        habit.completions = habit.completions.filter((d) => d !== storageKey);
      }
    });

    // Sort all completions for all habits
    habitsArray.forEach((habit) => {
      habit.completions.sort((a, b) => {
        // For daily habits, dates are YYYY-MM-DD format
        // For weekly habits, dates are YYYY-WXX format
        // Both sort correctly with string comparison
        return a.localeCompare(b);
      });
    });

    saveToLocal();
    renderAll();
    modal.remove();
  });

  // Focus the modal
  content.focus();
}

function renderCalendar() {
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();

  // Update header
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  currentMonthYear.textContent = `${monthNames[month]} ${year}`;

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const todayStr = toDateStr(today);

  calendarGrid.innerHTML = "";

  // Add empty cells for days before the month starts
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "calendar-day calendar-day-inactive";
    calendarGrid.appendChild(emptyCell);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(year, month, day);
    const cellDateStr = toDateStr(cellDate);

    // Check if any habit is completed on this day
    const isCompleted = habitsArray.some((h) =>
      h.completions.includes(cellDateStr),
    );
    const isToday = cellDateStr === todayStr;

    const dayCell = document.createElement("button");
    dayCell.type = "button";
    dayCell.className = "calendar-day";
    dayCell.textContent = day;
    dayCell.dataset.dateStr = cellDateStr;

    if (isCompleted) dayCell.classList.add("calendar-day-completed");
    if (isToday) dayCell.classList.add("calendar-day-today");

    // Show tooltip on hover
    let completionCount = 0;
    habitsArray.forEach((h) => {
      if (h.completions.includes(cellDateStr)) completionCount++;
    });
    dayCell.title = `${cellDateStr}: ${completionCount} completion${completionCount === 1 ? "" : "s"}\nClick to log all habits for this date`;

    // Add click handler to toggle all habits for this date
    dayCell.addEventListener("click", (e) => {
      e.preventDefault();
      showDateHabitSelector(cellDateStr);
    });

    calendarGrid.appendChild(dayCell);
  }
}

/* ==========================================================================
   Master render + events
   ========================================================================== */

function renderAll() {
  renderHabitList();
  renderSummary();
  renderCalendar();
  populateHeatmapSelect();
  renderHeatmap();
}

habitForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = habitNameInput.value.trim();

  if (!name) {
    habitNameInput.focus();
    return;
  }

  const frequency = habitForm.querySelector(
    'input[name="frequency"]:checked',
  ).value;
  addHabit(name, frequency);

  habitForm.reset();
  habitNameInput.focus();
});

habitList.addEventListener("click", (e) => {
  const checkBtn = e.target.closest(".check-stitch");
  if (checkBtn) {
    toggleCompletion(checkBtn.dataset.habitId, todayStr());
    return;
  }

  const deleteBtn = e.target.closest(".habit-delete");
  if (deleteBtn) {
    deleteHabit(deleteBtn.dataset.deleteId);
  }
});

heatmapHabitSelect.addEventListener("change", renderHeatmap);

/* ==========================================================================
   Calendar event listeners
   ========================================================================== */

prevMonthBtn.addEventListener("click", () => {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
  renderCalendar();
});

nextMonthBtn.addEventListener("click", () => {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
  renderCalendar();
});

/* ==========================================================================
   Init
   ========================================================================== */

loadFromLocal();
renderAll();
