'use client';

import React from 'react';
import Button from '@/components/Button/Button';
import { Check, Copy } from 'lucide-react';
import './CodeBlock.scss';

interface CodeBlockProps {
  label: string;
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ label, code, language }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block">
      <div className="code-block__header">
        <span className="code-block__label">{label}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="code-block__copy-button"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="code-block__container">
        <pre className="code-block__content">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;