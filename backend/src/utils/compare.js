export const isSameObject = (original, updates) => {
  for (const key of Object.keys(updates)) {
    const newValue = updates[key];
    if (newValue === undefined) continue;

    const oldValue = original[key];

    if (oldValue instanceof Date || newValue instanceof Date) {
      const oldTime = new Date(oldValue).getTime();
      const newTime = new Date(newValue).getTime();
      if (oldTime !== newTime) return false;
      continue;
    }

    if (String(newValue) !== String(oldValue)) {
      return false;
    }
  }

  return true;
};
