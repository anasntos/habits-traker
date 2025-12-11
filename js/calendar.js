// calendar.js
const CALENDARIFIC_URL = 'https://calendarific.com/api/v2/holidays';
export async function fetchHolidays(country='US', year=(new Date()).getFullYear(), apiKey='YOUR_CALENDARIFIC_API_KEY'){
  // Calendarific requires API key; handle failure gracefully
  try{
    const url = `${CALENDARIFIC_URL}?api_key=${apiKey}&country=${country}&year=${year}`;
    const res = await fetch(url);
    if(!res.ok) throw new Error('Holidays fetch failed');
    const json = await res.json();
    return json.response.holidays || [];
  }catch(e){
    console.warn('Calendar fetch failed', e);
    return [];
  }
}
