// motivation.js
const QUOTABLE_URL = 'https://api.quotable.io/random';

export async function fetchQuoteOfDay(){
  try{
    const res = await fetch(QUOTABLE_URL);
    if(!res.ok) throw new Error('Network error');
    const json = await res.json();
    return { text: json.content, author: json.author };
  }catch(e){
    console.error('Quote fetch failed', e);
    // fallback quote
    return { text: 'Keep going — small progress is still progress.', author: 'Habit Hopper' };
  }
}
