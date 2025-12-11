// ui.js (excert)
import { getAllHabits, addHabit, markHabitCompleted } from './habitManager.js';
import { fetchQuoteOfDay } from './motivation.js';
import { createWeeklyChart } from './charts.js';

export async function initUI(){
  const quoteEl = document.getElementById('quote-of-day');
  const q = await fetchQuoteOfDay();
  quoteEl.innerHTML = `<blockquote>"${q.text}" — <small>${q.author}</small></blockquote>`;

  renderCreateHabitForm();
  renderHabitList();
}

function renderCreateHabitForm(){
  // create a small form for adding habit
  // on submit call addHabit(...)
}

function renderHabitList(){
  const list = document.getElementById('habit-list');
  list.innerHTML = '';
  const habits = getAllHabits();
  habits.forEach(h=>{
    const card = document.createElement('div');
    card.className = 'habit-card';
    card.innerHTML = `
      <h3>${h.name}</h3>
      <p>Categoria: ${h.category || '—'}</p>
      <button class="checkbtn" data-id="${h.id}">Check In</button>
    `;
    list.appendChild(card);
  });

  list.querySelectorAll('.checkbtn').forEach(btn=>{
    btn.addEventListener('click', async e=>{
      const id = e.target.dataset.id;
      await markHabitCompleted(id);
      renderHabitList(); // update UI
    });
  });
}
