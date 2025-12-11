import { loadDailyQuote } from "./motivation.js";
import { addHabit, getAllHabits, deleteHabit, editHabit } from "./habitManager.js";
import { checkInHabit } from "./progressTracker.js";
import { sendBrowserNotification } from "./notifications.js";

document.addEventListener("DOMContentLoaded", () => {
  loadDailyQuote().then(quote => {
    document.getElementById("daily-quote").textContent = quote;
  });

  renderHabits();
});

// -----------------------------------------------------
// RENDER HABITS
// -----------------------------------------------------
const habitList = document.getElementById("habit-list");

export function renderHabits() {
  const habits = getAllHabits();
  habitList.innerHTML = "";

  habits.forEach(habit => {
    const li = document.createElement("div");
    li.classList.add("habit-item");

    li.innerHTML = `
      <div class="habit-info">
        <strong>${habit.name}</strong>
        <span>${habit.category}</span>
        <small>${habit.schedule}</small>
      </div>

      <div class="habit-actions">
        <button class="checkin-btn" data-id="${habit.id}">✔</button>
        <button class="edit-btn" data-id="${habit.id}">✏️</button>
        <button class="delete-btn" data-id="${habit.id}">🗑️</button>
      </div>
    `;

    habitList.appendChild(li);
  });

  addHabitActionEvents();

  // adicionar eventos do check-in
  document.querySelectorAll(".checkin-btn").forEach(btn => {
    btn.addEventListener("click", handleCheckIn);
  });
}

// -----------------------------------------------------
// CHECK-IN HANDLER + NOTIFICAÇÕES
// -----------------------------------------------------
function handleCheckIn(event) {
  const id = Number(event.target.dataset.id);

  const result = checkInHabit(id);

  if (result === "alreadyChecked") {
    alert("You already completed this habit today!");

    sendBrowserNotification("Already done!", {
      body: "You already completed this habit today. Keep it up!",
    });

    return;
  }

  alert("Great job! Your streak is now: " + result + " 🔥");

  sendBrowserNotification("Daily Check-in ✔", {
    body: `Nice! Your streak is now ${result} days!`,
  });

  renderHabits();
}

// -----------------------------------------------------
// ADD HABIT MODAL
// -----------------------------------------------------
const addHabitBtn = document.getElementById("add-habit-btn");
const modal = document.getElementById("add-habit-modal");
const overlay = document.getElementById("modal-overlay");
const cancelBtn = document.getElementById("cancel-habit-btn");

function openModal() {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

addHabitBtn.addEventListener("click", openModal);
cancelBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

const saveHabitBtn = document.getElementById("save-habit-btn");

// -----------------------------------------------------
// SAVE NEW HABIT + NOTIFICATION
// -----------------------------------------------------
saveHabitBtn.addEventListener("click", () => {
  const name = document.getElementById("habit-name-input").value.trim();
  const category = document.getElementById("habit-category-input").value;
  const schedule = document.getElementById("habit-schedule-input").value;

  if (!name || !schedule) {
    alert("Please fill all fields.");
    return;
  }

  addHabit({ name, category, schedule });

  renderHabits();
  closeModal();

  document.getElementById("habit-name-input").value = "";
  document.getElementById("habit-schedule-input").value = "";

  sendBrowserNotification("New Habit Added!", {
    body: `${name} has been added to your routine.`,
  });
});

// -----------------------------------------------------
// DELETE + EDIT BUTTON EVENTS
// -----------------------------------------------------
function addHabitActionEvents() {
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", handleDeleteHabit);
  });

  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", openEditModal);
  });
}

// -----------------------------------------------------
// DELETE HABIT + NOTIFICATION
// -----------------------------------------------------
function handleDeleteHabit(event) {
  const id = Number(event.target.dataset.id);

  if (!confirm("Delete this habit?")) return;

  deleteHabit(id);
  renderHabits();

  sendBrowserNotification("Habit Deleted", {
    body: "The habit was removed successfully.",
  });
}

// -----------------------------------------------------
// EDIT HABIT MODAL
// -----------------------------------------------------
const editModal = document.getElementById("edit-habit-modal");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const saveEditBtn = document.getElementById("save-edit-btn");

let habitBeingEdited = null;

function openEditModal(event) {
  const id = Number(event.target.dataset.id);
  const habits = getAllHabits();
  const habit = habits.find(h => h.id === id);

  habitBeingEdited = habit;

  document.getElementById("edit-habit-name").value = habit.name;
  document.getElementById("edit-habit-category").value = habit.category;
  document.getElementById("edit-habit-schedule").value = habit.schedule;

  editModal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

function closeEditModal() {
  editModal.classList.add("hidden");
  overlay.classList.add("hidden");
}

cancelEditBtn.addEventListener("click", closeEditModal);

// -----------------------------------------------------
// SAVE EDITED HABIT + NOTIFICATION
// -----------------------------------------------------
saveEditBtn.addEventListener("click", () => {
  const name = document.getElementById("edit-habit-name").value.trim();
  const category = document.getElementById("edit-habit-category").value;
  const schedule = document.getElementById("edit-habit-schedule").value;

  if (!name || !schedule) {
    alert("All fields are required.");
    return;
  }

  editHabit(habitBeingEdited.id, { name, category, schedule });

  renderHabits();
  closeEditModal();

  sendBrowserNotification("Habit Updated!", {
    body: `${name} was successfully updated.`,
  });
});
