-- CreateEnum
CREATE TYPE "Channel" AS ENUM ('INSTAGRAM', 'TIKTOK', 'YOUTUBE_SHORTS', 'YOUTUBE_LONGO', 'BLOG');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('IDEIA', 'PAUTA', 'ROTEIRO', 'LOCUCAO_GRAVACAO', 'EDICAO', 'AGENDADO', 'POSTADO');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "contents" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "briefing" TEXT,
    "script" TEXT,
    "channel" "Channel" NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'IDEIA',
    "scheduledAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "thumbnailUrl" TEXT,
    "publishUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "dueDate" TIMESTAMP(3),
    "contentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "contents_status_idx" ON "contents"("status");

-- CreateIndex
CREATE INDEX "contents_channel_idx" ON "contents"("channel");

-- CreateIndex
CREATE INDEX "contents_scheduledAt_idx" ON "contents"("scheduledAt");

-- CreateIndex
CREATE INDEX "contents_channel_status_idx" ON "contents"("channel", "status");

-- CreateIndex
CREATE INDEX "tasks_contentId_idx" ON "tasks"("contentId");

-- CreateIndex
CREATE INDEX "tasks_completed_idx" ON "tasks"("completed");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "contents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
