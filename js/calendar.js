// calendar.js
// -----------------------------------------
// Calendarific API - Holiday Detection with Fallback
// -----------------------------------------

const API_KEY = "YOUR_CALENDARIFIC_API_KEY"; // substitua pela sua chave
const BASE_URL = "https://calendarific.com/api/v2/holidays";

// -----------------------------------------
// DETECT USER COUNTRY
// -----------------------------------------
function detectCountry() {
  // Tenta detectar via navegador, fallback "US"
  return (navigator.language || "en-US").split("-")[1] || "US";
}

// -----------------------------------------
// FETCH HOLIDAYS FOR CURRENT YEAR
// -----------------------------------------
export async function fetchHolidays(year = new Date().getFullYear(), country = detectCountry()) {
  try {
    const response = await fetch(`${BASE_URL}?api_key=${API_KEY}&country=${country}&year=${year}`);
    if (!response.ok) throw new Error("Failed to fetch holidays");
    const data = await response.json();
    return data.response.holidays || [];
  } catch (error) {
    console.error("Error fetching holidays:", error);
    return []; // fallback vazio
  }
}

// -----------------------------------------
// CHECK IF TODAY IS A HOLIDAY
// -----------------------------------------
export async function isTodayHoliday() {
  const todayStr = new Date().toISOString().split("T")[0];
  const country = detectCountry();
  const holidays = await fetchHolidays(new Date().getFullYear(), country);

  const holidayToday = holidays.find(h => h.date.iso === todayStr);

  if (holidayToday) {
    return holidayToday.name;
  }
  return null;
}

// -----------------------------------------
// GET MOTIVATIONAL MESSAGE FOR TODAY
// -----------------------------------------
export async function getDailyMessage(defaultMessage = "Stay consistent with your habits today! 💪") {
  try {
    const holidayName = await isTodayHoliday();
    if (holidayName) {
      return `Happy ${holidayName}! 🎉 Remember to enjoy your habits today!`;
    }
    return defaultMessage;
  } catch (error) {
    console.warn("Error generating daily message, using default.");
    return defaultMessage;
  }
}
