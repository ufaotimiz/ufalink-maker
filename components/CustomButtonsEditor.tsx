"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getLinkIcon } from "@/lib/link-icon";
import { addCustomButton, removeCustomButton, reorderItems } from "@/lib/page-actions";

type ButtonItem = { id: string; label: string; url: string };

type Props = {
  clientPageId: string;
  buttons: ButtonItem[];
};

export function CustomButtonsEditor({ clientPageId, buttons }: Props) {
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [pendingAdd, startAdd] = useTransition();
  const [pendingDelete, startDelete] = useTransition();
  const [pendingMove, startMove] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault();
    startAdd(async () => {
      const result = await addCustomButton(clientPageId, { label, url });
      if (!result.ok) toast.error(result.error);
      else {
        setLabel("");
        setUrl("");
        toast.success("Botão adicionado");
      }
    });
  };

  const onRemove = (id: string) => {
    setDeletingId(id);
    startDelete(async () => {
      const result = await removeCustomButton(id);
      if (!result.ok) toast.error(result.error);
      else toast.success("Removido");
      setDeletingId(null);
    });
  };

  const onMove = (id: string, direction: "up" | "down") => {
    const idx = buttons.findIndex((b) => b.id === id);
    if (idx === -1) return;
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= buttons.length) return;
    const next = [...buttons];
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    startMove(async () => {
      const result = await reorderItems(
        clientPageId,
        "button",
        next.map((b) => b.id),
      );
      if (!result.ok) toast.error(result.error);
    });
  };

  return (
    <div className="space-y-4">
      <form
        onSubmit={onAdd}
        className="space-y-3 rounded-lg border bg-muted/30 p-4"
      >
        <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Adicionar botão
        </Label>
        <div className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Texto (ex: Reservar)"
            maxLength={80}
            required
          />
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://link.com"
            type="url"
            required
          />
          <Button type="submit" disabled={pendingAdd || !label || !url}>
            {pendingAdd ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>

      {buttons.length === 0 ? (
        <p className="rounded-lg border border-dashed py-6 text-center text-sm text-muted-foreground">
          Nenhum botão ainda — adicione acima.
        </p>
      ) : (
        <ul className="space-y-2">
          {buttons.map((btn, idx) => {
            const Icon = getLinkIcon(btn.url);
            return (
            <li
              key={btn.id}
              className="flex items-center gap-2 rounded-lg border bg-card p-3"
            >
              <div className="flex flex-col">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onMove(btn.id, "up")}
                  disabled={idx === 0 || pendingMove}
                  className="h-5 w-5"
                  aria-label="Mover para cima"
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onMove(btn.id, "down")}
                  disabled={idx === buttons.length - 1 || pendingMove}
                  className="h-5 w-5"
                  aria-label="Mover para baixo"
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>
              </div>
              <Icon className="h-5 w-5 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{btn.label}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {btn.url}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(btn.id)}
                disabled={pendingDelete && deletingId === btn.id}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                aria-label="Remover"
              >
                {pendingDelete && deletingId === btn.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
