import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle, Info } from 'lucide-react';
import { Icon } from '@glyphkit/glyphkit';
import './Toast.scss';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose?: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'success', 
  onClose,
  duration = 2000 
}) => {
  React.useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Icon name="checkmark_16" size={15} />;
      case 'error':
        return <Icon name="message_warning_16" size={15} />;
      case 'info':
        return <Icon name="message_info_16" size={15} />
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`toast toast--${type}`}
    >
      <div className="toast__icon">
        {getIcon()}
      </div>
      <p className="toast__message">{message}</p>
      {onClose && (
        <button onClick={onClose} className="toast__close">
          <Icon name="x_circle_filled_16" size={15} />
        </button>
      )}
    </motion.div>
  );
};

export default Toast; 