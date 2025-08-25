// utils/formatDate.ts
export function formatDate(timestamp: number | string): string {
  const date = new Date(timestamp);
  return date.toLocaleString(); // можно кастомизировать формат
}
