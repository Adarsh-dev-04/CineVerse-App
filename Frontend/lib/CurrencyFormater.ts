export const formatCurrencyCompact = (
  value: number,
  currency = "$"
): string => {
  if (value >= 1_000_000_000) {
    return `${currency}${(value / 1_000_000_000).toFixed(1).replace(".0", "")}B`;
  }

  if (value >= 1_000_000) {
    return `${currency}${(value / 1_000_000).toFixed(1).replace(".0", "")}M`;
  }

  if (value >= 1_000) {
    return `${currency}${(value / 1_000).toFixed(1).replace(".0", "")}K`;
  }

  return `${currency}${value.toLocaleString()}`;
};