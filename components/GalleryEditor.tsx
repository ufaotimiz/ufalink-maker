"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, ImageIcon, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addGalleryImage,
  removeGalleryImage,
  reorderItems,
} from "@/lib/page-actions";

type GalleryItem = { id: string; url: string; caption: string | null };

type Props = {
  clientPageId: string;
  images: GalleryItem[];
};

export function GalleryEditor({ clientPageId, images }: Props) {
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [pendingAdd, startAdd] = useTransition();
  const [pendingDelete, startDelete] = useTransition();
  const [pendingMove, startMove] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault();
    startAdd(async () => {
      const result = await addGalleryImage(clientPageId, { url, caption });
      if (!result.ok) toast.error(result.error);
      else {
        setUrl("");
        setCaption("");
        toast.success("Imagem adicionada");
      }
    });
  };

  const onRemove = (id: string) => {
    setDeletingId(id);
    startDelete(async () => {
      const result = await removeGalleryImage(id);
      if (!result.ok) toast.error(result.error);
      else toast.success("Removida");
      setDeletingId(null);
    });
  };

  const onMove = (id: string, direction: "up" | "down") => {
    const idx = images.findIndex((i) => i.id === id);
    if (idx === -1) return;
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= images.length) return;
    const next = [...images];
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    startMove(async () => {
      const result = await reorderItems(
        clientPageId,
        "gallery",
        next.map((i) => i.id),
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
          Adicionar imagem
        </Label>
        <div className="grid gap-2 sm:grid-cols-[2fr_1fr_auto]">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://...imagem.jpg"
            type="url"
            required
          />
          <Input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Legenda (opcional)"
            maxLength={120}
          />
          <Button type="submit" disabled={pendingAdd || !url}>
            {pendingAdd ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>

      {images.length === 0 ? (
        <p className="rounded-lg border border-dashed py-6 text-center text-sm text-muted-foreground">
          Nenhuma imagem ainda — adicione acima.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {images.map((img, idx) => (
            <li
              key={img.id}
              className="group relative overflow-hidden rounded-lg border bg-card"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.caption ?? ""}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onMove(img.id, "up")}
                    disabled={idx === 0 || pendingMove}
                    aria-label="Mover para cima"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onMove(img.id, "down")}
                    disabled={idx === images.length - 1 || pendingMove}
                    aria-label="Mover para baixo"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onRemove(img.id)}
                    disabled={pendingDelete && deletingId === img.id}
                    aria-label="Remover"
                  >
                    {pendingDelete && deletingId === img.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
                <div className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-[10px] font-semibold text-white">
                  {idx + 1}
                </div>
              </div>
              {img.caption ? (
                <p className="truncate p-2 text-xs text-muted-foreground">
                  <ImageIcon className="mr-1 inline h-3 w-3" />
                  {img.caption}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
