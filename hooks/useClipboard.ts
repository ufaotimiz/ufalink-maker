"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Options = {
  successMessage?: string;
  errorMessage?: string;
  resetMs?: number;
};

export function useClipboard({
  successMessage = "Link copiado!",
  errorMessage = "Não foi possível copiar",
  resetMs = 2000,
}: Options = {}) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const copy = useCallback(
    async (value: string) => {
      try {
        if (!navigator?.clipboard) {
          throw new Error("Clipboard API indisponível");
        }
        await navigator.clipboard.writeText(value);
        setCopied(true);
        toast.success(successMessage);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), resetMs);
        return true;
      } catch {
        toast.error(errorMessage);
        return false;
      }
    },
    [successMessage, errorMessage, resetMs],
  );

  return { copy, copied };
}
