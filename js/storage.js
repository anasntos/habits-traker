export function saveHabitsToLocalStorage(habits) {}
export function loadHabitsFromLocalStorage() {}

export function saveHabitsToLocalStorage(habits) {
  try {
    localStorage.setItem("habit-hopper-habits", JSON.stringify(habits));
  } catch (err) {
    console.error("Erro ao salvar hábitos:", err);
  }
}

export function loadHabitsFromLocalStorage() {
  try {
    const data = localStorage.getItem("habit-hopper-habits");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Erro ao carregar hábitos:", err);
    return [];
  }
}
