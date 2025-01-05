'use client';

import React from 'react';
import { IconMetadata } from '@/types/icon';
import { X, Code, Download, FileText } from 'lucide-react';
import Button from "../Button/Button";
import Icon from './Icon';
import CodeBlock from '../CodeBlock/CodeBlock';
import './styling/IconDetailPanel.scss';
import { cn } from '@/lib/utils';
import { Icon as GlyphKitIcon } from '@glyphkit/glyphkit';
import Slider from '../Slider/Slider';

interface IconDetailPanelProps {
  icon: IconMetadata;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (icon: IconMetadata) => void;
  onCopy: (text: string, type?: 'name' | 'code') => void;
}

const IconDetailPanel: React.FC<IconDetailPanelProps> = ({
  icon,
  isOpen,
  onClose,
  onDownload,
  onCopy,
}) => {
  const [showLargePreview, setShowLargePreview] = React.useState(false);
  const [iconSize, setIconSize] = React.useState(Math.max(icon.size * 1.5, icon.size));

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEscape);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, isOpen]);

  return (
    <>
      <div 
        className={cn('icon-detail-overlay', { open: isOpen })}
        onClick={onClose}
      />
      <div className={cn('icon-detail-panel', { open: isOpen })}>
        <div className="icon-detail-panel__header">
          <div className="icon-detail-panel__title">
            <h2>Details</h2>
            <Button
              variant="tertiary"
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
              variant="secondary"
              size="sm"
            >
              <GlyphKitIcon name="text_24" size={16} />
              <span>Copy Name</span>
            </Button>

            <Button
              onClick={() => onDownload(icon)}
              variant="secondary"
              size="sm"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </Button>

            <Button
              onClick={() => onCopy(icon.path)}
              variant="secondary"
              size="sm"
            >
              <GlyphKitIcon name="arrow_chevron_left_right_24" size={16} />
              <span>Copy Path</span>
            </Button>
          </div>

          <section className="icon-detail-panel__preview">
            <div className="icon-detail-panel__preview-header">
              <h3>Preview</h3>
              <div className='icon-detail-panel__preview-header-slider-container'>
                <p>Size</p>
              <Slider
                value={[iconSize]}
                min={icon.size}
                max={icon.size * 5}
                onValueChange={(value) => setIconSize(value[0])}
                className="icon-detail-panel__preview-header-slider"
                step={10}
              />
              </div>
            </div>
            <div className="icon-detail-panel__preview-container">
              <Icon
                icon={icon}
                showSize={true}
                customSize={iconSize}
              />
            </div>
          </section>

          <section className="icon-detail-panel__usage">
            <h3>Usage</h3>
            <CodeBlock
              label="React Component"
              code={`<Icon name="${icon.name}" size={${icon.size}} />`}
              language="javascript"
            />
            {/* <CodeBlock
              label="Import Path"
              code={icon.path}
              language="text"
            />  */}
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
    </>
  );
};

export default IconDetailPanel; 