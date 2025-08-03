import React, { useState } from 'react';
import {
  FileText,
  Brain,
  Wand2,
  Download,
  Copy,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  Settings,
  Eye,
  Edit3,
  Save,
  Clock,
  Scale,
  BookOpen,
  Target,
  Lightbulb,
  FileCheck,
  Gavel,
  Users,
  Building,
  Calendar
} from 'lucide-react';
import { clsx } from 'clsx';
import { HealthInsuranceProcess } from '../../types/healthInsurance';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AIDocumentGeneratorProps {
  process: HealthInsuranceProcess;
}

type DocumentType = 'subsidios' | 'contestacao' | 'recurso' | 'parecer' | 'acordo' | 'cumprimento';
type DocumentTone = 'formal' | 'tecnico' | 'persuasivo' | 'conciliatorio';
type DocumentComplexity = 'simples' | 'intermediario' | 'avancado';

interface DocumentTemplate {
  id: DocumentType;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  estimatedTime: string;
  aiComplexity: DocumentComplexity;
}

interface GenerationSettings {
  documentType: DocumentType;
  tone: DocumentTone;
  complexity: DocumentComplexity;
  includeJurisprudence: boolean;
  includePrecedents: boolean;
  includeFinancialAnalysis: boolean;
  customInstructions: string;
}

const documentTemplates: DocumentTemplate[] = [
  {
    id: 'subsidios',
    name: 'Subsídios para Defesa',
    description: 'Análise técnica e argumentos jurídicos para fundamentar a contestação',
    icon: BookOpen,
    color: 'blue',
    estimatedTime: '5-8 min',
    aiComplexity: 'intermediario'
  },
  {
    id: 'contestacao',
    name: 'Minuta de Contestação',
    description: 'Peça defensiva completa com preliminares e mérito',
    icon: Scale,
    color: 'purple',
    estimatedTime: '8-12 min',
    aiComplexity: 'avancado'
  },
  {
    id: 'recurso',
    name: 'Minuta de Recurso',
    description: 'Recurso de apelação ou agravo contra decisões desfavoráveis',
    icon: RefreshCw,
    color: 'orange',
    estimatedTime: '10-15 min',
    aiComplexity: 'avancado'
  },
  {
    id: 'parecer',
    name: 'Parecer Jurídico',
    description: 'Análise técnica detalhada com recomendações estratégicas',
    icon: FileCheck,
    color: 'green',
    estimatedTime: '6-10 min',
    aiComplexity: 'intermediario'
  },
  {
    id: 'acordo',
    name: 'Proposta de Acordo',
    description: 'Minuta de acordo com análise de custos e benefícios',
    icon: Gavel,
    color: 'indigo',
    estimatedTime: '4-6 min',
    aiComplexity: 'simples'
  },
  {
    id: 'cumprimento',
    name: 'Cumprimento de Sentença',
    description: 'Manifestação sobre cumprimento de decisão judicial',
    icon: CheckCircle,
    color: 'cyan',
    estimatedTime: '3-5 min',
    aiComplexity: 'simples'
  }
];

