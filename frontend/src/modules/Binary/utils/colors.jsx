export const calculateZeroColor = (colorSliderValue) => {
  // Map 0-100 to 180-300 degrees (cyan to pink in HSL)
  const hue = 180 + (colorSliderValue * 1.2);
  return `hsl(${hue}, 70%, 60%)`;
};
