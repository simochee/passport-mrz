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