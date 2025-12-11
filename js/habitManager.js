import { saveHabitsToLocalStorage, loadHabitsFromLocalStorage } from "./storage.js";

// Carregar hábitos do localStorage
let habits = loadHabitsFromLocalStorage();

// -------------------------
// GET ALL HABITS
// -------------------------
export function getAllHabits() {
  return habits;
}

// -------------------------
// ADD HABIT
// -------------------------
export function addHabit(name, category, schedule) {
  const newHabit = {
    id: Date.now(),
    name,
    category,
    schedule,

    // Controle de progresso
    streak: 0,
    lastCheckIn: null,

    // Histórico compatível com progressTracker + charts
    history: {
      daily: [],
      weekly: []
    }
  };

  habits.push(newHabit);
  saveHabitsToLocalStorage(habits);
}

// -------------------------
// DELETE HABIT
// -------------------------
export function deleteHabit(id) {
  habits = habits.filter(h => h.id !== id);
  saveHabitsToLocalStorage(habits);
}

// -------------------------
// EDIT HABIT
// -------------------------
export function editHabit(id, updatedData) {
  const habit = habits.find(h => h.id === id);
  if (!habit) return;

  habit.name = updatedData.name;
  habit.category = updatedData.category;
  habit.schedule = updatedData.schedule;

  saveHabitsToLocalStorage(habits);
}

// -------------------------
// DAILY CHECK-IN
// -------------------------
export function markDailyCheckIn(id) {
  const habit = habits.find(h => h.id === id);
  if (!habit) return;

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD

  // Já feito hoje?
  if (habit.lastCheckIn === todayStr) {
    alert("You already checked in today!");
    return;
  }

  // Calcular streak
  if (habit.lastCheckIn) {
    const last = new Date(habit.lastCheckIn);
    const diff = (today - last) / (1000 * 60 * 60 * 24);

    habit.streak = diff < 2 ? habit.streak + 1 : 1;
  } else {
    habit.streak = 1;
  }

  habit.lastCheckIn = todayStr;

  // Registrar no histórico
  habit.history.daily.push(todayStr);

  saveHabitsToLocalStorage(habits);
}

// -------------------------
// WEEKLY CHECK-IN
// -------------------------
export function markWeeklyCheckIn(id) {
  const habit = habits.find(h => h.id === id);
  if (!habit) return;

  const currentWeek = getWeekNumber(new Date());

  // Já registrado esta semana?
  if (habit.history.weekly.includes(currentWeek)) {
    alert("You already checked in this week!");
    return;
  }

  habit.history.weekly.push(currentWeek);

  saveHabitsToLocalStorage(habits);
}

// -------------------------
// HELPER: GET WEEK NUMBER
// -------------------------
function getWeekNumber(date) {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const pastDays = Math.floor((date - firstDay) / 86400000);
  return Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
}

import { saveHabitsToLocalStorage } from "./storage.js";

// ...

export function saveAllHabits(habits) {
  saveHabitsToLocalStorage(habits);
}
