# AGENTS.md - Especificações Técnicas para Implementação

## 🤖 Instruções para IA Implementadora

Este documento fornece especificações técnicas detalhadas para que uma IA possa implementar o **Sistema de Gestão de Minutas Jurídicas** com base nos dados fornecidos e requisitos do usuário.

## 📋 Contexto e Dados Disponíveis

### Dados de Entrada Fornecidos
1. **README.md anterior:** Sistema omnichannel Portal Jus.BR
2. **HTML Dashboard:** Painel de processos existente
3. **HTML Processo:** Visualização detalhada de processo  
4. **JSON Processo:** Dados estruturados de processo real
5. **JSON Análise FIRAC:** Análise jurídica estruturada por IA
6. **Screenshots:** Exemplos visuais das telas desejadas

### Objetivo da Implementação
Criar um **mockup funcional** que demonstre para procuradores como será a experiência final do sistema de gestão automatizada de minutas, focando na **produtividade jurídica** e **validação de conceitos**.

## 🏗️ Arquitetura Técnica Requerida

### Stack Obrigatório
```json
{
  "framework": "React 18",
  "language": "TypeScript", 
  "bundler": "Vite",
  "styling": "Tailwind CSS",
  "icons": "Lucide React",
  "routing": "React Router v6",
  "state": "React Hooks (useState, useEffect, useContext)"
}
```

### Estrutura de Diretórios
```
src/
├── components/
│   ├── dashboard/
│   │   ├── MetricsCards.tsx
│   │   ├── ProductivityChart.tsx
│   │   └── PrazosUrgentes.tsx
│   ├── intimacoes/
│   │   ├── IntimacaosList.tsx
│   │   ├── FiltrosInteligentes.tsx
│   │   └── EtiquetasIA.tsx
│   ├── processo/
│   │   ├── ProcessoDetalhes.tsx
│   │   ├── AnaliseFireac.tsx
│   │   └── TimelineProcesso.tsx
│   ├── minutas/
│   │   ├── EditorMinutas.tsx
│   │   ├── SugestoesIA.tsx
│   │   └── ValidadorJuridico.tsx
│   └── common/
│       ├── Layout.tsx
│       ├── Navigation.tsx
│       └── LoadingStates.tsx
├── hooks/
│   ├── useProcessos.ts
│   ├── useMinutas.ts
│   └── useAnaliseIA.ts
├── services/
│   ├── mockApi.ts
│   └── dataTransformers.ts
├── types/
│   ├── processo.types.ts
│   ├── minutas.types.ts
│   └── analytics.types.ts
├── data/
│   ├── processos-mock.json
│   ├── analises-firac-mock.json
│   └── minutas-mock.json
└── utils/
    ├── dateHelpers.ts
    ├── juridicHelpers.ts
    └── formatters.ts
```

## 📊 Dados Mockados - Especificações Detalhadas

### 1. Processos Mockados (baseado nos dados reais fornecidos)
```typescript
// Arquivo: data/processos-mock.json
interface ProcessoMock {
  id: string;
  numeroProcesso: string; // Ex: "0835078-22.2023.8.20.5001"
  tribunal: string;
  classe: string; // Ex: "CUMPRIMENTO DE SENTENÇA CONTRA A FAZENDA PÚBLICA"
  assunto: string; // Ex: "Enquadramento"
  partes: {
    ativo: string[]; // Ex: ["CAIO HIGOR MORAIS ARAUJO"]
    passivo: string[]; // Ex: ["Município de Natal"]
  };
  status: 'nova' | 'em_analise' | 'minuta_gerada' | 'concluida' | 'vencida';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  dataRecebimento: string;
  prazoResposta: string;
  valorCausa: number;
  etiquetasIA: EtiquetaIA[];
  intimacao?: IntimacaoData;
  analiseFireac?: AnaliseFireacData;
  minutaSugerida?: MinutaData;
}
```

### 2. Análises FIRAC (baseado no JSON fornecido)
```typescript
// Usar estrutura exata do JSON fornecido
interface AnaliseFireacData {
  identificacao: {
    processo: string;
    juizo: string;
    assunto: string;
    partes: string;
    fase: string;
  };
  fatos: Array<{
    data: string;
    descricao: string;
    classificacao: 'incontroverso' | 'controvertido';
    fonte: string;
  }>;
  questoes: Array<{
    descricao: string;
    secundarias?: string[];
  }>;
  regras: Array<{
    dispositivo: string;
    descricao: string;
  }>;
  analise: {
    correlacoes: Array<{
      fato: string;
      norma: string;
      implicacao: string;
    }>;
    pontos_fortes: string[];
    vulnerabilidades: string[];
  };
  conclusao: {
    estrategia: string;
    acoes_recomendadas: string[];
    provas_necessarias?: string[];
  };
  prazos: Array<{
    andamento: string;
    data: string;
    urgencia: 'baixa' | 'media' | 'alta';
    parte_responsavel: string;
    observacao: string;
  }>;
}
```

