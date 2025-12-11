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

    // Se não existir
    if (!data) return [];

    // Tentar converter
    const habits = JSON.parse(data);

    // Garantir que é um array válido
    if (!Array.isArray(habits)) {
      console.warn("Dados inválidos no localStorage. Limpando...");
      localStorage.removeItem("habits");
      return [];
    }

    return habits;

  } catch (error) {
    console.error("Erro ao carregar hábitos:", error);

    // Se der erro na leitura/parse → limpar pra evitar travar o app
    localStorage.removeItem("habits");
    return [];
  }
}
