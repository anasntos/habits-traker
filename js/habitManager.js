export function addHabit(habit) {}
export function deleteHabit(id) {}
export function editHabit(id, updatedData) {}
export function getAllHabits() {}

import { saveHabitsToLocalStorage, loadHabitsFromLocalStorage } from "./storage.js";

// Inicializa array de hábitos (carrega do LocalStorage)
let habits = loadHabitsFromLocalStorage() || [];

// -------------------------
// Criar hábito
// -------------------------
export function addHabit({ name, category, schedule }) {
  const newHabit = {
    id: Date.now(), // ID único
    name,
    category,
    schedule,
    createdAt: new Date().toISOString(),
    streak: 0,
    history: [],
  };

  habits.push(newHabit);
  saveHabitsToLocalStorage(habits);

  return newHabit;
}

// -------------------------
// Deletar hábito
// -------------------------
export function deleteHabit(id) {
  habits = habits.filter(h => h.id !== id);
  saveHabitsToLocalStorage(habits);
}

// -------------------------
// Editar hábito
// -------------------------
export function editHabit(id, updatedFields) {
  habits = habits.map(habit => {
    if (habit.id === id) {
      return { ...habit, ...updatedFields };
    }
    return habit;
  });

  saveHabitsToLocalStorage(habits);
}

// -------------------------
// Obter todos os hábitos
// -------------------------
export function getAllHabits() {
  return habits;
}