### 3. Minutas Geradas
```typescript
interface MinutaData {
  id: string;
  processoId: string;
  tipo: 'contestacao' | 'recurso' | 'peticao' | 'manifestacao' | 'embargo';
  conteudo: string;
  dataGeracao: string;
  status: 'rascunho' | 'revisao' | 'aprovada' | 'protocolada';
  metadados: {
    templateUtilizado: string;
    fundamentosLegais: string[];
    precedentesUtilizados: string[];
    confiancaIA: number;
    tempoGeracao: number;
  };
  revisoes: Array<{
    data: string;
    usuario: string;
    alteracoes: string;
    comentarios: string;
  }>;
}
```

## 🎨 Componentes Principais - Especificações

### 1. Dashboard Principal
```typescript
// components/dashboard/Dashboard.tsx
interface DashboardProps {
  // Sem props - usa hooks para dados
}

// Funcionalidades obrigatórias:
- Cards de métricas animados (CountUp effect)
- Gráfico de produtividade (usando biblioteca de charts simples)
- Lista de prazos urgentes (< 5 dias)
- Filtros rápidos funcionais
- Navegação para outras seções

// Métricas mockadas:
const metricasMock = {
  intimacoesRecebidas: 1247,
  minutasPendentes: 23,
  minutasConcluidas: 156,
  prazosUrgentes: 8,
  eficienciaIA: 87,
  tempoMedioPorMinuta: 15
};
```

### 2. Lista de Intimações
```typescript
// components/intimacoes/IntimacoesList.tsx
interface IntimacaoListProps {
  // Props para filtros e ordenação
}

// Funcionalidades obrigatórias:
- Tabela responsiva com ordenação
- Filtros por setor, prioridade, prazo
- Busca por número de processo ou partes
- Etiquetas coloridas por categoria
- Ações em lote (aprovação, redistribuição)
- Indicadores de urgência visuais
- Navegação para detalhes do processo

// Estados da intimação:
- nova: Recebida, aguardando análise
- em_analise: IA processando ou revisor analisando  
- minuta_gerada: Minuta criada, aguardando aprovação
- concluida: Minuta aprovada e protocolada
- vencida: Prazo expirado
```

### 3. Visualização de Processo
```typescript
// components/processo/ProcessoDetalhes.tsx
interface ProcessoDetalhesProps {
  processoId: string;
}

// Funcionalidades obrigatórias:
- Tabs para diferentes seções (Visão Geral, FIRAC, Minutas, Documentos)
- Timeline de movimentações
- Exibição de dados das partes
- Integração com análise FIRAC
- Área de minuta com editor
- Alertas de prazo com countdown
- Botões para ações (gerar minuta, aprovar, etc.)
```

### 4. Editor de Minutas
```typescript
// components/minutas/EditorMinutas.tsx
interface EditorMinutasProps {
  minuta?: MinutaData;
  processo: ProcessoMock;
  onSave: (minuta: MinutaData) => void;
}

// Funcionalidades obrigatórias:
- Editor de texto rico (usar div contentEditable ou textarea)
- Botões de formatação básica
- Sugestões da IA em sidebar
- Validação de fundamentos legais
- Preview de formatação final
- Controle de versões
- Export para PDF (simular)
```

## 🔄 Fluxos de Navegação Principais

### Fluxo 1: Dashboard → Lista → Processo → Minuta
```
1. Dashboard com métricas
2. Clicar em "Minutas Pendentes" → Lista de Intimações
3. Filtrar por "Alta Prioridade"
4. Clicar em processo específico → Detalhes do Processo
5. Tab "Análise FIRAC" → Mostrar análise completa
6. Tab "Minutas" → Editor com minuta sugerida
7. Editar e aprovar minuta
8. Retornar ao dashboard com métricas atualizadas
```

### Fluxo 2: Processo Urgente
```
1. Dashboard mostra "8 Prazos Urgentes"
2. Clicar no card → Lista filtrada por urgência
3. Primeiro processo com prazo < 3 dias
4. Alert vermelho no topo da página
5. Botão "Ação Rápida" → Modal de geração de minuta
6. Gerar minuta automática com base no FIRAC
7. Aprovar e protocolar
```

## 🎯 Regras de Negócio Implementadas

