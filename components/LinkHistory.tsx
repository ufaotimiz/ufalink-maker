"use client";

import { useState } from "react";
import { History, Search, Trash } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LinkHistoryItem } from "@/components/LinkHistoryItem";
import { useLinkHistory } from "@/hooks/useLinkHistory";

export function LinkHistory() {
  const [query, setQuery] = useState("");
  const { links, total, hydrated, clear } = useLinkHistory(query);

  return (
    <Card className="flex h-full max-h-[640px] flex-col">
      <CardHeader className="space-y-2 pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Histórico</CardTitle>
          </div>
          {total > 0 ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => clear()}
              className="text-xs text-muted-foreground hover:text-destructive"
            >
              <Trash className="mr-1 h-3.5 w-3.5" />
              Limpar
            </Button>
          ) : null}
        </div>
        <CardDescription>
          {hydrated && total === 0
            ? "Salve links gerados para reaproveitar depois."
            : `${total} ${total === 1 ? "link salvo" : "links salvos"}`}
        </CardDescription>
        {total > 0 ? (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por URL, source, campanha..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        {!hydrated ? (
          <EmptyState
            title="Carregando..."
            description="Buscando links salvos no seu navegador."
          />
        ) : total === 0 ? (
          <EmptyState
            title="Sem histórico ainda"
            description="Quando você salvar um link, ele aparece aqui — fica armazenado só no seu navegador."
          />
        ) : links.length === 0 ? (
          <EmptyState
            title="Nada encontrado"
            description={`Nenhum link bate com "${query}".`}
          />
        ) : (
          <ScrollArea className="h-full px-4 pb-4">
            <ul className="space-y-2">
              {links.map((link) => (
                <LinkHistoryItem key={link.id} link={link} />
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1 px-6 py-12 text-center">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
