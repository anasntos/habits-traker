import { saveHabitsToLocalStorage, loadHabitsFromLocalStorage } from "./storage.js";

// Carregar hábitos
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
    history: []
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
  if (habit.lastCheckIn === today) {
    alert("You already checked in today!");
    return;
  }

  // Checar streak
  if (habit.lastCheckIn) {
    const last = new Date(habit.lastCheckIn);
    const now = new Date();
    const difference = (now - last) / (1000 * 60 * 60 * 24);

    if (difference < 2) {
      habit.streak += 1; // manteve
    } else {
      habit.streak = 1; // resetou
    }
  } else {
    habit.streak = 1;
  }

  habit.lastCheckIn = today;

  // Registrar histórico
  habit.history.push({
    date: today,
    type: "daily"
  });

  saveHabitsToLocalStorage(habits);
}

// -------------------------
// WEEKLY CHECK-IN
// -------------------------
export function markWeeklyCheckIn(id) {
  const habit = habits.find(h => h.id === id);
  if (!habit) return;

  const currentWeek = getWeekNumber(new Date());

 // Já fez essa semana?
  if (habit.weeklyCheckIn === currentWeek) {
    alert("You already checked in this week!");
    return;
  }

  habit.weeklyCheckIn = currentWeek;

  // Registrar histórico
  habit.history.push({
    date: new Date().toDateString(),
    week: currentWeek,
    type: "weekly"
  });

  saveHabitsToLocalStorage(habits);
}

// -------------------------
// GET WEEK NUMBER (HELPER)
// -------------------------
function getWeekNumber(date) {
  const oneJan = new Date(date.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
  return Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
}
