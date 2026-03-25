import { SOLO_SONGS } from "./music.data.js";
import { renderMusicCards } from "./music.view.js";

/**
 * 음악 컨트롤러 (Music Controller).
 *
 * 이 모듈은 음악 기능의 '두뇌' 역할을 합니다.
 * 화면을 구성하는 DOM 요소를 찾고, 미리 정의된 노래 목록(`SOLO_SONGS`)을
 * 화면을 그려주는 함수(`renderMusicCards`)에 전달합니다.
 *
 * 주요 역할:
 * - 음악 그리드(`.music-grid`) DOM 노드 탐색
 * - 뷰 렌더러에 노래 데이터를 공급
 */
export function drawMusic() {
  // 음악이 표시될 컨테이너 요소를 찾습니다.
  const musicGridEl = document.querySelector("#music-page .music-grid");

  // 데이터와 컨테이너를 전달하여 화면에 노래 카드들을 그립니다.
  renderMusicCards(musicGridEl, SOLO_SONGS);
}
