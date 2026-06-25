# 📋 Agenda vibesfilm

> Sistema de agendamento e produção de conteúdo para criadores digitais.
> Gerencie ideias, roteiros, gravações e publicações em um só lugar.

**Stack:** Fastify + Prisma + Supabase (PostgreSQL) | Next.js (App Router) + Tailwind CSS

---

## Sumário

1. [Rodando o Projeto](#1-rodando-o-projeto)
2. [Estrutura Geral](#2-estrutura-geral)
3. [Dashboard](#3-dashboard)
4. [Kanban Board](#4-kanban-board)
5. [Calendário](#5-calendário)
6. [Editor de Conteúdo](#6-editor-de-conteúdo)
7. [Referência Rápida](#7-referência-rápida)
8. [Deploy em Produção](#8-deploy-em-produção)

---

## 1. Rodando o Projeto

### Pré-requisitos

- Node.js ≥ 18
- npm ≥ 9
- Conta no Supabase com o projeto **Agenda** configurado

### Estrutura do Monorepo

```
agenda/
├── apps/
│   ├── api/    ← Backend Fastify (porta 3333)
│   └── web/    ← Frontend Next.js (porta 3000)
```

### Iniciar o Backend (API)

```bash
# Na raiz do projeto
cd apps/api

# Primeira vez: configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais do Supabase

# Criar/atualizar tabelas no banco
npx prisma migrate dev

# Popular banco com dados de exemplo
npx prisma db seed

# Iniciar servidor de desenvolvimento
npx tsx src/server.ts
# API disponível em: http://localhost:3333
```

### Iniciar o Frontend (Web)

```bash
# Em outro terminal, na raiz do projeto
cd apps/web

# Iniciar Next.js
npm run dev
# App disponível em: http://localhost:3000
```

> O app abre em `http://localhost:3000` e redireciona automaticamente para `/dashboard`.

### Verificar se está tudo ok

Abra `http://localhost:3333/api/health` no navegador. Deve retornar:
```json
{ "status": "ok", "timestamp": "..." }
```

---

## 2. Estrutura Geral

A aplicação é dividida em **3 visões principais**, acessadas pela barra lateral esquerda:

| Ícone | Página | Para que serve |
|-------|--------|----------------|
| 📊 | **Dashboard** | Visão geral: métricas, pipeline e conteúdos recentes |
| 🗂️ | **Kanban** | Gerenciar o status de cada conteúdo via drag-and-drop |
| 📅 | **Calendário** | Ver o que está agendado por data e canal |

Ao clicar em qualquer card (Kanban ou Dashboard), você abre o **Editor de Conteúdo** — onde escreve roteiros, gerencia tarefas e define datas.

---

## 3. Dashboard

**Acesso:** `/dashboard`

A página de entrada mostra um panorama rápido da sua produção.

### Cards de Métricas (topo)

| Card | O que mostra |
|------|-------------|
| **Total de Conteúdos** | Soma de todos os conteúdos cadastrados |
| **Em Produção** | Conteúdos entre Pauta e Edição (excluindo Ideia e Postado) |
| **Agendados** | Conteúdos com status AGENDADO |
| **Postados** | Conteúdos já publicados |

### Pipeline de Produção (coluna esquerda)

Barras horizontais mostrando a **distribuição por status**. Permite identificar gargalos — ex: muitos conteúdos travados em "Edição".

### Conteúdos Recentes (coluna direita)

Lista os **6 conteúdos mais recentemente atualizados**. Cada linha mostra:
- Bolinha colorida com o status atual
- Título (clicável → abre o editor)
- Badge do canal
- Data de agendamento (se houver)

---

## 4. Kanban Board

**Acesso:** `/kanban`

O Kanban é o **centro de controle** da sua produção. Cada coluna representa uma etapa do pipeline.

### As 7 Colunas

```
IDEIA → PAUTA → ROTEIRO → GRAVAÇÃO → EDIÇÃO → AGENDADO → POSTADO
```

| Coluna | Cor | Significa |
|--------|-----|-----------| 
| **Ideia** | Cinza | Concept inicial, ainda sem pauta definida |
| **Pauta** | Âmbar | Tema definido, pronto para roteirizar |
| **Roteiro** | Azul | Script em andamento ou concluído |
| **Gravação** | Roxo | Em processo de locução ou gravação de vídeo |
| **Edição** | Rosa | Material gravado, em edição |
| **Agendado** | Laranja | Pronto, data de publicação definida |
| **Postado** | Verde | Publicado! 🎉 |

### Como mover um card

1. **Clique e segure** em qualquer card
2. **Arraste** para a coluna destino
3. **Solte** — o status é salvo automaticamente no banco

> A atualização é **otimista**: o card se move na tela imediatamente, mesmo antes da API confirmar. Se houver erro de rede, o card volta à posição original com uma notificação.

### O que aparece em cada card

- **Badge do canal** (Instagram, TikTok, YouTube, Blog)
- **Título** do conteúdo
- **Progresso de tarefas** (ex: `2/4`) com barra de progresso
- **Data de agendamento** (se definida)

### Clicar num card

Leva para a página de detalhes (`/content/[id]`) onde você edita tudo.

---

## 5. Calendário

**Acesso:** `/calendar`

Visão mensal de todos os conteúdos que possuem **data de agendamento** (`scheduledAt`) definida.

### Navegação

| Botão | Ação |
|-------|------|
| `‹` | Mês anterior |
| `Hoje` | Volta para o mês atual |
| `›` | Próximo mês |

### Eventos no calendário

Cada conteúdo agendado aparece como uma **pílula colorida** no dia correspondente. A cor identifica o **canal**:

| Canal | Cor |
|-------|-----|
| Instagram | Rosa |
| TikTok | Branco/Cinza |
| YouTube Shorts | Vermelho |
| YouTube Longo | Vermelho |
| Blog | Índigo/Roxo |

- Se houver **mais de 3 eventos** no mesmo dia, aparece `+X mais`
- **Clique em qualquer evento** para abrir o editor daquele conteúdo

### Legenda

Na parte inferior do calendário há uma legenda visual com todos os canais e suas cores.

> Para que um conteúdo apareça no calendário, é necessário definir uma **data de agendamento** no editor de conteúdo.

---

## 6. Editor de Conteúdo

**Acesso:** Clicar em qualquer card do Kanban, Dashboard ou evento do Calendário

É a tela mais completa do sistema. Dividida em seções:

### Barra Superior

- **← Voltar** — retorna à página anterior
- **Ver publicado** — abre o link da publicação (aparece só se `publishUrl` estiver preenchido)
- **Deletar** — remove o conteúdo (pede confirmação)

### Seção: Cabeçalho do Conteúdo

| Campo | Como editar |
|-------|-------------|
| **Título** | Clique no texto e edite diretamente. Salva ao clicar fora (`onBlur`) |
| **Canal** | Exibido como badge |
| **Status** | Dropdown — selecione qualquer etapa do pipeline |
| **Agendado para** | Input de data e hora — define quando o conteúdo será publicado |

> Ao mudar o status para **POSTADO**, o sistema registra automaticamente a `publishedAt` com a data/hora atual.

### Seção: Pauta / Briefing

Campo de texto livre para descrever a ideia, ângulo do vídeo, principais pontos a abordar.

- Salva ao clicar fora do campo (`onBlur`)

### Seção: Roteiro

O editor principal de texto.

**Auto-save:** o roteiro é salvo **automaticamente 1,5 segundos** após você parar de digitar. Você verá "Salvando…" enquanto isso ocorre.

**Contadores em tempo real:**
- **Palavras** — útil para estimar duração de vídeos (média: 130 palavras/min)
- **Caracteres** — útil para posts com limite (ex: legendas)

> **Estimativas de tempo:**
> - 130 palavras ≈ 1 min de vídeo (ritmo normal)
> - 200 palavras ≈ 1 min de vídeo (ritmo acelerado / TikTok)
> - Posts Instagram: ideal até 2.200 caracteres

### Seção: Tarefas

Checklist de subtarefas vinculadas ao conteúdo.

- **Adicionar:** Digite o título e pressione **Enter** ou clique em `+`
- **Concluir:** Clique no círculo à esquerda — vira ✅ verde
- **Remover:** Passe o mouse → ícone 🗑️ aparece à direita

**Exemplos de tarefas típicas por canal:**

| Canal | Tarefas comuns |
|-------|---------------|
| Blog | Pesquisa, Rascunho, Revisar SEO, Imagem de capa, Publicar |
| YouTube | Gravar locução, Selecionar B-roll, Editar, Thumbnail, Upload |
| Instagram/TikTok | Gravar, Legenda, Áudio, Caption, Agendar |

---

## 7. Referência Rápida

### Status do Pipeline

```
IDEIA → PAUTA → ROTEIRO → LOCUCAO_GRAVACAO → EDICAO → AGENDADO → POSTADO
```

### Canais Suportados

| Valor no sistema | Exibição |
|-----------------|---------|
| `INSTAGRAM` | Instagram |
| `TIKTOK` | TikTok |
| `YOUTUBE_SHORTS` | YT Shorts |
| `YOUTUBE_LONGO` | YouTube |
| `BLOG` | Blog |

### Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/health` | Status da API |
| `GET` | `/api/contents` | Listar conteúdos (`?status=` `?channel=`) |
| `GET` | `/api/contents/calendar` | Por intervalo de datas (`?startDate=` `?endDate=`) |
| `GET` | `/api/contents/stats` | Estatísticas por status e canal |
| `GET` | `/api/contents/:id` | Detalhes de um conteúdo |
| `POST` | `/api/contents` | Criar conteúdo |
| `PUT` | `/api/contents/:id` | Atualizar conteúdo completo |
| `PATCH` | `/api/contents/:id/status` | Atualizar apenas o status |
| `DELETE` | `/api/contents/:id` | Deletar conteúdo |
| `GET` | `/api/tasks?contentId=` | Tarefas de um conteúdo |
| `POST` | `/api/tasks` | Criar tarefa |
| `PATCH` | `/api/tasks/:id` | Atualizar tarefa |
| `PATCH` | `/api/tasks/:id/toggle` | Alternar concluído/pendente |
| `DELETE` | `/api/tasks/:id` | Deletar tarefa |

### Variáveis de Ambiente

**Backend (`apps/api/.env`):**
```env
DATABASE_URL="postgresql://..."   # URL do pooler Supabase (porta 6543)
DIRECT_URL="postgresql://..."     # URL direta (porta 5432) — para migrations
PORT=3333
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**Frontend (`apps/web/.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3333/api
```

---

## 8. Deploy em Produção

### Frontend → Vercel

1. Push do repositório para o GitHub
2. Importe o projeto na [Vercel](https://vercel.com)
3. Configure o **Root Directory** como `apps/web`
4. Adicione a variável de ambiente:
   ```
   NEXT_PUBLIC_API_URL=https://sua-api.railway.app/api
   ```
5. Deploy automático a cada `git push`

### Backend → Railway

1. Acesse [railway.app](https://railway.app) e crie um novo projeto
2. Conecte ao repositório GitHub
3. Configure o **Root Directory** como `apps/api`
4. Adicione as variáveis de ambiente (as mesmas do `.env` local)
5. Configure o **Start Command**:
   ```
   npx prisma migrate deploy && node dist/server.js
   ```
6. Configure o **Build Command**:
   ```
   npm install && npx prisma generate && npm run build
   ```

> **Atenção:** Em produção, atualize `FRONTEND_URL` na API para o domínio real da Vercel, para o CORS funcionar corretamente.

> **Segurança:** Nunca faça commit do arquivo `.env` com credenciais reais. O `.gitignore` já está configurado para ignorá-lo.

---

## Comandos Úteis

```bash
# Interface visual do banco (Prisma Studio)
cd apps/api && npx prisma studio

# Re-popular banco com dados de exemplo
cd apps/api && npx prisma db seed

# API com hot-reload
cd apps/api && npx tsx watch src/server.ts

# Nova migration após alterar schema.prisma
cd apps/api && npx prisma migrate dev --name "descricao-da-mudanca"

# Build de produção do frontend
cd apps/web && npm run build
```

---

> Desenvolvido para o [vibesfilm.com](https://vibesfilm.com) 🎬
