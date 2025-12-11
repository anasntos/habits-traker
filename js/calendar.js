// calendar.js
const API_KEY = "Jw9ABh6UWFPGKuLGBD36pQqqFjQj1B4M";
const BASE_URL = "https://calendarific.com/api/v2/holidays";

// Detectar país do usuário (pode ser manual)
const USER_COUNTRY = "BR"; // Brasil por padrão

// ------------------------------------
// FETCH HOLIDAYS
// ------------------------------------
export async function fetchHolidays(year = new Date().getFullYear(), country = USER_COUNTRY) {
  try {
    const response = await fetch(`${BASE_URL}?api_key=${API_KEY}&country=${country}&year=${year}`);
    const data = await response.json();
    if (data.meta && data.meta.code === 200) {
      return data.response.holidays;
    } else {
      console.warn("Erro ao buscar feriados:", data);
      return [];
    }
  } catch (error) {
    console.error("Erro na requisição de feriados:", error);
    return [];
  }
}

// ------------------------------------
// CHECK IF TODAY IS HOLIDAY
// ------------------------------------
export async function checkTodayHoliday() {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const holidays = await fetchHolidays();
  const holidayToday = holidays.find(h => h.date.iso === today);
  return holidayToday || null;
}

// ------------------------------------
// SHOW HOLIDAY MESSAGE
// ------------------------------------
export async function showHolidayMessage(defaultMessage = "Stay consistent with your habits!") {
  const holiday = await checkTodayHoliday();
  const messageElement = document.getElementById("daily-quote");
  
  if (!messageElement) return;

  if (holiday) {
    messageElement.textContent = `🎉 Today is ${holiday.name}! Enjoy your day!`;
  } else {
    messageElement.textContent = defaultMessage;
  }
}

