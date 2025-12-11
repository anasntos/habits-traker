import { saveHabitsToLocalStorage, loadHabitsFromLocalStorage } from "./storage.js";

// Carregar hábitos existentes
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
    streak: 0,
    lastCheckIn: null,
    weeklyCheckIn: null,
    history: [],
    weekHistory: [],
    weekStreak: 0
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

  const today = new Date().toDateString();

  // Já fez check-in hoje?
  if (habit.lastCheckIn === today) return false;

  // Atualiza streak
  if (habit.lastCheckIn) {
    const last = new Date(habit.lastCheckIn);
    const now = new Date();
    const diff = (now - last) / (1000 * 60 * 60 * 24);

    habit.streak = diff < 2 ? habit.streak + 1 : 1;
  } else {
    habit.streak = 1;
  }

  habit.lastCheckIn = today;
  habit.history.push({ date: today, type: "daily" });

  saveHabitsToLocalStorage(habits);
  return habit.streak;
}

// -------------------------
// WEEKLY CHECK-IN
// -------------------------
export function markWeeklyCheckIn(id) {
  const habit = habits.find(h => h.id === id);
  if (!habit) return false;

  const currentWeek = getWeekNumber(new Date());

  // Já registrou esta semana?
  if (habit.weeklyCheckIn === currentWeek) return false;

  habit.weeklyCheckIn = currentWeek;
  habit.weekHistory.push(currentWeek);

  // Atualiza streak semanal
  const lastWeek = currentWeek - 1;
  habit.weekStreak = habit.weekHistory.includes(lastWeek)
    ? habit.weekStreak + 1
    : 1;

  saveHabitsToLocalStorage(habits);
  return habit.weekStreak;
}

// -------------------------
// HELPER: GET WEEK NUMBER
// -------------------------
function getWeekNumber(date) {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const pastDays = (date - firstDay) / 86400000;
  return Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
}
