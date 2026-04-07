export function getDropWindow() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed, June = 5

  let windowStart: Date;
  let windowEnd: Date;

  if (currentMonth >= 5) {
    // June or later: window is June this year → June 30 next year
    windowStart = new Date(currentYear, 5, 1);
    windowEnd = new Date(currentYear + 1, 5, 30);
  } else {
    // Before June: window is June last year → June 30 this year
    windowStart = new Date(currentYear - 1, 5, 1);
    windowEnd = new Date(currentYear, 5, 30);
  }

  return {
    windowStart,
    windowEnd,
    startYear: windowStart.getFullYear(),
    endYear: windowEnd.getFullYear(),
    daysRemaining: Math.floor(
      (windowEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    ),
  };
}
