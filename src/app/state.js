/**
 * Global UI state.
 *
 * Right now the only state we keep is the currently active page id.
 * If you add more state later (e.g., current week offset, loaded meals),
 * consider storing only primitives / serializable objects here.
 */
const appState = {
  currentPageId: "timer-page",
};

/**
 * @returns {string} current page id (e.g. "timer-page", "meal-page").
 */
export function getCurrentPageId() {
  return appState.currentPageId;
}

/**
 * Update current page id.
 * @param {string} pageId
 */
export function setCurrentPageId(pageId) {
  appState.currentPageId = pageId;
}
