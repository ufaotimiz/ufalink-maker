"use client";

import { useState, useTransition } from "react";
import {
  ArrowDown,
  ArrowUp,
  FileAudio,
  FileText,
  Film,
  Heading as HeadingIcon,
  Image as ImageIcon,
  Loader2,
  Minus,
  Paperclip,
  Pilcrow,
  Plus,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";

import { MediaUploadField } from "@/components/MediaUploadField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  addBlock,
  removeBlock,
  reorderItems,
  updateBlock,
} from "@/lib/page-actions";
import { BLOCK_SIZES, type BlockSize, type BlockType } from "@/lib/page-schemas";

type MediaKind = "image" | "audio" | "video" | "file";

const MEDIA_KIND_BY_TYPE: Partial<Record<BlockType, MediaKind>> = {
  IMAGE: "image",
  AUDIO: "audio",
  VIDEO: "video",
  FILE: "file",
  DOCUMENT: "file",
};

type BlockItem = {
  id: string;
  type: BlockType;
  size: BlockSize | null;
  text: string | null;
  url: string | null;
  caption: string | null;
};

const SIZE_LABEL: Record<BlockSize, string> = {
  SMALL: "Pequeno",
  MEDIUM: "Médio",
  LARGE: "Grande",
  FULL: "Largura total",
};

const SIZE_APPLIES_TO: BlockType[] = ["IMAGE", "VIDEO", "EMBED"];

type Props = {
  clientPageId: string;
  blocks: BlockItem[];
};

type BlockMeta = {
  label: string;
  description: string;
  icon: LucideIcon;
  needs: "text" | "url" | "none";
  textPlaceholder?: string;
  urlPlaceholder?: string;
  captionPlaceholder?: string;
};

const BLOCK_META: Record<BlockType, BlockMeta> = {
  HEADING: {
    label: "Título",
    description: "Texto grande de seção",
    icon: HeadingIcon,
    needs: "text",
    textPlaceholder: "Sobre nós",
  },
  PARAGRAPH: {
    label: "Parágrafo",
    description: "Bloco de texto livre",
    icon: Pilcrow,
    needs: "text",
    textPlaceholder: "Escreva aqui...",
  },
  IMAGE: {
    label: "Imagem",
    description: "Imagem grande inline",
    icon: ImageIcon,
    needs: "url",
    urlPlaceholder: "https://...imagem.jpg",
    captionPlaceholder: "Legenda (opcional)",
  },
  AUDIO: {
    label: "Áudio",
    description: "Player de áudio (mp3, ogg, wav...)",
    icon: FileAudio,
    needs: "url",
    urlPlaceholder: "https://...audio.mp3",
    captionPlaceholder: "Título do áudio",
  },
  VIDEO: {
    label: "Vídeo",
    description: "Player de vídeo (mp4, webm...)",
    icon: Film,
    needs: "url",
    urlPlaceholder: "https://...video.mp4",
    captionPlaceholder: "Título do vídeo",
  },
  FILE: {
    label: "Arquivo",
    description: "Link para download genérico",
    icon: Paperclip,
    needs: "url",
    urlPlaceholder: "https://...arquivo.zip",
    captionPlaceholder: "Nome para exibir",
  },
  DOCUMENT: {
    label: "Documento",
    description: "PDF, DOCX, planilha, etc.",
    icon: FileText,
    needs: "url",
    urlPlaceholder: "https://...documento.pdf",
    captionPlaceholder: "Nome do documento",
  },
  EMBED: {
    label: "Embed",
    description: "Incorporar (YouTube, Spotify, etc.)",
    icon: Sparkles,
    needs: "url",
    urlPlaceholder: "https://www.youtube.com/embed/...",
    captionPlaceholder: "Descrição (opcional)",
  },
  DIVIDER: {
    label: "Divisor",
    description: "Linha separadora",
    icon: Minus,
    needs: "none",
  },
};

const ALL_TYPES: BlockType[] = [
  "HEADING",
  "PARAGRAPH",
  "IMAGE",
  "AUDIO",
  "VIDEO",
  "FILE",
  "DOCUMENT",
  "EMBED",
  "DIVIDER",
];

