# Sistema de Gestão de Minutas Jurídicas - Setup

## 🚀 Como executar o projeto

### Pré-requisitos
- Node.js 18+ (LTS recomendado)
- npm ou yarn

### Instalação e Execução

1. **Instalar dependências:**
```bash
npm install
```

2. **Executar em modo desenvolvimento:**
```bash
npm run dev
```

3. **Abrir no navegador:**
```
http://localhost:5173
```

### Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento com hot reload
npm run build        # Build otimizado para produção
npm run preview      # Preview da build de produção
npm run lint         # Verificação de código e tipos
npm run type-check   # Validação TypeScript
```

## 🎯 Funcionalidades Principais

### Dashboard
- Métricas operacionais em tempo real
- Distribuição por departamentos
- Processos urgentes
- Indicadores de performance da IA

### Lista de Processos
- **Filtros por departamento** (Fiscal, Judicial, Administrativo, Saúde, etc.)
- **Filtros por complexidade** (Simples, Média, Complexa, Estratégica)
- **Filtros por prazo** (Urgentes, Vencendo, Normais)
- **Busca inteligente** por número de processo, partes ou assunto
- **Seleção em lote** para validação de tags
- **Indicadores de confiança da IA**

### Detalhes do Processo
- **Análise FIRAC completa** (Facts, Issues, Rules, Analysis, Conclusion)
- **Sistema de tags automáticas** com validação manual
- **Prazos críticos** com alertas visuais
- **Métricas de IA** e confiança

## 🏷️ Sistema de Etiquetagem

O sistema demonstra um **agrupamento inteligente** de processos através de:

### Departamentos
- **Fiscal:** Questões tributárias e fazendárias
- **Judicial:** Processos judiciais e litígios
- **Administrativo:** Direito administrativo e servidores
- **Saúde:** Ações de saúde pública e medicamentos
- **Ambiental:** Questões ambientais e licenciamento
- **Patrimônio:** Gestão de bens públicos
- **Trabalhista:** Relações de trabalho
- **Urbanismo:** Planejamento urbano e zoneamento
- **Licitação:** Processos licitatórios e contratos

### Níveis de Complexidade
- **Simples:** Procedimentos padrão
- **Média:** Casos com pesquisa moderada
- **Complexa:** Casos de alta complexidade
- **Estratégica:** Impacto institucional significativo

### Tipos de Ação
- **Resposta Obrigatória:** Prazo crítico para manifestação
- **Recurso:** Procedimentos recursais
- **Defesa:** Contestações e defesas
- **Cumprimento:** Execução de decisões
- **Monitoramento:** Acompanhamento processual

## 📊 Dados de Demonstração

O sistema utiliza dados mockados baseados em:
- **Processo real:** 0835078-22.2023.8.20.5001 (Enquadramento funcional)
- **Análise FIRAC** estruturada conforme metodologia jurídica
- **Variety de cenários** (urgentes, alto valor, diferentes complexidades)
- **Distribuição realística** entre departamentos

## 🎨 Design System

### Cores por Categoria
- **Fiscal:** Verde (Calculator)
- **Judicial:** Azul (Scale)
- **Administrativo:** Roxo (FileText)
- **Saúde:** Vermelho (Heart)
- **Ambiental:** Verde esmeralda (Leaf)
- **Patrimônio:** Laranja (Building)

### Responsividade
- **Mobile:** Navegação colapsável
- **Tablet:** Layout adaptativo
- **Desktop:** Experiência completa com painéis laterais

## 🤖 Simulação de IA

O sistema simula:
- **Classificação automática** com níveis de confiança (60-95%)
- **Análise FIRAC** estruturada
- **Sugestões de minutas** baseadas em templates
- **Distribuição departamental** inteligente
- **Priorização automática** por prazo e valor

## 🎯 Objetivos da Demonstração

1. **Mostrar eficiência:** 80% redução no tempo de elaboração
2. **Demonstrar precisão:** 90% de acerto na classificação
3. **Validar fluxo:** Processo revisor > validador > aprovador
4. **Comprovar valor:** Foco do procurador em análise, não em criação

## 📱 Fluxo de Uso Recomendado

1. **Dashboard:** Visualizar métricas e processos urgentes
2. **Filtrar por Departamento:** Selecionar área de atuação
3. **Revisar Tags:** Validar classificações da IA
4. **Analisar FIRAC:** Revisar análise jurídica estruturada
5. **Aprovar Minutas:** Confirmar ou editar documentos gerados
6. **Monitorar Prazos:** Acompanhar deadlines críticos

---

**Foco Principal:** Demonstrar que a IA funciona como uma **assessoria jurídica automatizada**, entregando trabalho organizado e classificado que requer apenas **revisão e aprovação** do procurador.