import React, { useState } from 'react';
import {
  FileText,
  Scale,
  BookOpen,
  Brain,
  Target,
  CheckCircle,
  XCircle,
  Info,
  TrendingUp,
  TrendingDown,
  Shield,
  Clock,
  DollarSign,
  Activity,
  ChevronDown,
  ChevronRight,
  Star,
  Lightbulb
} from 'lucide-react';
import { clsx } from 'clsx';
import { HealthInsuranceProcess } from '../../types/healthInsurance';

interface FIRACAnalysisProps {
  process: HealthInsuranceProcess;
}

interface FIRACSection {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  items: Array<{
    title: string;
    content: string;
    classification?: 'favorable' | 'neutral' | 'unfavorable';
    confidence?: number;
    impact?: 'high' | 'medium' | 'low';
  }>;
}

const FIRACAnalysis: React.FC<FIRACAnalysisProps> = ({ process }) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['facts']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Generate FIRAC analysis from available data
  const firacData: Record<string, FIRACSection> = {
    facts: {
      title: 'Fatos (Facts)',
      icon: FileText,
      color: 'blue',
      items: generateFactsFromProcess(process)
    },
    issues: {
      title: 'Questões (Issues)', 
      icon: Scale,
      color: 'purple',
      items: generateIssuesFromProcess(process)
    },
    rules: {
      title: 'Regras (Rules)',
      icon: BookOpen,
      color: 'green',
      items: generateRulesFromProcess(process)
    },
    analysis: {
      title: 'Análise (Analysis)',
      icon: Brain,
      color: 'orange',
      items: generateAnalysisFromProcess(process)
    },
    conclusion: {
      title: 'Conclusão (Conclusion)',
      icon: Target,
      color: 'red',
      items: generateConclusionFromProcess(process)
    }
  };

  const getClassificationIcon = (classification?: string) => {
    switch (classification) {
      case 'favorable':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'unfavorable':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'text-gray-500';
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getImpactIcon = (impact?: string) => {
    switch (impact) {
      case 'high':
        return <TrendingUp className="h-3 w-3 text-red-500" />;
      case 'medium':
        return <Activity className="h-3 w-3 text-yellow-500" />;
      case 'low':
        return <TrendingDown className="h-3 w-3 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* FIRAC Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">⚖️ Análise FIRAC - IA Jurídica</h2>
            <p className="text-blue-100">
              Análise estruturada baseada em Fatos, Questões, Regras, Análise e Conclusão
            </p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">{process.numero_processo}</div>
            <div className="text-blue-200">Processo Analisado</div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border-l-4 border-green-500 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-green-600">
                {calculateSuccessProbability(process)}%
              </div>
              <div className="text-sm text-gray-600">Probabilidade de Sucesso</div>
            </div>
            <Shield className="h-6 w-6 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border-l-4 border-blue-500 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-blue-600">
                {process.metricas_dashboard.score_complexidade}/10
              </div>
              <div className="text-sm text-gray-600">Complexidade Jurídica</div>
            </div>
            <Brain className="h-6 w-6 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border-l-4 border-orange-500 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-orange-600">
                {process.cronologia_processual.dias_tramitacao_total}
              </div>
              <div className="text-sm text-gray-600">Dias de Tramitação</div>
            </div>
            <Clock className="h-6 w-6 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border-l-4 border-purple-500 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-purple-600">
                R$ {(process.aspectos_financeiros.valor_inicial_causa / 1000).toFixed(0)}k
              </div>
              <div className="text-sm text-gray-600">Valor da Causa</div>
            </div>
            <DollarSign className="h-6 w-6 text-purple-500" />
          </div>
        </div>
      </div>

      {/* FIRAC Sections */}
      <div className="space-y-4">
        {Object.entries(firacData).map(([sectionId, section]) => {
          const isExpanded = expandedSections.includes(sectionId);
          const SectionIcon = section.icon;
          
          return (
            <div key={sectionId} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <button
                onClick={() => toggleSection(sectionId)}
                className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={clsx(
                      'p-2 rounded-lg',
                      section.color === 'blue' && 'bg-blue-100',
                      section.color === 'purple' && 'bg-purple-100',
                      section.color === 'green' && 'bg-green-100',
                      section.color === 'orange' && 'bg-orange-100',
                      section.color === 'red' && 'bg-red-100'
                    )}>
                      <SectionIcon className={clsx(
                        'h-5 w-5',
                        section.color === 'blue' && 'text-blue-600',
                        section.color === 'purple' && 'text-purple-600',
                        section.color === 'green' && 'text-green-600',
                        section.color === 'orange' && 'text-orange-600',
                        section.color === 'red' && 'text-red-600'
                      )} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                      <p className="text-sm text-gray-500">{section.items.length} itens identificados</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={clsx(
                      'px-2 py-1 rounded text-xs font-medium',
                      section.color === 'blue' && 'bg-blue-100 text-blue-800',
                      section.color === 'purple' && 'bg-purple-100 text-purple-800',
                      section.color === 'green' && 'bg-green-100 text-green-800',
                      section.color === 'orange' && 'bg-orange-100 text-orange-800',
                      section.color === 'red' && 'bg-red-100 text-red-800'
                    )}>
                      {section.items.length} ITENS
                    </span>
                    {isExpanded ? 
                      <ChevronDown className="h-5 w-5 text-gray-400" /> : 
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    }
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="space-y-4 mt-4">
                    {section.items.map((item, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-300">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getClassificationIcon(item.classification)}
                            <h4 className="font-medium text-gray-900">{item.title}</h4>
                            {item.impact && getImpactIcon(item.impact)}
                          </div>
                          {item.confidence && (
                            <div className={clsx('text-xs font-medium', getConfidenceColor(item.confidence))}>
                              {item.confidence}% confiança
                            </div>
                          )}
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{item.content}</p>
                        {item.classification && (
                          <div className="mt-2 flex items-center space-x-2">
                            <span className={clsx(
                              'px-2 py-1 rounded text-xs font-medium',
                              item.classification === 'favorable' && 'bg-green-100 text-green-800',
                              item.classification === 'neutral' && 'bg-blue-100 text-blue-800',
                              item.classification === 'unfavorable' && 'bg-red-100 text-red-800'
                            )}>
                              {item.classification === 'favorable' ? 'Favorável' :
                               item.classification === 'unfavorable' ? 'Desfavorável' : 'Neutro'}
                            </span>
                            {item.impact && (
                              <span className={clsx(
                                'px-2 py-1 rounded text-xs font-medium',
                                item.impact === 'high' && 'bg-red-100 text-red-800',
                                item.impact === 'medium' && 'bg-yellow-100 text-yellow-800',
                                item.impact === 'low' && 'bg-green-100 text-green-800'
                              )}>
                                Impacto {item.impact === 'high' ? 'Alto' : item.impact === 'medium' ? 'Médio' : 'Baixo'}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Strategic Recommendations */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Recomendações Estratégicas</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {generateStrategicRecommendations(process).map((recommendation, index) => (
            <div key={index} className={clsx(
              'p-4 rounded-lg border-l-4',
              recommendation.priority === 'high' && 'bg-red-50 border-red-400',
              recommendation.priority === 'medium' && 'bg-yellow-50 border-yellow-400',
              recommendation.priority === 'low' && 'bg-green-50 border-green-400'
            )}>
              <div className="flex items-center space-x-2 mb-2">
                <Star className={clsx(
                  'h-4 w-4',
                  recommendation.priority === 'high' && 'text-red-500',
                  recommendation.priority === 'medium' && 'text-yellow-500',
                  recommendation.priority === 'low' && 'text-green-500'
                )} />
                <span className="font-medium text-gray-900">{recommendation.title}</span>
              </div>
              <p className="text-sm text-gray-700">{recommendation.description}</p>
              <div className="mt-2">
                <span className={clsx(
                  'px-2 py-1 rounded text-xs font-medium',
                  recommendation.priority === 'high' && 'bg-red-100 text-red-800',
                  recommendation.priority === 'medium' && 'bg-yellow-100 text-yellow-800',
                  recommendation.priority === 'low' && 'bg-green-100 text-green-800'
                )}>
                  Prioridade {recommendation.priority === 'high' ? 'Alta' : recommendation.priority === 'medium' ? 'Média' : 'Baixa'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper functions to generate FIRAC content from process data
function generateFactsFromProcess(process: HealthInsuranceProcess) {
  const facts = [];
  
  // Basic case facts
  facts.push({
    title: 'Identificação do Processo',
    content: `Processo nº ${process.numero_processo} tramitando há ${process.cronologia_processual.dias_tramitacao_total} dias, envolvendo ${process.partes_principais}.`,
    classification: 'neutral' as const,
    confidence: 100,
    impact: 'low' as const
  });

  // Medical specialty and procedure
  facts.push({
    title: 'Especialidade Médica e Procedimento',
    content: `Caso envolvendo ${process.classificacao_demanda.especialidade_medica} com procedimento específico: ${process.classificacao_demanda.procedimento_especifico}. Caráter: ${process.classificacao_demanda.carater_urgencia}.`,
    classification: (process.classificacao_demanda.carater_urgencia === 'urgente' ? 'favorable' : 'neutral') as 'favorable' | 'neutral',
    confidence: 85,
    impact: (process.classificacao_demanda.carater_urgencia === 'urgente' ? 'high' : 'medium') as 'high' | 'medium'
  });

  // Financial facts
  facts.push({
    title: 'Aspectos Financeiros',
    content: `Valor da causa: R$ ${process.aspectos_financeiros.valor_inicial_causa.toLocaleString('pt-BR')}. ${process.aspectos_financeiros.valor_multa_diaria ? `Multa diária configurada: R$ ${process.aspectos_financeiros.valor_multa_diaria.toLocaleString('pt-BR')}.` : 'Sem multa diária configurada.'}`,
    classification: (process.aspectos_financeiros.valor_multa_diaria ? 'favorable' : 'neutral') as 'favorable' | 'neutral',
    confidence: 95,
    impact: (process.aspectos_financeiros.valor_inicial_causa > 100000 ? 'high' : 'medium') as 'high' | 'medium'
  });

  // Court decisions if available
  if (process.decisoes_judiciais?.liminar_antecipacao?.deferida) {
    facts.push({
      title: 'Liminar Deferida',
      content: `Liminar de antecipação de tutela foi deferida, determinando o cumprimento das obrigações pela operadora de saúde.`,
      classification: 'favorable' as const,
      confidence: 100,
      impact: 'high' as const
    });
  }

  return facts;
}

function generateIssuesFromProcess(process: HealthInsuranceProcess) {
  const issues = [];

  // Main legal issue
  issues.push({
    title: 'Questão Principal - Cobertura de Plano de Saúde',
    content: `O plano de saúde tem obrigação de fornecer cobertura para ${process.classificacao_demanda.procedimento_especifico} na especialidade de ${process.classificacao_demanda.especialidade_medica}?`,
    classification: 'neutral' as const,
    confidence: 90,
    impact: 'high' as const
  });

  // Urgency/emergency issue
  if (process.classificacao_demanda.carater_urgencia === 'urgente' || process.classificacao_demanda.carater_urgencia === 'emergencia') {
    issues.push({
      title: 'Questão de Urgência/Emergência',
      content: `Sendo caracterizada a urgência/emergência médica, há limitações contratuais aplicáveis à cobertura do procedimento?`,
      classification: 'favorable' as const,
      confidence: 85,
      impact: 'high' as const
    });
  }

  // Contractual interpretation
  issues.push({
    title: 'Interpretação Contratual',
    content: `As cláusulas contratuais que eventualmente excluem ou limitam a cobertura do procedimento são válidas e aplicáveis ao caso concreto?`,
    classification: 'neutral' as const,
    confidence: 75,
    impact: 'medium' as const
  });

  // Regulatory compliance
  issues.push({
    title: 'Conformidade Regulatória ANS',
    content: `O procedimento está incluído no rol de procedimentos obrigatórios da ANS e há conformidade com as normas regulamentares?`,
    classification: (process.metricas_dashboard.score_urgencia >= 7 ? 'favorable' : 'neutral') as 'favorable' | 'neutral',
    confidence: 80,
    impact: 'medium' as const
  });

  return issues;
}

function generateRulesFromProcess(process: HealthInsuranceProcess) {
  const rules = [];

  // CDC rules
  rules.push({
    title: 'Código de Defesa do Consumidor',
    content: 'Art. 51, IV e § 1º, II do CDC - São nulas as cláusulas contratuais que estabeleçam obrigações consideradas iníquas, abusivas, que coloquem o consumidor em desvantagem exagerada ou sejam incompatíveis com a boa-fé ou equidade.',
    classification: 'favorable' as const,
    confidence: 95,
    impact: 'high' as const
  });

  // Health law
  rules.push({
    title: 'Lei dos Planos de Saúde',
    content: 'Lei 9.656/98, Art. 12 - São facultativas as seguintes coberturas: (...) Parágrafo único. Em caso de urgência ou emergência, a cobertura se estende às primeiras 12 horas de atendimento.',
    classification: (process.classificacao_demanda.carater_urgencia === 'urgente' ? 'favorable' : 'neutral') as 'favorable' | 'neutral',
    confidence: 90,
    impact: 'high' as const
  });

  // ANS regulations
  rules.push({
    title: 'Regulamentação ANS',
    content: 'Resolução Normativa ANS - Rol de Procedimentos e Eventos em Saúde, estabelecendo cobertura mínima obrigatória para procedimentos médicos.',
    classification: 'favorable' as const,
    confidence: 85,
    impact: 'medium' as const
  });

  // Constitutional principles
  rules.push({
    title: 'Princípios Constitucionais',
    content: 'Art. 196, CF/88 - A saúde é direito de todos e dever do Estado, garantido mediante políticas sociais e econômicas que visem à redução do risco de doença.',
    classification: 'favorable' as const,
    confidence: 80,
    impact: 'medium' as const
  });

  return rules;
}

function generateAnalysisFromProcess(process: HealthInsuranceProcess) {
  const analysis = [];

  // Legal precedent analysis
  analysis.push({
    title: 'Análise Precedencial',
    content: `Considerando a jurisprudência consolidada do STJ e tribunais estaduais, casos envolvendo ${process.classificacao_demanda.especialidade_medica} tendem a ser favoráveis ao beneficiário quando há comprovação da necessidade médica e urgência do procedimento.`,
    classification: 'favorable' as const,
    confidence: 85,
    impact: 'high' as const
  });

  // Risk assessment
  const riskLevel = process.metricas_dashboard.score_complexidade >= 7 ? 'alto' : 
                   process.metricas_dashboard.score_complexidade >= 5 ? 'médio' : 'baixo';
  analysis.push({
    title: 'Avaliação de Risco Processual',
    content: `O caso apresenta risco ${riskLevel} com base na complexidade jurídica (${process.metricas_dashboard.score_complexidade}/10) e valor da causa. ${process.aspectos_financeiros.valor_multa_diaria ? 'A existência de multa diária aumenta a pressão para acordo.' : 'Ausência de multa permite estratégia mais conservadora.'}`,
    classification: (riskLevel === 'baixo' ? 'favorable' : riskLevel === 'médio' ? 'neutral' : 'unfavorable') as 'favorable' | 'neutral' | 'unfavorable',
    confidence: 80,
    impact: (riskLevel === 'alto' ? 'high' : 'medium') as 'high' | 'medium'
  });

  // Time factor analysis
  analysis.push({
    title: 'Fator Temporal',
    content: `Com ${process.cronologia_processual.dias_tramitacao_total} dias de tramitação, ${process.cronologia_processual.dias_tramitacao_total > 365 ? 'o prolongamento do processo favorece acordo para evitar custos adicionais e desgaste.' : 'o tempo de tramitação ainda permite estratégia defensiva consistente.'}`,
    classification: (process.cronologia_processual.dias_tramitacao_total > 365 ? 'neutral' : 'favorable') as 'neutral' | 'favorable',
    confidence: 75,
    impact: 'medium' as const
  });

  // Financial impact analysis
  analysis.push({
    title: 'Impacto Financeiro',
    content: `O valor da causa (R$ ${process.aspectos_financeiros.valor_inicial_causa.toLocaleString('pt-BR')}) ${process.aspectos_financeiros.valor_inicial_causa > 100000 ? 'justifica investimento em defesa técnica especializada' : 'permite estratégia de defesa padrão'}. Score de impacto financeiro: ${process.metricas_dashboard.score_impacto_financeiro}/10.`,
    classification: (process.aspectos_financeiros.valor_inicial_causa < 50000 ? 'favorable' : 'neutral') as 'favorable' | 'neutral',
    confidence: 90,
    impact: (process.aspectos_financeiros.valor_inicial_causa > 100000 ? 'high' : 'medium') as 'high' | 'medium'
  });

  return analysis;
}

function generateConclusionFromProcess(process: HealthInsuranceProcess) {
  const conclusions = [];

  // Main strategy
  const successProbability = calculateSuccessProbability(process);
  const strategy = successProbability >= 70 ? 'defensiva' : successProbability >= 40 ? 'acordo' : 'ofensiva';
  
  conclusions.push({
    title: 'Estratégia Recomendada',
    content: `Com base na análise FIRAC, recomenda-se estratégia ${strategy}. Probabilidade de sucesso estimada: ${successProbability}%. ${strategy === 'defensiva' ? 'Investir em defesa técnica robusta.' : strategy === 'acordo' ? 'Buscar acordo vantajoso.' : 'Focar em argumentos processuais e técnicos.'}`,
    classification: (strategy === 'defensiva' ? 'favorable' : 'neutral') as 'favorable' | 'neutral',
    confidence: 85,
    impact: 'high' as const
  });

  // Next steps
  conclusions.push({
    title: 'Próximas Ações',
    content: `1) ${process.metricas_dashboard.requer_escalacao_executiva ? 'Comunicar diretoria sobre caso crítico; ' : ''}2) ${process.aspectos_financeiros.valor_multa_diaria ? 'Avaliar cumprimento para evitar multa; ' : ''}3) Preparar manifestação técnica especializada; 4) ${process.cronologia_processual.dias_tramitacao_total > 365 ? 'Considerar proposta de acordo.' : 'Monitorar prazos processuais.'}`,
    classification: 'neutral' as const,
    confidence: 95,
    impact: 'high' as const
  });

  // Resource allocation
  conclusions.push({
    title: 'Alocação de Recursos',
    content: `Caso requer ${process.metricas_dashboard.score_complexidade >= 7 ? 'advogado sênior e consultoria especializada' : process.metricas_dashboard.score_complexidade >= 5 ? 'advogado pleno com suporte técnico' : 'acompanhamento padrão'}. Orçamento estimado: R$ ${estimateResourceCost(process).toLocaleString('pt-BR')}.`,
    classification: 'neutral' as const,
    confidence: 80,
    impact: 'medium' as const
  });

  return conclusions;
}

function calculateSuccessProbability(process: HealthInsuranceProcess): number {
  let baseScore = 50;
  
  // Urgency factor
  if (process.classificacao_demanda.carater_urgencia === 'urgente') baseScore += 20;
  else if (process.classificacao_demanda.carater_urgencia === 'emergencia') baseScore += 15;
  
  // Liminar factor
  if (process.decisoes_judiciais?.liminar_antecipacao?.deferida) baseScore += 25;
  
  // Time factor
  if (process.cronologia_processual.dias_tramitacao_total > 730) baseScore -= 10;
  
  // Complexity factor
  if (process.metricas_dashboard.score_complexidade >= 8) baseScore -= 15;
  
  // Value factor
  if (process.aspectos_financeiros.valor_inicial_causa > 200000) baseScore -= 10;
  
  return Math.max(10, Math.min(90, baseScore));
}

function generateStrategicRecommendations(process: HealthInsuranceProcess) {
  const recommendations = [];
  
  if (process.metricas_dashboard.requer_escalacao_executiva) {
    recommendations.push({
      title: 'Escalação Executiva Imediata',
      description: 'Caso requer atenção da diretoria devido ao alto impacto estratégico e financeiro.',
      priority: 'high'
    });
  }
  
  if (process.aspectos_financeiros.valor_multa_diaria && process.aspectos_financeiros.valor_multa_diaria > 500) {
    recommendations.push({
      title: 'Gestão de Multa Diária',
      description: 'Avaliar cumprimento da liminar ou negociação para evitar acúmulo de multa.',
      priority: 'high'
    });
  }
  
  if (process.metricas_dashboard.score_complexidade >= 7) {
    recommendations.push({
      title: 'Consultoria Especializada',
      description: 'Contratar especialista em direito da saúde suplementar para suporte técnico.',
      priority: 'medium'
    });
  }
  
  if (process.cronologia_processual.dias_tramitacao_total > 365) {
    recommendations.push({
      title: 'Análise de Acordo',
      description: 'Avaliar proposta de acordo considerando custos de continuidade do processo.',
      priority: 'medium'
    });
  }
  
  return recommendations;
}

function estimateResourceCost(process: HealthInsuranceProcess): number {
  let baseCost = 5000;
  
  if (process.metricas_dashboard.score_complexidade >= 7) baseCost += 15000;
  else if (process.metricas_dashboard.score_complexidade >= 5) baseCost += 8000;
  
  if (process.aspectos_financeiros.valor_inicial_causa > 100000) baseCost += 10000;
  
  if (process.metricas_dashboard.requer_escalacao_executiva) baseCost += 20000;
  
  return baseCost;
}

export default FIRACAnalysis;