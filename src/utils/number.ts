export const isNumber = (value: any): boolean =>
  typeof value === "number" && Number.isFinite(value);
