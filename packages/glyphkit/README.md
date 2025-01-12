# GlyphKit

A lightweight, customizable SVG icon toolkit for React applications with built-in caching and TypeScript support.

[![npm version](https://badge.fury.io/js/%40glyphkit%2Fglyphkit.svg)](https://www.npmjs.com/package/@glyphkit/glyphkit)  
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

## Overview

GlyphKit is an extensive icon library designed to be friendly to use, highly performant, flexible to any need, and in a constant state of evolution. This documentation will help you get started with using the library effectively.

### Performance
GlyphKit includes built-in caching for SVG content:
- SVGs are cached after the first load
- Subsequent requests use cached content
- Memory-efficient Map implementation
- Automatic error handling

### Browser Support
Supported browsers include:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Note**: IE11 is not supported.

## Getting Started

### Installation

Choose your preferred package manager:

```bash
# npm
npm install @glyphkit/glyphkit

# yarn
yarn add @glyphkit/glyphkit

# pnpm
pnpm add @glyphkit/glyphkit
```

### Quick Start

Once installed correctly, its pretty simple to get started... Just import the package where will be consumed then add the icon reference like so:

```jsx
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
```

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

## Usage

### Error Handling

The `onError` and `onLoad` props can be used for debugging purposes. The `onError` prop allows you to handle any issues that arise when loading an icon, while the `onLoad` prop can be used to confirm successful loading.

```jsx
<Icon
  name="user"
  onError={(error) => console.error('Icon failed to load:', error)}
  onLoad={() => console.log('Icon loaded successfully')}
/>
```

### Color

The `color` prop can handle various formats, including hex, rgba, and even advanced logic for dynamic color changes. This allows for flexible styling based on application state or user interactions.

```jsx
<Icon
  name="heart"
  color={isLiked ? '#ff0000' : '#cccccc'}
  size={24}
/>
```

### Size

The `size` prop allows you to specify the size of the icon. You can use dynamic size attributes to adjust the icon's size based on your application's needs. For example, you can specify sizes like `x_16` or `x_24` in the icon name to indicate the desired size.

```jsx
<Icon
  name="x_24"
  size={24}
/>
```

### Accessibility

GlyphKit icons support ARIA attributes for proper accessibility implementation. Here are the common patterns for different use cases:

#### Decorative Icons
Icons that are purely decorative should have `aria-hidden="true"`. This will not visually hide the icon, but it will hide the element from assistive technology.

```jsx
<Icon 
  name="heart"
  aria-hidden={true}
  size={24}
/>
```

#### Interactive Icons
If the icon conveys meaning, it should have alternate text defined by adding an `aria-label`.

```jsx
<Icon
  name="heart"
  aria-label="Add to favorites"
  size={24}
/>
```

#### Icons Within Interactive Elements
When an icon is inside another element that it's describing, the parent element should have the `aria-label`, and the icon should be hidden using `aria-hidden`.

```jsx
<button aria-label="Add to favorites">
  <Icon
    name="heart"
    aria-hidden={true}
    size={24}
  />
</button>
```

## Keywords

- 🚀 Zero dependencies
- 📦 Tree-shakeable
- 🎨 Customizable colors and sizes
- 💾 Built-in SVG caching
- 🔧 TypeScript support
- ♿ Accessibility-friendly
- 🎯 Simple API

## Support

- [Submit Feedback](https://docs.google.com/forms/d/e/1FAIpQLSfcyX2Xe75o5kgseKGcexqCuyOKIFwrixdelPrCga_-EvN-xg/viewform)
- [Twitter](https://twitter.com/glyphkit)

## License

MIT © [caidentity](https://github.com/caidentity)

## Credits

Created and maintained by [caidentity](https://github.com/caidentity).

