// -----------------------------------------------------
// ASK PERMISSION FOR NOTIFICATIONS
// -----------------------------------------------------
export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.warn("Este navegador não suporta notificações.");
    return false;
  }

  let permission = Notification.permission;

  if (permission === "default") {
    permission = await Notification.requestPermission();
  }

  return permission === "granted";
}

// -----------------------------------------------------
// SEND NOTIFICATION
// -----------------------------------------------------
export function sendBrowserNotification(title, options = {}) {
  if (!("Notification" in window)) return;

  if (Notification.permission !== "granted") return;

  new Notification(title, {
    body: options.body || "",
    icon: options.icon || "/assets/icons/notification.png",
    badge: options.badge || "/assets/icons/badge.png",
    vibrate: options.vibrate || [200, 100, 200],
    timestamp: Date.now()
  });
}

// -----------------------------------------------------
// SCHEDULE A NOTIFICATION FOR LATER
// (Local scheduling - triggers even if tab is in background)
// -----------------------------------------------------
export function scheduleNotification(delayMs, title, options = {}) {
  setTimeout(() => {
    sendBrowserNotification(title, options);
  }, delayMs);
}
