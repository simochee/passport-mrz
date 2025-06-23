/**
 * Calculates the check digit for MRZ fields according to ICAO 9303 standard.
 * 
 * Uses the standard weighting pattern [7, 3, 1] and maps characters as follows:
 * - Digits '0'-'9' map to values 0-9
 * - Letters 'A'-'Z' map to values 10-35
 * - All other characters map to 0
 * 
 * @param str - The string to calculate the check digit for
 * @returns The calculated check digit as a single character string
 */
export const calculateCheckDigit = (str: string): string => {
  const weights = [7, 3, 1];
  let sum = 0;
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    let value: number;
    
    if (char >= '0' && char <= '9') {
      value = parseInt(char, 10);
    } else if (char >= 'A' && char <= 'Z') {
      value = char.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
    } else {
      value = 0;
    }
    
    sum += value * weights[i % 3];
  }
  
  return (sum % 10).toString();
};