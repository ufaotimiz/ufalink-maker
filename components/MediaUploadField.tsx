"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import {
  CloudUpload,
  ExternalLink,
  FileText,
  Link as LinkIcon,
  Loader2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Kind = "image" | "audio" | "video" | "file";

type Props = {
  id?: string;
  value: string;
  onChange: (url: string) => void;
  kind: Kind;
  urlPlaceholder?: string;
  /** Texto curto no estado vazio (ex.: "Arraste uma imagem aqui"). */
  emptyHint?: string;
  /** Habilita drop area maior (mais espaço, usado em image/cover). */
  large?: boolean;
};

const ACCEPT_BY_KIND: Record<Kind, string> = {
  image: "image/*",
  audio: "audio/*",
  video: "video/*",
  file: "*/*",
};

const KIND_LABEL: Record<Kind, string> = {
  image: "imagem",
  audio: "áudio",
  video: "vídeo",
  file: "arquivo",
};

export function MediaUploadField({
  id,
  value,
  onChange,
  kind,
  urlPlaceholder,
  emptyHint,
  large = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [tab, setTab] = useState<"upload" | "url">("upload");

  const handleFile = async (file: File) => {
    setProgress(0);
    try {
      const safeName = file.name
        .normalize("NFKD")
        .replace(/[^\w.\-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80) || "file";
      const pathname = `${kind}/${safeName}`;
      const blob = await upload(pathname, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        onUploadProgress: ({ percentage }) =>
          setProgress(Math.round(percentage)),
      });
      onChange(blob.url);
      toast.success(
        `${KIND_LABEL[kind][0].toUpperCase() + KIND_LABEL[kind].slice(1)} enviado`,
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : `Falha no upload do ${KIND_LABEL[kind]}`,
      );
    } finally {
      setProgress(null);
    }
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) void handleFile(f);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) void handleFile(f);
  };

  if (value) {
    return (
      <div className="space-y-2">
        <UploadedPreview kind={kind} url={value} />
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            disabled={progress !== null}
          >
            {progress !== null ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                {Math.round(progress)}%
              </>
            ) : (
              <>
                <CloudUpload className="mr-2 h-3.5 w-3.5" />
                Trocar
              </>
            )}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => onChange("")}
            disabled={progress !== null}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            Remover
          </Button>
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="h-3 w-3" />
            abrir
          </a>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_BY_KIND[kind]}
          className="hidden"
          onChange={onPick}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-1 rounded-md bg-muted p-0.5 text-xs">
        <button
          type="button"
          onClick={() => setTab("upload")}
          className={cn(
            "flex-1 rounded px-2 py-1 font-medium transition-colors",
            tab === "upload"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <CloudUpload className="mr-1 inline h-3 w-3" />
          Upload
        </button>
        <button
          type="button"
          onClick={() => setTab("url")}
          className={cn(
            "flex-1 rounded px-2 py-1 font-medium transition-colors",
            tab === "url"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <LinkIcon className="mr-1 inline h-3 w-3" />
          URL externa
        </button>
      </div>

      {tab === "upload" ? (
        <label
          htmlFor={id ? `${id}-file` : undefined}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border-2 border-dashed bg-muted/30 px-4 text-center text-sm transition-colors hover:bg-muted/60",
            large ? "min-h-[140px] py-6" : "min-h-[88px] py-4",
            dragging
              ? "border-primary bg-primary/5 text-primary"
              : "border-border text-muted-foreground",
            progress !== null && "pointer-events-none opacity-70",
          )}
        >
          {progress !== null ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-xs font-medium text-primary">
                Enviando… {Math.round(progress)}%
              </span>
              <div className="h-1 w-full max-w-[200px] overflow-hidden rounded-full bg-primary/20">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <CloudUpload className="h-5 w-5" />
              <span className="text-xs font-medium">
                {emptyHint ?? `Clique ou arraste um(a) ${KIND_LABEL[kind]} aqui`}
              </span>
              <span className="text-[10px] opacity-70">até 100 MB</span>
            </>
          )}
          <input
            id={id ? `${id}-file` : undefined}
            ref={inputRef}
            type="file"
            accept={ACCEPT_BY_KIND[kind]}
            className="hidden"
            onChange={onPick}
          />
        </label>
      ) : (
        <div className="space-y-1.5">
          <Label htmlFor={id} className="sr-only">
            URL externa
          </Label>
          <Input
            id={id}
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={urlPlaceholder ?? "https://..."}
            maxLength={2000}
          />
        </div>
      )}
    </div>
  );
}

function UploadedPreview({ kind, url }: { kind: Kind; url: string }) {
  if (kind === "image") {
    return (
      <div className="overflow-hidden rounded-md border bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt=""
          className="max-h-48 w-full object-contain"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
    );
  }
  if (kind === "audio") {
    return <audio src={url} controls className="w-full" preload="metadata" />;
  }
  if (kind === "video") {
    return (
      <video
        src={url}
        controls
        className="max-h-48 w-full rounded-md border bg-black"
        preload="metadata"
      />
    );
  }
  return (
    <div className="flex items-center gap-2 rounded-md border bg-muted/40 p-2 text-xs">
      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="truncate font-mono">{url}</span>
    </div>
  );
}
