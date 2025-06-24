# @simochee/passport-mrz-builder

<!-- automd:badges color="red" github="simochee/passport-mrz" license name="@simochee/passport-mrz-builder" bundlephobia -->

[![npm version](https://img.shields.io/npm/v/@simochee/passport-mrz-builder?color=red)](https://npmjs.com/package/@simochee/passport-mrz-builder)
[![npm downloads](https://img.shields.io/npm/dm/@simochee/passport-mrz-builder?color=red)](https://npm.chart.dev/@simochee/passport-mrz-builder)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@simochee/passport-mrz-builder?color=red)](https://bundlephobia.com/package/@simochee/passport-mrz-builder)
[![license](https://img.shields.io/github/license/simochee/passport-mrz?color=red)](https://github.com/simochee/passport-mrz/blob/main/LICENSE)

<!-- /automd -->

## Usage

```js
import { buildMrzLines } from '@simochee/passport-mrz-builder'

const [line1, line2] = buildMrzLines({
  documentType: 'P',
  issuingState: 'JPN',
  documentNumber: 'XS1234567',
  primaryIdentifier: 'GAIMU',
  secondaryIdentifier: 'SAKURA',
  nationality: 'JPN',
  dateOfBirth: '790220',
  sex: 'F',
  dateOfExpiry: '110101',
  // personalNumber: '', (optional)
})

console.log(line1)
// P<JPNGAIMU<<SAKURA<<<<<<<<<<<<<<<<<<<<<<<<<<
console.log(line2)
// XS12345673JPN7902206F1101018<<<<<<<<<<<<<<00
```

## Features

✨ **TD3 format compliant** - Generates 2×44 character lines according to ICAO 9303 standard<br>
🔒 **Automatic check digits** - Calculates all required check digits for validation<br>
🧹 **Input sanitization** - Strips non-alphanumeric characters to ensure MRZ compliance<br>
📦 **Zero dependencies** - Lightweight and fast<br>
🎯 **TypeScript ready** - Full type definitions included

## API

### `buildMrzLines(input)`

Generates MRZ lines for a passport document.

#### input

Type: `object`

<!-- automd:file src="./src/input.ts" code -->

```ts [input.ts]
/**
 * Input data for generating passport MRZ (Machine Readable Zone).
 * Follows TD3 format specification for passport documents according to ICAO 9303 standard.
 */
export type Input = {
	/** Document Type (typically "P" for passport) */
	documentType: string;
	/** Issuing State (ISO 3166-1 alpha-3 country code) */
	issuingState: string;
	/** Document Number (passport number) */
	documentNumber: string;
	/** Primary Identifier (surname/family name) */
	primaryIdentifier: string;
	/** Secondary Identifier (given names) */
	secondaryIdentifier: string;
	/** Nationality (ISO 3166-1 alpha-3 country code) */
	nationality: string;
	/** Date of Birth (YYMMDD format) */
	dateOfBirth: string;
	/** Personal Number (optional, may be empty) */
	personalNumber?: string;
	/** Sex (M/F/<) */
	sex: string;
	/** Date of Expiry (YYMMDD format) */
	dateOfExpiry: string;
};
```

<!-- /automd -->

#### Returns

Type: `[string, string]`

Returns a tuple containing the two MRZ lines, each exactly 44 characters long.

## MRZ Format

The generated MRZ follows the TD3 format specification:

**Line 1 (44 chars):**
```
P<IIISURNAME<<GIVEN<NAMES<<<<<<<<<<<<<<<<<<<
```

**Line 2 (44 chars):**
```
NNNNNNNNNCKAAABBBBBBBCSEEEEEEECPPPPPPPPPPPCC
```

Where:
- `P` - Document type
- `III` - Issuing state code
- `NNNNNNNNN` - Document number
- `AAA` - Nationality code
- `BBBBBB` - Date of birth (YYMMDD)
- `S` - Sex
- `EEEEEE` - Expiry date (YYMMDD)
- `PPPPPPPPPPPP` - Personal number
- `C` - Check digits

## Related

- [Passport MRZ Simulator](https://passport-mrz.simochee.net) - Interactive web app using this library
- [@simochee/passport-mrz-renderer](https://github.com/simochee/passport-mrz/tree/main/packages/renderer) - Render MRZ as images

## License

MIT
