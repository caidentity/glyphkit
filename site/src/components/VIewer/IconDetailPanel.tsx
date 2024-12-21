'use client';

import React from 'react';
import { IconMetadata } from '@/types/icon';
import { X, Code, Download, FileText } from 'lucide-react';
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
          >
            <X className="icon-detail-panel__close-icon" />
          </Button>
        </div>
        <p className="icon-detail-panel__name">{icon.name}</p>
      </div>

      <div className="icon-detail-panel__content">
        <div className="icon-detail-panel__actions">
          <Button
            onClick={() => onCopy(icon.name)}
            variant="outline"
            size="sm"
          >
            <Code className="icon-detail-panel__button-icon" />
            <span>Copy Name</span>
          </Button>

          <Button
            onClick={() => onDownload(icon)}
            variant="outline"
            size="sm"
          >
            <Download className="icon-detail-panel__button-icon" />
            <span>Download</span>
          </Button>

          <Button
            onClick={() => onCopy(icon.path)}
            variant="outline"
            size="sm"
          >
            <FileText className="icon-detail-panel__button-icon" />
            <span>Copy Path</span>
          </Button>
        </div>

        <section className="icon-detail-panel__preview">
          <div className="icon-detail-panel__preview-header">
            <h3>Preview</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLargePreview(!showLargePreview)}
            >
              {showLargePreview ? "Show Original" : "Show Large"}
            </Button>
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
      </div>
    </div>
  );
};

export default IconDetailPanel; 