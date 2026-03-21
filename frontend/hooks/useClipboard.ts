"use client";

import React from "react";
import { useToast } from "./useToast";

export const useClipboard = () => {
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
      toastNeutral(message || `${text} copied to clipboard!`);

      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current);
      }

      timeoutIdRef.current = window.setTimeout(() => {
        setCopied(false);
        timeoutIdRef.current = null;
      }, 2000);
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
