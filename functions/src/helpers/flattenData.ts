export function flattenData(obj: { [field: string]: boolean | number | string }) {
  const flattened: typeof obj = {};

  for (const key in obj) {
    const value = obj[key];

    if (typeof value === 'object') {
      Object.assign(flattened, flattenData(value));
    } else {
      flattened[key] = value;
    }
  }

  return flattened;
};