### Sistema de Priorização
```typescript
function calcularPrioridade(processo: ProcessoMock): 'baixa' | 'media' | 'alta' | 'urgente' {
  const diasRestantes = calcularDiasRestantes(processo.prazoResposta);
  const valorCausa = processo.valorCausa;
  
  if (diasRestantes <= 2) return 'urgente';
  if (diasRestantes <= 5) return 'alta';  
  if (valorCausa > 100000) return 'alta';
  if (diasRestantes <= 10) return 'media';
  return 'baixa';
}
```

### Sistema de Etiquetagem
```typescript
interface EtiquetaIA {
  categoria: 'assunto' | 'setor' | 'fase' | 'financeiro' | 'prazo' | 'complexidade';
  valor: string;
  confianca: number; // 0-100
  cor: string;
  icone?: string;
}

// Regras de classificação:
function classificarProcesso(processo: ProcessoMock): EtiquetaIA[] {
  const etiquetas: EtiquetaIA[] = [];
  
  // Etiqueta de assunto (baseada na classe)
  etiquetas.push({
    categoria: 'assunto',
    valor: extrairAssuntoPrincipal(processo.classe),
    confianca: 95,
    cor: 'blue'
  });
  
  // Etiqueta de fase (baseada na movimentação)
  etiquetas.push({
    categoria: 'fase',
    valor: identificarFaseProcessual(processo),
    confianca: 88,
    cor: 'orange'
  });
  
  // Etiqueta financeira (baseada no valor da causa)
  if (processo.valorCausa > 100000) {
    etiquetas.push({
      categoria: 'financeiro',
      valor: 'Alto Valor - Precatório',
      confianca: 92,
      cor: 'red'
    });
  }
  
  return etiquetas;
}
```

### Simulação de IA - Confiança e Sugestões
```typescript
// Simular diferentes níveis de confiança da IA
function simularConfiancaIA(processo: ProcessoMock): number {
  let confianca = 85; // Base
  
  // Aumenta confiança para processos similares aos dados fornecidos
  if (processo.classe.includes('CUMPRIMENTO DE SENTENÇA')) confianca += 10;
  if (processo.tribunal.includes('Fazenda Pública')) confianca += 5;
  if (processo.valorCausa > 0) confianca += 5;
  
  // Diminui confiança para casos complexos
  if (processo.assunto.includes('Constitucional')) confianca -= 15;
  if (processo.partes.ativo.length > 2) confianca -= 5;
  
  return Math.min(Math.max(confianca, 60), 95);
}
```

## 📱 Responsividade e UX

### Breakpoints Obrigatórios
```css
/* Tailwind breakpoints a usar */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop pequeno */
xl: 1280px  /* Desktop padrão */
2xl: 1536px /* Desktop grande */
```

### Layout Responsivo
```typescript
// Desktop (lg+): Sidebar + Main content + Right panel
// Tablet (md): Tab navigation + Main content
// Mobile (sm): Stack navigation + Single column

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showRightPanel?: boolean;
}

// Componente de layout deve adaptar automaticamente
```

### Estados de Loading
```typescript
// Simular tempos reais de carregamento
const loadingTimes = {
  processos: 800,      // Lista de processos
  analiseFireac: 2000, // Análise complexa
  minutaGeracao: 3000, // Geração de minuta
  validacao: 500       // Validações simples
};

// Usar skeletons realísticos, não spinners genéricos
```

## 🎨 Design System e Componentes

### Paleta de Cores
```typescript
const coresPrioridade = {
  urgente: 'bg-red-100 text-red-800 border-red-500',
  alta: 'bg-orange-100 text-orange-800 border-orange-500', 
  media: 'bg-yellow-100 text-yellow-800 border-yellow-500',
  baixa: 'bg-green-100 text-green-800 border-green-500'
};

const coresEtiquetas = {
  assunto: 'bg-blue-100 text-blue-800',
  setor: 'bg-indigo-100 text-indigo-800',
  fase: 'bg-purple-100 text-purple-800',
  financeiro: 'bg-red-100 text-red-800',
  prazo: 'bg-yellow-100 text-yellow-800',
  complexidade: 'bg-gray-100 text-gray-800'
};
```

### Componentes Reutilizáveis
```typescript
// components/common/Badge.tsx
interface BadgeProps {
  variant: 'prioridade' | 'etiqueta' | 'status';
  value: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

// components/common/MetricCard.tsx
interface MetricCardProps {
  title: string;
  value: number | string;
  change?: number;
  icon: string;
  color: string;
  onClick?: () => void;
}

// components/common/ProcessoCard.tsx
interface ProcessoCardProps {
  processo: ProcessoMock;
  onViewDetails: (id: string) => void;
  onQuickAction?: (id: string) => void;
}
```

