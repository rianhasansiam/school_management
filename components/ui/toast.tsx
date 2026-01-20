'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

// ============================================
// TOAST/NOTIFICATION COMPONENT
// ============================================

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-gray-50 border-gray-200 text-gray-800',
};

const iconStyles = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-gray-500',
};

export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const Icon = toastIcons[type];

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [id, duration, onClose]);

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg',
        'animate-in slide-in-from-right-full duration-300',
        toastStyles[type]
      )}
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', iconStyles[type])} />
      <div className="flex-1 min-w-0">
        <p className="font-medium">{title}</p>
        {message && <p className="mt-1 text-sm opacity-90">{message}</p>}
      </div>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-1 hover:bg-black/5 rounded transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// ============================================
// TOAST CONTAINER
// ============================================

interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
}

// ============================================
// USE TOAST HOOK
// ============================================

type ToastInput = Omit<ToastProps, 'id' | 'onClose'>;

interface ToastContextValue {
  toasts: ToastProps[];
  addToast: (toast: ToastInput) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const addToast = React.useCallback((toast: ToastInput) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id, onClose: removeToast }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// ============================================
// ALERT COMPONENT
// ============================================

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  onClose?: () => void;
}

export function Alert({ type, title, children, onClose, className, ...props }: AlertProps) {
  const Icon = toastIcons[type];

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border',
        toastStyles[type],
        className
      )}
      {...props}
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', iconStyles[type])} />
      <div className="flex-1 min-w-0">
        {title && <p className="font-medium">{title}</p>}
        {children && <div className={cn('text-sm', title && 'mt-1')}>{children}</div>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 hover:bg-black/5 rounded transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
