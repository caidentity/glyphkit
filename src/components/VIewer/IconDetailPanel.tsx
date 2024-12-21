'use client';

import React from 'react';
import { IconMetadata } from '@/types/icon';
import { X, Code, Download, FileText, Link } from 'lucide-react';
import Button from "../Button/Button";
import Icon from './Icon';
import CodeBlock from '../CodeBlock/CodeBlock';
import './styling/IconDetailPanel.scss';

interface IconDetailPanelProps {
  icon: IconMetadata;
  onClose: () => void;
  onDownload: (icon: IconMetadata) => void;
  onCopy: (text: string) => void;
}

const IconDetailPanel: React.FC<IconDetailPanelProps> = ({
  icon,
  onClose,
  onDownload,
  onCopy,
}) => {
  const [showLargePreview, setShowLargePreview] = React.useState(false);

  return (
    <div className="icon-detail-panel">
      <div className="icon-detail-panel__header">
        <div className="icon-detail-panel__title">
          <h2>Details</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="icon-detail-panel__close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="icon-detail-panel__name">{icon.name}</p>
      </div>

      <div className="icon-detail-panel__content">
        <section className="icon-detail-panel__preview">
          <div className="icon-detail-panel__preview-header">
            <h3>Preview</h3>
            <button 
              className="icon-detail-panel__preview-toggle"
              onClick={() => setShowLargePreview(!showLargePreview)}
            >
              {showLargePreview ? "Show Original" : "Show Large"}
            </button>
          </div>
          <div className="icon-detail-panel__preview-container">
            <Icon
              icon={icon}
              showSize={true}
              customSize={showLargePreview ? icon.size * 3 : icon.size}
            />
          </div>
        </section>

        <section className="icon-detail-panel__usage">
          <h3>Usage</h3>
          <CodeBlock
            label="React Component"
            code={`<Icon name="${icon.name}" size={${icon.size}} />`}
            language="jsx"
          />
          <CodeBlock
            label="Import Path"
            code={icon.path}
            language="text"
          />
        </section>

        <section className="icon-detail-panel__metadata">
          <div className="icon-detail-panel__metadata-item">
            <h3>Size</h3>
            <p>{icon.size}px</p>
          </div>
          <div className="icon-detail-panel__metadata-item">
            <h3>Category</h3>
            <p>{icon.category}</p>
          </div>
        </section>

        <div className="icon-detail-panel__actions">
          <Button
            onClick={() => onCopy(`<Icon name="${icon.name}" size={${icon.size}} />`)}
            variant="outline"
            className="icon-detail-panel__action-button"
          >
            <Code className="h-4 w-4" />
            <span>Copy Component</span>
            <Link className="h-4 w-4" />
          </Button>

          <Button
            onClick={() => onDownload(icon)}
            variant="outline"
            className="icon-detail-panel__action-button"
          >
            <Download className="h-4 w-4" />
            <span>Download SVG</span>
          </Button>

          <Button
            onClick={() => onCopy(icon.path)}
            variant="outline"
            className="icon-detail-panel__action-button"
          >
            <FileText className="h-4 w-4" />
            <span>Copy Path</span>
            <Link className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IconDetailPanel; 