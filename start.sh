#!/bin/bash

echo "==================================="
echo "🏛️  Sistema de Gestão de Minutas Jurídicas"
echo "==================================="
echo ""
echo "📋 Verificando dependências..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

echo ""
echo "🚀 Iniciando servidor de desenvolvimento..."
echo ""
echo "📱 Acesse o sistema em:"
echo "   Local:   http://localhost:5173/"
echo "   Network: http://192.168.18.5:5173/"
echo ""
echo "🎯 Funcionalidades principais:"
echo "   • Dashboard com métricas departamentais"
echo "   • Lista de processos com filtros inteligentes"
echo "   • Análise FIRAC automatizada"
echo "   • Sistema de etiquetagem por IA"
echo "   • Validação em lote de tags"
echo ""
echo "🔄 Para parar o servidor: Ctrl+C"
echo ""

npm run dev