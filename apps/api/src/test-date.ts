import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const contents = await prisma.content.findMany({
    select: {
      id: true,
      title: true,
      channel: true,
      scheduledAt: true
    }
  })
  
  console.log('--- LISTA DE CONTEÚDOS E SEUS AGENDAMENTOS BRUTOS NO BANCO ---')
  contents.forEach(c => {
    console.log(`Título: ${c.title}`)
    console.log(`Canal: ${c.channel}`)
    console.log(`Agendado Para (Raw): ${c.scheduledAt ? c.scheduledAt.toISOString() : 'Não agendado'}`)
    console.log('----------------------------------------------------')
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
