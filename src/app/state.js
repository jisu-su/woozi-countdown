const appState = {
  currentPageId: "timer-page",
};

export function getCurrentPageId() {
  return appState.currentPageId;
}

export function setCurrentPageId(pageId) {
  appState.currentPageId = pageId;
}
