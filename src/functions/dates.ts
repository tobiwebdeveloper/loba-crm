export function isToday(date: string): boolean {
  const target = new Date(date);
  const now = new Date();

  return (
    target.getFullYear() === now.getFullYear() &&
    target.getMonth() === now.getMonth() &&
    target.getDate() === now.getDate()
  );
}

export function isOverdue(date: string): boolean {
  return new Date(date).getTime() < Date.now();
}

export function isUpcoming(date: string): boolean {
  return new Date(date).getTime() >= Date.now();
}
