import { loadDailyQuote } from "./motivation.js";

document.addEventListener("DOMContentLoaded", () => {
  loadDailyQuote().then(quote => {
    document.getElementById("daily-quote").textContent = quote;
  });
});

import { addHabit, getAllHabits } from "./habitManager.js";

// -------------------------
// RENDER HABITS ON SCREEN
// -------------------------
const habitList = document.getElementById("habit-list");

export function renderHabits() {
  const habits = getAllHabits();
  habitList.innerHTML = "";

  habits.forEach(habit => {
    const li = document.createElement("li");
    li.classList.add("habit-item");
    li.innerHTML = `
      <strong>${habit.name}</strong>
      <span>${habit.category}</span>
      <small>${habit.schedule}</small>
    `;

    habitList.appendChild(li);
  });
}

// Render na inicialização
document.addEventListener("DOMContentLoaded", renderHabits);

// -------------------------
// MODAL CONTROL
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

saveHabitBtn.addEventListener("click", () => {
  const name = document.getElementById("habit-name-input").value.trim();
  const category = document.getElementById("habit-category-input").value;
  const schedule = document.getElementById("habit-schedule-input").value;

  // -------------------------
  // VALIDATION
  // -------------------------
  if (!name) {
    alert("Please enter a habit name.");
    return;
  }

  if (!schedule) {
    alert("Please choose a schedule time.");
    return;
  }

  // -------------------------
  // CREATE HABIT
  // -------------------------
  addHabit({
    name,
    category,
    schedule
  });

  // -------------------------
  // UI UPDATE
  // -------------------------
  renderHabits();   // atualiza lista
  closeModal();     // fecha modal

  // limpar campos
  document.getElementById("habit-name-input").value = "";
  document.getElementById("habit-schedule-input").value = "";
});
