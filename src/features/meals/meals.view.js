/**
 * Meals calendar view.
 *
 * This file only renders DOM.
 * It does not fetch data and does not mutate application state.
 *
 * Input contract:
 * - baseDate: a Date object used to compute "Sunday" start
 * - mealDataByDate:
 *   { "YYYY-MM-DD": { menu: "..." } }
 */
export function renderWeeklyCalendar({ baseDate, mealDataByDate }) {
  // Locate DOM nodes (safe: if not found, just exit).
  const container = document.getElementById("weekly-calendar");
  const title = document.getElementById("week-title");
  if (!container || !title) return;

  // Find Sunday of the week containing `baseDate`.
  const sunday = new Date(baseDate);
  sunday.setDate(baseDate.getDate() - baseDate.getDay());
  title.innerText = `${baseDate.getFullYear()}년 ${baseDate.getMonth() + 1}월 식단표`;

  let html = "";
  for (let i = 0; i < 7; i += 1) {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    // Each day renders:
    // - a title like "1일"
    // - a menu list split by comma or "/" separators.
    let mealHtml = '<div class="meal-list-container">';
    if (mealDataByDate[dateStr]) {
      const menuItems = mealDataByDate[dateStr].menu.split(/[,/]/);
      menuItems.forEach((item) => {
        if (item.trim()) mealHtml += `<div class="meal-line">${item.trim()}</div>`;
      });
    } else {
      mealHtml += '<div class="meal-line meal-line--muted">정보 없음</div>';
    }
    mealHtml += "</div>";

    // Visual hint: days outside the locked month are dimmed.
    const isSameMonth = date.getMonth() === baseDate.getMonth() && date.getFullYear() === baseDate.getFullYear();
    const dayClass = isSameMonth ? "calendar-day calendar-day--in-month" : "calendar-day calendar-day--out-month";
    html += `
      <div class="${dayClass}">
        <div class="calendar-day-title">${date.getDate()}일</div>
        ${mealHtml}
      </div>
    `;
  }

  // Apply HTML in one shot.
  container.innerHTML = html;
}
