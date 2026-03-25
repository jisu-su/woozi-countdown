const mealData = {
    // 1주차
    "2026-02-01": { menu: " 낙지삼겹새우볶음, 호박감자국, 두부구이, 깍두기" },
    "2026-02-02": { menu: " 오리불고기, 순두부찌개, 감자채볶음, 배추김치" },
    "2026-02-03": { menu: " 김치순살닭볶음탕, 콩나물국, 돈육계란장조림" },
    "2026-02-04": { menu: " 소고기비빔밥, 된장찌개, 약고추장, 수제비" },
    "2026-02-05": { menu: " 백순대볶음, 고추장찌개, 해물부추전, 깍두기" },
    "2026-02-06": { menu: " 가자미순살구이, 순대국, 주꾸미떡볶음, 배추김치" },
    "2026-02-07": { menu: " 조식: 불고기버거 / 중식: 사골곰탕, 삼겹살구이" },
    // 2주차
    "2026-02-08": { menu: " 콩나물불고기, 사골우거지국, 야채튀김, 배추김치" },
    "2026-02-09": { menu: " 들깨돼지국밥, 마파두부, 오징어젓갈볶음" },
    "2026-02-10": { menu: " 삼치순살구이, 유산슬덮밥, 미역국, 짜장라면" },
    "2026-02-11": { menu: " 돼지불백, 나가사끼짬뽕국, 감자만두튀김" },
    "2026-02-12": { menu: " 낙지삼겹새우볶음, 북어국, 에그카츠, 배추김치" },
    "2026-02-13": { menu: " 비엔나데리야끼볶음, 육개장, 볼케이노닭조림" },
    "2026-02-14": { menu: " 조식: 핫도그 / 중식: 소떡소떡, 제육덮밥, 우동" },
    // 3주차 (설날 포함)
    "2026-02-15": { menu: " 들깨돼지불고기, 감자탕, 계란찜, 깍두기" },
    "2026-02-16": { menu: " 순살안동찜닭, 어묵국, 족발&모둠쌈, 무생채" },
    "2026-02-17": { menu: " [설날] 소고기떡국, 모듬전, 갈비찜, 잡채, 식혜" },
    "2026-02-18": { menu: " 동파육, 미역미소국, 누들떡볶이, 만두강정" },
    "2026-02-19": { menu: " 그린빈삼겹살볶음, 짬뽕국, 수제치킨, 콘샐러드" },
    "2026-02-20": { menu: " 간장소불고기, 만둣국, 타코야끼, 오이무침" },
    "2026-02-21": { menu: " 조식: 햄치즈버거 / 중식: 바베큐닭살조림, 김치찌개" },
    // 4주차
    "2026-02-22": { menu: " 사골순대국, 간장돼지불고기, 부추겉절이" },
    "2026-02-23": { menu: " 갈치순살구이, 새우튀김덮밥, 팽이버섯장국" },
    "2026-02-24": { menu: " 훈제삼겹살, 김치찌개, 불고기크로켓, 상추쌈" },
    "2026-02-25": { menu: " 주꾸미치즈떡볶음, 닭조림, 근대국, 깍두기" },
    "2026-02-26": { menu: " 돼지고기청경채볶음, 갈비탕, 오징어무침" },
    "2026-02-27": { menu: " 불향삼겹오징어볶음, 훈제오리, 순두부국" },
    "2026-02-28": { menu: " 조식: 핫도그 / 중식: 치킨스테이크, 소고기덮밥" }
};


// 기존 고정 날짜 대신 현재 접속 시간(오늘)을 가져옵니다.
let currentBaseDate = new Date();

function changeWeek(direction) {
    let newDate = new Date(currentBaseDate);
    newDate.setDate(newDate.getDate() + (direction * 7));

    // 2026년 2월(Month index 1)을 벗어나지 못하게 함
    if (newDate.getFullYear() === 2026 && newDate.getMonth() === 1) {
        currentBaseDate = newDate;
        renderWeeklyCalendar();
    } else {
        alert("2월 식단표 범위 내에서만 이동 가능합니다!");
    }
}

function renderWeeklyCalendar() {
    const container = document.getElementById('weekly-calendar');
    const title = document.getElementById('week-title');
    if(!container) return;

    const sunday = new Date(currentBaseDate);
    sunday.setDate(currentBaseDate.getDate() - currentBaseDate.getDay());
    title.innerText = `2026년 2월 식단표`;

    let html = '';
    for (let i = 0; i < 7; i++) {
        const date = new Date(sunday);
        date.setDate(sunday.getDate() + i);
        const dayNum = date.getDate();
        const dateStr = `2026-02-${dayNum.toString().padStart(2, '0')}`;
        const isFeb = date.getMonth() === 1;
        
        let mealHtml = '<div class="meal-list-container">';
        if (isFeb && mealData[dateStr]) {
            // 쉼표, 슬래시, 또는 "조식:", "중식:" 등의 키워드 기준으로 줄바꿈 시도
            const menuItems = mealData[dateStr].menu.split(/[,/]/);
            menuItems.forEach(item => {
                if(item.trim()) mealHtml += `<div class="meal-line">${item.trim()}</div>`;
            });
        } else {
            mealHtml += `<div class="meal-line" style="color:#ccc">정보 없음</div>`;
        }
        mealHtml += '</div>';

        // calendar-day가 가로로 나열되도록 weekly-grid 안에 들어가는 구조여야 합니다.
        html += `
            <div class="calendar-day" style="background: white; border-radius: 15px; padding: 10px; min-height: 200px; opacity: ${isFeb ? 1 : 0.2}">
                <div style="font-weight:bold; color:var(--serenity); margin-bottom:5px;">${dayNum}일</div>
                ${mealHtml}
            </div>
        `;
    }
    container.innerHTML = html;
}

// 초기 로드 시 실행
window.addEventListener('load', renderWeeklyCalendar);