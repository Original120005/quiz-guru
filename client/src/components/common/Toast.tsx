'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return '#22c55e';
      case 'error': return '#ef4444';
      case 'info': return '#3b82f6';
      default: return '#3b82f6';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="toast">
      <div className="toastContent">
        <span className="toastIcon">{getIcon()}</span>
        <span className="toastMessage">{message}</span>
        <button onClick={onClose} className="toastClose">
          ×
        </button>
      </div>
      
      <style jsx>{`
        .toast {
          position: fixed;
          top: 20px;
          right: 20px;
          background: ${getBackgroundColor()};
          color: white;
          padding: 0;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          z-index: 10000;
          animation: slideIn 0.3s ease-out;
          max-width: 400px;
        }
        
        .toastContent {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          gap: 12px;
        }
        
        .toastIcon {
          font-size: 18px;
          flex-shrink: 0;
        }
        
        .toastMessage {
          flex: 1;
          font-weight: 500;
          font-size: 14px;
        }
        
        .toastClose {
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: background 0.2s ease;
          
          &:hover {
            background: rgba(255, 255, 255, 0.2);
          }
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}