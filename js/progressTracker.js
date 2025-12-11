import { getAllHabits } from "./habitManager.js";
import { saveHabitsToLocalStorage } from "./storage.js";

// -----------------------------------------
// DAILY CHECK-IN
// -----------------------------------------
export function checkInHabit(habitId) {
  const habits = getAllHabits();
  const habit = habits.find(h => h.id === habitId);
  if (!habit) return "notFound";

  const today = new Date().toISOString().split("T")[0];

  if (!habit.history) habit.history = [];

  if (habit.history.includes(today)) return "alreadyChecked";

  habit.history.push(today);

  // Atualiza streak
  updateDailyStreak(habit);

  saveHabitsToLocalStorage(habits);
  return habit.streak;
}

// -----------------------------------------
// UPDATE DAILY STREAK
// -----------------------------------------
function updateDailyStreak(habit) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (!habit.streak) habit.streak = 0;

  if (habit.history.includes(yesterdayStr)) {
    habit.streak += 1;
  } else {
    habit.streak = 1;
  }
}

// -----------------------------------------
// WEEKLY CHECK-IN
// -----------------------------------------
export function weeklyCheckIn(habitId) {
  const habits = getAllHabits();
  const habit = habits.find(h => h.id === habitId);
  if (!habit) return "notFound";

  const currentWeek = getCurrentWeek();

  if (!habit.weekHistory) habit.weekHistory = [];

  if (habit.weekHistory.includes(currentWeek)) return "alreadyChecked";

  habit.weekHistory.push(currentWeek);
  updateWeeklyStreak(habit);

  saveHabitsToLocalStorage(habits);
  return habit.weekStreak;
}

// -----------------------------------------
// UPDATE WEEKLY STREAK
// -----------------------------------------
function updateWeeklyStreak(habit) {
  const currentWeek = getCurrentWeek();
  const lastWeek = currentWeek - 1;

  if (!habit.weekStreak) habit.weekStreak = 0;

  if (habit.weekHistory.includes(lastWeek)) {
    habit.weekStreak += 1;
  } else {
    habit.weekStreak = 1;
  }
}

// -----------------------------------------
// GET FULL HISTORY
// -----------------------------------------
export function getHabitHistory(habitId) {
  const habit = getAllHabits().find(h => h.id === habitId);
  if (!habit) return null;

  return {
    daily: habit.history || [],
    weekly: habit.weekHistory || [],
    dailyStreak: habit.streak || 0,
    weeklyStreak: habit.weekStreak || 0
  };
}

// -----------------------------------------
// HELPER: CURRENT WEEK NUMBER
// -----------------------------------------
function getCurrentWeek() {
  const date = new Date();
  const oneJan = new Date(date.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
  return Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
}
