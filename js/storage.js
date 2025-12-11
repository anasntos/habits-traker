// ---------------------------------------
// SAVE HABITS TO LOCAL STORAGE
// ---------------------------------------
export function saveHabitsToLocalStorage(habits) {
  try {
    localStorage.setItem("habits", JSON.stringify(habits));
  } catch (error) {
    console.error("Erro ao salvar hábitos:", error);
  }
}

// ---------------------------------------
// LOAD HABITS FROM LOCAL STORAGE
// ---------------------------------------
export function loadHabitsFromLocalStorage() {
  try {
    const data = localStorage.getItem("habits");
    if (!data) return [];
    const habits = JSON.parse(data);
    if (!Array.isArray(habits)) {
      localStorage.removeItem("habits");
      return [];
    }
    return habits;
  } catch (error) {
    console.error("Erro ao carregar hábitos:", error);
    localStorage.removeItem("habits");
    return [];
  }
}
