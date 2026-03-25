/**
 * 음악 카드 화면 렌더링.
 *
 * 이 파일은 주어진 노래 목록 데이터를 바탕으로 `.music-grid` 안에 카드를 그려주는 역할을 합니다.
 * 데이터를 직접 가져오거나 상태를 관리하지 않고, 오직 '화면에 그리는 일'에만 집중합니다.
 */
export function renderMusicCards(containerEl, songs) {
  /**
   * @param {Element|null} containerEl - 음악 카드가 담길 그리드 DOM 요소
   * @param {{title:string, youtubeEmbedUrl:string}[]} songs - 화면에 보여줄 노래들의 배열
   */
  if (!containerEl) return;

  // `map` 함수를 사용해 각 노래 데이터를 HTML 코드로 변환하고,
  // `join("")`을 통해 하나의 커다란 문자열로 합쳐서 한 번에 화면에 넣습니다.
  // 이렇게 하면 화면 업데이트 성능을 더 좋게 만들 수 있습니다.
  containerEl.innerHTML = songs
    .map(
      (song) => `
        <div class="music-card">
          <!-- 유튜브 영상을 보여주기 위해 iframe 태그를 사용합니다. -->
          <iframe src="${song.youtubeEmbedUrl}" allowfullscreen></iframe>
          <!-- 노래 제목을 표시합니다. -->
          <div class="music-title">${song.title}</div>
        </div>
      `
    )
    .join("");
}
