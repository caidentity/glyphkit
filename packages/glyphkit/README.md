# GlyphKit

A lightweight, customizable SVG icon toolkit for React applications with built-in caching and TypeScript support.

[![npm version](https://badge.fury.io/js/%40glyphkit%2Fglyphkit.svg)](https://www.npmjs.com/package/@glyphkit/glyphkit)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

## Features

- 🚀 Zero dependencies
- 📦 Tree-shakeable
- 🎨 Customizable colors and sizes
- 💾 Built-in SVG caching
- 🔧 TypeScript support
- ♿ Accessibility-friendly
- 🎯 Simple API

## Installation
npm
npm install @glyphkit/glyphkit
yarn
yarn add @glyphkit/glyphkit
pnpm
pnpm add @glyphkit/glyphkit


## Quick Start

import { Icon } from '@glyphkit/glyphkit';
function App() {
return (
<Icon
name="arrow-right"
size={24}
color="#000"
/>
);
}


## API Reference

### Icon Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | Required | Icon name (without .svg extension) |
| `size` | `number \| string` | `24` | Icon size in pixels |
| `color` | `string` | `'currentColor'` | Icon color |
| `className` | `string` | `undefined` | Additional CSS classes |
| `svgDirectory` | `string` | `'public/icons'` | Directory containing SVG files |
| `iconPrefix` | `string` | `'gk'` | Prefix for icon IDs |
| `onError` | `(error: Error) => void` | `undefined` | Error callback |
| `onLoad` | `() => void` | `undefined` | Success callback |

## Advanced Usage

### Custom Directory Structure
<Icon
name="menu"
svgDirectory="/assets/icons"
size={32}
color="#333"
/>

### Error Handling
<Icon
name="user"
onError={(error) => console.error('Icon failed to load:', error)}
onLoad={() => console.log('Icon loaded successfully')}
/>

### With Tailwind CSS
<Icon
name="search"
className="w-6 h-6 text-gray-500 hover:text-gray-700"
/>

### Dynamic Colors
<Icon
name="heart"
color={isLiked ? '#ff0000' : '#cccccc'}
size={24}
/>


## SVG Requirements

- SVG files should be optimized (you can use tools like SVGO)
- File names should match the `name` prop (e.g., `arrow-right.svg`)
- Place SVG files in your public directory (default: `public/icons`)

## Performance

GlyphKit includes built-in caching for SVG content:
- SVGs are cached after first load
- Subsequent requests use cached content
- Memory-efficient Map implementation
- Automatic error handling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE11 not supported

## TypeScript Support

GlyphKit is written in TypeScript and includes type definitions:

import { Icon, IconProps } from '@glyphkit/glyphkit';
// Props are fully typed
const MyIcon: React.FC<{ iconName: string }> = ({ iconName }) => (
<Icon
name={iconName}
size={24}
/>
);


## Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for details.

## License

MIT © [caidentity](https://github.com/caidentity)

## Related Projects

- [GlyphKit Website](https://github.com/caidentity/glyphkit) - Official documentation and examples
- [Create GlyphKit](https://github.com/caidentity/create-glyphkit) - CLI tool for creating icon sets

## Support

- [GitHub Issues](https://github.com/caidentity/glyphkit/issues)
- [Discord Community](https://discord.gg/glyphkit)
- [Twitter](https://twitter.com/glyphkit)

## Credits

Created and maintained by [caidentity](https://github.com/caidentity)