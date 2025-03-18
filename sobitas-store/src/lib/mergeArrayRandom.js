export const mergeAndShuffle = (arr1, arr2) => {
  const merged = [...arr1, ...arr2];

  const shuffled = [...merged];

  // Fisher-Yates shuffle algorithm
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};
