export const formatName = (surname: string, givenNames: string): string => {
  const cleanSurname = surname.toUpperCase().replace(/[^A-Z]/g, '');
  const cleanGivenNames = givenNames.toUpperCase().replace(/[^A-Z\s]/g, '').replace(/\s+/g, '<');
  return `${cleanSurname}<<${cleanGivenNames}`.padEnd(39, '<').substring(0, 39);
};

export const formatDate = (date: string): string => {
  const cleaned = date.replace(/\D/g, '');
  if (cleaned.length === 8) {
    return cleaned.substring(2);
  }
  return '000000';
};

export const formatField = (value: string, length: number, filler = '<'): string => {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '').padEnd(length, filler).substring(0, length);
};