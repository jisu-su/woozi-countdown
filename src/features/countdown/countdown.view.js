export function renderCountdown(text) {
  const clockEl = document.getElementById("clock");
  if (!clockEl) return;
  clockEl.innerHTML = text;
}
