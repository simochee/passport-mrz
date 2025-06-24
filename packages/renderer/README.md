# @simochee/passport-mrz-renderer

<!-- automd:badges color="red" github="simochee/passport-mrz-simulator" license name="@simochee/passport-mrz-renderer" bundlephobia -->

[![npm version](https://img.shields.io/npm/v/@simochee/passport-mrz-renderer?color=red)](https://npmjs.com/package/@simochee/passport-mrz-renderer)
[![npm downloads](https://img.shields.io/npm/dm/@simochee/passport-mrz-renderer?color=red)](https://npm.chart.dev/@simochee/passport-mrz-renderer)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@simochee/passport-mrz-renderer?color=red)](https://bundlephobia.com/package/@simochee/passport-mrz-renderer)
[![license](https://img.shields.io/github/license/simochee/passport-mrz-simulator?color=red)](https://github.com/simochee/passport-mrz-simulator/blob/main/LICENSE)

<!-- /automd -->

Renders passport MRZ (Machine Readable Zone) strings as images using the OCR-B font.

## Installation

<!-- automd:pm-install name="@simochee/passport-mrz-renderer" -->

```sh
# ✨ Auto-detect
npx nypm install @simochee/passport-mrz-renderer

# npm
npm install @simochee/passport-mrz-renderer

# yarn
yarn add @simochee/passport-mrz-renderer

# pnpm
pnpm install @simochee/passport-mrz-renderer

# bun
bun install @simochee/passport-mrz-renderer

# deno
deno install @simochee/passport-mrz-renderer
```

<!-- /automd -->

## Usage

### Programmatic API

```ts
import type { Input } from '@simochee/passport-mrz-builder'
import { renderMRZToPNG } from '@simochee/passport-mrz-renderer'

const input: Input = {
  documentType: 'P',
  issuingState: 'JPN',
  documentNumber: 'XS1234567',
  primaryIdentifier: 'GAIMU',
  secondaryIdentifier: 'SAKURA',
  nationality: 'JPN',
  dateOfBirth: '790220',
  sex: 'F',
  dateOfExpiry: '110101'
}

// Generate PNG buffer
const pngBuffer = await renderMRZToPNG(input)
```

## Output Example

![Sample MRZ Output](examples/XS1234567-GAIMU_SAKURA.png)

The above image shows the rendered output for the input data in [`examples/XS1234567.json`](examples/XS1234567.json).

### Command Line Interface

Basic usage with command line arguments:

```bash
npx @simochee/passport-mrz-renderer \
  --documentType P \
  --issuingState JPN \
  --documentNumber XS1234567 \
  --primaryIdentifier GAIMU \
  --secondaryIdentifier SAKURA \
  --nationality JPN \
  --dateOfBirth 790220 \
  --sex F \
  --dateOfExpiry 110101
```

Load input from JSON file:

```bash
npx @simochee/passport-mrz-renderer --json input.json
```

Custom output filename with placeholders:

```bash
npx @simochee/passport-mrz-renderer \
  --json input.json \
  passport-{documentNumber}.png
```

## Features

🖼️ **OCR-B font rendering** - Uses authentic OCR-B font for accurate MRZ appearance
🌐 **Cross-platform support** - Works in both Node.js and browser environments
🎯 **CLI included** - Command-line tool with flexible input options
📄 **Dynamic filenames** - Supports placeholder substitution in output filenames

## API

### `renderMRZToPNG(input)`

Renders MRZ as a PNG image buffer.

#### input

Type: `Input` (from @simochee/passport-mrz-builder)

Passport information object containing document details.

#### Returns

Type: `Promise<Buffer>`

PNG image data as a Buffer (Node.js only).

### `renderMRZToCanvas(input)`

Renders MRZ to an HTML5 Canvas object.

#### input

Type: `Input` (from @simochee/passport-mrz-builder)

#### Returns

Type: `Canvas`

Canvas object with rendered MRZ text.

## CLI Options

- `--json <file>` - Load input data from JSON file
- `--output <filename>` - Output filename (default: `{documentNumber}-{primaryIdentifier}_{secondaryIdentifier}.png`)
- Individual passport fields: `--documentType`, `--issuingState`, `--documentNumber`, etc.

### Filename Placeholders

The output filename supports these placeholders:
- `{documentType}` - Document type
- `{issuingState}` - Issuing state code
- `{documentNumber}` - Document number
- `{primaryIdentifier}` - Primary identifier (surname)
- `{secondaryIdentifier}` - Secondary identifier (given names)
- `{nationality}` - Nationality code
- `{dateOfBirth}` - Date of birth
- `{personalNumber}` - Personal number
- `{sex}` - Sex
- `{dateOfExpiry}` - Date of expiry

## Related

- [Passport MRZ Simulator](https://passport-mrz.simochee.net) - Interactive web app using this library
- [@simochee/passport-mrz-builder](https://github.com/simochee/passport-mrz-simulator/tree/main/packages/builder) - Generate MRZ strings

## License

MIT