## 🔧 Funcionalidades Específicas Obrigatórias

### 1. Contador de Prazo em Tempo Real
```typescript
// hooks/usePrazoCalculator.ts
function usePrazoCalculator(dataLimite: string) {
  const [diasRestantes, setDiasRestantes] = useState<number>(0);
  const [horasRestantes, setHorasRestantes] = useState<number>(0);
  const [urgencia, setUrgencia] = useState<'normal' | 'atencao' | 'critico'>('normal');
  
  useEffect(() => {
    const interval = setInterval(() => {
      const agora = new Date();
      const limite = new Date(dataLimite);
      const diff = limite.getTime() - agora.getTime();
      
      const dias = Math.ceil(diff / (1000 * 60 * 60 * 24));
      const horas = Math.ceil(diff / (1000 * 60 * 60));
      
      setDiasRestantes(Math.max(0, dias));
      setHorasRestantes(Math.max(0, horas));
      
      if (dias <= 1) setUrgencia('critico');
      else if (dias <= 3) setUrgencia('atencao');
      else setUrgencia('normal');
    }, 60000); // Atualiza a cada minuto
    
    return () => clearInterval(interval);
  }, [dataLimite]);
  
  return { diasRestantes, horasRestantes, urgencia };
}
```

### 2. Filtros Inteligentes
```typescript
// components/intimacoes/FiltrosInteligentes.tsx
interface FiltrosState {
  comarca: string;
  setor: string;
  prioridade: string[];
  prazo: 'todos' | 'urgentes' | 'vencendo' | 'normais';
  etiquetas: string[];
  busca: string;
}

// Filtros devem funcionar em tempo real
function filtrarIntimacoes(intimacoes: ProcessoMock[], filtros: FiltrosState): ProcessoMock[] {
  return intimacoes.filter(intimacao => {
    // Implementar lógica completa de filtragem
    if (filtros.comarca && !intimacao.tribunal.includes(filtros.comarca)) return false;
    if (filtros.prioridade.length && !filtros.prioridade.includes(intimacao.prioridade)) return false;
    if (filtros.busca && !buscarTexto(intimacao, filtros.busca)) return false;
    return true;
  });
}
```

### 3. Geração de Minuta Simulada
```typescript
// services/minutaGenerator.ts
interface GenerateMinutaParams {
  processo: ProcessoMock;
  tipo: 'contestacao' | 'recurso' | 'manifestacao';
  analiseFireac?: AnaliseFireacData;
  instrucoes?: string;
}

async function gerarMinutaSimulada(params: GenerateMinutaParams): Promise<MinutaData> {
  // Simular tempo de processamento
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Gerar conteúdo baseado no tipo e dados do processo
  const conteudo = gerarConteudoMinuta(params);
  
  return {
    id: `minuta-${Date.now()}`,
    processoId: params.processo.id,
    tipo: params.tipo,
    conteudo,
    dataGeracao: new Date().toISOString(),
    status: 'rascunho',
    metadados: {
      templateUtilizado: `template-${params.tipo}`,
      fundamentosLegais: extrairFundamentos(params.analiseFirec),
      precedentesUtilizados: [],
      confiancaIA: simularConfiancaIA(params.processo),
      tempoGeracao: 3000
    },
    revisoes: []
  };
}

function gerarConteudoMinuta(params: GenerateMinutaParams): string {
  // Template baseado no tipo de minuta
  const templates = {
    contestacao: `EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO...`,
    manifestacao: `EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A)...`,
    recurso: `COLENDO TRIBUNAL...`
  };
  
  // Personalizar com dados do processo
  let conteudo = templates[params.tipo] || templates.manifestacao;
  
  // Substituir placeholders com dados reais
  conteudo = conteudo.replace('{NUMERO_PROCESSO}', params.processo.numeroProcesso);
  conteudo = conteudo.replace('{PARTES}', params.processo.partes.ativo.join(', '));
  
  // Adicionar fundamentação baseada na análise FIRAC
  if (params.analiseFireac) {
    conteudo += `\n\nDOS FATOS:\n${params.analiseFireac.fatos.map(f => f.descricao).join('\n')}`;
    conteudo += `\n\nDO DIREITO:\n${params.analiseFireac.regras.map(r => `${r.dispositivo}: ${r.descricao}`).join('\n')}`;
  }
  
  return conteudo;
}
```

## 🚀 Performance e Otimização

