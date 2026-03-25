export function renderMusicCards(containerEl, songs) {
  if (!containerEl) return;

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
