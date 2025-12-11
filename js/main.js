// =====================================================
// progressTracker.js — TRACKER DE CHECK-INS
// =====================================================

import { getAllHabits, saveAllHabits } from "./habitManager.js";

// ==========================
// HELPER: DATA
// ==========================
function getTodayDate() {
    return new Date().toISOString().split("T")[0];
}

function getCurrentWeek() {
    const date = new Date();
    const oneJan = new Date(date.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
    return Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
}

// ==========================
// CHECK-IN DIÁRIO
// ==========================
export function checkInHabit(habitId) {
    const habits = getAllHabits();
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return "notFound";

    const today = getTodayDate();
    if (!habit.history) habit.history = [];

    // Já fez check-in hoje?
    if (habit.history.includes(today)) return "alreadyChecked";

    habit.history.push(today);
    updateDailyStreak(habit);
    saveAllHabits(habits);

    return habit.streak;
}

function updateDailyStreak(habit) {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const todayStr = today.toISOString().split("T")[0];
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (!habit.streak) habit.streak = 0;
    habit.streak = habit.history.includes(yesterdayStr) ? habit.streak + 1 : 1;
}

// ==========================
// CHECK-IN SEMANAL
// ==========================
export function weeklyCheckIn(habitId) {
    const habits = getAllHabits();
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return "notFound";

    const week = getCurrentWeek();
    if (!habit.weekHistory) habit.weekHistory = [];

    if (habit.weekHistory.includes(week)) return "alreadyChecked";

    habit.weekHistory.push(week);
    updateWeeklyStreak(habit);
    saveAllHabits(habits);

    return habit.weekStreak;
}

function updateWeeklyStreak(habit) {
    if (!habit.weekStreak) habit.weekStreak = 0;

    const currentWeek = getCurrentWeek();
    const lastWeek = currentWeek - 1;
    habit.weekStreak = habit.weekHistory.includes(lastWeek) ? habit.weekStreak + 1 : 1;
}

// ==========================
// CHECK-IN AUTOMÁTICO HOJE
// ==========================
export function hasCheckedInToday() {
    const habits = getAllHabits();
    const today = getTodayDate();

    return habits.some(habit => habit.history && habit.history.includes(today));
}

// ==========================
// GET HISTÓRICO COMPLETO
// ==========================
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
