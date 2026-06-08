"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { CloudUpload, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { LinkIconView } from "@/components/LinkIconView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ICON_REGISTRY, type LinkIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

type Props = {
  /** Valor atual: null = automático; URL = imagem; senão = chave do registro. */
  value: string | null;
  /** Ícone mostrado quando o valor é automático. */
  fallback: LinkIcon;
  onChange: (icon: string | null) => void;
  /** Prefixo do caminho no blob para uploads. */
  uploadDir?: string;
  disabled?: boolean;
};

export function IconPicker({
  value,
  fallback,
  onChange,
  uploadDir = "icon",
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [progress, setProgress] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? ICON_REGISTRY.filter(
        (e) => e.label.toLowerCase().includes(q) || e.key.includes(q),
      )
    : ICON_REGISTRY;

  const select = (icon: string | null) => {
    onChange(icon);
    setOpen(false);
    setQuery("");
  };

  const handleFile = async (file: File) => {
    setProgress(0);
    try {
      const safeName =
        file.name
          .normalize("NFKD")
          .replace(/[^\w.\-]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 80) || "icon";
      const blob = await upload(`${uploadDir}/${safeName}`, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        onUploadProgress: ({ percentage }) =>
          setProgress(Math.round(percentage)),
      });
      select(blob.url);
      toast.success("Ícone enviado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha no upload");
    } finally {
      setProgress(null);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={disabled}
          className="h-9 w-9 shrink-0"
          aria-label="Escolher ícone"
          title="Escolher ícone"
        >
          <LinkIconView icon={value} fallback={fallback} className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-3">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={value ? "outline" : "default"}
              size="sm"
              className="h-8 flex-1 justify-start gap-2"
              onClick={() => select(null)}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Automático
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-2"
              onClick={() => inputRef.current?.click()}
              disabled={progress !== null}
            >
              {progress !== null ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {progress}%
                </>
              ) : (
                <>
                  <CloudUpload className="h-3.5 w-3.5" />
                  Imagem
                </>
              )}
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleFile(f);
                e.target.value = "";
              }}
            />
          </div>

          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar ícone…"
            className="h-8"
          />

          <div className="grid max-h-56 grid-cols-6 gap-1 overflow-y-auto">
            {filtered.map((entry) => {
              const Icon = entry.Icon;
              const selected = value === entry.key;
              return (
                <button
                  key={entry.key}
                  type="button"
                  onClick={() => select(entry.key)}
                  title={entry.label}
                  aria-label={entry.label}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-md border transition-colors hover:bg-accent",
                    selected
                      ? "border-primary ring-1 ring-primary"
                      : "border-transparent",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
            {filtered.length === 0 ? (
              <p className="col-span-6 py-4 text-center text-xs text-muted-foreground">
                Nenhum ícone encontrado.
              </p>
            ) : null}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
