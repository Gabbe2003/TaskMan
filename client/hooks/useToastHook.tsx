import { useRef } from 'react';
import { toast, ToastOptions, TypeOptions } from 'react-toastify';

interface ToastSettings extends ToastOptions {
  position: "bottom-right" | "top-right" | "top-left" | "bottom-left" | "top-center" | "bottom-center";
  theme: "light" | "dark" | "colored";
}

const toastSettings: ToastSettings = {
    position: "top-right",
    autoClose: 2000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
};

export default function useToast() {
    const toastId = useRef<number | string | null>(null);

    const showToast = (message: string, type: TypeOptions | "default" = "default"): void => {
        if (toastId.current !== null && toast.isActive(toastId.current)) {
            return;
        }

        switch (type) {
            case "success":
                toastId.current = toast.success(message, toastSettings);
                break;
            case "info":
                toastId.current = toast.info(message, toastSettings);
                break;
            case "warning":
                toastId.current = toast.warn(message, toastSettings);
                break;
            case "error":
                toastId.current = toast.error(message, toastSettings);
                break;
            default:
                toastId.current = toast(message, toastSettings);
        }
    };

    return showToast;
}
