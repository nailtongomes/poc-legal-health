export type PriorityLevel = 'baixa' | 'media' | 'alta' | 'urgente';
export type ProcessStatus = 'nova' | 'em_analise' | 'minuta_gerada' | 'concluida' | 'vencida';
export type ComplexityLevel = 'simples' | 'media' | 'complexa' | 'estrategica';
export type UrgencyLevel = 'normal' | 'atencao' | 'critico';

export type Department = 
  | 'fiscal' 
  | 'judicial' 
  | 'administrativo' 
  | 'saude' 
  | 'ambiental' 
  | 'patrimonio'
  | 'trabalhista'
  | 'urbanismo'
  | 'licitacao';

export type ActionType = 
  | 'resposta_obrigatoria'
  | 'recurso'
  | 'defesa'
  | 'cumprimento'
  | 'monitoramento';

export type WorkflowStatus = 
  | 'nao_atribuido'
  | 'atribuido'
  | 'em_andamento'
  | 'revisao'
  | 'aprovado'
  | 'protocolado';

export type UserRole = 'procurador' | 'assessor' | 'estagiario' | 'coordenador';

export interface User {
  id: string;
  nome: string;
  role: UserRole;
  departamentos: Department[];
  email: string;
  avatar?: string;
}

export interface Tag {
  id: string;
  categoria: 'departamento' | 'complexidade' | 'acao' | 'prioridade' | 'assunto' | 'financeiro' | 'workflow' | 'responsavel';
  valor: string;
  cor: string;
  confianca: number;
  icone?: string;
  justificativa?: string;
}

export interface ProcessoBase {
  id: string;
  numeroProcesso: string;
  tribunal: string;
  classe: string;
  assunto: string;
  partes: {
    ativo: string[];
    passivo: string[];
  };
  status: ProcessStatus;
  prioridade: PriorityLevel;
  dataRecebimento: string;
  prazoResposta: string;
  valorCausa: number;
  tags: Tag[];
  departamentoResponsavel: Department;
  complexidade: ComplexityLevel;
  tipoAcao: ActionType;
  confiancaIA: number;
  workflowStatus: WorkflowStatus;
  responsavel?: User;
  dataAtribuicao?: string;
  observacoes?: string;
}

export interface AnaliseFireac {
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

export interface Minuta {
  id: string;
  processoId: string;
  tipo: 'contestacao' | 'recurso' | 'manifestacao' | 'peticao' | 'embargo';
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
  responsavel?: User;
  dataAtribuicao?: string;
}

export interface Processo extends ProcessoBase {
  analiseFireac?: AnaliseFireac;
  minuta?: Minuta;
  documentos?: Array<{
    id: string;
    nome: string;
    data: string;
    tipo: string;
  }>;
  timeline?: Array<{
    data: string;
    descricao: string;
    tipo: string;
  }>;
}

export interface DashboardMetrics {
  intimacoesRecebidas: number;
  minutasPendentes: number;
  minutasConcluidas: number;
  prazosUrgentes: number;
  eficienciaIA: number;
  tempoMedioPorMinuta: number;
  distribuicaoDepartamentos: Record<Department, number>;
  distribuicaoComplexidade: Record<ComplexityLevel, number>;
}

export interface FilterState {
  departamento: Department | 'todos';
  prioridade: PriorityLevel[];
  complexidade: ComplexityLevel[];
  prazo: 'todos' | 'urgentes' | 'vencendo' | 'normais';
  status: ProcessStatus[];
  busca: string;
  tags: string[];
  workflowStatus: WorkflowStatus[];
  responsavel: string | 'todos';
  role: UserRole | 'todos';
}