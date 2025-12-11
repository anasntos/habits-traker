// progressTracker.js
import { saveHabitsToLocalStorage } from './storage.js';

function getConsecutiveStreak(historyDates){
  // historyDates = ['2025-12-01', '2025-12-02', ...'] (sorted)
  if(historyDates.length === 0) return 0;
  // compute streak ending today
  const today = new Date();
  let streak = 0;
  for(let i = historyDates.length -1; i >=0; i--){
    const d = new Date(historyDates[i]);
    const daysDiff = Math.round(( (today) - d ) / (1000*60*60*24));
    if(daysDiff === streak) {
      streak++;
    } else if(daysDiff > streak) {
      // gap
      break;
    }
  }
  return streak;
}

export function computeStreak(habit){
  // return integer
  const sorted = [...habit.history].sort();
  return getConsecutiveStreak(sorted);
}

export function checkPhaseAndAddXP(habit){
  // every 21 completions grant a phase XP, reset or accumulate as you want
  const phasesCompleted = Math.floor(habit.history.length / 21);
  const xpFromPhases = phasesCompleted * 100; // example: 100 xp per phase
  if(habit.xp !== xpFromPhases){
    habit.xp = xpFromPhases;
    saveHabitsToLocalStorage(); // call with full habits in real app
  }
  return habit.xp;
}

// called when creating habit to ensure fields exist
export function initOrUpdateStreakOnCreate(habit){
  habit.history = habit.history || [];
  habit.xp = habit.xp || 0;
}
