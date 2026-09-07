/**
 * 다이아몬드 해금
 * 파일 경로: src/features/diamond/diamond.js
 *
 * 허브(seventeen-countdown)의 packages/shared/diamondState.js 와
 * diamondUnlock.js 에서 필요한 부분만 옮겨왔다. 두 저장소가 npm 워크스페이스로
 * 연결돼 있지 않아 파일 복제 외에 방법이 없다. SVG 좌표나 색을 고칠 일이
 * 생기면 허브 쪽도 함께 고쳐야 한다.
 *
 * 허브와 다른 점: 여기서는 그룹 전체 진행 상황을 그리지 않는다.
 * 우지 사이트는 다른 멤버의 전역일을 알지 못하고, 알게 하려면 멤버 명단을
 * 복제해야 해서 사실이 두 곳으로 갈라진다. 그래서 이 연출은 "우지의 조각이
 * 더해지는 순간"만 보여주고, 그룹의 진행 상황은 허브가 맡는다.
 */

/** 우지가 배정받은 셀 번호. 허브에서 전역일 순서로 계산된 값이다. */
const WOOZI_CELL = 7;

/** 멤버와 무관하게 항상 켜져 있는 칸. */
const DEFAULT_ACTIVE_CELLS = [1, 2, 3, 4];

/** 이 브라우저에서 해금 연출을 이미 봤는지 기록하는 키. */
const UNLOCK_STORAGE_KEY = 'woozi_diamond_unlocked';

const DIAMOND_CELLS = [
    [1, '110,50 40,150 180,150'],
    [2, '110,50 250,50 180,150'],
    [3, '250,50 180,150 320,150'],
    [4, '250,50 390,50 320,150'],
    [5, '390,50 320,150 460,150'],
    [6, '40,150 110,250 180,150'],
    [7, '180,150 110,250 250,250'],
    [8, '180,150 250,250 320,150'],
    [9, '320,150 250,250 390,250'],
    [10, '320,150 390,250 460,150'],
    [11, '110,250 180,350 250,250'],
    [12, '250,250 180,350 320,350'],
    [13, '250,250 320,350 390,250'],
    [14, '180,350 250,450 320,350']
];

let diamondInstanceId = 0;

function appendStop(gradient, offset, color, opacity) {
    const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');

    stop.setAttribute('offset', offset);
    stop.setAttribute('stop-color', color);
    stop.setAttribute('stop-opacity', opacity);
    gradient.append(stop);
}

/** 다이아몬드 SVG를 만든다. 셀은 모두 꺼진 상태로 나온다. */
export function createDiamondSvg() {
    const namespace = 'http://www.w3.org/2000/svg';
    const uniqueId = `diamond-${diamondInstanceId += 1}`;
    const clearLineId = `${uniqueId}-clear-line`;
    const activeFillId = `${uniqueId}-active-fill`;
    const svg = document.createElementNS(namespace, 'svg');
    const defs = document.createElementNS(namespace, 'defs');
    const clearLine = document.createElementNS(namespace, 'linearGradient');
    const activeFill = document.createElementNS(namespace, 'linearGradient');
    const group = document.createElementNS(namespace, 'g');

    svg.setAttribute('viewBox', '0 0 500 500');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'WOOZI diamond unlock');
    svg.style.setProperty('--diamond-clear-line', `url(#${clearLineId})`);
    svg.style.setProperty('--diamond-active-fill', `url(#${activeFillId})`);

    clearLine.setAttribute('id', clearLineId);
    clearLine.setAttribute('x1', '0%');
    clearLine.setAttribute('y1', '0%');
    clearLine.setAttribute('x2', '100%');
    clearLine.setAttribute('y2', '100%');
    appendStop(clearLine, '0%', '#FFFFFF', '1');
    appendStop(clearLine, '100%', '#D9F1FF', '1');

    activeFill.setAttribute('id', activeFillId);
    activeFill.setAttribute('x1', '0%');
    activeFill.setAttribute('y1', '100%');
    activeFill.setAttribute('x2', '100%');
    activeFill.setAttribute('y2', '0%');
    appendStop(activeFill, '0%', '#B9E7FF', '0.9');
    appendStop(activeFill, '55%', '#6FB8FF', '0.9');
    appendStop(activeFill, '100%', '#2F6FE4', '0.92');

    defs.append(clearLine, activeFill);
    group.classList.add('diamond-cells');

    DIAMOND_CELLS.forEach(([cellNumber, points]) => {
        const polygon = document.createElementNS(namespace, 'polygon');

        polygon.setAttribute('data-cell', String(cellNumber));
        polygon.setAttribute('points', points);
        polygon.classList.add('diamond-cell');
        group.append(polygon);
    });

    svg.append(defs, group);
    return svg;
}

