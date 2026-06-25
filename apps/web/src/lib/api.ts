import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (!error.response) {
      // Erro de rede: API offline, CORS, timeout, etc.
      console.error('[API Error] Sem resposta da API — verifique se o servidor está rodando em http://localhost:3333', error.message)
      return Promise.reject(new Error('Não foi possível conectar à API. Verifique se o servidor está rodando.'))
    }

    // Erro HTTP retornado pela API
    const status  = error.response.status
    const data    = error.response.data
    const message = data?.error || data?.message || `Erro ${status}`
    console.error(`[API Error] ${status}:`, data)
    return Promise.reject(new Error(message))
  },
)
