/**
 * Music cards view.
 *
 * This file renders the list of songs into `.music-grid`.
 * It does not fetch data and does not manage state.
 */
export function renderMusicCards(containerEl, songs) {
  /**
   * @param {Element|null} containerEl - DOM node for grid
   * @param {{title:string, youtubeEmbedUrl:string}[]} songs
   */
  if (!containerEl) return;

  // Replace content in one shot.
  containerEl.innerHTML = songs
    .map(
      (song) => `
        <div class="music-card">
          <iframe src="${song.youtubeEmbedUrl}" allowfullscreen></iframe>
          <div class="music-title">${song.title}</div>
        </div>
      `
    )
    .join("");
}
