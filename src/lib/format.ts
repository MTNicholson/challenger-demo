export function formatNumber(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

export function formatCoins(value: number) {
  return `${formatNumber(value)} монет`;
}

export function formatPercent(value: number) {
  return `${formatNumber(value)}%`;
}
