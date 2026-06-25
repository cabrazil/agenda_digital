import { buildApp } from './app'

const app = buildApp()
const PORT = Number(process.env.PORT) || 3333

app.listen({ port: PORT, host: '0.0.0.0' }).then(() => {
  console.log(`🚀 API rodando em http://localhost:${PORT}`)
})
