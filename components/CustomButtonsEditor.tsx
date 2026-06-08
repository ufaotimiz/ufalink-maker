"use client";

import { useState, useTransition } from "react";
import { GripVertical, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { IconPicker } from "@/components/IconPicker";
import { SortableList } from "@/components/SortableList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getLinkIcon } from "@/lib/link-icon";
import {
  addCustomButton,
  removeCustomButton,
  reorderItems,
  setItemIcon,
} from "@/lib/page-actions";

type ButtonItem = {
  id: string;
  label: string;
  url: string;
  icon: string | null;
};

type Props = {
  clientPageId: string;
  buttons: ButtonItem[];
};

export function CustomButtonsEditor({ clientPageId, buttons }: Props) {
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [pendingAdd, startAdd] = useTransition();
  const [pendingDelete, startDelete] = useTransition();
  const [, startMove] = useTransition();
  const [, startIcon] = useTransition();
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

  const onReorder = (orderedIds: string[]) => {
    startMove(async () => {
      const result = await reorderItems(clientPageId, "button", orderedIds);
      if (!result.ok) toast.error(result.error);
    });
  };

  const onIconChange = (id: string, icon: string | null) => {
    startIcon(async () => {
      const result = await setItemIcon(clientPageId, "button", id, icon);
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
        <SortableList items={buttons} onReorder={onReorder} className="space-y-2">
          {(btn, handle) => (
            <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
              <button
                type="button"
                ref={handle.setActivatorNodeRef}
                {...handle.attributes}
                {...handle.listeners}
                className="shrink-0 cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
                aria-label="Arrastar para reordenar"
              >
                <GripVertical className="h-4 w-4" />
              </button>
              <IconPicker
                value={btn.icon}
                fallback={getLinkIcon(btn.url)}
                onChange={(icon) => onIconChange(btn.id, icon)}
              />
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
            </div>
          )}
        </SortableList>
      )}
    </div>
  );
}
