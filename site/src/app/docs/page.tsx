import React from 'react';
import './docs.scss';
import Footer from '@/components/Footer/Footer';
import '@/styles/pages/infopages.scss';
import FloatingTOC from '@/components/FloatingTOC/FloatingTOC';
import CodeBlock from '@/components/CodeBlock/CodeBlock';

const tocItems = [
  { href: '#installation', text: 'Installation' },
  { href: '#quick-start', text: 'Quick Start' },
];

export default function LicensePage() {
  return (
    <main className="license-page">
      <div className="page-masthead">
        <h1>Getting Started with GlyphKit</h1>
      </div>

      <FloatingTOC items={tocItems} />

      <div className="content-container">
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
      </div>

      <Footer />
    </main>
  );
} 