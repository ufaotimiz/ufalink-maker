# CLAUDE.md

## Visão Geral do Projeto

Este projeto é um site de criação de links personalizados (“Link Maker”).
O objetivo é permitir que usuários gerem links customizados de forma rápida, moderna e intuitiva.

O foco principal do sistema é:

- UX simples e rápida
- Interface moderna e responsiva
- Performance alta
- SEO básico otimizado
- Código limpo e escalável
- Estrutura organizada para crescimento futuro

---

# Stack Principal

## Frontend

- React
- Next.js
- TypeScript
- TailwindCSS
- Shadcn/ui

## Backend

- Node.js
- API Routes do Next.js

## Banco de Dados

- PostgreSQL
- Prisma ORM

## Deploy

- Vercel

---

# Objetivo do Produto

O usuário deve conseguir:

1. Criar links personalizados
2. Adicionar parâmetros automaticamente
3. Copiar links rapidamente
4. Gerenciar links salvos
5. Visualizar estatísticas futuramente
6. Utilizar o sistema em mobile e desktop

---

# Regras Gerais de Desenvolvimento

## Código

- Sempre usar TypeScript
- Evitar `any`
- Priorizar funções pequenas e reutilizáveis
- Componentes devem ter responsabilidade única
- Utilizar nomenclatura clara e consistente
- Não duplicar lógica
- Preferir composição ao invés de código repetido

## Estrutura

- Componentes reutilizáveis em `/components`
- Páginas em `/app`
- Hooks em `/hooks`
- Libs utilitárias em `/lib`
- Tipagens em `/types`
- Serviços/API em `/services`

---

# Padrão Visual

## Design

O site deve seguir um visual:

- Moderno
- Minimalista
- Limpo
- Responsivo
- Dark mode friendly

## UI/UX

Prioridades:

- Inputs grandes e claros
- Botões destacados
- Feedback visual imediato
- Loading states
- Toasts para ações
- Navegação intuitiva

---

# Funcionalidades Principais

## MVP

### Criador de Link

Campos:

- URL base
- UTM Source
- UTM Medium
- UTM Campaign
- UTM Content
- UTM Term

### Resultado

- Preview do link final
- Botão de copiar
- Validação de URL
- Geração em tempo real

### Histórico

- Salvar links criados
- Buscar links
- Excluir links

---

# Regras Técnicas

## Performance

- Evitar renders desnecessários
- Lazy loading quando possível
- Otimizar imagens
- Minimizar chamadas de API

## Segurança

- Validar inputs no frontend e backend
- Sanitizar URLs
- Nunca confiar apenas na validação do cliente

## Acessibilidade

- Labels em inputs
- Navegação via teclado
- Contraste adequado
- aria-label quando necessário

---

# Convenções

## Componentes

- PascalCase
- Exemplo:
  - `LinkForm.tsx`
  - `GeneratedLinkCard.tsx`

## Hooks

- Sempre iniciar com `use`
- Exemplo:
  - `useClipboard.ts`
  - `useLinkGenerator.ts`

## Variáveis

- camelCase

## Constantes

- UPPER_SNAKE_CASE

---

# Preferências de Implementação

## Formulários

Preferir:

- React Hook Form
- Zod para validação

## Estado

Preferir:

- Zustand para estados globais simples

## Requests

Preferir:

- Fetch API
- Server Actions quando fizer sentido

---

# Boas Práticas

## Antes de criar código

- Verificar se já existe componente parecido
- Reutilizar estilos
- Manter consistência visual

## Antes de finalizar

- Conferir responsividade
- Conferir TypeScript errors
- Conferir acessibilidade
- Conferir performance básica

---

# Não Fazer

- Não usar CSS inline desnecessário
- Não criar componentes gigantes
- Não misturar lógica e UI excessivamente
- Não usar bibliotecas pesadas sem necessidade

---

# Futuras Features

## Roadmap

- Login de usuários
- Dashboard analytics
- Encurtador de links
- QR Code generator
- Templates de campanha
- Exportação CSV
- Integração com Google Analytics

---

# Estilo de Resposta Esperado do Claude

Ao gerar código:

- Explicar rapidamente decisões importantes
- Priorizar código limpo e legível
- Entregar componentes completos
- Evitar pseudo-código
- Seguir a arquitetura do projeto
- Manter consistência entre arquivos
- Sempre sequir a estrutura de pastas