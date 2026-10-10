"use client";

import React from "react";
import { useToast } from "./useToast";

interface UseClipboardOptions {
  resetAfter?: number;
  showToast?: boolean;
}

export const useClipboard = ({
  resetAfter = 2000,
  showToast = true,
}: UseClipboardOptions = {}) => {
  const [copied, setCopied] = React.useState(false);
  const timeoutIdRef = React.useRef<number | null>(null);
  const { toastNeutral } = useToast();

  const copyToClipboard = async (text: string, message?: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard || !navigator.clipboard.writeText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (showToast) {
        toastNeutral(message || `${text} copied to clipboard!`);
      }

      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current);
      }

      timeoutIdRef.current = window.setTimeout(() => {
        setCopied(false);
        timeoutIdRef.current = null;
      }, resetAfter);
    } catch {
      // Silently ignore clipboard errors to avoid misleading UI state.
    }
  };

  React.useEffect(() => {
    return () => {
      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);
  return {
    copied,
    copyToClipboard,
  };
};
