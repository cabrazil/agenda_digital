import { join } from 'path'
import { existsSync, readFileSync } from 'fs'

const envPath = join(__dirname, '../../.env')
if (existsSync(envPath)) {
  try {
    if (typeof (process as any).loadEnvFile === 'function') {
      (process as any).loadEnvFile(envPath)
    } else {
      const dotenvContent = readFileSync(envPath, 'utf-8')
      dotenvContent.split('\n').forEach((line) => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
        if (match) {
          const key = match[1]
          let val = match[2] || ''
          if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
          if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1)
          if (!process.env[key]) {
            process.env[key] = val
          }
        }
      })
    }
  } catch (e) {
    console.error('Erro ao carregar .env manualmente:', e)
  }
}
