"use client";

import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useClipboard } from "@/hooks/useClipboard";

type Props = {
  value: string;
  label?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
};

export function CopyLinkButton({
  value,
  label = "Copiar link",
  variant = "outline",
  size = "sm",
}: Props) {
  const { copy, copied } = useClipboard({ successMessage: "Link copiado!" });
  const Icon = copied ? Check : Copy;

  if (!label) {
    return (
      <Button
        type="button"
        variant={variant}
        size="icon"
        onClick={() => copy(value)}
        aria-label="Copiar link"
      >
        <Icon className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={() => copy(value)}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
