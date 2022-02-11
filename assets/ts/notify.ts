import { toast } from 'react-toastify';
import type { ToastContent, ToastOptions } from 'react-toastify';

const notify = (message: ToastContent, options: ToastOptions = {}) =>
  toast(message, {
    position: 'top-right',
    type: 'success',
    theme: 'dark',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    pauseOnFocusLoss: false,
    ...options,
  });

export default notify;
