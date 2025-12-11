//-----------------------------------------------------
// UI.JS — APENAS RENDERIZAÇÃO DO FRONT-END
//-----------------------------------------------------

import { getAllHabits } from "./habitManager.js";

// Elemento principal onde os hábitos serão renderizados
const habitList = document.getElementById("habit-list");

// -----------------------------------------------------
// RENDER HABITS
// -----------------------------------------------------
export function renderHabits() {
  const habits = getAllHabits();
  habitList.innerHTML = "";

  habits.forEach(habit => {
    const item = document.createElement("div");
    item.classList.add("habit-item");

    item.innerHTML = `
      <div class="habit-info">
        <strong>${habit.name}</strong>
        <span>${habit.category}</span>
        <small>${habit.schedule}</small>
      </div>

      <div class="habit-actions">

        <!-- DAILY CHECK-IN -->
        <button 
          class="daily-checkin-btn" 
          data-id="${habit.id}">
          ✔ Daily
        </button>

        <!-- WEEKLY CHECK-IN -->
        <button 
          class="weekly-checkin-btn" 
          data-id="${habit.id}">
          📅 Weekly
        </button>

        <!-- EDIT -->
        <button 
          class="edit-btn" 
          data-id="${habit.id}">
          ✏️
        </button>

        <!-- DELETE -->
        <button 
          class="delete-btn" 
          data-id="${habit.id}">
          🗑️
        </button>

      </div>
    `;

    habitList.appendChild(item);
  });
}
