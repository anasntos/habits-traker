// habitManager.js
import { saveHabitsToLocalStorage, loadHabitsFromLocalStorage } from './storage.js';
import { initOrUpdateStreakOnCreate } from './progressTracker.js';

let habits = loadHabitsFromLocalStorage();

export function getAllHabits(){ return habits; }

export function addHabit(habit){
  // habit: { id, name, category, schedule: {days:[0..6]}, startDate, xp, history: [] }
  habit.id = Date.now().toString();
  habit.xp = habit.xp || 0;
  habit.history = habit.history || []; // array of dates completed
  habits.push(habit);
  saveHabitsToLocalStorage(habits);
  initOrUpdateStreakOnCreate(habit);
  return habit;
}

export function deleteHabit(id){
  habits = habits.filter(h=> h.id !== id);
  saveHabitsToLocalStorage(habits);
}

export function editHabit(id, updates){
  const idx = habits.findIndex(h=> h.id === id);
  if(idx === -1) return null;
  habits[idx] = {...habits[idx], ...updates};
  saveHabitsToLocalStorage(habits);
  return habits[idx];
}

export function markHabitCompleted(id, date = (new Date()).toISOString()){
  const h = habits.find(h=> h.id === id);
  if(!h) return null;
  // prevent duplicate completion on same day (compare YYYY-MM-DD)
  const dayKey = date.slice(0,10);
  if(h.history.includes(dayKey)) return h;
  h.history.push(dayKey);
  // add XP when finishing a 21-day phase handled in progressTracker
  saveHabitsToLocalStorage(habits);
  return h;
}
