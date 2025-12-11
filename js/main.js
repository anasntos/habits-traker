// IMPORTS
import { addHabit, deleteHabit, editHabit, markDailyCheckIn, markWeeklyCheckIn, getAllHabits } from "./habitManager.js";
import { renderHabits } from "./ui.js";

// ==========================
//        MODAL: ADD
// ==========================
const addHabitBtn = document.getElementById("add-habit-btn");
const addHabitModal = document.getElementById("addHabitModal");
const closeAddModalBtn = document.getElementById("closeAddModal");
const saveHabitBtn = document.getElementById("saveHabitBtn");

// Abrir modal de adicionar hábito
addHabitBtn.addEventListener("click", () => {
  addHabitModal.style.display = "flex";
});

// Fechar modal
closeAddModalBtn.addEventListener("click", () => {
  addHabitModal.style.display = "none";
});

// Salvar novo hábito
saveHabitBtn.addEventListener("click", () => {
  const name = document.getElementById("habit-name").value.trim();
  const category = document.getElementById("habit-category").value;
  const schedule = document.getElementById("habit-schedule").value;

  if (!name || !schedule) {
    alert("All fields are required.");
    return;
  }

  addHabit(name, category, schedule);
  renderHabits();
  addHabitModal.style.display = "none";
});


// ==========================
//        MODAL: EDIT
// ==========================
const editHabitModal = document.getElementById("editHabitModal");
const closeEditModalBtn = document.getElementById("closeEditModal");
const saveEditBtn = document.getElementById("saveEditBtn");

let habitBeingEdited = null;

// Abrir modal de edição
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-btn")) {
    const id = Number(e.target.dataset.id);
    const habit = getAllHabits().find(h => h.id === id);

    if (!habit) return;

    habitBeingEdited = habit;

    document.getElementById("edit-habit-name").value = habit.name;
    document.getElementById("edit-habit-category").value = habit.category;
    document.getElementById("edit-habit-schedule").value = habit.schedule;

    editHabitModal.style.display = "flex";
  }
});

// Fechar modal
closeEditModalBtn.addEventListener("click", () => {
  editHabitModal.style.display = "none";
});

// Salvar edição
saveEditBtn.addEventListener("click", () => { 
  const name = document.getElementById("edit-habit-name").value.trim();
  const category = document.getElementById("edit-habit-category").value;
  const schedule = document.getElementById("edit-habit-schedule").value;

  if (!name || !schedule) {
    alert("All fields are required.");
    return;
  }

  editHabit(habitBeingEdited.id, {
    name,
    category,
    schedule
  });

  renderHabits();
  editHabitModal.style.display = "none";
});


// ==========================
//     DELETE HABIT
// ==========================
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = Number(e.target.dataset.id);
    deleteHabit(id);
    renderHabits();
  }
});


// ==========================
//     CHECK-IN DIÁRIO
// ==========================
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("daily-checkin-btn")) {
    const id = Number(e.target.dataset.id);
    markDailyCheckIn(id);
    renderHabits();
  }
});


// ==========================
//     CHECK-IN SEMANAL
// ==========================
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("weekly-checkin-btn")) {
    const id = Number(e.target.dataset.id);
    markWeeklyCheckIn(id);
    renderHabits();
  }
});


// ==========================
//     INICIALIZAÇÃO
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  renderHabits();
});

import { sendNotification } from "./notifications.js";
import { hasCheckedInToday } from "./progressTracker.js";

document.addEventListener("DOMContentLoaded", () => {
  renderHabits();

  if (!hasCheckedInToday()) {
    sendNotification("Don't forget your daily check-in! ✨", "warning");
  }
});
import { requestNotificationPermission } from "./notifications.js";

document.addEventListener("DOMContentLoaded", async () => {
  await requestNotificationPermission();
});

// -----------------------------------------------------
// MAIN.JS — ARQUIVO PRINCIPAL DE INICIALIZAÇÃO DO APP
// -----------------------------------------------------

import { renderHabits } from "./ui.js";
import { loadDailyQuote } from "./motivation.js";
import { requestNotificationPermission } from "./notifications.js";

document.addEventListener("DOMContentLoaded", async () => {

  // -----------------------------------------------------
  // 1) Pedir permissão de notificações AO ABRIR O APP
  // -----------------------------------------------------
  requestNotificationPermission();

  // -----------------------------------------------------
  // 2) Carregar frase motivacional do dia
  // -----------------------------------------------------
  try {
    const quote = await loadDailyQuote();
    document.getElementById("daily-quote").textContent = quote;
  } catch (error) {
    console.warn("Não foi possível carregar a frase motivacional.");
  }

  // -----------------------------------------------------
  // 3) Renderizar hábitos salvos no localStorage
  // -----------------------------------------------------
  renderHabits();

  // -----------------------------------------------------
  // 4) (OPCIONAL) Em breve: lembretes automáticos
  // -----------------------------------------------------
  // setupDailyReminders();  // só ativar quando implementarmos
});