export function BlocksEditor({ clientPageId, blocks }: Props) {
  const [pendingAdd, startAdd] = useTransition();
  const [pendingMove, startMove] = useTransition();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const onAddType = (type: BlockType) => {
    startAdd(async () => {
      const meta = BLOCK_META[type];
      const seed =
        meta.needs === "text"
          ? { type, size: "MEDIUM" as BlockSize, text: "Novo " + meta.label.toLowerCase(), url: "", caption: "" }
          : { type, size: "MEDIUM" as BlockSize, text: "", url: "", caption: "" };

      const result = await addBlock(clientPageId, seed);
      if (!result.ok) toast.error(result.error);
      else toast.success(`${meta.label} adicionado`);
    });
  };

  const onMove = (id: string, direction: "up" | "down") => {
    const idx = blocks.findIndex((b) => b.id === id);
    if (idx === -1) return;
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= blocks.length) return;
    const next = [...blocks];
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    startMove(async () => {
      const result = await reorderItems(
        clientPageId,
        "block",
        next.map((b) => b.id),
      );
      if (!result.ok) toast.error(result.error);
    });
  };

  const onRemove = async (id: string) => {
    setPendingDeleteId(id);
    const result = await removeBlock(id);
    if (!result.ok) toast.error(result.error);
    else toast.success("Bloco removido");
    setPendingDeleteId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Adicionar bloco
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" size="sm" disabled={pendingAdd}>
              {pendingAdd ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Novo bloco
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            {ALL_TYPES.map((t) => {
              const meta = BLOCK_META[t];
              const Icon = meta.icon;
              return (
                <DropdownMenuItem
                  key={t}
                  onSelect={() => onAddType(t)}
                  className="flex items-start gap-2 py-2"
                >
                  <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-tight">
                      {meta.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {meta.description}
                    </p>
                  </div>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {blocks.length === 0 ? (
        <p className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
          Nenhum bloco ainda — use o botão acima para começar.
        </p>
      ) : (
        <ul className="space-y-3">
          {blocks.map((block, idx) => (
            <li key={block.id}>
              <BlockRow
                block={block}
                index={idx}
                total={blocks.length}
                pendingMove={pendingMove}
                pendingDelete={pendingDeleteId === block.id}
                onMoveUp={() => onMove(block.id, "up")}
                onMoveDown={() => onMove(block.id, "down")}
                onRemove={() => onRemove(block.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

type RowProps = {
  block: BlockItem;
  index: number;
  total: number;
  pendingMove: boolean;
  pendingDelete: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
};

function BlockRow({
  block,
  index,
  total,
  pendingMove,
  pendingDelete,
  onMoveUp,
  onMoveDown,
  onRemove,
}: RowProps) {
  const meta = BLOCK_META[block.type];
  const Icon = meta.icon;

  const [text, setText] = useState(block.text ?? "");
  const [url, setUrl] = useState(block.url ?? "");
  const [caption, setCaption] = useState(block.caption ?? "");
  const [size, setSize] = useState<BlockSize>(block.size ?? "MEDIUM");
  const [pendingSave, startSave] = useTransition();

  const dirty =
    text !== (block.text ?? "") ||
    url !== (block.url ?? "") ||
    caption !== (block.caption ?? "") ||
    size !== (block.size ?? "MEDIUM");

  const saveWith = (overrides?: {
    text?: string;
    url?: string;
    caption?: string;
    size?: BlockSize;
  }) => {
    startSave(async () => {
      const result = await updateBlock(block.id, {
        type: block.type,
        size: overrides?.size ?? size,
        text: overrides?.text ?? text,
        url: overrides?.url ?? url,
        caption: overrides?.caption ?? caption,
      });
      if (!result.ok) toast.error(result.error);
      else toast.success("Bloco salvo");
    });
  };

  const onSave = () => saveWith();

  const showSize = SIZE_APPLIES_TO.includes(block.type);

  const onSizeSelect = (next: BlockSize) => {
    setSize(next);
    saveWith({ size: next });
  };

  const mediaKind = MEDIA_KIND_BY_TYPE[block.type];

  const onUploadComplete = (newUrl: string) => {
    setUrl(newUrl);
    saveWith({ url: newUrl });
  };

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-xs font-semibold">
            {index + 1}
          </span>
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{meta.label}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onMoveUp}
            disabled={index === 0 || pendingMove}
            aria-label="Mover para cima"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onMoveDown}
            disabled={index === total - 1 || pendingMove}
            aria-label="Mover para baixo"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={onRemove}
            disabled={pendingDelete}
            aria-label="Remover"
          >
            {pendingDelete ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {meta.needs === "text" ? (
        <div className="space-y-1.5">
          <Label htmlFor={`text-${block.id}`} className="sr-only">
            Texto
          </Label>
          {block.type === "PARAGRAPH" ? (
            <textarea
              id={`text-${block.id}`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              maxLength={2000}
              placeholder={meta.textPlaceholder}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          ) : (
            <Input
              id={`text-${block.id}`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={200}
              placeholder={meta.textPlaceholder}
            />
          )}
        </div>
      ) : null}

      {showSize ? (
        <div className="mb-3">
          <Label className="mb-1.5 block text-xs">Tamanho</Label>
          <div className="flex flex-wrap gap-1">
            {BLOCK_SIZES.map((s) => (
              <Button
                key={s}
                type="button"
                variant={size === s ? "default" : "outline"}
                size="sm"
                onClick={() => onSizeSelect(s)}
                className="h-8 px-3 text-xs"
              >
                {SIZE_LABEL[s]}
              </Button>
            ))}
          </div>
        </div>
      ) : null}

      {meta.needs === "url" ? (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor={`url-${block.id}`}>
              {mediaKind ? "Mídia" : "URL"}
            </Label>
            {mediaKind ? (
              <MediaUploadField
                id={`url-${block.id}`}
                value={url}
                onChange={onUploadComplete}
                kind={mediaKind}
                urlPlaceholder={meta.urlPlaceholder}
              />
            ) : (
              <Input
                id={`url-${block.id}`}
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={meta.urlPlaceholder}
                maxLength={1000}
              />
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`caption-${block.id}`}>
              {meta.captionPlaceholder ? "Legenda" : "Legenda (opcional)"}
            </Label>
            <Input
              id={`caption-${block.id}`}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={280}
              placeholder={meta.captionPlaceholder}
            />
          </div>
        </div>
      ) : null}

      {meta.needs === "none" ? (
        <p className="text-xs text-muted-foreground">
          Sem conteúdo — só posicione com as setas acima.
        </p>
      ) : null}

      {meta.needs !== "none" ? (
        <div className="mt-3 flex justify-end">
          <Button
            type="button"
            size="sm"
            variant={dirty ? "default" : "outline"}
            onClick={onSave}
            disabled={!dirty || pendingSave}
          >
            {pendingSave ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Salvar
          </Button>
        </div>
      ) : null}
    </div>
  );
}
