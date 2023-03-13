const priceDisplay = (price: string | number) => {
  if (price === 0) return 0;
  else if (!price) {
    return "";
  }
  return price.toLocaleString("en-US");
};

export default priceDisplay;

export const formatValuePrice = (price: string | null) => {
  if (!price) {
    return null;
  }
  return `${price}`.replaceAll(",", "").replaceAll(".", "");
};

export const formatPercent = (percent: string) => {
  return parseFloat(percent.replace(",", "."));
};

export const formatPrice = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(?!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1,");
};
