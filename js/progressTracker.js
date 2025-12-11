export function updateStreak(habit) {}
export function resetStreak(habit) {}
export function getHabitHistory(habitId) {}
import { getAllHabits, saveHabitsToLocalStorage } from "./habitManager.js";

export function checkInHabit(id) {
  const habits = getAllHabits();
  const habit = habits.find(h => h.id === id);

  if (!habit) return;

  const today = new Date().toDateString();

  // Se já marcou hoje, sair
  if (habit.lastCheckIn === today) {
    return "alreadyChecked";
  }

  // Se marcou ontem → streak continua
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (habit.lastCheckIn === yesterday.toDateString()) {
    habit.streak += 1;
  } 
  else {
    habit.streak = 1; // reset streak se perdeu o dia
  }

  habit.lastCheckIn = today;

  habit.history.push({
    date: today,
    status: "completed"
  });

  saveHabitsToLocalStorage(habits);

  return habit.streak;
}

export function checkWeeklyHabit(id) {
  const habits = getAllHabits();
  const habit = habits.find(h => h.id === id);
  if (!habit) return;

  const today = new Date();
  const last = habit.weeklyLastCheck ? new Date(habit.weeklyLastCheck) : null;

  // Se nunca fez check-in semanal → começar a streak
  if (!last) {
    habit.weeklyLastCheck = today.toISOString();
    habit.weeklyStreak = 1;
    saveHabits(habits);
    return habit.weeklyStreak;
  }

  // -------------------------------
  // VERIFICAR DIFERENÇA EM SEMANAS
  // -------------------------------
  const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));

  if (diffDays < 7) {
    // tentativa dentro da mesma semana
    return "alreadyChecked"; 
  }

  if (diffDays <= 14) {
    // semana seguinte → streak continua
    habit.weeklyStreak++;
  } else {
    // muito tempo → streak reseta
    habit.weeklyStreak = 1;
  }

  habit.weeklyLastCheck = today.toISOString();
  saveHabits(habits);

  return habit.weeklyStreak;
}
