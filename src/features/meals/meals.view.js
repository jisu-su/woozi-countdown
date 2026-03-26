/**
 * 식단 달력 화면 렌더링.
 *
 * 이 파일은 오직 DOM(화면 요소)을 그리는 역할만 담당합니다.
 * 데이터를 서버에서 직접 가져오거나 앱의 상태를 직접 수정하지 않습니다.
 *
 * 입력받는 데이터 (입력 계약):
 * - baseDate: '일요일'을 계산하기 위한 기준 날짜 (Date 객체)
 * - mealDataByDate: { "YYYY-MM-DD": { menu: "..." } } 형태의 식단 정보
 */
export function renderWeeklyCalendar({ baseDate, mealDataByDate }) {
  // 화면을 그릴 컨테이너와 제목 요소를 찾습니다.
  const container = document.getElementById("weekly-calendar");
  const title = document.getElementById("week-title");
  if (!container || !title) return; // 요소가 없으면 그냥 종료합니다.

  // 기준 날짜가 속한 주의 일요일(Sunday)을 계산합니다.
  const sunday = new Date(baseDate);
  // getDay()는 요일을 0(일) ~ 6(토)으로 반환하므로, 현재 날짜에서 요일 값을 빼면 일요일이 됩니다.
  sunday.setDate(baseDate.getDate() - baseDate.getDay());

  // 제목에 현재 기준이 되는 연도와 월을 표시합니다.
  title.innerText = `${baseDate.getFullYear()}년 ${baseDate.getMonth() + 1}월 식단표`;

  let html = "";
  // 일요일부터 토요일까지 7일간 반복하며 HTML을 만듭니다.
  for (let i = 0; i < 7; i += 1) {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);
    // YYYY-MM-DD 형태의 날짜 문자열을 생성하여 데이터 매칭에 사용합니다.
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    let mealHtml = '<div class="meal-list-container">';
    // 만약 해당 날짜의 식단 데이터가 있다면 렌더링합니다.
    if (mealDataByDate[dateStr]) {
      // 메뉴를 쉼표(,)나 슬래시(/) 기준으로 나누어 개별 라인으로 만듭니다.
      const menuItems = mealDataByDate[dateStr].menu.split(/[,/]/);
      menuItems.forEach((item) => {
        // 공백을 제거하고 내용이 있을 때만 추가합니다.
        if (item.trim()) mealHtml += `<div class="meal-line">${item.trim()}</div>`;
      });
    } else {
      // 데이터가 없는 경우의 표시입니다.
      mealHtml += '<div class="meal-line meal-line--muted">정보 없음</div>';
    }
    mealHtml += "</div>";

    // 시각적 효과: 현재 기준 달(Month)에 속하지 않는 날짜는 흐릿하게 보이게 클래스를 지정합니다.
    const isSameMonth = date.getMonth() === baseDate.getMonth() && date.getFullYear() === baseDate.getFullYear();
    const dayClass = isSameMonth ? "calendar-day calendar-day--in-month" : "calendar-day calendar-day--out-month";

    html += `
      <div class="${dayClass}">
        <div class="calendar-day-title">${date.getDate()}일</div>
        ${mealHtml}
      </div>
    `;
  }

  // 생성된 HTML을 컨테이너에 한꺼번에 넣어서 화면을 업데이트합니다.
  container.innerHTML = html;
}
