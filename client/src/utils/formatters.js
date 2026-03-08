export const formatINR = (amount, decimals = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

export const formatNum = (n) => new Intl.NumberFormat("en-IN").format(n);

export const pnlColor = (val) => (val >= 0 ? "#10b981" : "#ef4444");
export const pnlPrefix = (val) => (val >= 0 ? "+" : "");

export const stripNS = (symbol) => symbol.replace(".NS", "");
