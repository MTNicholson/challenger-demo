export function formatNumber(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

export function formatCoins(value: number) {
  const absoluteValue = Math.abs(value);
  const lastTwoDigits = absoluteValue % 100;
  const lastDigit = absoluteValue % 10;
  const unit =
    lastTwoDigits >= 11 && lastTwoDigits <= 14
      ? "баллов"
      : lastDigit === 1
        ? "балл"
        : lastDigit >= 2 && lastDigit <= 4
          ? "балла"
          : "баллов";

  return `${formatNumber(value)} ${unit}`;
}

export function formatPercent(value: number) {
  return `${formatNumber(value)}%`;
}
