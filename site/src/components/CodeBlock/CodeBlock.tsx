'use client';

import React from 'react';
import Button from '@/components/Button/Button';
import { Check, Copy } from 'lucide-react';
import Toast, { ToastType } from '@/components/Toast/Toast';
import { AnimatePresence } from 'framer-motion';
import './CodeBlock.scss';

interface CodeBlockProps {
  label: string;
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ label, code, language }) => {
  const [toast, setToast] = React.useState<{ message: string; type: ToastType } | null>(null);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setToast({ message: 'Code copied to clipboard', type: 'success' });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      setToast({ message: 'Failed to copy to clipboard', type: 'error' });
    }
  };

  return (
    <div className="code-block">
      <div className="code-block__header">
        <span className="code-block__label">{label}</span>
        <Button
          variant="tertiary"
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
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
            duration={2000}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CodeBlock;