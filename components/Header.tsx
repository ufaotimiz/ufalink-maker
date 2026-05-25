import { Link2 } from "lucide-react";

import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Link2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold tracking-tight">
              Link Maker
            </span>
            <span className="text-xs text-muted-foreground">
              Gerador de UTM para redes sociais
            </span>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
