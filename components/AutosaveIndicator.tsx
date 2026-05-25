"use client";

import { Check, CircleAlert, Loader2 } from "lucide-react";

import type { AutosaveStatus } from "@/hooks/useAutosave";

type Props = {
  status: AutosaveStatus;
  lastSavedAt: number | null;
};

function formatTime(ts: number): string {
  const d = new Date(ts);
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

export function AutosaveIndicator({ status, lastSavedAt }: Props) {
  if (status === "saving") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Salvando…
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-destructive">
        <CircleAlert className="h-3.5 w-3.5" />
        Erro ao salvar
      </span>
    );
  }
  if (status === "saved" && lastSavedAt) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Check className="h-3.5 w-3.5 text-emerald-500" />
        Salvo às {formatTime(lastSavedAt)}
      </span>
    );
  }
  return (
    <span className="text-xs text-muted-foreground">
      Alterações são salvas automaticamente
    </span>
  );
}
