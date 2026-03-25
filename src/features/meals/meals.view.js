export function renderWeeklyCalendar({ baseDate, mealDataByDate }) {
  const container = document.getElementById("weekly-calendar");
  const title = document.getElementById("week-title");
  if (!container || !title) return;

  const sunday = new Date(baseDate);
  sunday.setDate(baseDate.getDate() - baseDate.getDay());
  title.innerText = `${baseDate.getFullYear()}년 ${baseDate.getMonth() + 1}월 식단표`;

  let html = "";
  for (let i = 0; i < 7; i += 1) {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    let mealHtml = '<div class="meal-list-container">';
    if (mealDataByDate[dateStr]) {
      const menuItems = mealDataByDate[dateStr].menu.split(/[,/]/);
      menuItems.forEach((item) => {
        if (item.trim()) mealHtml += `<div class="meal-line">${item.trim()}</div>`;
      });
    } else {
      mealHtml += '<div class="meal-line" style="color:#ccc">정보 없음</div>';
    }
    mealHtml += "</div>";

    const isSameMonth = date.getMonth() === baseDate.getMonth() && date.getFullYear() === baseDate.getFullYear();
    html += `
      <div class="calendar-day" style="background: white; border-radius: 15px; padding: 10px; min-height: 200px; opacity: ${isSameMonth ? 1 : 0.2};">
        <div style="font-weight:bold; color:var(--serenity); margin-bottom:5px;">${date.getDate()}일</div>
        ${mealHtml}
      </div>
    `;
  }

  container.innerHTML = html;
}
