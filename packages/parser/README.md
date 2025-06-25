# @simochee/passport-mrz-parser

A library for parsing passport MRZ (Machine Readable Zone) strings into structured data.

## Features

- Parse TD3 format passport MRZ strings
- Validate checksums for all fields
- Detect invalid characters
- Return partial results even with errors
- Detailed error reporting

## Installation

```bash
npm install @simochee/passport-mrz-parser
```

## Usage

```typescript
import { parseMRZ } from '@simochee/passport-mrz-parser';

// Parse MRZ lines
const result = parseMRZ([
  'P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<',
  'L898902C36UTO7408122F1204159ZE184226B<<<<<<'
]);

if (result.result === 'success') {
  console.log(result.data);
  // {
  //   documentType: 'P',
  //   issuingState: 'UTO',
  //   primaryIdentifier: 'ERIKSSON',
  //   secondaryIdentifier: 'ANNA MARIA',
  //   documentNumber: 'L898902C3',
  //   nationality: 'UTO',
  //   dateOfBirth: '740812',
  //   sex: 'F',
  //   dateOfExpiry: '120415',
  //   personalNumber: 'ZE184226B'
  // }
} else {
  console.log('Errors:', result.errors);
}
```

## API

### `parseMRZ(lines: string[] | string): ParseResult`

Parses MRZ lines and returns structured data.

#### Parameters

- `lines`: Array of MRZ lines or a single string with newlines

#### Returns

```typescript
type ParseResult = {
  result: 'success' | 'partial' | 'error';
  data: Partial<Input>;
  errors: ParseError[];
}
```

- `result`: 
  - `'success'`: All fields parsed and validated successfully
  - `'partial'`: Some fields parsed successfully but errors were found
  - `'error'`: Critical error preventing any parsing
- `data`: Parsed passport data (may be partial)
- `errors`: Array of validation errors

### Error Types

```typescript
type ParseError = {
  field: string;
  type: 'invalid_character' | 'checksum_mismatch' | 'format_error';
  expected?: string;
  actual?: string;
  message: string;
}
```

## License

MIT