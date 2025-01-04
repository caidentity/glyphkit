import React from 'react';
import './docs.scss';
import Footer from '@/components/Footer/Footer';
import '@/styles/pages/infopages.scss';
import FloatingTOC from '@/components/FloatingTOC/FloatingTOC';
import CodeBlock from '@/components/CodeBlock/CodeBlock';

const tocItems = [
  { href: '#installation', text: 'Installation' },
  { href: '#quick-start', text: 'Quick Start' },
  { href: '#usage-examples', text: 'Usage Examples' },
];

export default function LicensePage() {
  return (
    <main className="license-page">
      <div className="page-masthead">
        <h1>GlyphKit Docs</h1>
      </div>

      <FloatingTOC items={tocItems} />

      <div className="content-container">

        <section id="overview">
          <h1>Overview</h1>
          <p>
            GlyphKit is an extensive icon library designed to be friendly to use, highly performant, flexible to any need, and in a constant state of evolution. This documentation will help you get started with using the library effectively.
          </p>
          <h2>Performance</h2>
          <p>GlyphKit includes built-in caching for SVG content:</p>
          <ul>
            <li>SVGs are cached after the first load.</li>
            <li>Subsequent requests use cached content.</li>
            <li>Memory-efficient Map implementation.</li>
            <li>Automatic error handling.</li>
          </ul>
          <h2>Browser Support</h2>
          <p>Supported browsers include:</p>
          <ul>
            <li>Chrome (latest)</li>
            <li>Firefox (latest)</li>
            <li>Safari (latest)</li>
            <li>Edge (latest)</li>
          </ul>
          <p>Note: IE11 is not supported.</p>
        </section>


        <h1>Getting Started with GlyphKit</h1>

        <section id="installation">

          <h2>Installation</h2>
          <p>Choose your preferred package manager:</p>
          <CodeBlock
            label="Package Installation"
            code={`
# npm
npm install @glyphkit/glyphkit

# yarn
yarn add @glyphkit/glyphkit

# pnpm
pnpm add @glyphkit/glyphkit`}
            language="bash"
          />
        </section>

        <section id="quick-start">
          <h2>Quick Start</h2>
          <p>Once installed correctly, its pretty simple to get started... Just import the package where will be consumed then add the icon reference like so.</p>
          <CodeBlock
            label="Basic Usage"
            code={`
import { Icon } from '@glyphkit/glyphkit';

function App() {
  return (
    <Icon
      name="arrow-right"
      size={24}
      color="#000"
    />
  );
}`}
            language="javascript"
          />
        </section>

        <section id="usage-examples">
          <h1>Usage Examples</h1>

          <h2>Error Handling</h2>
          <p>
            The <code>onError</code> and <code>onLoad</code> props can be used for debugging purposes.
            The <code>onError</code> prop allows you to handle any issues that arise when loading an icon,
            while the <code>onLoad</code> prop can be used to confirm successful loading.
          </p>
          <CodeBlock
            label="Error Handling"
            code={`
<Icon
  name="user"
  onError={(error) => console.error('Icon failed to load:', error)}
  onLoad={() => console.log('Icon loaded successfully')}
/>`}
            language="javascript"
          />

          <h2>Color</h2>
          <p>
            The <code>color</code> prop can handle various formats, including hex, rgba, and even advanced logic for dynamic color changes.
            This allows for flexible styling based on application state or user interactions.
          </p>
          <CodeBlock
            label="Dynamic Colors"
            code={`
<Icon
  name="heart"
  color={isLiked ? '#ff0000' : '#cccccc'}
  size={24}
/>`}
            language="javascript"
          />

          <h2>Size</h2>
          <p>
            The <code>size</code> prop allows you to specify the size of the icon. You can use dynamic size attributes
            to adjust the icon's size based on your application's needs. For example, you can specify sizes like
            <code>x_16</code> or <code>x_24</code> in the icon name to indicate the desired size.
          </p>
          <CodeBlock
            label="Dynamic Size"
            code={`
<Icon
  name="x_24"
  size={24}
/>`}
            language="javascript"
          />
        </section>
        <section id="need-help">
          <h1>Need Help?</h1>
          <p>
            Hopefully, this documentation has helped you get started. If you have any questions, requests, or concerns, please reach out to us at hello@glyphkit.com.
          </p>
        </section>
      </div>



      <Footer />
    </main>
  );
} 