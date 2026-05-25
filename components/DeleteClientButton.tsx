"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { deleteClientPage } from "@/lib/page-actions";

type Props = {
  clientPageId: string;
  clientName: string;
  redirectTo?: string;
  variant?: "destructive" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  iconOnly?: boolean;
};

export function DeleteClientButton({
  clientPageId,
  clientName,
  redirectTo,
  variant = "ghost",
  size = "sm",
  iconOnly = false,
}: Props) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  const onClick = () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    startTransition(async () => {
      const result = await deleteClientPage(clientPageId);
      if (!result.ok) {
        toast.error(result.error);
        setConfirming(false);
      } else {
        toast.success(`"${clientName}" removido`);
        if (redirectTo) router.push(redirectTo);
      }
    });
  };

  if (iconOnly) {
    return (
      <Button
        type="button"
        variant={confirming ? "destructive" : variant}
        size="icon"
        onClick={onClick}
        disabled={pending}
        aria-label={confirming ? "Confirmar exclusão" : "Excluir"}
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={confirming ? "destructive" : variant}
      size={size}
      onClick={onClick}
      disabled={pending}
    >
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="mr-2 h-4 w-4" />
      )}
      {confirming ? "Confirmar exclusão" : "Excluir"}
    </Button>
  );
}
