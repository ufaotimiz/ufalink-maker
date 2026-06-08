"use client";

import { getIconByKey, type LinkIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/** True quando o valor de ícone é uma imagem (URL http(s) ou caminho absoluto). */
export function isImageIcon(icon?: string | null): boolean {
  return !!icon && /^(https?:\/\/|\/)/.test(icon);
}

type Props = {
  /** null/undefined → automático (usa `fallback`); URL → imagem; senão → chave do registro. */
  icon?: string | null;
  fallback: LinkIcon;
  className?: string;
};

/** Renderiza o ícone de um item: imagem enviada, ícone do registro, ou o fallback automático. */
export function LinkIconView({ icon, fallback: Fallback, className }: Props) {
  if (isImageIcon(icon)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={icon as string} alt="" className={cn("object-contain", className)} />
    );
  }
  const ByKey = icon ? getIconByKey(icon) : null;
  const Icon = ByKey ?? Fallback;
  return <Icon className={className} />;
}
