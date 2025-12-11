// ui.js
import { loadDailyQuote } from "./motivation.js";
import { addHabit, getAllHabits, deleteHabit, editHabit } from "./habitManager.js";
import { checkInHabit } from "./progressTracker.js";
import { sendBrowserNotification } from "./notifications.js";
import { renderChartsForHabit } from "./charts.js";

const habitList = document.getElementById("habit-list");
const addHabitBtn = document.getElementById("add-habit-btn");
const addModal = document.getElementById("add-habit-modal");
const editModal = document.getElementById("edit-habit-modal");
const overlay = document.getElementById("modal-overlay");
let habitBeingEdited = null;

// -----------------------------------------
// LOAD DAILY QUOTE
// -----------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const quote = await loadDailyQuote();
    document.getElementById("daily-quote").textContent = quote;
  } catch (err) {
    console.warn("Não foi possível carregar a frase diária.");
  }

  renderHabits();
});

// -----------------------------------------
// RENDER HABITS
// -----------------------------------------
export function renderHabits() {
  const habits = getAllHabits();
  habitList.innerHTML = "";

  habits.forEach(habit => {
    const li = document.createElement("li");
    li.classList.add("habit-item");
    li.dataset.id = habit.id;

    li.innerHTML = `
      <div class="habit-info">
        <strong>${habit.name}</strong>
        <span>${habit.category}</span>
        <small>${habit.schedule}</small>
      </div>
      <div class="habit-actions">
        <button class="checkin-btn" type="button" data-id="${habit.id}">✔</button>
        <button class="edit-btn" type="button" data-id="${habit.id}">✏️</button>
        <button class="delete-btn" type="button" data-id="${habit.id}">🗑️</button>
      </div>
      <div class="habit-streak">🔥 Streak: <strong>${habit.streak || 0}</strong> days</div>
      <canvas id="habitChart-${habit.id}" class="habit-chart"></canvas>
    `;

    habitList.appendChild(li);

    // Render charts for each habit
    renderChartsForHabit(habit.id);
  });
}

// -----------------------------------------
// MODALS OPEN/CLOSE
// -----------------------------------------
function openModal(modal) {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

function closeModal(modal) {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

// Add Habit Modal
addHabitBtn.addEventListener("click", () => openModal(addModal));
document.getElementById("cancel-habit-btn").addEventListener("click", () => closeModal(addModal));

// Edit Habit Modal
document.getElementById("cancel-edit-btn").addEventListener("click", () => closeModal(editModal));

// Overlay closes any modal
overlay.addEventListener("click", () => {
  closeModal(addModal);
  closeModal(editModal);
});

// -----------------------------------------
// ADD HABIT
// -----------------------------------------
document.getElementById("save-habit-btn").addEventListener("click", () => {
  const name = document.getElementById("habit-name-input").value.trim();
  const category = document.getElementById("habit-category-input").value;
  const schedule = document.getElementById("habit-schedule-input").value;

  if (!name || !schedule) {
    alert("Please fill all fields.");
    return;
  }

  addHabit(name, category, schedule);
  renderHabits();
  closeModal(addModal);

  document.getElementById("habit-name-input").value = "";
  document.getElementById("habit-schedule-input").value = "";

  sendBrowserNotification("New Habit Added!", {
    body: `${name} has been added to your routine.`,
  });
});

// -----------------------------------------
// EDIT HABIT
// -----------------------------------------
document.getElementById("save-edit-btn").addEventListener("click", () => {
  const name = document.getElementById("edit-habit-name").value.trim();
  const category = document.getElementById("edit-habit-category").value;
  const schedule = document.getElementById("edit-habit-schedule").value;

  if (!name || !schedule) {
    alert("All fields are required.");
    return;
  }

  editHabit(habitBeingEdited.id, { name, category, schedule });
  renderHabits();
  closeModal(editModal);

  sendBrowserNotification("Habit Updated!", {
    body: `${name} was successfully updated.`,
  });
});

// -----------------------------------------
// DELEGATED EVENTS
// -----------------------------------------
habitList.addEventListener("click", (e) => {
  const id = Number(e.target.dataset.id);

  if (e.target.classList.contains("checkin-btn")) {
    const result = checkInHabit(id);
    if (result === "alreadyChecked") {
      alert("You already completed this habit today!");
      sendBrowserNotification("Already done!", { body: "Keep it up!" });
      return;
    }
    alert("Great job! Your streak is now: " + result + " 🔥");
    sendBrowserNotification("Daily Check-in ✔", { body: `Streak: ${result} days` });
    renderHabits();
  }

  if (e.target.classList.contains("edit-btn")) {
    const habit = getAllHabits().find(h => h.id === id);
    if (!habit) return;

    habitBeingEdited = habit;
    document.getElementById("edit-habit-name").value = habit.name;
    document.getElementById("edit-habit-category").value = habit.category;
    document.getElementById("edit-habit-schedule").value = habit.schedule;

    openModal(editModal);
  }

  if (e.target.classList.contains("delete-btn")) {
    if (!confirm("Delete this habit?")) return;

    deleteHabit(id);
    renderHabits();
    sendBrowserNotification("Habit Deleted", { body: "The habit was removed successfully." });
  }
});
