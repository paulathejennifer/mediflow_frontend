/**
 * Simple Toast Utility
 * 
 * Basic toast notification system for the notification center.
 * This can be replaced with a more sophisticated toast library.
 */

interface ToastOptions {
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

let toastContainer: HTMLDivElement | null = null;
let toastCounter = 0;

const createToastContainer = () => {
  if (typeof document === 'undefined') return null;
  
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed top-4 right-4 z-50 space-y-2';
    document.body.appendChild(toastContainer);
  }
  
  return toastContainer;
};

const createToastElement = (toast: Toast): HTMLDivElement => {
  const toastEl = document.createElement('div');
  toastEl.id = toast.id;
  
  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500'
  }[toast.type];

  toastEl.className = `
    ${bgColor} text-white p-4 rounded-lg shadow-lg 
    transform transition-all duration-300 ease-in-out
    translate-x-full opacity-0 min-w-[300px] max-w-md
  `;

  toastEl.innerHTML = `
    <div class="flex justify-between items-start">
      <div class="flex-1">
        <div class="font-medium">${toast.title}</div>
        ${toast.description ? `<div class="text-sm opacity-90 mt-1">${toast.description}</div>` : ''}
        ${toast.action ? `
          <button 
            class="mt-2 text-sm underline hover:no-underline"
            id="${toast.id}-action"
          >
            ${toast.action.label}
          </button>
        ` : ''}
      </div>
      <button 
        class="ml-2 text-white hover:opacity-80"
        id="${toast.id}-close"
      >
        ×
      </button>
    </div>
  `;

  // Add event listeners
  const closeBtn = toastEl.querySelector(`#${toast.id}-close`);
  if (closeBtn) {
    closeBtn.addEventListener('click', () => removeToast(toast.id));
  }

  const actionBtn = toastEl.querySelector(`#${toast.id}-action`);
  if (actionBtn && toast.action) {
    const action = toast.action;
    actionBtn.addEventListener('click', () => {
      action.onClick();
      removeToast(toast.id);
    });
  }

  return toastEl;
};

const removeToast = (id: string) => {
  const toastEl = document.getElementById(id);
  if (toastEl) {
    toastEl.classList.add('translate-x-full', 'opacity-0');
    setTimeout(() => {
      toastEl.remove();
    }, 300);
  }
};

const showToast = (type: Toast['type'], title: string, options?: ToastOptions) => {
  const container = createToastContainer();
  if (!container) return;

  const id = `toast-${++toastCounter}`;
  const toast: Toast = {
    id,
    type,
    title,
    description: options?.description,
    action: options?.action,
    duration: type === 'error' ? 5000 : 3000
  };

  const toastEl = createToastElement(toast);
  container.appendChild(toastEl);

  // Animate in
  setTimeout(() => {
    toastEl.classList.remove('translate-x-full', 'opacity-0');
  }, 10);

  // Auto remove
  if (toast.duration) {
    setTimeout(() => removeToast(id), toast.duration);
  }
};

export const toast = {
  success: (title: string, options?: ToastOptions) => showToast('success', title, options),
  error: (title: string, options?: ToastOptions) => showToast('error', title, options),
  info: (title: string, options?: ToastOptions) => showToast('info', title, options),
  warning: (title: string, options?: ToastOptions) => showToast('warning', title, options)
};
