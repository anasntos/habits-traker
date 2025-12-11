// storage.js
export function saveHabitsToLocalStorage(habits){
  try{
    localStorage.setItem('habits', JSON.stringify(habits));
  }catch(e){
    console.error('Storage save failed', e);
  }
}

export function loadHabitsFromLocalStorage(){
  try{
    const raw = localStorage.getItem('habits');
    return raw ? JSON.parse(raw) : [];
  }catch(e){
    console.error('Storage load failed', e);
    return [];
  }
}