### Lazy Loading Obrigatório
```typescript
// Componentes pesados devem usar lazy loading
const ProcessoDetalhes = lazy(() => import('./components/processo/ProcessoDetalhes'));
const EditorMinutas = lazy(() => import('./components/minutas/EditorMinutas'));
const RelatoriosAnalytics = lazy(() => import('./components/relatorios/RelatoriosAnalytics'));

// Usar Suspense com fallbacks realísticos
<Suspense fallback={<ProcessoDetailsSkeleton />}>
  <ProcessoDetalhes processoId={id} />
</Suspense>
```

### Virtualização para Listas Grandes
```typescript
// Para listas com muitos itens (> 100), usar windowing
import { FixedSizeList as List } from 'react-window';

function IntimacoesList({ intimacoes }: { intimacoes: ProcessoMock[] }) {
  const itemRenderer = ({ index, style }: any) => (
    <div style={style}>
      <ProcessoCard processo={intimacoes[index]} />
    </div>
  );
  
  return (
    <List
      height={600}
      itemCount={intimacoes.length}
      itemSize={120}
    >
      {itemRenderer}
    </List>
  );
}
```

## 📊 Analytics e Tracking

### Eventos para Tracking
```typescript
// utils/analytics.ts
interface AnalyticsEvent {
  category: 'navegacao' | 'acao' | 'performance';
  action: string;
  label?: string;
  value?: number;
}

// Eventos importantes para medir:
const eventosImportantes = [
  'dashboard_carregado',
  'lista_intimacoes_acessada', 
  'processo_visualizado',
  'minuta_gerada',
  'minuta_aprovada',
  'filtro_aplicado',
  'busca_realizada',
  'tempo_total_sessao'
];

// Simular coleta de métricas
function trackEvent(event: AnalyticsEvent) {
  console.log('Analytics:', event);
  // Em produção, enviaria para serviço de analytics
}
```

## 🧪 Dados de Teste e Cenários

### Cenários Obrigatórios
```typescript
// data/scenarios.ts
export const scenariosTeste = {
  processoUrgente: {
    // Processo com prazo em 1 dia
    numeroProcesso: "0123456-78.2024.8.20.5001",
    prazoResposta: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    prioridade: 'urgente'
  },
  
  processoComplexo: {
    // Processo com análise FIRAC complexa
    numeroProcesso: "0835078-22.2023.8.20.5001", // Usar dados reais fornecidos
    analiseFireac: firacDataFornecida
  },
  
  processoAltoValor: {
    // Processo que requer precatório
    valorCausa: 150000,
    etiquetas: [{ categoria: 'financeiro', valor: 'Alto Valor - Precatório' }]
  },
  
  processosVarios: {
    // 50+ processos com variações realísticas
    // Usar como base os dados fornecidos e criar variações
  }
};
```

## ✅ Checklist de Implementação

### MVP Obrigatório
- [ ] Dashboard com métricas funcionais
- [ ] Lista de intimações com filtros
- [ ] Visualização detalhada de processo
- [ ] Análise FIRAC integrada (usar JSON fornecido)
- [ ] Editor de minutas básico
- [ ] Sistema de etiquetagem visual
- [ ] Navegação fluida entre telas
- [ ] Responsividade completa
- [ ] Estados de loading realísticos
- [ ] Dados mockados baseados nos exemplos reais

### Funcionalidades Avançadas (se tempo permitir)
- [ ] Gráficos de produtividade interativos
- [ ] Busca semântica simulada
- [ ] Notificações de prazo
- [ ] Export de relatórios
- [ ] Modo escuro
- [ ] Atalhos de teclado
- [ ] Tour guiado da interface

### Qualidade de Código
- [ ] TypeScript sem erros
- [ ] Componentes reutilizáveis
- [ ] Hooks customizados
- [ ] Tratamento de erros
- [ ] Código limpo e comentado
- [ ] Performance otimizada

## 🎯 Foco da Demonstração

### O que Deve Impressionar os Procuradores
1. **Velocidade:** Interface rápida e responsiva
2. **Inteligência:** Classificação automática precisa 
3. **Praticidade:** Fluxos que espelham o trabalho real
4. **Qualidade:** Minutas com conteúdo jurídico sólido
5. **Confiabilidade:** Sistema estável e previsível
6. **Produtividade:** Redução visível de tempo/esforço

### O que NÃO Precisa Estar Perfeito
- Integração real com sistemas externos
- Autenticação/autorização completa
- Persistência de dados
- Funcionalidades admin avançadas
- Configurações complexas

---

**Lembre-se:** O objetivo é **validar conceitos** e **demonstrar valor**, não criar um sistema completo. Foque na **experiência do usuário** e na **demonstração clara dos benefícios** da automação inteligente para procuradores.