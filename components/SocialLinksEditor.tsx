"use client";

import { useState, useTransition } from "react";
import {
  Facebook,
  Globe,
  GripVertical,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  MessageCircle,
  Music2,
  Plus,
  Trash2,
  Twitter,
  Youtube,
} from "lucide-react";
import { toast } from "sonner";

import { IconPicker } from "@/components/IconPicker";
import { SortableList } from "@/components/SortableList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  addSocialLink,
  removeSocialLink,
  reorderItems,
  setItemIcon,
} from "@/lib/page-actions";
import { SOCIAL_PLATFORMS } from "@/lib/page-schemas";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type SocialLink = {
  id: string;
  platform: (typeof SOCIAL_PLATFORMS)[number];
  url: string;
  icon: string | null;
};

type Props = {
  clientPageId: string;
  links: SocialLink[];
};

const META: Record<
  (typeof SOCIAL_PLATFORMS)[number],
  { label: string; icon: LucideIcon; color: string; placeholder: string }
> = {
  INSTAGRAM: {
    label: "Instagram",
    icon: Instagram,
    color: "text-pink-500",
    placeholder: "https://instagram.com/usuario",
  },
  FACEBOOK: {
    label: "Facebook",
    icon: Facebook,
    color: "text-blue-600",
    placeholder: "https://facebook.com/pagina",
  },
  TIKTOK: {
    label: "TikTok",
    icon: Music2,
    color: "text-foreground",
    placeholder: "https://tiktok.com/@usuario",
  },
  X: {
    label: "X / Twitter",
    icon: Twitter,
    color: "text-foreground",
    placeholder: "https://x.com/usuario",
  },
  YOUTUBE: {
    label: "YouTube",
    icon: Youtube,
    color: "text-red-600",
    placeholder: "https://youtube.com/@canal",
  },
  LINKEDIN: {
    label: "LinkedIn",
    icon: Linkedin,
    color: "text-sky-700",
    placeholder: "https://linkedin.com/in/perfil",
  },
  WHATSAPP: {
    label: "WhatsApp",
    icon: MessageCircle,
    color: "text-green-500",
    placeholder: "https://wa.me/5511999999999",
  },
  WEBSITE: {
    label: "Site",
    icon: Globe,
    color: "text-violet-500",
    placeholder: "https://seusite.com",
  },
  EMAIL: {
    label: "Email",
    icon: Mail,
    color: "text-amber-600",
    placeholder: "mailto:contato@empresa.com",
  },
};

export function SocialLinksEditor({ clientPageId, links }: Props) {
  const [platform, setPlatform] = useState<(typeof SOCIAL_PLATFORMS)[number]>(
    "INSTAGRAM",
  );
  const [url, setUrl] = useState("");
  const [pendingAdd, startAdd] = useTransition();
  const [pendingDelete, startDelete] = useTransition();
  const [, startMove] = useTransition();
  const [, startIcon] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault();
    startAdd(async () => {
      const result = await addSocialLink(clientPageId, { platform, url });
      if (!result.ok) toast.error(result.error);
      else {
        setUrl("");
        toast.success("Rede social adicionada");
      }
    });
  };

  const onRemove = (id: string) => {
    setDeletingId(id);
    startDelete(async () => {
      const result = await removeSocialLink(id);
      if (!result.ok) toast.error(result.error);
      else toast.success("Removido");
      setDeletingId(null);
    });
  };

  const onReorder = (orderedIds: string[]) => {
    startMove(async () => {
      const result = await reorderItems(clientPageId, "social", orderedIds);
      if (!result.ok) toast.error(result.error);
    });
  };

  const onIconChange = (id: string, icon: string | null) => {
    startIcon(async () => {
      const result = await setItemIcon(clientPageId, "social", id, icon);
      if (!result.ok) toast.error(result.error);
    });
  };

  const meta = META[platform];
  const Icon = meta.icon;

  return (
    <div className="space-y-4">
      <form
        onSubmit={onAdd}
        className="space-y-3 rounded-lg border bg-muted/30 p-4"
      >
        <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Adicionar rede social
        </Label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="justify-start gap-2 sm:w-40"
              >
                <Icon className={cn("h-4 w-4", meta.color)} />
                {meta.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              {SOCIAL_PLATFORMS.map((p) => {
                const PIcon = META[p].icon;
                return (
                  <DropdownMenuItem
                    key={p}
                    onSelect={() => setPlatform(p)}
                    className="gap-2"
                  >
                    <PIcon className={cn("h-4 w-4", META[p].color)} />
                    {META[p].label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={meta.placeholder}
            type="url"
            required
            className="flex-1"
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

      {links.length === 0 ? (
        <p className="rounded-lg border border-dashed py-6 text-center text-sm text-muted-foreground">
          Nenhuma rede ainda — adicione acima.
        </p>
      ) : (
        <SortableList items={links} onReorder={onReorder} className="space-y-2">
          {(link, handle) => {
            const lmeta = META[link.platform];
            return (
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
                  value={link.icon}
                  fallback={lmeta.icon}
                  onChange={(icon) => onIconChange(link.id, icon)}
                />
                <div className="min-w-0 flex-1">
                  <Badge variant="secondary" className="mb-1">
                    {lmeta.label}
                  </Badge>
                  <p className="truncate text-xs text-muted-foreground">
                    {link.url}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(link.id)}
                  disabled={pendingDelete && deletingId === link.id}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Remover"
                >
                  {pendingDelete && deletingId === link.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            );
          }}
        </SortableList>
      )}
    </div>
  );
}
