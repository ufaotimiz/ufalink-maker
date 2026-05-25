"use client";

import { useFormContext } from "react-hook-form";
import { ArrowUpRight, Copy, RotateCcw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useClipboard } from "@/hooks/useClipboard";
import { useLinkHistory } from "@/hooks/useLinkHistory";
import { findPresetBySource } from "@/lib/social-presets";
import type { LinkSchema } from "@/lib/link-schema";
import type { SavedLink } from "@/types/link";

type Props = { link: SavedLink };

function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);
}

export function LinkHistoryItem({ link }: Props) {
  const { reset } = useFormContext<LinkSchema>();
  const { remove } = useLinkHistory();
  const { copy } = useClipboard();
  const preset = findPresetBySource(link.utms.utm_source);

  const handleReload = () => {
    reset({
      url: link.url,
      utm_source: link.utms.utm_source ?? "",
      utm_medium: link.utms.utm_medium ?? "",
      utm_campaign: link.utms.utm_campaign ?? "",
      utm_content: link.utms.utm_content ?? "",
      utm_term: link.utms.utm_term ?? "",
    });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <li className="group flex flex-col gap-2 rounded-lg border bg-card p-3 transition-colors hover:border-foreground/20">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2">
            {preset ? (
              <Badge variant="secondary" className="gap-1">
                <preset.icon className={`h-3 w-3 ${preset.color}`} />
                {preset.name}
              </Badge>
            ) : link.utms.utm_source ? (
              <Badge variant="outline">{link.utms.utm_source}</Badge>
            ) : null}
            {link.utms.utm_campaign ? (
              <span className="truncate text-xs text-muted-foreground">
                {link.utms.utm_campaign}
              </span>
            ) : null}
          </div>
          <p className="truncate font-mono text-xs text-foreground/80">
            {link.finalUrl}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {formatDate(link.createdAt)}
          </p>
        </div>
      </div>

      <TooltipProvider delayDuration={200}>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => copy(link.finalUrl)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copiar</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReload}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Recarregar no formulário</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                asChild
              >
                <a
                  href={link.finalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir link"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Abrir em nova aba</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-auto text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => remove(link.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Excluir</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </li>
  );
}
