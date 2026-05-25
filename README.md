# Link Maker

Ferramenta web para gerar links rastreáveis (UTM) para campanhas em redes sociais — Instagram, Facebook, TikTok, LinkedIn, X e YouTube — com preview em tempo real, cópia rápida e histórico local.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **TailwindCSS** + **shadcn/ui** + **lucide-react**
- **React Hook Form** + **Zod** (validação)
- **Zustand** com `persist` middleware (histórico em `localStorage`)
- **next-themes** (dark mode) + **sonner** (toasts)

## Pré-requisitos

- Node.js 18.18+ (testado em 24.x)
- pnpm 9+

## Como rodar

```bash
pnpm install
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando | Descrição |
|---|---|
| `pnpm dev` | Sobe o servidor de desenvolvimento |
| `pnpm build` | Build de produção |
| `pnpm start` | Sobe o build de produção |
| `pnpm lint` | Roda o ESLint |
| `pnpm format` | Formata com Prettier |

## Estrutura

```
/app            → páginas e layout do App Router
/components     → componentes da aplicação
  /ui           → primitives do shadcn/ui
/hooks          → hooks reutilizáveis (useClipboard, useLinkGenerator, useLinkHistory)
/lib            → utilidades puras (url-builder, link-schema, social-presets, history-store)
/types          → tipos TypeScript compartilhados
```

## Funcionalidades MVP

- Formulário com URL base + 5 campos UTM (source, medium, campaign, content, term)
- Presets de redes sociais que preenchem `utm_source` e oferecem `utm_medium` por contexto
- Preview do link gerado atualizado em tempo real
- Botões: copiar, salvar, testar (abre em nova aba)
- Histórico persistente no navegador com busca e exclusão
- Dark mode automático (segue sistema) ou via toggle

## Próximas fases

Backend com Prisma/PostgreSQL, login, dashboard de analytics, QR Code, encurtador próprio, exportação CSV, integração Google Analytics.
