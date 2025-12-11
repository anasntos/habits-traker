import { getAllHabits, saveAllHabits } from "./habitManager.js";
import{saveHabitsToLocalStorage} from "./storage.js";

// =====================================
// HELPERS — Funções de Data
// =====================================

// Retorna string "YYYY-MM-DD"
function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

// Retorna número da semana (1–53)
function getCurrentWeek() {
  const date = new Date();
  const oneJan = new Date(date.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
  return Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
}


// =====================================
// CHECK-IN DIÁRIO
// =====================================
export function checkInHabit(habitId) {
  const habits = getAllHabits();
  const habit = habits.find(h => h.id === habitId);

  if (!habit) return "notFound";

  const today = getTodayDate();

  // Criar histórico se não existir
  if (!habit.history) habit.history = [];

  // Verifica se já fez check-in hoje
  if (habit.history.includes(today)) {
    return "alreadyChecked";
  }

  // Registrar check-in
  habit.history.push(today);

  // Atualizar streak
  updateDailyStreak(habit);

  saveAllHabits(habits);

  return habit.streak; // retorna streak atualizado
}


// =====================================
// STREAK DIÁRIO
// =====================================
function updateDailyStreak(habit) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const todayStr = today.toISOString().split("T")[0];
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (!habit.streak) habit.streak = 0;

  if (habit.history.includes(yesterdayStr)) {
    habit.streak += 1;
  } else {
    habit.streak = 1; // inicia streak
  }
}


// =====================================
// CHECK-IN SEMANAL
// =====================================
export function weeklyCheckIn(habitId) {
  const habits = getAllHabits();
  const habit = habits.find(h => h.id === habitId);
  if (!habit) return "notFound";

  const week = getCurrentWeek();

  if (!habit.weekHistory) habit.weekHistory = [];

  // Já registrou esta semana?
  if (habit.weekHistory.includes(week)) {
    return "alreadyChecked";
  }

  habit.weekHistory.push(week);

  updateWeeklyStreak(habit);

  saveAllHabits(habits);

  return habit.weekStreak;
}


// =====================================
// STREAK SEMANAL
// =====================================
function updateWeeklyStreak(habit) {
  if (!habit.weekStreak) habit.weekStreak = 0;

  const currentWeek = getCurrentWeek();
  const lastWeek = currentWeek - 1;

  if (habit.weekHistory.includes(lastWeek)) {
    habit.weekStreak += 1;
  } else {
    habit.weekStreak = 1;
  }
}


// =====================================
// GET FULL HISTORY
// =====================================
export function getHabitHistory(habitId) {
  const habits = getAllHabits();
  const habit = habits.find(h => h.id === habitId);

  if (!habit) return null;

  return {
    daily: habit.history || [],
    weekly: habit.weekHistory || [],
    dailyStreak: habit.streak || 0,
    weeklyStreak: habit.weekStreak || 0
  };
}
