export const formatPrice = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(?!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1,");
};
