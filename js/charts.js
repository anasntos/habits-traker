import { getHabitHistory } from "./progressTracker.js";

let weeklyChart = null;
let monthlyChart = null;

// ===================================
// HELPERS
// ===================================

// Número da semana no ano
function getCurrentWeek() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), 0, 1);
  const diff = Math.floor((today - firstDay) / (1000 * 60 * 60 * 24));
  return Math.ceil((diff + firstDay.getDay() + 1) / 7);
}

// Últimos 6 meses no formato YYYY-MM
function getLast6Months() {
  const months = [];
  const date = new Date();

  for (let i = 0; i < 6; i++) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    months.unshift(`${y}-${m}`);
    date.setMonth(date.getMonth() - 1);
  }

  return months;
}

// Conta check-ins mensais
function countMonthlyCheckins(dailyHistory) {
  if (!Array.isArray(dailyHistory)) dailyHistory = [];

  const months = getLast6Months();
  const counts = months.map(month => {
    return dailyHistory.filter(date => date.startsWith(month)).length;
  });

  return { months, counts };
}


// ===================================
// WEEKLY CHART
// ===================================
export function renderWeeklyChart(habitId) {
  const history = getHabitHistory(habitId) || { daily: [], weekly: [] };

  const weeklyArray = Array.isArray(history.weekly) ? history.weekly : [];
  const currentWeek = getCurrentWeek();
  const weeksToShow = [];

  // 6 semanas atrás até esta semana
  for (let i = 5; i >= 0; i++) {
    const week = currentWeek - i;
    weeksToShow.push(weeklyArray.includes(week) ? 1 : 0);
  }

  const canvas = document.getElementById("weeklyChart");
  if (!canvas) return; // evita erro se não existir na página

  const ctx = canvas.getContext("2d");

  if (weeklyChart) weeklyChart.destroy();

  weeklyChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["-5w", "-4w", "-3w", "-2w", "-1w", "This Week"],
      datasets: [
        {
          label: "Weekly Check-ins",
          data: weeksToShow,
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, max: 1 }
      }
    }
  });
}


// ===================================
// MONTHLY CHART
// ===================================
export function renderMonthlyChart(habitId) {
  const history = getHabitHistory(habitId) || { daily: [], weekly: [] };
  const dailyArray = Array.isArray(history.daily) ? history.daily : [];

  const { months, counts } = countMonthlyCheckins(dailyArray);

  const canvas = document.getElementById("monthlyChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (monthlyChart) monthlyChart.destroy();

  monthlyChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: months,
      datasets: [
        {
          label: "Monthly Check-ins",
          data: counts,
          tension: 0.3,
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}


// ===================================
// RENDER ALL CHARTS
// ===================================
export function renderCharts(habitId) {
  renderWeeklyChart(habitId);
  renderMonthlyChart(habitId);
}
