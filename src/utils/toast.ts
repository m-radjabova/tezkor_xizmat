import { toast, type ToastOptions } from 'react-toastify'

const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 2600,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
}

export function showSuccessToast(message: string) {
  toast.success(message, defaultOptions)
}

export function showErrorToast(message: string) {
  toast.error(message, {
    ...defaultOptions,
    autoClose: 3600,
  })
}

export function showInfoToast(message: string) {
  toast.info(message, defaultOptions)
}
