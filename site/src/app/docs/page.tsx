import React from 'react';
import './docs.scss';
import Footer from '@/components/Footer/Footer';
import '@/styles/pages/infopages.scss';
import FloatingTOC from '@/components/FloatingTOC/FloatingTOC';
import CodeBlock from '@/components/CodeBlock/CodeBlock';

const tocItems = [
  { href: '#overview', text: 'Overview' },
  { href: '#getting-started', text: 'Getting Started' },
  { href: '#usage', text: 'Usage' },
  { href: '#need-help', text: 'Need Help' },
];

export default function DocsPage() {
  return (
    <main className="docs-page">
      <div className="page-masthead">
        <h1>GlyphKit Docs</h1>
      </div>

      <div className="info-page-wrapper">
        <div className="content-container">
          <section id="overview">
            <h1>Overview</h1>
            <p>
              GlyphKit is an extensive icon library designed to be friendly to use, highly performant, flexible to any need, and in a constant state of evolution. This documentation will help you get started with using the library effectively.
            </p>
            <h3>Performance</h3>
            <p>GlyphKit includes built-in caching for SVG content:</p>
            <ul>
              <li>SVGs are cached after the first load.</li>
              <li>Subsequent requests use cached content.</li>
              <li>Memory-efficient Map implementation.</li>
              <li>Automatic error handling.</li>
            </ul>
            <h3>Browser Support</h3>
            <p>Supported browsers include:</p>
            <ul>
              <li>Chrome (latest)</li>
              <li>Firefox (latest)</li>
              <li>Safari (latest)</li>
              <li>Edge (latest)</li>
            </ul>
            <p>Note: IE11 is not supported.</p>
          </section>

          <section id="getting-started">
            <h1>Getting Started</h1>
            
            <h3>Installation</h3>
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

            <h3>Quick Start</h3>
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


          <section id="api-reference">
            <h1>API Reference</h1>
            
            <h3>Icon Props</h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Prop</th>
                    <th>Type</th>
                    <th>Default</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>name</code></td>
                    <td><code>string</code></td>
                    <td>Required</td>
                    <td>Icon name (without .svg extension)</td>
                  </tr>
                  <tr>
                    <td><code>size</code></td>
                    <td><code>number</code></td>
                    <td>24</td>
                    <td>Icon size in pixels</td>
                  </tr>
                  <tr>
                    <td><code>color</code></td>
                    <td><code>string</code></td>
                    <td>'currentColor'</td>
                    <td>Icon color</td>
                  </tr>
                  <tr>
                    <td><code>className</code></td>
                    <td><code>string</code></td>
                    <td>''</td>
                    <td>Additional CSS classes</td>
                  </tr>
                  <tr>
                    <td><code>aria-hidden</code></td>
                    <td><code>boolean</code></td>
                    <td>undefined</td>
                    <td>Whether to hide the icon from screen readers</td>
                  </tr>
                  <tr>
                    <td><code>aria-label</code></td>
                    <td><code>string</code></td>
                    <td>undefined</td>
                    <td>Accessible label for the icon</td>
                  </tr>
                  <tr>
                    <td><code>role</code></td>
                    <td><code>string</code></td>
                    <td>'img' if aria-label present</td>
                    <td>ARIA role for the icon</td>
                  </tr>
                  <tr>
                    <td><code>onError</code></td>
                    <td><code>(error: Error) =&gt; void</code></td>
                    <td>undefined</td>
                    <td>Error callback</td>
                  </tr>
                  <tr>
                    <td><code>onLoad</code></td>
                    <td><code>() =&gt; void</code></td>
                    <td>undefined</td>
                    <td>Success callback</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>


          <section id="usage">
            <h1>Usage</h1>

            <h3>Error Handling</h3>
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

            <h3>Color</h3>
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

            <h3>Size</h3>
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

            <h3>Accessibility</h3>
            <p>
              GlyphKit icons support ARIA attributes for proper accessibility implementation. Here are the common patterns for different use cases:
            </p>

            <h4>Decorative Icons</h4>
            <p>
              Icons that are purely decorative should have <code>aria-hidden="true"</code>. This will not visually hide the icon, 
              but it will hide the element from assistive technology.
            </p>
            <CodeBlock
              label="Decorative Icon"
              code={`
<Icon 
  name="heart"
  aria-hidden={true}
  size={24}
/>`}
              language="javascript"
            />

            <h4>Interactive Icons</h4>
            <p>
              If the icon conveys meaning, it should have alternate text defined by adding an <code>aria-label</code>.
            </p>
            <CodeBlock
              label="Interactive Icon"
              code={`
<Icon
  name="heart"
  aria-label="Add to favorites"
  size={24}
/>`}
              language="javascript"
            />

            <h4>Icons Within Interactive Elements</h4>
            <p>
              When an icon is inside another element that it's describing, the parent element should have the <code>aria-label</code>,
              and the icon should be hidden using <code>aria-hidden</code>.
            </p>
            <CodeBlock
              label="Icon in Button"
              code={`
<button aria-label="Add to favorites">
  <Icon
    name="heart"
    aria-hidden={true}
    size={24}
  />
</button>`}
              language="javascript"
            />
          </section>

          <section id="need-help">
            <h2>Need Help?</h2>
            <p>
              Hopefully, this documentation has helped you get started. If you have any questions, requests, or concerns, please reach out to us at hello@glyphkit.com.
            </p>
          </section>
        </div>
        
        <FloatingTOC items={tocItems} />
      </div>

      <Footer />
    </main>
  );
} 