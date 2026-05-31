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
      mealHtml += '<div class="meal-line meal-line--muted">정보 없음</div>';
    }
    mealHtml += "</div>";

    const isSameMonth = date.getMonth() === baseDate.getMonth() && date.getFullYear() === baseDate.getFullYear();
    const dayClass = isSameMonth ? "calendar-day calendar-day--in-month" : "calendar-day calendar-day--out-month";
    html += `
      <div class="${dayClass}">
        <div class="calendar-day-title">${date.getDate()}일</div>
        ${mealHtml}
      </div>
    `;
  }

  container.innerHTML = html;
}

export function renderMealsStatus(message = "") {
  const header = document.querySelector("#meal-page .meal-header");
  if (!header) return;

  let status = document.getElementById("meal-status");
  if (!status) {
    status = document.createElement("p");
    status.id = "meal-status";
    status.className = "meal-status";
    header.insertAdjacentElement("afterend", status);
  }

  status.textContent = message;
  status.hidden = !message;
}
