import { getAllHabits, markDailyCheckIn, markWeeklyCheckIn } from "./habitManager.js";

// ------------------------------------
// DAILY CHECK-IN FUNCTION
// ------------------------------------
export function checkInHabit(habitId) {
  const streak = markDailyCheckIn(habitId);
  if (streak === false) return "alreadyChecked";
  return streak;
}

// ------------------------------------
// WEEKLY CHECK-IN FUNCTION
// ------------------------------------
export function weeklyCheckIn(habitId) {
  const weekStreak = markWeeklyCheckIn(habitId);
  if (weekStreak === false) return "alreadyChecked";
  return weekStreak;
}

// ------------------------------------
// GET FULL HISTORY OF A HABIT
// ------------------------------------
export function getHabitHistory(habitId) {
  const habit = getAllHabits().find(h => h.id === habitId);
  if (!habit) return null;

  return {
    daily: habit.history.map(h => h.date) || [],
    weekly: habit.weekHistory || [],
    dailyStreak: habit.streak || 0,
    weeklyStreak: habit.weekStreak || 0
  };
}

// ------------------------------------
// SIMULATION HELPER (OPTIONAL)
// ------------------------------------
// Simula check-ins passados para teste de gráficos
export function simulateHabitHistory(habitId, days = 30) {
  const habit = getAllHabits().find(h => h.id === habitId);
  if (!habit) return;

  const today = new Date();
  habit.history = [];
  habit.weekHistory = [];
  habit.streak = 0;
  habit.weekStreak = 0;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateStr = date.toDateString();
    habit.history.push({ date: dateStr, type: "daily" });

    const weekNum = getWeekNumber(date);
    if (!habit.weekHistory.includes(weekNum)) {
      habit.weekHistory.push(weekNum);
    }
  }
}

// ------------------------------------
// HELPER: GET WEEK NUMBER
// ------------------------------------
function getWeekNumber(date) {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const pastDays = (date - firstDay) / 86400000;
  return Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
}
