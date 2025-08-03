// Health Insurance Legal Intelligence System Types

// Medical specialties for health insurance cases
export type MedicalSpecialty = 
  | 'cardiologia'
  | 'oncologia' 
  | 'neurologia'
  | 'ortopedia'
  | 'psiquiatria'
  | 'gastroenterologia'
  | 'ginecologia'
  | 'pediatria'
  | 'urologia'
  | 'oftalmologia'
  | 'dermatologia'
  | 'endocrinologia'
  | 'reumatologia'
  | 'hematologia'
  | 'nefrologia'
  | 'pneumologia'
  | 'outros';

// Types of health insurance demands
export type DemandType = 
  | 'cobertura_negada'
  | 'reajuste_contratual'
  | 'prazo_autorizacao'
  | 'rede_credenciada'
  | 'urgencia_emergencia'
  | 'doenca_preexistente'
  | 'carencia'
  | 'medicamento_alto_custo'
  | 'procedimento_experimental'
  | 'home_care'
  | 'internacao_domiciliar'
  | 'terapias'
  | 'exames_diagnosticos'
  | 'cirurgia_eletiva'
  | 'transplante'
  | 'outros';

// Procedure categories
export type ProcedureCategory = 
  | 'consulta'
  | 'exame_diagnostico'
  | 'cirurgia'
  | 'internacao'
  | 'procedimento_ambulatorial'
  | 'terapia'
  | 'medicamento'
  | 'material_protese'
  | 'home_care'
  | 'fisioterapia'
  | 'psicologia'
  | 'nutricao'
  | 'outros';

// Urgency character of medical procedures
export type UrgencyCharacter = 'eletivo' | 'urgente' | 'emergencia';

// Court phase
export type CourtPhase = 'conhecimento' | 'execucao' | 'recurso' | 'arquivo';

// Priority levels for management
export type ManagementPriority = 'baixa' | 'media' | 'alta' | 'critica';

// Traffic light status
export type TrafficLightStatus = 'verde' | 'amarelo' | 'vermelho';

// Process status
export type ProcessStatus = 'ativo' | 'suspenso' | 'arquivado' | 'acordo' | 'sentenca';

// Financial aspects interface
export interface FinancialAspects {
  valor_inicial_causa: number;
  valor_pedido_danos_morais?: number;
  valor_final_condenacao?: number;
  valor_multa_configurada?: number;
  valor_multa_acumulado?: number;
  valor_multa_diaria?: number;
}

// Court timeline interface
export interface CourtTimeline {
  dias_tramitacao_total: number;
  dias_ate_primeira_decisao?: number;
  processo_ativo: boolean;
}

// Classification of legal demand
export interface DemandClassification {
  area_direito: string;
  tipo_demanda: DemandType;
  especialidade_medica: MedicalSpecialty;
  procedimento_especifico: string;
  carater_urgencia: UrgencyCharacter;
}

// Dashboard metrics for executives
export interface DashboardMetrics {
  score_urgencia: number; // 1-10
  score_complexidade: number; // 1-10  
  score_impacto_financeiro: number; // 1-10
  prioridade_gestao: ManagementPriority;
  status_semaforo: TrafficLightStatus;
  requer_escalacao_executiva: boolean;
}

// Court decisions interface
export interface CourtDecisions {
  liminar_antecipacao?: {
    requerida: boolean;
    deferida: boolean;
    data_decisao?: string;
    resumo_obrigacao?: string[];
    prazo_cumprimento?: number;
    multa_diaria?: number;
    limite_multa?: number;
  };
  sentenca_final?: {
    proferida: boolean;
    data?: string;
    resultado: 'procedente' | 'improcedente' | 'parcial';
    valor_condenacao?: number;
    pedidos_julgados?: Array<{
      pedido: string;
      resultado: string;
    }>;
  };
}

