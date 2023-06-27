export const isObject = (value: unknown):boolean => typeof value === "object" && value !== null;

export const extend = Object.assign