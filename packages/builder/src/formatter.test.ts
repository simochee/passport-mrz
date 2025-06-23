import { describe, it, expect } from 'vitest';
import { formatName, formatDate, formatField } from './formatter';

describe('formatName', () => {
  it('should format standard names correctly', () => {
    const result = formatName('YAMADA', 'TARO');
    expect(result).toBe('YAMADA<<TARO<<<<<<<<<<<<<<<<<<<<<<<<<<<');
    expect(result).toHaveLength(39);
  });

  it('should handle multiple given names', () => {
    const result = formatName('SMITH', 'JOHN MICHAEL');
    expect(result).toBe('SMITH<<JOHN<MICHAEL<<<<<<<<<<<<<<<<<<<<');
    expect(result).toHaveLength(39);
  });

  it('should handle long names by truncating', () => {
    const result = formatName('VERYLONGFAMILYNAMEHERE', 'VERYLONGGIVENNAMEHERE');
    expect(result).toHaveLength(39);
    expect(result).toMatch(/^VERYLONGFAMILYNAMEHERE<<VERYLONGGIVENN/);
  });

  it('should clean non-alphabetic characters', () => {
    const result = formatName('O\'CONNOR', 'MARY-JANE');
    expect(result).toBe('OCONNOR<<MARYJANE<<<<<<<<<<<<<<<<<<<<<<');
    expect(result).toHaveLength(39);
  });

  it('should handle empty secondary identifier', () => {
    const result = formatName('YAMADA', '');
    expect(result).toBe('YAMADA<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
    expect(result).toHaveLength(39);
  });

  it('should handle single character names', () => {
    const result = formatName('A', 'B');
    expect(result).toBe('A<<B<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
    expect(result).toHaveLength(39);
  });
});

describe('formatDate', () => {
  it('should format valid 8-digit dates to 6-digit format', () => {
    expect(formatDate('19900101')).toBe('900101');
    expect(formatDate('20301231')).toBe('301231');
    expect(formatDate('19850615')).toBe('850615');
  });

  it('should handle dates with separators', () => {
    expect(formatDate('1990-01-01')).toBe('900101');
    expect(formatDate('2030/12/31')).toBe('301231');
    expect(formatDate('1985.06.15')).toBe('850615');
  });

  it('should return 000000 for invalid dates', () => {
    expect(formatDate('invalid')).toBe('000000');
    expect(formatDate('12345')).toBe('000000');
    expect(formatDate('123456789')).toBe('000000');
    expect(formatDate('')).toBe('000000');
  });

  it('should handle mixed characters', () => {
    expect(formatDate('a1b9c9d0e0f1g0h1i')).toBe('900101');
  });
});

describe('formatField', () => {
  it('should format document numbers correctly', () => {
    expect(formatField('TK0000001', 9)).toBe('TK0000001');
    expect(formatField('us1234567', 9)).toBe('US1234567');
  });

  it('should pad short values', () => {
    expect(formatField('ABC', 5)).toBe('ABC<<');
    expect(formatField('12', 4)).toBe('12<<');
  });

  it('should truncate long values', () => {
    expect(formatField('VERYLONGVALUE', 5)).toBe('VERYL');
    expect(formatField('1234567890', 5)).toBe('12345');
  });

  it('should clean non-alphanumeric characters', () => {
    expect(formatField('A-B_C.D@E', 10)).toBe('ABCDE<<<<<');
    expect(formatField('12-34 56', 10)).toBe('123456<<<<');
  });

  it('should handle different filler characters', () => {
    expect(formatField('ABC', 5, '0')).toBe('ABC00');
    expect(formatField('123', 5, 'X')).toBe('123XX');
  });

  it('should handle empty values', () => {
    expect(formatField('', 5)).toBe('<<<<<');
    expect(formatField('', 3, '0')).toBe('000');
  });

  it('should format nationality codes correctly', () => {
    expect(formatField('JPN', 3)).toBe('JPN');
    expect(formatField('USA', 3)).toBe('USA');
    expect(formatField('DE', 3)).toBe('DE<');
  });

  it('should format sex field correctly', () => {
    expect(formatField('M', 1)).toBe('M');
    expect(formatField('F', 1)).toBe('F');
    expect(formatField('', 1)).toBe('<');
  });
});