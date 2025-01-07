/**
 * Generates an array of numbers within a specified range
 * @param start - The start number of the range (inclusive)
 * @param end - The end number of the range (exclusive). If omitted, start becomes end and start is set to 0
 * @returns An array of numbers from start to end-1
 */
export const range = (start: number, end?: number): number[] => {
  if (typeof end === "undefined") {
    end = start;
    start = 0;
  }
  
  // Ensure we're working with valid numbers
  start = Math.max(0, Math.floor(start));
  end = Math.floor(end);
  
  // Create array with exact size needed
  const size = Math.max(0, end - start);
  return Array.from({ length: size }, (_, i) => start + i);
};
