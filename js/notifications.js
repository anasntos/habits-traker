// notifications.js
export async function requestNotificationPermission(){
  if(!('Notification' in window)) return false;
  const perm = await Notification.requestPermission();
  return perm === 'granted';
}

export function scheduleNotification(title, body, timestamp){
  // timestamp = ms (Date.now() + ...)
  const delay = timestamp - Date.now();
  if(delay <= 0) {
    new Notification(title, { body });
    return;
  }
  // for web-only approach we use setTimeout (works only if tab open)
  setTimeout(()=> new Notification(title, { body }), delay);
}
