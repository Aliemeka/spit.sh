import React from "react";
import { useToast } from "./useToast";

export const useClipboard = () => {
  const [copied, setCopied] = React.useState(false);
  const { toastNeutral } = useToast();

  const copyToClipboard = (text: string, message?: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toastNeutral(message || `${text} copied to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return {
    copied,
    copyToClipboard,
  };
};
