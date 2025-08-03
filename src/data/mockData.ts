import { Processo, DashboardMetrics, Tag, User } from '../types';

// Department configurations
export const departmentConfig = {
  fiscal: { name: 'Fiscal', color: 'bg-green-100 text-green-800', icon: 'Calculator' },
  judicial: { name: 'Judicial', color: 'bg-blue-100 text-blue-800', icon: 'Scale' },
  administrativo: { name: 'Administrativo', color: 'bg-purple-100 text-purple-800', icon: 'FileText' },
  saude: { name: 'Saúde', color: 'bg-red-100 text-red-800', icon: 'Heart' },
  ambiental: { name: 'Ambiental', color: 'bg-emerald-100 text-emerald-800', icon: 'Leaf' },
  patrimonio: { name: 'Patrimônio', color: 'bg-orange-100 text-orange-800', icon: 'Building' },
  trabalhista: { name: 'Trabalhista', color: 'bg-yellow-100 text-yellow-800', icon: 'Users' },
  urbanismo: { name: 'Urbanismo', color: 'bg-indigo-100 text-indigo-800', icon: 'Map' },
  licitacao: { name: 'Licitação', color: 'bg-pink-100 text-pink-800', icon: 'ShoppingCart' },
};

export const complexityConfig = {
  simples: { name: 'Simples', color: 'bg-green-100 text-green-800' },
  media: { name: 'Média', color: 'bg-yellow-100 text-yellow-800' },
  complexa: { name: 'Complexa', color: 'bg-orange-100 text-orange-800' },
  estrategica: { name: 'Estratégica', color: 'bg-red-100 text-red-800' },
};

export const priorityConfig = {
  baixa: { name: 'Baixa', color: 'bg-gray-100 text-gray-800' },
  media: { name: 'Média', color: 'bg-yellow-100 text-yellow-800' },
  alta: { name: 'Alta', color: 'bg-orange-100 text-orange-800' },
  urgente: { name: 'Urgente', color: 'bg-red-100 text-red-800' },
};

export const workflowConfig = {
  nao_atribuido: { name: 'Não Atribuído', color: 'bg-gray-100 text-gray-800' },
  atribuido: { name: 'Atribuído', color: 'bg-blue-100 text-blue-800' },
  em_andamento: { name: 'Em Andamento', color: 'bg-yellow-100 text-yellow-800' },
  revisao: { name: 'Em Revisão', color: 'bg-orange-100 text-orange-800' },
  aprovado: { name: 'Aprovado', color: 'bg-green-100 text-green-800' },
  protocolado: { name: 'Protocolado', color: 'bg-purple-100 text-purple-800' },
};

export const roleConfig = {
  procurador: { name: 'Procurador', color: 'bg-purple-100 text-purple-800' },
  assessor: { name: 'Assessor', color: 'bg-blue-100 text-blue-800' },
  estagiario: { name: 'Estagiário', color: 'bg-green-100 text-green-800' },
  coordenador: { name: 'Coordenador', color: 'bg-red-100 text-red-800' },
};

// Mock users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    nome: 'Dr. João Silva',
    role: 'procurador',
    departamentos: ['fiscal', 'administrativo'],
    email: 'joao.silva@pgm.natal.rn.gov.br',
  },
  {
    id: 'user-2',
    nome: 'Dra. Maria Santos',
    role: 'procurador',
    departamentos: ['saude', 'ambiental'],
    email: 'maria.santos@pgm.natal.rn.gov.br',
  },
  {
    id: 'user-3',
    nome: 'Carlos Oliveira',
    role: 'assessor',
    departamentos: ['judicial', 'trabalhista'],
    email: 'carlos.oliveira@pgm.natal.rn.gov.br',
  },
  {
    id: 'user-4',
    nome: 'Ana Costa',
    role: 'assessor',
    departamentos: ['licitacao', 'patrimonio'],
    email: 'ana.costa@pgm.natal.rn.gov.br',
  },
  {
    id: 'user-5',
    nome: 'Pedro Almeida',
    role: 'estagiario',
    departamentos: ['administrativo', 'fiscal'],
    email: 'pedro.almeida@pgm.natal.rn.gov.br',
  },
  {
    id: 'user-6',
    nome: 'Dra. Lucia Ferreira',
    role: 'coordenador',
    departamentos: ['fiscal', 'judicial', 'administrativo'],
    email: 'lucia.ferreira@pgm.natal.rn.gov.br',
  },
];

