import { saveHabitsToLocalStorage, loadHabitsFromLocalStorage } from "./storage.js";

// Carregar hábitos do localStorage
let habits = loadHabitsFromLocalStorage();

// -----------------------------------------
// GET ALL HABITS
// -----------------------------------------
export function getAllHabits() {
  return habits;
}

// -----------------------------------------
// ADD HABIT
// -----------------------------------------
export function addHabit(name, category, schedule) {
  const newHabit = {
    id: Date.now(),
    name,
    category,
    schedule,
    streak: 0,
    lastCheckIn: null,
    history: [],
    weekHistory: [],
    weekStreak: 0
  };
  habits.push(newHabit);
  saveHabitsToLocalStorage(habits);
}

// -----------------------------------------
// DELETE HABIT
// -----------------------------------------
export function deleteHabit(id) {
  habits = habits.filter(h => h.id !== id);
  saveHabitsToLocalStorage(habits);
}

// -----------------------------------------
// EDIT HABIT
// -----------------------------------------
export function editHabit(id, updatedData) {
  const habit = habits.find(h => h.id === id);
  if (!habit) return;

  habit.name = updatedData.name;
  habit.category = updatedData.category;
  habit.schedule = updatedData.schedule;

  saveHabitsToLocalStorage(habits);
}
