import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Limpar dados existentes
  await prisma.task.deleteMany()
  await prisma.content.deleteMany()

  // Conteúdos de exemplo
  const contents = await Promise.all([
    prisma.content.create({
      data: {
        title: 'Top 10 Filmes de Suspense que Você Precisa Assistir',
        briefing: 'Lista curada de filmes de suspense com análise de cada um. Foco em filmes menos conhecidos.',
        channel: 'BLOG',
        status: 'ROTEIRO',
        scheduledAt: new Date('2026-06-20T10:00:00Z'),
        tags: ['suspense', 'lista', 'recomendação'],
        tasks: {
          create: [
            { title: 'Pesquisar filmes pouco conhecidos', completed: true, priority: 'HIGH' },
            { title: 'Escrever sinopses sem spoiler', completed: false, priority: 'HIGH' },
            { title: 'Revisar SEO do artigo', completed: false, priority: 'MEDIUM' },
            { title: 'Criar imagem de capa', completed: false, priority: 'LOW' },
          ],
        },
      },
    }),
    prisma.content.create({
      data: {
        title: 'Review: O Brutalista (2024)',
        briefing: 'Análise completa do filme The Brutalist. Cinematografia, atuação, roteiro.',
        script: 'O Brutalista é uma obra monumental que...',
        channel: 'YOUTUBE_LONGO',
        status: 'EDICAO',
        scheduledAt: new Date('2026-06-22T18:00:00Z'),
        tags: ['review', 'drama', '2024'],
        tasks: {
          create: [
            { title: 'Gravar locução', completed: true, priority: 'HIGH' },
            { title: 'Selecionar cenas para B-roll', completed: true, priority: 'HIGH' },
            { title: 'Editar vídeo', completed: false, priority: 'HIGH' },
            { title: 'Criar thumbnail', completed: false, priority: 'MEDIUM' },
          ],
        },
      },
    }),
    prisma.content.create({
      data: {
        title: '5 Filmes para Assistir Neste Final de Semana',
        channel: 'INSTAGRAM',
        status: 'IDEIA',
        tags: ['reels', 'recomendação', 'fim de semana'],
        tasks: {
          create: [
            { title: 'Definir os 5 filmes', completed: false, priority: 'HIGH' },
          ],
        },
      },
    }),
    prisma.content.create({
      data: {
        title: 'Cena Icônica: "Here\'s Johnny!" - O Iluminado',
        briefing: 'Análise da cena mais icônica de O Iluminado. Curiosidades de bastidores.',
        channel: 'TIKTOK',
        status: 'PAUTA',
        scheduledAt: new Date('2026-06-25T12:00:00Z'),
        tags: ['cena-iconica', 'terror', 'kubrick'],
        tasks: {
          create: [
            { title: 'Recortar cena do filme', completed: false, priority: 'HIGH' },
            { title: 'Escrever roteiro de 60s', completed: false, priority: 'HIGH' },
          ],
        },
      },
    }),
    prisma.content.create({
      data: {
        title: 'Oscar 2026: Análise Completa dos Indicados',
        briefing: 'Cobertura completa das indicações ao Oscar 2026.',
        script: 'O Oscar 2026 trouxe surpresas em diversas categorias...',
        channel: 'BLOG',
        status: 'POSTADO',
        scheduledAt: new Date('2026-03-01T08:00:00Z'),
        publishedAt: new Date('2026-03-01T08:30:00Z'),
        publishUrl: 'https://vibesfilm.com/oscar-2026-indicados',
        tags: ['oscar', 'premiação', '2026'],
      },
    }),
    prisma.content.create({
      data: {
        title: 'Dune: Parte 3 - O que esperar?',
        briefing: 'Especulações sobre Dune 3 baseadas nos livros.',
        channel: 'YOUTUBE_SHORTS',
        status: 'AGENDADO',
        scheduledAt: new Date('2026-06-28T15:00:00Z'),
        tags: ['dune', 'sci-fi', 'especulação'],
        tasks: {
          create: [
            { title: 'Gravar vídeo vertical', completed: true, priority: 'HIGH' },
            { title: 'Adicionar legendas', completed: true, priority: 'MEDIUM' },
            { title: 'Agendar no YouTube Studio', completed: false, priority: 'HIGH' },
          ],
        },
      },
    }),
    prisma.content.create({
      data: {
        title: 'Maratona Ghibli: Guia Definitivo',
        channel: 'BLOG',
        status: 'LOCUCAO_GRAVACAO',
        scheduledAt: new Date('2026-07-05T10:00:00Z'),
        tags: ['ghibli', 'animação', 'guia'],
        briefing: 'Guia completo para maratonar os filmes do Studio Ghibli na ordem ideal.',
        tasks: {
          create: [
            { title: 'Listar todos os filmes Ghibli', completed: true, priority: 'HIGH' },
            { title: 'Definir ordem de maratona', completed: true, priority: 'HIGH' },
            { title: 'Escrever sobre cada filme', completed: false, priority: 'HIGH' },
            { title: 'Selecionar imagens', completed: false, priority: 'MEDIUM' },
          ],
        },
      },
    }),
  ])

  console.log(`✅ Criados ${contents.length} conteúdos com suas tasks.`)
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
