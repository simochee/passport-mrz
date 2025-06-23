import { describe, it, expect } from 'vitest';
import { buildMrzLines } from './index';
import type { Input } from './index';

describe('index exports', () => {
  it('should export buildMrzLines function', () => {
    expect(typeof buildMrzLines).toBe('function');
  });

  it('should work with exported function', () => {
    const input: Input = {
      documentType: 'P',
      issuingState: 'JPN',
      primaryIdentifier: 'TEST',
      secondaryIdentifier: 'USER',
      documentNumber: 'TK1234567',
      nationality: 'JPN',
      dateOfBirth: '19900101',
      sex: 'M',
      dateOfExpiry: '20301231'
    };

    const [line1, line2] = buildMrzLines(input);

    expect(line1).toHaveLength(44);
    expect(line2).toHaveLength(44);
    expect(line1).toMatch(/^P<JPN/);
    expect(line2).toMatch(/^TK1234567/);
  });
});