const AIDocumentGenerator: React.FC<AIDocumentGeneratorProps> = ({ process }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [generatedDocument, setGeneratedDocument] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [documentStatus, setDocumentStatus] = useState<'draft' | 'review' | 'approved'>('draft');
  const [viewMode, setViewMode] = useState<'preview' | 'edit'>('preview');
  
  const [settings, setSettings] = useState<GenerationSettings>({
    documentType: 'subsidios',
    tone: 'formal',
    complexity: 'intermediario',
    includeJurisprudence: true,
    includePrecedents: true,
    includeFinancialAnalysis: true,
    customInstructions: ''
  });

  const generateDocument = async () => {
    if (!selectedTemplate) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation with realistic delay
    await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 4000));
    
    const document = generateDocumentContent(selectedTemplate, process, settings);
    setGeneratedDocument(document);
    setIsGenerating(false);
    setDocumentStatus('draft');
  };

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const getTemplateColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      purple: 'bg-purple-50 border-purple-200 text-purple-700',
      orange: 'bg-orange-50 border-orange-200 text-orange-700',
      green: 'bg-green-50 border-green-200 text-green-700',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      cyan: 'bg-cyan-50 border-cyan-200 text-cyan-700'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getTemplateIconColor = (color: string) => {
    const colors = {
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600',
      green: 'text-green-600',
      indigo: 'text-indigo-600',
      cyan: 'text-cyan-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const downloadDocument = () => {
    const blob = new Blob([generatedDocument], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate?.name}_${process.numero_processo.replace(/[^\w]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedDocument);
    // Could add toast notification here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">🤖 Gerador de Documentos IA</h2>
            <p className="text-purple-100">
              Criação inteligente de peças jurídicas baseada em análise automatizada do processo
            </p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">{process.numero_processo}</div>
            <div className="text-purple-200">Processo Analisado</div>
          </div>
        </div>
      </div>

      {/* Process Summary for Context */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <h3 className="font-medium text-gray-900 mb-3">Contexto do Processo</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Especialidade:</span>
            <div className="font-medium capitalize">{process.classificacao_demanda.especialidade_medica.replace('_', ' ')}</div>
          </div>
          <div>
            <span className="text-gray-600">Urgência:</span>
            <div className={clsx(
              'font-medium capitalize',
              process.classificacao_demanda.carater_urgencia === 'urgente' ? 'text-red-600' : 'text-gray-900'
            )}>
              {process.classificacao_demanda.carater_urgencia}
            </div>
          </div>
          <div>
            <span className="text-gray-600">Valor da Causa:</span>
            <div className="font-medium">{formatCurrency(process.aspectos_financeiros.valor_inicial_causa)}</div>
          </div>
          <div>
            <span className="text-gray-600">Complexidade IA:</span>
            <div className="font-medium">{process.metricas_dashboard.score_complexidade}/10</div>
          </div>
        </div>
      </div>

      {!selectedTemplate ? (
        /* Template Selection */
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Selecione o Tipo de Documento</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documentTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={clsx(
                    'p-6 rounded-lg border-2 text-left transition-all hover:shadow-lg',
                    getTemplateColor(template.color),
                    'hover:scale-105'
                  )}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-white rounded-lg">
                      <Icon className={clsx('h-6 w-6', getTemplateIconColor(template.color))} />
                    </div>
                    <div>
                      <h4 className="font-semibold">{template.name}</h4>
                      <div className="flex items-center space-x-2 text-xs mt-1">
                        <Clock className="h-3 w-3" />
                        <span>{template.estimatedTime}</span>
                        <span>•</span>
                        <span className="capitalize">{template.aiComplexity}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm opacity-90">{template.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Document Generation Interface */
        <div className="space-y-6">
          {/* Selected Template Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={clsx('p-3 rounded-lg', getTemplateColor(selectedTemplate.color))}>
                <selectedTemplate.icon className={clsx('h-6 w-6', getTemplateIconColor(selectedTemplate.color))} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedTemplate.name}</h3>
                <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center"
              >
                <Settings className="h-4 w-4 mr-1" />
                Configurações
              </button>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Voltar
              </button>
            </div>
          </div>

          {/* Generation Settings */}
          {showSettings && (
            <div className="bg-gray-50 rounded-lg p-6 border">
              <h4 className="font-medium text-gray-900 mb-4">Configurações de Geração</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tom do Documento</label>
                  <select
                    value={settings.tone}
                    onChange={(e) => setSettings(prev => ({ ...prev, tone: e.target.value as DocumentTone }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="formal">Formal</option>
                    <option value="tecnico">Técnico</option>
                    <option value="persuasivo">Persuasivo</option>
                    <option value="conciliatorio">Conciliatório</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Complexidade</label>
                  <select
                    value={settings.complexity}
                    onChange={(e) => setSettings(prev => ({ ...prev, complexity: e.target.value as DocumentComplexity }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="simples">Simples</option>
                    <option value="intermediario">Intermediário</option>
                    <option value="avancado">Avançado</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.includeJurisprudence}
                    onChange={(e) => setSettings(prev => ({ ...prev, includeJurisprudence: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Incluir jurisprudência relevante</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.includePrecedents}
                    onChange={(e) => setSettings(prev => ({ ...prev, includePrecedents: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Incluir precedentes similares</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.includeFinancialAnalysis}
                    onChange={(e) => setSettings(prev => ({ ...prev, includeFinancialAnalysis: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Incluir análise financeira</span>
                </label>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Instruções Personalizadas</label>
                <textarea
                  value={settings.customInstructions}
                  onChange={(e) => setSettings(prev => ({ ...prev, customInstructions: e.target.value }))}
                  placeholder="Ex: Focar em argumentos de urgência médica, enfatizar precedentes do STJ..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Generation Button */}
          {!generatedDocument && (
            <div className="text-center">
              <button
                onClick={generateDocument}
                disabled={isGenerating}
                className={clsx(
                  'px-8 py-4 rounded-lg font-medium text-white transition-all flex items-center space-x-3 mx-auto',
                  isGenerating 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                )}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Gerando Documento...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="h-5 w-5" />
                    <span>Gerar {selectedTemplate.name}</span>
                  </>
                )}
              </button>
              
              {isGenerating && (
                <div className="mt-4 text-sm text-gray-600">
                  <p>🤖 IA analisando processo e jurisprudência...</p>
                  <p className="mt-1">⚖️ Preparando argumentos jurídicos...</p>
                  <p className="mt-1">📝 Estruturando documento final...</p>
                </div>
              )}
            </div>
          )}

          {/* Generated Document */}
          {generatedDocument && (
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {/* Document Header */}
              <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedTemplate.name}</h4>
                    <p className="text-sm text-gray-600">
                      Gerado em {format(new Date(), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={clsx(
                    'px-2 py-1 rounded text-xs font-medium',
                    documentStatus === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    documentStatus === 'review' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  )}>
                    {documentStatus === 'draft' ? 'Rascunho' :
                     documentStatus === 'review' ? 'Em Revisão' : 'Aprovado'}
                  </span>
                  
                  <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                    <button
                      onClick={() => setViewMode('preview')}
                      className={clsx(
                        'px-3 py-2 text-sm transition-colors',
                        viewMode === 'preview' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('edit')}
                      className={clsx(
                        'px-3 py-2 text-sm transition-colors border-l border-gray-300',
                        viewMode === 'edit' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={copyToClipboard}
                    className="p-2 text-gray-600 hover:text-blue-600 rounded transition-colors"
                    title="Copiar documento"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={downloadDocument}
                    className="p-2 text-gray-600 hover:text-blue-600 rounded transition-colors"
                    title="Download documento"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Document Content */}
              <div className="p-6">
                {viewMode === 'preview' ? (
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-gray-900">
                      {generatedDocument}
                    </pre>
                  </div>
                ) : (
                  <textarea
                    value={generatedDocument}
                    onChange={(e) => setGeneratedDocument(e.target.value)}
                    className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder="Edite o documento aqui..."
                  />
                )}
              </div>

              {/* Document Actions */}
              <div className="bg-gray-50 px-6 py-4 border-t flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{generatedDocument.length} caracteres</span>
                  <span>•</span>
                  <span>~{Math.ceil(generatedDocument.length / 500)} páginas</span>
                  <span>•</span>
                  <span>Confiança IA: 92%</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={generateDocument}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerar
                  </button>
                  
                  <button
                    onClick={() => setDocumentStatus('review')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Enviar para Revisão
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper function to generate document content
function generateDocumentContent(
  template: DocumentTemplate, 
  process: HealthInsuranceProcess, 
  settings: GenerationSettings
): string {
  const currentDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  switch (template.id) {
    case 'subsidios':
      return `SUBSÍDIOS PARA DEFESA
Processo: ${process.numero_processo}
Data: ${currentDate}

═══════════════════════════════════════════════════════════════════

I. SÍNTESE DO CASO

O presente processo trata de demanda judicial movida contra operadora de plano de saúde, questionando ${process.classificacao_demanda.tipo_demanda.replace('_', ' ')} na especialidade de ${process.classificacao_demanda.especialidade_medica}, com procedimento específico: ${process.classificacao_demanda.procedimento_especifico}.

Valor da causa: ${formatCurrency(process.aspectos_financeiros.valor_inicial_causa)}
Caráter: ${process.classificacao_demanda.carater_urgencia.toUpperCase()}
Tempo de tramitação: ${process.cronologia_processual.dias_tramitacao_total} dias

II. ANÁLISE JURÍDICA PRELIMINAR

${settings.includeJurisprudence ? `
1. JURISPRUDÊNCIA APLICÁVEL

Súmula 469 do STJ: "Aplica-se o Código de Defesa do Consumidor aos contratos de plano de saúde."

Jurisprudência consolidada do STJ sobre ${process.classificacao_demanda.especialidade_medica}:
- Necessidade médica comprovada sobrepõe cláusulas limitativas
- Urgência/emergência afasta período de carência
- Interpretação contratual favorável ao consumidor
` : ''}

2. ARGUMENTOS DEFENSIVOS PRINCIPAIS

a) Análise Contratual:
   - Verificar cobertura específica no rol ANS
   - Examinar cláusulas de exclusão aplicáveis
   - Avaliar cumprimento de prazos de carência

b) Aspectos Médicos:
   - Questionar necessidade/urgência alegada
   - Solicitar segunda opinião médica se aplicável
   - Verificar protocolos clínicos estabelecidos

c) Questões Processuais:
   - Competência do juízo
   - Legitimidade das partes
   - Documentação probatória

III. ESTRATÉGIA RECOMENDADA

Com base na análise de risco (Score: ${process.metricas_dashboard.score_complexidade}/10), recomenda-se:

${process.metricas_dashboard.score_complexidade >= 7 ? 
  '- Defesa técnica robusta com consultoria especializada\n- Instrução probatória ampla\n- Preparo para recursos' :
  '- Defesa padrão com argumentos consolidados\n- Considerar possibilidade de acordo\n- Acompanhamento processual regular'
}

${settings.includeFinancialAnalysis ? `
IV. ANÁLISE FINANCEIRA

Valor em discussão: ${formatCurrency(process.aspectos_financeiros.valor_inicial_causa)}
${process.aspectos_financeiros.valor_multa_diaria ? 
  `Multa diária: ${formatCurrency(process.aspectos_financeiros.valor_multa_diaria)}` : 
  'Sem multa diária configurada'
}

Custo estimado da defesa: R$ 15.000 - R$ 25.000
Análise custo-benefício: ${process.aspectos_financeiros.valor_inicial_causa > 50000 ? 'Favorável à contestação' : 'Avaliar acordo'}
` : ''}

V. PRÓXIMOS PASSOS

1. Análise detalhada do processo e documentos
2. Consulta a especialista médico se necessário
3. Elaboração da contestação/manifestação
4. ${process.metricas_dashboard.requer_escalacao_executiva ? 'ATENÇÃO: Caso requer escalação executiva' : 'Acompanhamento processual regular'}

═══════════════════════════════════════════════════════════════════
Documento gerado por IA - Revisão jurídica recomendada
Confiança: 92% | Complexidade: ${settings.complexity}`;

    case 'contestacao':
      return `CONTESTAÇÃO

EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA ___ª VARA CÍVEL DA COMARCA DE _______

Processo nº: ${process.numero_processo}

${process.analise_llm?.polo_passivo || 'OPERADORA DE PLANO DE SAÚDE'}, pessoa jurídica de direito privado, inscrita no CNPJ sob nº ___.___.___/____-__, com sede na _______, por seus advogados que esta subscrevem, nos autos da ação de ${process.classificacao_demanda.tipo_demanda.replace('_', ' ')} que lhe move ${process.analise_llm?.polo_ativo || 'REQUERENTE'}, vem, respeitosamente, perante Vossa Excelência, tempestivamente apresentar

CONTESTAÇÃO

com fundamento no artigo 335 do Código de Processo Civil, pelas razões de fato e de direito a seguir expendidas:

I. PRELIMINARES

1.1. DA COMPETÊNCIA
Requer-se a verificação da competência deste juízo para processar e julgar a presente demanda, considerando as regras específicas dos contratos de saúde suplementar.

1.2. DA LEGITIMIDADE
A contestante possui legitimidade para figurar no polo passivo da presente demanda, na qualidade de operadora do plano de saúde contratado.

II. DO MÉRITO

2.1. DOS FATOS
${process.classificacao_demanda.carater_urgencia === 'urgente' ? 
  'Embora alegue-se urgência do procedimento, é necessário analisar criteriosamente se há real caracterização de urgência/emergência médica que justifique a cobertura pleiteada.' :
  'Os fatos narrados na inicial não demonstram de forma inequívoca a obrigatoriedade de cobertura do procedimento/tratamento pleiteado.'
}

2.2. DA COBERTURA CONTRATUAL
O contrato de plano de saúde firmado entre as partes estabelece claramente as coberturas incluídas e excluídas, em conformidade com a legislação vigente e as normas da ANS.

${settings.includeJurisprudence ? `
2.3. DA JURISPRUDÊNCIA
Embora a jurisprudência seja favorável ao consumidor em casos de urgência/emergência, é necessário verificar:
a) A real caracterização da urgência médica;
b) O cumprimento dos requisitos contratuais;
c) A disponibilidade na rede credenciada.
` : ''}

2.4. DA ANÁLISE MÉDICA
O procedimento solicitado deve ser analisado sob a ótica da necessidade médica comprovada, protocolos clínicos estabelecidos e alternativas terapêuticas disponíveis na rede credenciada.

III. DO PEDIDO

Ante o exposto, requer-se:

a) O acolhimento das preliminares arguidas;
b) No mérito, a total improcedência do pedido inicial;
c) A condenação do autor ao pagamento das custas processuais e honorários advocatícios.

Protesta por todos os meios de prova em direito admitidos, especialmente documental e pericial médica.

Termos em que,
Pede deferimento.

Local, ${currentDate}.

_________________________________
[Nome do Advogado]
OAB/UF nº

═══════════════════════════════════════════════════════════════════
Minuta gerada por IA - Revisão e adaptação necessárias
Valor da causa: ${formatCurrency(process.aspectos_financeiros.valor_inicial_causa)}`;

    case 'parecer':
      return `PARECER JURÍDICO

PROCESSO: ${process.numero_processo}
CONSULENTE: [Nome da Operadora]
DATA: ${currentDate}

═══════════════════════════════════════════════════════════════════

I. CONSULTA

Solicita-se parecer jurídico sobre a viabilidade de defesa no processo em epígrafe, que versa sobre ${process.classificacao_demanda.tipo_demanda.replace('_', ' ')} na especialidade de ${process.classificacao_demanda.especialidade_medica}.

II. ANÁLISE DOS FATOS

O processo apresenta as seguintes características:

• Especialidade médica: ${process.classificacao_demanda.especialidade_medica}
• Procedimento: ${process.classificacao_demanda.procedimento_especifico}
• Caráter: ${process.classificacao_demanda.carater_urgencia}
• Valor da causa: ${formatCurrency(process.aspectos_financeiros.valor_inicial_causa)}
• Tempo de tramitação: ${process.cronologia_processual.dias_tramitacao_total} dias
• Score de complexidade: ${process.metricas_dashboard.score_complexidade}/10

III. FUNDAMENTAÇÃO JURÍDICA

3.1. Quanto à Aplicação do CDC
Os contratos de plano de saúde estão sujeitos às disposições do Código de Defesa do Consumidor, conforme Súmula 469 do STJ.

3.2. Quanto à Cobertura
${process.classificacao_demanda.carater_urgencia === 'urgente' ? 
  'Em casos de urgência/emergência, a jurisprudência consolidada favorece a cobertura, limitando a aplicação de cláusulas restritivas.' :
  'Para procedimentos eletivos, é essencial verificar a inclusão no rol ANS e as disposições contratuais específicas.'
}

3.3. Análise de Risco
Com base nos elementos processuais analisados, o risco de sucumbância é considerado ${
  process.metricas_dashboard.score_complexidade >= 7 ? 'ALTO' :
  process.metricas_dashboard.score_complexidade >= 5 ? 'MÉDIO' : 'BAIXO'
}.

IV. CONCLUSÃO E RECOMENDAÇÕES

${process.metricas_dashboard.score_complexidade >= 7 ? `
RECOMENDAÇÃO: DEFESA TÉCNICA ESPECIALIZADA
- Contratar consultoria médica especializada
- Instrução probatória robusta
- Preparo para eventual recurso
- Análise detalhada de precedentes
` : process.metricas_dashboard.score_complexidade >= 5 ? `
RECOMENDAÇÃO: DEFESA PADRÃO COM ACOMPANHAMENTO
- Contestação com argumentos consolidados
- Acompanhamento processual regular
- Considerar proposta de acordo se conveniente
` : `
RECOMENDAÇÃO: ESTRATÉGIA CONSERVADORA
- Defesa com argumentos padrão
- Avaliar seriamente proposta de acordo
- Custos de defesa vs. valor da causa
`}

${settings.includeFinancialAnalysis ? `
V. ANÁLISE ECONÔMICA

Valor em discussão: ${formatCurrency(process.aspectos_financeiros.valor_inicial_causa)}
Custo estimado da defesa: R$ 15.000 - R$ 30.000
${process.aspectos_financeiros.valor_multa_diaria ? 
  `ATENÇÃO: Multa diária de ${formatCurrency(process.aspectos_financeiros.valor_multa_diaria)} pode tornar acordo mais vantajoso` :
  ''
}

Recomendação econômica: ${
  process.aspectos_financeiros.valor_inicial_causa > 100000 ? 
    'Investimento em defesa justificado pelo valor' :
    'Avaliar custo-benefício da defesa vs. acordo'
}
` : ''}

${process.metricas_dashboard.requer_escalacao_executiva ? `
⚠️  ATENÇÃO ESPECIAL: Este caso foi identificado pelo sistema como crítico e requer escalação para a diretoria devido ao alto impacto estratégico e/ou financeiro.
` : ''}

═══════════════════════════════════════════════════════════════════

[Nome do Advogado]
OAB/UF nº
${currentDate}

Parecer elaborado com auxílio de IA - Análise jurídica complementar recomendada`;

    default:
      return `Documento ${template.name} em construção para o processo ${process.numero_processo}.`;
  }
}

export default AIDocumentGenerator;