// Resources and appeals
export interface ResourcesAppeals {
  recursos_interpostos?: Array<{
    tipo: string;
    parte_recorrente: string;
    data_interposicao?: string;
  }>;
  acordaos_proferidos?: Array<{
    data_julgamento: string;
    resultado: string;
    relator?: string;
  }>;
  transito_julgado: boolean;
}

// Current process status
export interface CurrentStatus {
  fase_processual: CourtPhase;
  risco_multa_crescente: boolean;
  possui_liminar_ativa: boolean;
  aguardando_cumprimento: boolean;
}

// Main health insurance process interface
export interface HealthInsuranceProcess {
  // Basic identification
  id: string;
  numero_processo: string;
  link_processo?: string;
  data_extracao_dados: string;
  
  // Parties
  partes_principais: string;
  polo_ativo?: string;
  polo_passivo?: string;
  
  // Classification
  classificacao_demanda: DemandClassification;
  
  // Financial data
  aspectos_financeiros: FinancialAspects;
  
  // Timeline
  cronologia_processual: CourtTimeline;
  
  // Executive metrics
  metricas_dashboard: DashboardMetrics;
  
  // Court decisions
  decisoes_judiciais?: CourtDecisions;
  
  // Resources and appeals
  recursos_acordaos?: ResourcesAppeals;
  
  // Current status
  status_atual: CurrentStatus;
  
  // Documents and timeline
  documentos_judiciario?: Array<{
    nome_documento: string;
    data_documento: string;
    texto_documento?: string;
  }>;
  
  linha_tempo_otimizada?: Array<{
    data: string;
    descricao: string;
    documento?: string[];
  }>;
  
  // Additional metadata
  detalhes_capa_processual?: string;
  ultimo_movimento_processo?: string;
  
  // Complete AI analysis
  analise_llm?: any; // Raw LLM analysis data
}

// Filter state for health insurance processes
export interface HealthInsuranceFilterState {
  especialidade: MedicalSpecialty[];
  tipo_demanda: DemandType[];
  prioridade_gestao: ManagementPriority[];
  status_semaforo: TrafficLightStatus[];
  fase_processual: CourtPhase[];
  valor_causa_min: number;
  valor_causa_max: number;
  urgencia_min: number;
  apenas_ativos: boolean;
  busca: string;
  escalacao_executiva: boolean;
  risco_multa: boolean;
}

// Dashboard KPIs for health insurance
export interface HealthInsuranceDashboardKPIs {
  total_processos: number;
  processos_ativos: number;
  exposicao_total: number;
  casos_escalacao_executiva: number;
  multas_ativas: number;
  tempo_medio_tramitacao: number;
  valor_medio_causa: number;
  taxa_sucesso_estimada: number;
  distribuicao_especialidades: Record<MedicalSpecialty, number>;
  distribuicao_tipos_demanda: Record<DemandType, number>;
  distribuicao_prioridades: Record<ManagementPriority, number>;
}

// Executive alert interface
export interface ExecutiveAlert {
  id: string;
  processo: string;
  tipo: 'ESCALACAO_EXECUTIVA' | 'MULTA_ALTA' | 'ALTA_URGENCIA' | 'TRAMITACAO_LONGA' | 'ALTO_VALOR';
  severidade: 'critica' | 'importante' | 'informativa';
  mensagem: string;
  acao_recomendada: string;
  responsavel_sugerido: string;
  prazo_acao: number; // days
  valor_impacto?: number;
}

// Scenario analysis for predictions
export interface ScenarioAnalysis {
  nome: string;
  probabilidade: number; // 0-100
  valor_financeiro: number;
  tempo_estimado?: number; // days
  descricao: string;
}

// Success probability factors
export interface SuccessProbabilityFactors {
  urgencia_medica: number; // weight
  precedentes_favoraveis: number; // weight  
  complexidade_caso: number; // weight
  valor_causa: number; // weight
  tempo_tramitacao: number; // weight
  liminar_deferida: boolean;
  probabilidade_final: number; // 0-100
}