// Create sample tags
const createTag = (categoria: Tag['categoria'], valor: string, cor: string, confianca: number): Tag => ({
  id: `${categoria}-${valor.toLowerCase().replace(/\s+/g, '-')}`,
  categoria,
  valor,
  cor,
  confianca,
});

// Sample processes based on the real data
export const mockProcessos: Processo[] = [
  {
    id: 'proc-001',
    numeroProcesso: '0835078-22.2023.8.20.5001',
    tribunal: '2º Juizado da Fazenda Pública da Comarca de Natal',
    classe: 'CUMPRIMENTO DE SENTENÇA CONTRA A FAZENDA PÚBLICA',
    assunto: 'Enquadramento',
    partes: {
      ativo: ['CAIO HIGOR MORAIS ARAUJO'],
      passivo: ['Município de Natal'],
    },
    status: 'em_analise',
    prioridade: 'alta',
    dataRecebimento: '2025-05-29',
    prazoResposta: '2025-06-09',
    valorCausa: 36569.20,
    departamentoResponsavel: 'administrativo',
    complexidade: 'media',
    tipoAcao: 'cumprimento',
    confiancaIA: 87,
    workflowStatus: 'atribuido',
    responsavel: mockUsers[0], // Dr. João Silva
    dataAtribuicao: '2025-06-26',
    tags: [
      createTag('departamento', 'Administrativo', 'bg-purple-100 text-purple-800', 95),
      createTag('complexidade', 'Média', 'bg-yellow-100 text-yellow-800', 88),
      createTag('acao', 'Cumprimento', 'bg-blue-100 text-blue-800', 92),
      createTag('financeiro', 'Alto Valor - Precatório', 'bg-red-100 text-red-800', 90),
      createTag('workflow', 'Atribuído', 'bg-blue-100 text-blue-800', 100),
      createTag('responsavel', 'Dr. João Silva', 'bg-purple-100 text-purple-800', 100),
    ],
    analiseFireac: {
      identificacao: {
        processo: '0835078-22.2023.8.20.5001',
        juizo: '2º Juizado da Fazenda Pública da Comarca de Natal',
        assunto: 'Enquadramento',
        partes: 'CAIO HIGOR MORAIS ARAUJO X Município de Natal',
        fase: 'execução',
      },
      fatos: [
        {
          data: '19/05/2025',
          descricao: 'Publicada intimação para indicar dados bancários para liberação de alvará eletrônico',
          classificacao: 'incontroverso',
          fonte: 'movimentação',
        },
      ],
      questoes: [
        {
          descricao: 'Necessidade de expedição de precatório para pagamento do débito',
          secundarias: ['Validade dos cálculos apresentados pelas partes'],
        },
      ],
      regras: [
        {
          dispositivo: 'Lei 10.166/2017',
          descricao: 'Dispõe sobre os limites para pagamento via precatório',
        },
      ],
      analise: {
        correlacoes: [
          {
            fato: 'Valor homologado superior a 10 salários mínimos',
            norma: 'Lei 10.166/2017',
            implicacao: 'Necessidade de expedição de precatório',
          },
        ],
        pontos_fortes: ['Decisão judicial favorável à expedição de precatório'],
        vulnerabilidades: ['Possibilidade de impugnação ao instrumento de precatório'],
      },
      conclusao: {
        estrategia: 'Acompanhar a expedição do precatório e garantir a correta inclusão dos dados',
        acoes_recomendadas: [
          'Monitorar o prazo para impugnação ao instrumento de precatório',
          'Verificar a validação do precatório pela Divisão de Precatórios do TJ/RN',
        ],
      },
      prazos: [
        {
          andamento: 'Indicar dados bancários para expedição de alvará',
          data: '09/06/2025',
          urgencia: 'media',
          parte_responsavel: 'autor',
          observacao: 'Prazo de 15 dias úteis para cumprimento',
        },
      ],
    },
  },
  {
    id: 'proc-002',
    numeroProcesso: '5004567-89.2024.8.20.5002',
    tribunal: '1º Vara da Fazenda Pública da Comarca de Natal',
    classe: 'AÇÃO CIVIL PÚBLICA',
    assunto: 'Meio Ambiente',
    partes: {
      ativo: ['MINISTÉRIO PÚBLICO DO RN'],
      passivo: ['Município de Natal', 'EMPRESA ABC LTDA'],
    },
    status: 'nova',
    prioridade: 'urgente',
    dataRecebimento: '2025-06-26',
    prazoResposta: '2025-06-28',
    valorCausa: 500000,
    departamentoResponsavel: 'ambiental',
    complexidade: 'estrategica',
    tipoAcao: 'defesa',
    confiancaIA: 94,
    workflowStatus: 'nao_atribuido',
    tags: [
      createTag('departamento', 'Ambiental', 'bg-emerald-100 text-emerald-800', 96),
      createTag('complexidade', 'Estratégica', 'bg-red-100 text-red-800', 92),
      createTag('acao', 'Defesa', 'bg-orange-100 text-orange-800', 94),
      createTag('prioridade', 'Urgente', 'bg-red-100 text-red-800', 98),
      createTag('workflow', 'Não Atribuído', 'bg-gray-100 text-gray-800', 100),
    ],
  },
  {
    id: 'proc-003',
    numeroProcesso: '1234567-90.2024.8.20.5003',
    tribunal: 'Vara de Direitos Difusos',
    classe: 'MANDADO DE SEGURANÇA',
    assunto: 'Licitação',
    partes: {
      ativo: ['CONSTRUTORA XYZ LTDA'],
      passivo: ['Município de Natal'],
    },
    status: 'minuta_gerada',
    prioridade: 'alta',
    dataRecebimento: '2025-06-25',
    prazoResposta: '2025-07-10',
    valorCausa: 2000000,
    departamentoResponsavel: 'licitacao',
    complexidade: 'complexa',
    tipoAcao: 'resposta_obrigatoria',
    confiancaIA: 91,
    workflowStatus: 'em_andamento',
    responsavel: mockUsers[3], // Ana Costa
    dataAtribuicao: '2025-06-24',
    tags: [
      createTag('departamento', 'Licitação', 'bg-pink-100 text-pink-800', 93),
      createTag('complexidade', 'Complexa', 'bg-orange-100 text-orange-800', 89),
      createTag('acao', 'Resposta Obrigatória', 'bg-red-100 text-red-800', 95),
      createTag('financeiro', 'Alto Valor', 'bg-red-100 text-red-800', 92),
      createTag('workflow', 'Em Andamento', 'bg-yellow-100 text-yellow-800', 100),
      createTag('responsavel', 'Ana Costa', 'bg-blue-100 text-blue-800', 100),
    ],
  },
  {
    id: 'proc-004',
    numeroProcesso: '9876543-21.2024.8.20.5004',
    tribunal: '3ª Vara Cível',
    classe: 'AÇÃO DE COBRANÇA',
    assunto: 'IPTU',
    partes: {
      ativo: ['Município de Natal'],
      passivo: ['JOÃO DA SILVA'],
    },
    status: 'concluida',
    prioridade: 'media',
    dataRecebimento: '2025-06-20',
    prazoResposta: '2025-07-05',
    valorCausa: 15000,
    departamentoResponsavel: 'fiscal',
    complexidade: 'simples',
    tipoAcao: 'monitoramento',
    confiancaIA: 88,
    workflowStatus: 'aprovado',
    responsavel: mockUsers[4], // Pedro Almeida
    dataAtribuicao: '2025-06-19',
    tags: [
      createTag('departamento', 'Fiscal', 'bg-green-100 text-green-800', 90),
      createTag('complexidade', 'Simples', 'bg-green-100 text-green-800', 86),
      createTag('acao', 'Monitoramento', 'bg-blue-100 text-blue-800', 88),
      createTag('workflow', 'Aprovado', 'bg-green-100 text-green-800', 100),
      createTag('responsavel', 'Pedro Almeida', 'bg-green-100 text-green-800', 100),
    ],
  },
  {
    id: 'proc-005',
    numeroProcesso: '1111222-33.2024.8.20.5005',
    tribunal: 'Vara do Trabalho',
    classe: 'RECLAMAÇÃO TRABALHISTA',
    assunto: 'Horas Extras',
    partes: {
      ativo: ['MARIA DOS SANTOS'],
      passivo: ['Município de Natal'],
    },
    status: 'em_analise',
    prioridade: 'media',
    dataRecebimento: '2025-06-24',
    prazoResposta: '2025-07-08',
    valorCausa: 25000,
    departamentoResponsavel: 'trabalhista',
    complexidade: 'media',
    tipoAcao: 'defesa',
    confiancaIA: 85,
    workflowStatus: 'revisao',
    responsavel: mockUsers[2], // Carlos Oliveira
    dataAtribuicao: '2025-06-23',
    tags: [
      createTag('departamento', 'Trabalhista', 'bg-yellow-100 text-yellow-800', 87),
      createTag('complexidade', 'Média', 'bg-yellow-100 text-yellow-800', 83),
      createTag('acao', 'Defesa', 'bg-orange-100 text-orange-800', 88),
      createTag('workflow', 'Em Revisão', 'bg-orange-100 text-orange-800', 100),
      createTag('responsavel', 'Carlos Oliveira', 'bg-blue-100 text-blue-800', 100),
    ],
  },
  {
    id: 'proc-006',
    numeroProcesso: '4444555-66.2024.8.20.5006',
    tribunal: 'Vara da Saúde Pública',
    classe: 'AÇÃO DE FORNECIMENTO DE MEDICAMENTO',
    assunto: 'Saúde Pública',
    partes: {
      ativo: ['PEDRO OLIVEIRA'],
      passivo: ['Município de Natal', 'Estado do RN'],
    },
    status: 'nova',
    prioridade: 'urgente',
    dataRecebimento: '2025-06-27',
    prazoResposta: '2025-06-29',
    valorCausa: 80000,
    departamentoResponsavel: 'saude',
    complexidade: 'complexa',
    tipoAcao: 'resposta_obrigatoria',
    confiancaIA: 93,
    workflowStatus: 'atribuido',
    responsavel: mockUsers[1], // Dra. Maria Santos
    dataAtribuicao: '2025-06-27',
    tags: [
      createTag('departamento', 'Saúde', 'bg-red-100 text-red-800', 95),
      createTag('complexidade', 'Complexa', 'bg-orange-100 text-orange-800', 91),
      createTag('acao', 'Resposta Obrigatória', 'bg-red-100 text-red-800', 94),
      createTag('prioridade', 'Urgente', 'bg-red-100 text-red-800', 97),
      createTag('workflow', 'Atribuído', 'bg-blue-100 text-blue-800', 100),
      createTag('responsavel', 'Dra. Maria Santos', 'bg-purple-100 text-purple-800', 100),
    ],
  },
];

export const mockDashboardMetrics: DashboardMetrics = {
  intimacoesRecebidas: 1247,
  minutasPendentes: 23,
  minutasConcluidas: 156,
  prazosUrgentes: 8,
  eficienciaIA: 87,
  tempoMedioPorMinuta: 15,
  distribuicaoDepartamentos: {
    fiscal: 156,
    judicial: 234,
    administrativo: 189,
    saude: 98,
    ambiental: 67,
    patrimonio: 123,
    trabalhista: 145,
    urbanismo: 89,
    licitacao: 146,
  },
  distribuicaoComplexidade: {
    simples: 567,
    media: 445,
    complexa: 189,
    estrategica: 46,
  },
};