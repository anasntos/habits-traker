import { getHabitHistory } from "./progressTracker.js";

let weeklyChart = null;
let monthlyChart = null;

// ===================================
// HELPERS
// ===================================

// Retorna número da semana no ano
function getCurrentWeek() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), 0, 1);
  const diff = (today - firstDay) / (1000 * 60 * 60 * 24);
  return Math.ceil((diff + firstDay.getDay() + 1) / 7);
}

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
    return history.filter(date => date.startsWith(month)).length;
  });
  return { months, counts };
}

// ===================================
// WEEKLY CHART
// ===================================
export function renderWeeklyChart(habitId) {
  const history = getHabitHistory(habitId);

  if (!history) return;

  const weeklyData = [];
  const currentWeek = getCurrentWeek();

  for (let i = 5; i >= 0; i--) {
    const weekNumber = currentWeek - i;
    weeklyData.push(history.weekly.includes(weekNumber) ? 1 : 0);
  }

  const ctx = document.getElementById("weeklyChart").getContext("2d");

  if (weeklyChart) weeklyChart.destroy();

  weeklyChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["-5w", "-4w", "-3w", "-2w", "-1w", "This week"],
      datasets: [{
        label: "Weekly Check-ins",
        data: weeklyData,
        backgroundColor: "#A8D8EA"
      }]
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
  const history = getHabitHistory(habitId);

  if (!history) return;

  const { months, counts } = countMonthlyCheckins(history.daily);

  const ctx = document.getElementById("monthlyChart").getContext("2d");

  if (monthlyChart) monthlyChart.destroy();

  monthlyChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: months,
      datasets: [{
        label: "Monthly Check-ins",
        data: counts,
        borderColor: "#CDB4DB",
        backgroundColor: "rgba(205, 180, 219, 0.2)",
        tension: 0.3,
        fill: true
      }]
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
