"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type AutosaveStatus = "idle" | "saving" | "saved" | "error";

type Options<T> = {
  value: T;
  /** function that performs the save; returns true on success */
  onSave: (value: T) => Promise<boolean>;
  /** debounce delay in ms */
  delay?: number;
  /** skip the very first run (when initial mount sets value) */
  skipInitial?: boolean;
};

/**
 * Debounced autosave hook.
 * - Calls `onSave` after the value stops changing for `delay` ms.
 * - Exposes status + lastSavedAt + manual save trigger.
 */
export function useAutosave<T>({
  value,
  onSave,
  delay = 800,
  skipInitial = true,
}: Options<T>) {
  const [status, setStatus] = useState<AutosaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialRef = useRef(true);
  const valueRef = useRef(value);
  valueRef.current = value;

  const flush = useCallback(async () => {
    setStatus("saving");
    const ok = await onSave(valueRef.current);
    if (ok) {
      setStatus("saved");
      setLastSavedAt(Date.now());
    } else {
      setStatus("error");
    }
  }, [onSave]);

  useEffect(() => {
    if (skipInitial && initialRef.current) {
      initialRef.current = false;
      return;
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setStatus("idle");
    timeoutRef.current = setTimeout(() => {
      void flush();
    }, delay);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, delay]);

  return { status, lastSavedAt, saveNow: flush };
}
