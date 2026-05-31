const MEAL_FIELDS = [
  ["brst", "조식"],
  ["lunc", "중식"],
  ["dinr", "석식"],
  ["adspcfd", "추가"],
];

function normalizeDate(rawDate) {
  return String(rawDate || "")
    .replace(/\(.*?\)/g, "")
    .trim();
}

function textFrom(row, selector) {
  return row.querySelector(selector)?.textContent?.trim() || "";
}

function getRowsFromXml(xmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, "text/xml");
  const parseError = doc.querySelector("parsererror");

  if (parseError) {
    throw new Error("Failed to parse meals XML");
  }

  return Array.from(doc.querySelectorAll("row"));
}

export function toMealsByDate(xmlString) {
  if (!xmlString) return {};

  const mealsByDate = {};

  getRowsFromXml(xmlString).forEach((row) => {
    const dateKey = normalizeDate(textFrom(row, "dates"));
    if (!dateKey) return;

    if (!mealsByDate[dateKey]) {
      mealsByDate[dateKey] = {
        조식: [],
        중식: [],
        석식: [],
        추가: [],
      };
    }

    MEAL_FIELDS.forEach(([fieldName, bucketName]) => {
      const menu = textFrom(row, fieldName);
      if (menu) mealsByDate[dateKey][bucketName].push(menu);
    });
  });

  return Object.fromEntries(
    Object.entries(mealsByDate).map(([date, meals]) => {
      const menu = MEAL_FIELDS.map(([, bucketName]) => {
        const items = meals[bucketName];
        if (!items.length) return "";
        return `${bucketName}: ${items.join(" · ")}`;
      })
        .filter(Boolean)
        .join(", ");

      return [date, { menu }];
    }),
  );
}
