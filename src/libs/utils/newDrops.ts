// Returns the expiry date for a jersey's "new" status
export function getNewDropExpiry(registeredDate: Date): Date {
  const year = registeredDate.getFullYear();
  const nextYear = year + 1;
  return new Date(nextYear, 5, 30); // June 30 of next year (month is 0-indexed)
}

// Returns true if the jersey is still "new"
export function isNewDrop(registeredDate: Date): boolean {
  return new Date() < getNewDropExpiry(registeredDate);
}

// Returns days remaining as a new drop
export function newDropDaysLeft(registeredDate: Date): number {
  const expiry = getNewDropExpiry(registeredDate);
  return Math.max(0, Math.floor((expiry.getTime() - Date.now()) / 86400000));
}

// Returns the current football season string e.g. "2025-26"
// Football season runs August to July:
//   August or later  → currentYear-(currentYear+1)
//   Before August    → (currentYear-1)-currentYear
export function getCurrentSeason(): string {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed
  const year = now.getFullYear();
  if (month >= 7) {
    return `${year}-${String(year + 1).slice(-2)}`;
  } else {
    return `${year - 1}-${String(year).slice(-2)}`;
  }
}

// Returns true if the jersey's uniformSeason matches the current season
export function isCurrentSeason(uniformSeason: string | null | undefined): boolean {
  if (!uniformSeason) return false;
  return uniformSeason === getCurrentSeason();
}
