import { loadDailyQuote } from "./motivation.js";
import { addHabit, getAllHabits, deleteHabit, editHabit } from "./habitManager.js";
import { checkInHabit } from "./progressTracker.js";

document.addEventListener("DOMContentLoaded", () => {
  loadDailyQuote().then(quote => {
    document.getElementById("daily-quote").textContent = quote;
  });

  renderHabits();
});

// -------------------------
// RENDER HABITS
// -------------------------
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
        <small>🔥 Streak: ${habit.streak || 0}</small>
      </div>

      <div class="habit-actions">
        <button class="checkin-btn" data-id="${habit.id}">✔️</button>
        <button class="edit-btn" data-id="${habit.id}">✏️</button>
        <button class="delete-btn" data-id="${habit.id}">🗑️</button>
      </div>
    `;

    habitList.appendChild(li);
  });

  addHabitActionEvents();
 document.querySelectorAll(".weekly-checkin-btn").forEach(btn => {
  btn.addEventListener("click", handleWeeklyCheckIn);
});
 
}

// -------------------------
// ADD HABIT MODAL
// -------------------------
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

// ------------------------------
// SAVE NEW HABIT
// ------------------------------
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
});

// -------------------------
// DELETE + EDIT + CHECK-IN
// -------------------------
function addHabitActionEvents() {

  // DELETE
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", handleDeleteHabit);
  });

  // EDIT
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", openEditModal);
  });

  // CHECK-IN
  document.querySelectorAll(".checkin-btn").forEach(btn => {
    btn.addEventListener("click", handleCheckIn);
  });
}

// -------------------------
// DELETE HABIT
// -------------------------
function handleDeleteHabit(event) {
  const id = Number(event.target.dataset.id);

  if (!confirm("Delete this habit?")) return;

  deleteHabit(id);
  renderHabits();
}

// -------------------------
// CHECK-IN
// -------------------------
function handleCheckIn(event) {
  const id = Number(event.target.dataset.id);

  checkInHabit(id);

  renderHabits();
}

// -------------------------
// EDIT HABIT MODAL
// -------------------------
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

// ------------------------------
// SAVE EDITED HABIT
// ------------------------------
saveEditBtn.addEventListener("click", () => {
  const name = document.getElementById("edit-habit-name").value.trim();
  const category = document.getElementById("edit-habit-category").value;
  const schedule = document.getElementById("edit-habit-schedule").value;

  if (!name || !schedule) {
    alert("All fields are required.");
    return;
  }

  editHabit(habitBeingEdited.id, { name, category, schedule });

  renderHabits(
    <button class="weekly-checkin-btn" data-id="${habit.id}">📅</button>
  );
  closeEditModal();
});

function handleWeeklyCheckIn(event) {
  const id = Number(event.target.dataset.id);

  const result = checkWeeklyHabit(id);

  if (result === "alreadyChecked") {
    alert("You've already checked in this habit this week!");
    return;
  }

  alert("Great weekly progress! Your weekly streak is now: " + result + " 📅🔥");

  renderHabits();
}
