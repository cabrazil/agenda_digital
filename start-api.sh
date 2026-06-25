#!/bin/bash

# Script para acionar e gerenciar o backend Fastify (apps/api)
# Salve este arquivo na raiz do projeto e execute com: ./start-api.sh

API_DIR="apps/api"
PORT=3333

echo "🚀 Iniciando o backend (Fastify)..."

# 1. Navega para a pasta da API
if [ -d "$API_DIR" ]; then
  cd "$API_DIR" || exit
else
  echo "❌ Erro: Diretório $API_DIR não encontrado."
  exit 1
fi

# 2. Verifica se a porta já está ocupada
if lsof -i :$PORT -t >/dev/null ; then
  echo "⚠️ Porta $PORT já está em uso. Derrubando processo antigo..."
  fuser -k $PORT/tcp 2>/dev/null
  sleep 1
fi

# 3. Executa a API
echo "🔌 Servidor iniciando na porta $PORT..."
npx tsx watch src/server.ts