function isUnlockSeen() {
    try {
        return localStorage.getItem(UNLOCK_STORAGE_KEY) === 'true';
    } catch {
        // 시크릿 모드 등에서 localStorage를 못 쓰는 경우. 연출을 한 번 더
        // 보는 것뿐이라 조용히 넘어간다.
        return false;
    }
}

function markUnlockSeen() {
    try {
        localStorage.setItem(UNLOCK_STORAGE_KEY, 'true');
    } catch {
        /* 기록에 실패해도 연출과 이동은 정상 동작한다. */
    }
}

/** 전체화면 해금 연출을 한 번 재생한다. */
export function playDiamondUnlockAnimation() {
    const overlay = document.createElement('div');
    const diamond = createDiamondSvg();

    overlay.className = 'diamond-unlock-overlay';
    diamond.classList.add('diamond-unlock-svg');
    overlay.append(diamond);
    document.body.append(overlay);

    // 기본 칸을 먼저 켜고, 우지의 칸은 한 박자 늦게 켜서 "더해지는" 느낌을 준다.
    DEFAULT_ACTIVE_CELLS.forEach(cell => {
        diamond.querySelector(`[data-cell="${cell}"]`)?.classList.add('active');
    });

    window.setTimeout(() => {
        diamond.querySelector(`[data-cell="${WOOZI_CELL}"]`)?.classList.add('active', 'is-new');
    }, 700);

    window.setTimeout(() => overlay.classList.add('is-leaving'), 2400);
    window.setTimeout(() => overlay.remove(), 3200);
}

/**
 * 허브로 돌아가는 링크에 ?unlock=woozi 를 붙인다.
 *
 * 해금 기록은 도메인마다 따로 쌓여서 이 사이트에서 저장해도 허브는 알 수
 * 없다. 돌아가는 링크에 파라미터를 실어 보내면 허브가 받아서 자기 쪽에
 * 기록한다. 허브는 이미 아는 값이면 조용히 무시한다.
 */
function markBackLink() {
    const backButton = document.querySelector('.back-button');

    if (!backButton) {
        return;
    }

    const url = new URL(backButton.href, window.location.href);

    url.searchParams.set('unlock', 'woozi');
    backButton.href = url.toString();
}

/**
 * 전역일이 지났으면 화면을 눌러 해금할 수 있게 준비한다.
 *
 * @param {number} targetTime 전역 시각 타임스탬프
 * @param {Object} [options]
 * @param {Element} [options.container] 클릭을 받을 요소. 기본은 #timer-page.
 * @returns {boolean} 준비되었으면 true
 */
export function setupDiamondUnlock(targetTime, options = {}) {
    const { container = document.getElementById('timer-page') } = options;

    if (!container || Date.now() < targetTime) {
        return false;
    }

    container.classList.add('is-unlockable');

    // 이미 본 사람에게 연출을 다시 보여주지는 않는다. 다만 허브로 돌아갈 때
    // 파라미터는 계속 실어 보낸다. 허브 쪽 기록이 지워졌을 수도 있어서다.
    if (isUnlockSeen()) {
        container.classList.add('is-unlocked');
        markBackLink();
        return true;
    }

    function handleClick(event) {
        // 소통창이 열려 있을 때 바깥을 누르면 창을 닫는 동작이 먼저다.
        // 그 클릭이 뒤에 깔린 타이머 화면까지 닿아 해금이 잘못 발동하지
        // 않도록 막는다.
        if (isOverlayPageOpen()) {
            return;
        }

        // 소통창 안(입력창, 등록 버튼 등)에서 올라온 클릭도 해금이 아니다.
        if (event.target.closest('.page:not(#timer-page)')) {
            return;
        }

        container.removeEventListener('click', handleClick);
        container.classList.add('is-unlocked');
        markUnlockSeen();
        markBackLink();
        playDiamondUnlockAnimation();
    }

    container.addEventListener('click', handleClick);

    return true;
}

/** 타이머 말고 다른 페이지(소통창)가 열려 있는지. */
function isOverlayPageOpen() {
    return Boolean(document.querySelector('.page.active:not(#timer-page)'));
}
