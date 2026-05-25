"use client";

import { useFormContext } from "react-hook-form";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { SOCIAL_PRESETS } from "@/lib/social-presets";
import type { LinkSchema } from "@/lib/link-schema";

export function SocialPresets() {
  const { setValue, watch } = useFormContext<LinkSchema>();
  const currentSource = watch("utm_source");

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">Presets de rede social</span>
        <span className="text-xs text-muted-foreground">
          Clique para preencher origem e meio automaticamente.
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {SOCIAL_PRESETS.map((preset) => {
          const Icon = preset.icon;
          const active = currentSource === preset.source;
          return (
            <DropdownMenu key={preset.id}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "group flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border bg-card p-2 text-xs font-medium transition-all hover:border-foreground/40 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    active &&
                      "border-foreground bg-accent shadow-sm ring-2 ring-ring/40",
                  )}
                  aria-label={`Preencher com preset ${preset.name}`}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-transform group-hover:scale-110",
                      preset.color,
                    )}
                  />
                  <span className="leading-none">{preset.name}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-44">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Escolha um meio
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {preset.mediums.map((medium) => (
                  <DropdownMenuItem
                    key={medium}
                    onSelect={() => {
                      setValue("utm_source", preset.source, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                      setValue("utm_medium", medium, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                    className="capitalize"
                  >
                    {medium}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        })}
      </div>
    </div>
  );
}
