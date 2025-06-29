# @passport-mrz/renderer

<!-- automd:badges color="red" github="simochee/passport-mrz" license name="@passport-mrz/renderer" bundlephobia -->

[![npm version](https://img.shields.io/npm/v/@passport-mrz/renderer?color=red)](https://npmjs.com/package/@passport-mrz/renderer)
[![npm downloads](https://img.shields.io/npm/dm/@passport-mrz/renderer?color=red)](https://npm.chart.dev/@passport-mrz/renderer)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@passport-mrz/renderer?color=red)](https://bundlephobia.com/package/@passport-mrz/renderer)
[![license](https://img.shields.io/github/license/simochee/passport-mrz?color=red)](https://github.com/simochee/passport-mrz/blob/main/LICENSE)

<!-- /automd -->

Renders passport MRZ (Machine Readable Zone) strings as images using the OCR-B font.

## Installation

<!-- automd:pm-install name="@passport-mrz/renderer" -->

```sh
# ✨ Auto-detect
npx nypm install @passport-mrz/renderer

# npm
npm install @passport-mrz/renderer

# yarn
yarn add @passport-mrz/renderer

# pnpm
pnpm install @passport-mrz/renderer

# bun
bun install @passport-mrz/renderer

# deno
deno install @passport-mrz/renderer
```

<!-- /automd -->

## Usage

### Programmatic API

```ts
import type { Input } from '@passport-mrz/builder'
import { renderMRZToPNG } from '@passport-mrz/renderer'

const input: Input = {
  documentType: 'PP',
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
npx @passport-mrz/renderer \
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
npx @passport-mrz/renderer --json input.json
```

Custom output directory and filename with placeholders:

```bash
npx @passport-mrz/renderer \
  --json input.json \
  --outdir ./output \
  --filename passport-{documentNumber}.png
```

## Features

🖼️ **OCR-B font rendering** - Uses authentic OCR-B font for accurate MRZ appearance<br>
🌐 **Cross-platform support** - Works in both Node.js and browser environments<br>
🎯 **CLI included** - Command-line tool with flexible input options<br>
📄 **Dynamic filenames** - Supports placeholder substitution in output filenames

## API

### `renderMRZToPNG(input)`

Renders MRZ as a PNG image buffer.

#### input

Type: `Input` (from @passport-mrz/builder)

Passport information object containing document details.

#### Returns

Type: `Promise<Buffer>`

PNG image data as a Buffer (Node.js only).

### `renderMRZToCanvas(input)`

Renders MRZ to an HTML5 Canvas object.

#### input

Type: `Input` (from @passport-mrz/builder)

#### Returns

Type: `Canvas`

Canvas object with rendered MRZ text.

## CLI Options

- `--json <file>` - Load input data from JSON file
- `--outdir <directory>` - Output directory (default: current directory)
- `--filename <name>` - Output filename (default: `{documentNumber}-{primaryIdentifier}_{secondaryIdentifier}.png`)
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
- [@passport-mrz/builder](https://github.com/simochee/passport-mrz/tree/main/packages/builder) - Generate MRZ strings

## License

MIT
