// charts.js
import { getAllHabits } from "./habitManager.js";
import { getHabitHistory } from "./progressTracker.js";


let weeklyChart = null;
let monthlyChart = null;

// ===================================
// HELPERS
// ===================================

// Retorna array de "YYYY-MM" para os últimos 6 meses
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

// Conta check-ins por mês no formato "YYYY-MM"
function countMonthlyCheckins(history) {
  const months = getLast6Months();
  const counts = months.map(month => {
    return history.daily.filter(date => date.startsWith(month)).length;
  });
  return counts;
}

// Retorna número da semana no ano
function getCurrentWeek() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), 0, 1);
  const diff = (today - firstDay) / (1000 * 60 * 60 * 24);
  return Math.ceil((diff + firstDay.getDay() + 1) / 7);
}

// Conta check-ins semanais para as últimas 6 semanas
function countWeeklyCheckins(history) {
  const currentWeek = getCurrentWeek();
  const weeklyData = [];

  for (let i = 5; i >= 0; i--) {
    const weekNumber = currentWeek - i;
    weeklyData.push(history.weekly.includes(weekNumber) ? 1 : 0);
  }

  return weeklyData;
}

// Gera cores diferentes para múltiplos hábitos
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// ===================================
// RENDER WEEKLY CHART
// ===================================
export function renderWeeklyChart() {
  const habits = getAllHabits();
  const labels = ["-5w", "-4w", "-3w", "-2w", "-1w", "This week"];
  const datasets = habits.map(habit => {
    const history = getHabitHistory(habit.id);
    return {
      label: habit.name,
      data: countWeeklyCheckins(history),
      backgroundColor: getRandomColor(),
    };
  });

  const ctx = document.getElementById("weeklyChart").getContext("2d");

  if (weeklyChart) weeklyChart.destroy();

  weeklyChart = new Chart(ctx, {
    type: "bar",
    data: { labels, datasets },
    options: { responsive: true, scales: { y: { beginAtZero: true, max: 1 } } },
  });
}

// ===================================
// RENDER MONTHLY CHART
// ===================================
export function renderMonthlyChart() {
  const habits = getAllHabits();
  const months = getLast6Months();
  const datasets = habits.map(habit => {
    const history = getHabitHistory(habit.id);
    return {
      label: habit.name,
      data: countMonthlyCheckins(history),
      borderColor: getRandomColor(),
      backgroundColor: "transparent",
      tension: 0.3,
    };
  });

  const ctx = document.getElementById("monthlyChart").getContext("2d");

  if (monthlyChart) monthlyChart.destroy();

  monthlyChart = new Chart(ctx, {
    type: "line",
    data: { labels: months, datasets },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } },
    },
  });
}

// ===================================
// RENDER ALL CHARTS
// ===================================
export function renderCharts() {
  renderWeeklyChart();
  renderMonthlyChart();
}
