"use client";
import { toast } from "sonner";

type ToastState = "success" | "warning" | "error" | "neutral";

export function useToast() {
  const showToast = (message: string, state: ToastState = "neutral") => {
    switch (state) {
      case "success":
        toast.success(message);
        break;
      case "warning":
        toast.warning(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "neutral":
      default:
        toast(message);
    }
  };

  return { showToast };
}
