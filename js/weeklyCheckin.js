// weeklyCheckin.js

import { loadWeeklyCheckins, saveWeeklyCheckins } from "./storage.js";

export function addWeeklyCheckin() {
    const checkins = loadWeeklyCheckins();
    const today = new Date();
    
    // Obtém a semana atual (número da semana no ano)
    const currentWeek = getWeekNumber(today);
    const currentYear = today.getFullYear();

    const id = `${currentYear}-W${currentWeek}`;

    if (!checkins.includes(id)) {
        checkins.push(id);
        saveWeeklyCheckins(checkins);
        return true;   // registrado com sucesso
    }

    return false; // já existia
}

export function getWeeklyProgress() {
    return loadWeeklyCheckins();
}

// Função auxiliar para descobrir número da semana
function getWeekNumber(date) {
    const firstDay = new Date(date.getFullYear(), 0, 1);
    const pastDays = (date - firstDay) / 86400000;
    return Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
}
