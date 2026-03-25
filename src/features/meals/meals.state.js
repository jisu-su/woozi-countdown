const mealsState = {
  currentBaseDate: new Date(),
};

export function getCurrentBaseDate() {
  return mealsState.currentBaseDate;
}

export function setCurrentBaseDate(nextDate) {
  mealsState.currentBaseDate = nextDate;
}
