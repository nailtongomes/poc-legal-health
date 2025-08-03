import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain,
  Edit,
  Download,
  Eye,
  Database,
  Activity,
  BarChart3,
  TrendingUp,
  Heart,
  Stethoscope
} from 'lucide-react';
import { clsx } from 'clsx';
import { useHealthInsurance } from '../context/HealthInsuranceContext';
import FIRACAnalysis from '../components/analysis/FIRACAnalysis';
import CompleteDataViewer from '../components/analysis/CompleteDataViewer';
import ProcessTimeline from '../components/analysis/ProcessTimeline';
import AIDocumentGenerator from '../components/documents/AIDocumentGenerator';

const tabConfig = [
  { id: 'overview', name: 'Visão Geral', icon: Eye },
  { id: 'firac', name: 'Análise FIRAC', icon: Brain },
  { id: 'documents', name: 'Gerador IA', icon: Edit },
  { id: 'timeline', name: 'Timeline Processual', icon: Clock },
  { id: 'data', name: 'Dados Completos', icon: Database },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
];

export default function ProcessDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const { processes, loading } = useHealthInsurance();

  const processo = processes.find(p => p.id === id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg text-gray-600">Carregando processo...</span>
      </div>
    );
  }

  if (!processo) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Processo não encontrado</p>
        <button
          onClick={() => navigate('/processos')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4"
        >
          Voltar aos Processos
        </button>
      </div>
    );
  }

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const getSpecialtyIcon = () => {
    switch (processo.classificacao_demanda.especialidade_medica) {
      case 'cardiologia': return Heart;
      case 'oncologia': return Activity;
      default: return Stethoscope;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vermelho': return 'bg-red-100 text-red-800';
      case 'amarelo': return 'bg-yellow-100 text-yellow-800';
      case 'verde': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critica': return 'bg-red-100 text-red-800';
      case 'alta': return 'bg-orange-100 text-orange-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const SpecialtyIcon = getSpecialtyIcon();


  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Process Summary */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <SpecialtyIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{processo.numero_processo}</h2>
              <p className="text-gray-600">{processo.partes_principais}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={clsx(
              'px-3 py-1 rounded-full text-sm font-medium',
              getStatusColor(processo.metricas_dashboard.status_semaforo)
            )}>
              {processo.metricas_dashboard.status_semaforo.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Especialidade Médica</h3>
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-600 capitalize">
                {processo.classificacao_demanda.especialidade_medica.replace('_', ' ')}
              </p>
              <p className="text-xs text-gray-600">
                {processo.classificacao_demanda.procedimento_especifico}
              </p>
              <span className={clsx(
                'inline-block px-2 py-1 rounded text-xs font-medium',
                processo.classificacao_demanda.carater_urgencia === 'urgente' ? 'bg-red-100 text-red-800' :
                processo.classificacao_demanda.carater_urgencia === 'emergencia' ? 'bg-orange-100 text-orange-800' :
                'bg-green-100 text-green-800'
              )}>
                {processo.classificacao_demanda.carater_urgencia.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Aspectos Financeiros</h3>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-green-600">
                {formatCurrency(processo.aspectos_financeiros.valor_inicial_causa)}
              </p>
              {processo.aspectos_financeiros.valor_multa_diaria && (
                <p className="text-xs text-red-600">
                  Multa: {formatCurrency(processo.aspectos_financeiros.valor_multa_diaria)}/dia
                </p>
              )}
              <p className="text-xs text-gray-600">
                Score Impacto: {processo.metricas_dashboard.score_impacto_financeiro}/10
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Prioridade & Scores</h3>
            <div className="space-y-2">
              <span className={clsx(
                'inline-block px-2 py-1 rounded text-xs font-medium',
                getPriorityColor(processo.metricas_dashboard.prioridade_gestao)
              )}>
                {processo.metricas_dashboard.prioridade_gestao.toUpperCase()}
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-medium text-blue-600">{processo.metricas_dashboard.score_urgencia}</div>
                  <div className="text-gray-500">Urgência</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-purple-600">{processo.metricas_dashboard.score_complexidade}</div>
                  <div className="text-gray-500">Complex.</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-orange-600">{processo.metricas_dashboard.score_impacto_financeiro}</div>
                  <div className="text-gray-500">Impacto</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Status Atual</h3>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-gray-600">Tramitação:</span>
                <span className="font-medium ml-1">{processo.cronologia_processual.dias_tramitacao_total} dias</span>
              </p>
              <p className="text-sm">
                <span className="text-gray-600">Processo:</span>
                <span className={clsx(
                  'ml-1 px-2 py-0.5 rounded text-xs font-medium',
                  processo.cronologia_processual.processo_ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                )}>
                  {processo.cronologia_processual.processo_ativo ? 'Ativo' : 'Inativo'}
                </span>
              </p>
              {processo.metricas_dashboard.requer_escalacao_executiva && (
                <span className="inline-block px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                  🚨 ESCALAÇÃO EXECUTIVA
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Decision Status */}
      {processo.decisoes_judiciais && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
            Decisões Judiciais
          </h3>
          
          {processo.decisoes_judiciais.liminar_antecipacao && (
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-green-900">Liminar de Antecipação de Tutela</h4>
                <span className={clsx(
                  'px-2 py-1 rounded text-xs font-medium',
                  processo.decisoes_judiciais.liminar_antecipacao.deferida 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                )}>
                  {processo.decisoes_judiciais.liminar_antecipacao.deferida ? 'DEFERIDA' : 'INDEFERIDA'}
                </span>
              </div>
              {processo.decisoes_judiciais.liminar_antecipacao.data_decisao && (
                <p className="text-sm text-green-700">
                  Data da decisão: {processo.decisoes_judiciais.liminar_antecipacao.data_decisao}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Risk Alerts */}
      {(processo.status_atual.risco_multa_crescente || processo.metricas_dashboard.requer_escalacao_executiva) && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
            Alertas Críticos
          </h3>
          
          <div className="space-y-3">
            {processo.status_atual.risco_multa_crescente && (
              <div className="flex items-center p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
                <div>
                  <p className="font-medium text-red-900">Risco de Multa Crescente</p>
                  <p className="text-sm text-red-700">Processo com risco de acúmulo de multa diária</p>
                </div>
              </div>
            )}
            
            {processo.metricas_dashboard.requer_escalacao_executiva && (
              <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-600 mr-3" />
                <div>
                  <p className="font-medium text-orange-900">Escalação Executiva Requerida</p>
                  <p className="text-sm text-orange-700">Caso crítico que requer atenção da diretoria</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderFiracTab = () => (
    <FIRACAnalysis process={processo} />
  );

  const renderTimelineTab = () => (
    <ProcessTimeline process={processo} />
  );

  const renderDocumentsTab = () => (
    <AIDocumentGenerator process={processo} />
  );

  const renderDataTab = () => (
    <CompleteDataViewer process={processo} />
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-indigo-600" />
          Analytics Preditivos - {processo.numero_processo}
        </h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-gray-700 mb-4">
            <strong>Dados insuficientes na demonstração atual.</strong> Em produção com histórico completo, esta funcionalidade conecta gestores executivos através de:
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <strong>Predição de Sucesso:</strong> Análise preditiva indica {75 + Math.floor(Math.random() * 20)}% de probabilidade de resultado favorável baseada em casos similares
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <strong>Custo vs. Benefício:</strong> Estimativa de {formatCurrency(15000 + Math.floor(Math.random() * 20000))} para defesa completa vs. {formatCurrency(processo.aspectos_financeiros.valor_inicial_causa * 0.6)} para acordo
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <strong>Benchmark Setorial:</strong> Tempo médio de resolução para {processo.classificacao_demanda.especialidade_medica}: {180 + Math.floor(Math.random() * 200)} dias (este caso: {processo.cronologia_processual.dias_tramitacao_total} dias)
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <strong>Alertas Executivos:</strong> {processo.metricas_dashboard.requer_escalacao_executiva ? 'Sistema já escalou automaticamente para diretoria devido ao alto impacto estratégico' : 'Caso dentro dos parâmetros normais de gestão departamental'}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview': return renderOverviewTab();
      case 'firac': return renderFiracTab();
      case 'documents': return renderDocumentsTab();
      case 'timeline': return renderTimelineTab();
      case 'data': return renderDataTab();
      case 'analytics': return renderAnalyticsTab();
      default: return renderOverviewTab();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/processos')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{processo.numero_processo}</h1>
            <p className="text-gray-600">{processo.partes_principais}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center">
            <Edit className="h-4 w-4 mr-2" />
            Ações
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabConfig.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {renderActiveTab()}
    </div>
  );
}