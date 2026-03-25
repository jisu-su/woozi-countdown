import { SOLO_SONGS } from "./music.data.js";
import { renderMusicCards } from "./music.view.js";

/**
 * Music controller.
 *
 * Responsibilities:
 * - Find the music grid DOM node
 * - Provide song data to the view renderer
 */
export function drawMusic() {
  const musicGridEl = document.querySelector("#music-page .music-grid");
  renderMusicCards(musicGridEl, SOLO_SONGS);
}
