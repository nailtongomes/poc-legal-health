import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  MoreVertical,
  Eye,
  Edit,
  CheckSquare,
  Heart,
  Activity,
  Brain,
  Bone,
  Baby,
  Stethoscope,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import { clsx } from 'clsx';
import { useHealthInsurance } from '../../context/HealthInsuranceContext';
import { HealthInsuranceProcess, MedicalSpecialty, DemandType, ManagementPriority, TrafficLightStatus } from '../../types/healthInsurance';
import { formatDistanceToNow } from 'date-fns';

const medicalSpecialtyIcons: Record<MedicalSpecialty, React.ComponentType<{ className?: string }>> = {
  cardiologia: Heart,
  oncologia: Activity,
  neurologia: Brain,
  ortopedia: Bone,
  psiquiatria: Brain,
  gastroenterologia: Activity,
  ginecologia: Heart,
  pediatria: Baby,
  urologia: Activity,
  oftalmologia: Eye,
  dermatologia: Activity,
  endocrinologia: Activity,
  reumatologia: Bone,
  hematologia: Activity,
  nefrologia: Activity,
  pneumologia: Activity,
  outros: Stethoscope,
};

const demandTypeNames: Record<DemandType, string> = {
  cobertura_negada: 'Cobertura Negada',
  reajuste_contratual: 'Reajuste Contratual',
  prazo_autorizacao: 'Prazo Autorização',
  rede_credenciada: 'Rede Credenciada',
  urgencia_emergencia: 'Urgência/Emergência',
  doenca_preexistente: 'Doença Preexistente',
  carencia: 'Carência',
  medicamento_alto_custo: 'Medicamento Alto Custo',
  procedimento_experimental: 'Procedimento Experimental',
  home_care: 'Home Care',
  internacao_domiciliar: 'Internação Domiciliar',
  terapias: 'Terapias',
  exames_diagnosticos: 'Exames Diagnósticos',
  cirurgia_eletiva: 'Cirurgia Eletiva',
  transplante: 'Transplante',
  outros: 'Outros'
};

const specialtyNames: Record<MedicalSpecialty, string> = {
  cardiologia: 'Cardiologia',
  oncologia: 'Oncologia',
  neurologia: 'Neurologia',
  ortopedia: 'Ortopedia',
  psiquiatria: 'Psiquiatria',
  gastroenterologia: 'Gastroenterologia',
  ginecologia: 'Ginecologia',
  pediatria: 'Pediatria',
  urologia: 'Urologia',
  oftalmologia: 'Oftalmologia',
  dermatologia: 'Dermatologia',
  endocrinologia: 'Endocrinologia',
  reumatologia: 'Reumatologia',
  hematologia: 'Hematologia',
  nefrologia: 'Nefrologia',
  pneumologia: 'Pneumologia',
  outros: 'Outros'
};

interface FilterState {
  especialidade: MedicalSpecialty[];
  tipo_demanda: DemandType[];
  prioridade_gestao: ManagementPriority[];
  status_semaforo: TrafficLightStatus[];
  valor_causa_min: number;
  valor_causa_max: number;
  urgencia_min: number;
  apenas_ativos: boolean;
  busca: string;
  escalacao_executiva: boolean;
  risco_multa: boolean;
}

export default function HealthInsuranceProcessList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProcesses, setSelectedProcesses] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const { processes, loading } = useHealthInsurance();

  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterState>({
    especialidade: (searchParams.get('especialidade')?.split(',') as MedicalSpecialty[]) || [],
    tipo_demanda: (searchParams.get('tipo_demanda')?.split(',') as DemandType[]) || [],
    prioridade_gestao: (searchParams.get('prioridade_gestao')?.split(',') as ManagementPriority[]) || [],
    status_semaforo: (searchParams.get('status_semaforo')?.split(',') as TrafficLightStatus[]) || [],
    valor_causa_min: parseInt(searchParams.get('valor_causa_min') || '0'),
    valor_causa_max: parseInt(searchParams.get('valor_causa_max') || '1000000'),
    urgencia_min: parseInt(searchParams.get('urgencia_min') || '1'),
    apenas_ativos: searchParams.get('apenas_ativos') === 'true',
    busca: searchParams.get('busca') || '',
    escalacao_executiva: searchParams.get('escalacao_executiva') === 'true',
    risco_multa: searchParams.get('risco_multa') === 'true',
  });

  // Filter processes based on current filters
  const filteredProcesses = useMemo(() => {
    return processes.filter((processo) => {
      // Medical specialty filter
      if (filters.especialidade.length > 0 && !filters.especialidade.includes(processo.classificacao_demanda.especialidade_medica)) {
        return false;
      }

      // Demand type filter
      if (filters.tipo_demanda.length > 0 && !filters.tipo_demanda.includes(processo.classificacao_demanda.tipo_demanda)) {
        return false;
      }

      // Management priority filter
      if (filters.prioridade_gestao.length > 0 && !filters.prioridade_gestao.includes(processo.metricas_dashboard.prioridade_gestao)) {
        return false;
      }

      // Traffic light status filter
      if (filters.status_semaforo.length > 0 && !filters.status_semaforo.includes(processo.metricas_dashboard.status_semaforo)) {
        return false;
      }

      // Value range filter
      if (processo.aspectos_financeiros.valor_inicial_causa < filters.valor_causa_min || 
          processo.aspectos_financeiros.valor_inicial_causa > filters.valor_causa_max) {
        return false;
      }

      // Urgency filter
      if (processo.metricas_dashboard.score_urgencia < filters.urgencia_min) {
        return false;
      }

      // Active processes only
      if (filters.apenas_ativos && !processo.cronologia_processual.processo_ativo) {
        return false;
      }

      // Executive escalation filter
      if (filters.escalacao_executiva && !processo.metricas_dashboard.requer_escalacao_executiva) {
        return false;
      }

      // Penalty risk filter
      if (filters.risco_multa && !processo.status_atual.risco_multa_crescente) {
        return false;
      }

      // Search filter
      if (filters.busca) {
        const searchTerm = filters.busca.toLowerCase();
        const searchableText = [
          processo.numero_processo,
          processo.partes_principais,
          processo.classificacao_demanda.procedimento_especifico,
          specialtyNames[processo.classificacao_demanda.especialidade_medica],
          demandTypeNames[processo.classificacao_demanda.tipo_demanda],
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });
  }, [filters, processes]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const newParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && (Array.isArray(v) ? v.length > 0 : v !== 0 && v !== false && v !== '')) {
        newParams.set(k, Array.isArray(v) ? v.join(',') : String(v));
      }
    });
    setSearchParams(newParams);
  };

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const handleSelectProcess = (processId: string) => {
    setSelectedProcesses(prev => 
      prev.includes(processId) 
        ? prev.filter(id => id !== processId)
        : [...prev, processId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProcesses.length === filteredProcesses.length) {
      setSelectedProcesses([]);
    } else {
      setSelectedProcesses(filteredProcesses.map(p => p.id));
    }
  };

  const handleBulkValidation = () => {
    alert(`Validando classificação IA de ${selectedProcesses.length} processos...`);
    setSelectedProcesses([]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg text-gray-600">Carregando processos Unimed...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🏥 Processos Jurídicos - Saúde Suplementar</h1>
          <p className="text-gray-600">
            {filteredProcesses.length} de {processes.length} processos
            <span className="ml-2 text-sm text-blue-600">• Dados Unimed Real</span>
          </p>
        </div>
        
        {selectedProcesses.length > 0 && (
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <span className="text-sm text-gray-600">{selectedProcesses.length} selecionados</span>
            <button
              onClick={handleBulkValidation}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <CheckSquare className="h-4 w-4 mr-1 inline" />
              Validar Classificação IA
            </button>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar processos, especialidades, procedimentos..."
              value={filters.busca}
              onChange={(e) => updateFilter('busca', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={clsx(
                'px-3 py-2 text-sm font-medium rounded-lg border transition-colors',
                showFilters 
                  ? 'bg-blue-100 text-blue-700 border-blue-200' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              )}
            >
              <Filter className="h-4 w-4 mr-1 inline" />
              Filtros
            </button>
            
            <select
              value={filters.especialidade[0] || ''}
              onChange={(e) => updateFilter('especialidade', e.target.value ? [e.target.value] : [])}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas as Especialidades</option>
              {Object.entries(specialtyNames).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>

            <select
              value={filters.prioridade_gestao[0] || ''}
              onChange={(e) => updateFilter('prioridade_gestao', e.target.value ? [e.target.value] : [])}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas as Prioridades</option>
              <option value="critica">Crítica</option>
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </select>

            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={filters.escalacao_executiva}
                onChange={(e) => updateFilter('escalacao_executiva', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Escalação Executiva</span>
            </label>

            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={filters.risco_multa}
                onChange={(e) => updateFilter('risco_multa', e.target.checked)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span>Risco de Multa</span>
            </label>
          </div>
        </div>

        {/* Extended Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Urgency Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgência Mínima: {filters.urgencia_min}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={filters.urgencia_min}
                  onChange={(e) => updateFilter('urgencia_min', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Value Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor Mínimo: {formatCurrency(filters.valor_causa_min)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="10000"
                  value={filters.valor_causa_min}
                  onChange={(e) => updateFilter('valor_causa_min', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Active Only */}
              <div className="flex items-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.apenas_ativos}
                    onChange={(e) => updateFilter('apenas_ativos', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Apenas Processos Ativos</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Process List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
        {/* Table Header */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedProcesses.length === filteredProcesses.length && filteredProcesses.length > 0}
              onChange={handleSelectAll}
              className="mr-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="grid grid-cols-12 gap-4 flex-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-3">Processo</div>
              <div className="col-span-2">Especialidade</div>
              <div className="col-span-2">Tipo Demanda</div>
              <div className="col-span-2">Prioridade</div>
              <div className="col-span-2">Valor/Scores</div>
              <div className="col-span-1">Ações</div>
            </div>
          </div>
        </div>

        {/* Process Rows */}
        <div className="divide-y divide-gray-200">
          {filteredProcesses.map((processo) => {
            const SpecialtyIcon = medicalSpecialtyIcons[processo.classificacao_demanda.especialidade_medica];
            const priorityColors = {
              critica: 'bg-red-100 text-red-800 border-red-200',
              alta: 'bg-orange-100 text-orange-800 border-orange-200',
              media: 'bg-yellow-100 text-yellow-800 border-yellow-200',
              baixa: 'bg-green-100 text-green-800 border-green-200'
            };
            
            return (
              <div
                key={processo.id}
                className={clsx(
                  'px-6 py-4 hover:bg-gray-50 transition-colors',
                  selectedProcesses.includes(processo.id) && 'bg-blue-50'
                )}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedProcesses.includes(processo.id)}
                    onChange={() => handleSelectProcess(processo.id)}
                    className="mr-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  
                  <div className="grid grid-cols-12 gap-4 flex-1 items-center">
                    {/* Process Info */}
                    <div className="col-span-3">
                      <div 
                        className="cursor-pointer hover:text-blue-600"
                        onClick={() => navigate(`/processos/${processo.id}`)}
                      >
                        <p className="font-medium text-gray-900 text-sm">{processo.numero_processo}</p>
                        <p className="text-gray-600 text-xs truncate">{processo.partes_principais}</p>
                        <p className="text-gray-500 text-xs">
                          {processo.classificacao_demanda.procedimento_especifico}
                        </p>
                        {processo.metricas_dashboard.requer_escalacao_executiva && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-1">
                            🚨 ESCALAÇÃO
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Medical Specialty */}
                    <div className="col-span-2">
                      <div className="flex items-center space-x-2">
                        <SpecialtyIcon className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-900">
                          {specialtyNames[processo.classificacao_demanda.especialidade_medica]}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {processo.classificacao_demanda.carater_urgencia === 'urgente' ? '🚨 Urgente' :
                         processo.classificacao_demanda.carater_urgencia === 'emergencia' ? '⚡ Emergência' : '📅 Eletivo'}
                      </div>
                    </div>

                    {/* Demand Type */}
                    <div className="col-span-2">
                      <div className="text-sm font-medium text-gray-900">
                        {demandTypeNames[processo.classificacao_demanda.tipo_demanda]}
                      </div>
                      <div className="text-xs text-gray-500">
                        {processo.cronologia_processual.dias_tramitacao_total} dias tramitação
                      </div>
                    </div>

                    {/* Priority */}
                    <div className="col-span-2">
                      <span className={clsx(
                        'inline-flex items-center px-2 py-1 rounded text-xs font-medium border',
                        priorityColors[processo.metricas_dashboard.prioridade_gestao]
                      )}>
                        {processo.metricas_dashboard.prioridade_gestao.toUpperCase()}
                      </span>
                      <div className="flex items-center space-x-1 mt-1">
                        <div className={clsx(
                          'w-2 h-2 rounded-full',
                          processo.metricas_dashboard.status_semaforo === 'vermelho' ? 'bg-red-500' :
                          processo.metricas_dashboard.status_semaforo === 'amarelo' ? 'bg-yellow-500' : 'bg-green-500'
                        )} />
                        <span className="text-xs text-gray-500">
                          {processo.metricas_dashboard.status_semaforo}
                        </span>
                      </div>
                    </div>

                    {/* Value & Scores */}
                    <div className="col-span-2">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(processo.aspectos_financeiros.valor_inicial_causa)}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>U:{processo.metricas_dashboard.score_urgencia}</span>
                        <span>C:{processo.metricas_dashboard.score_complexidade}</span>
                        <span>I:{processo.metricas_dashboard.score_impacto_financeiro}</span>
                      </div>
                      {processo.aspectos_financeiros.valor_multa_diaria && processo.aspectos_financeiros.valor_multa_diaria > 0 && (
                        <div className="text-xs text-red-600 font-medium">
                          Multa: {formatCurrency(processo.aspectos_financeiros.valor_multa_diaria)}/dia
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="col-span-1">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => navigate(`/processos/${processo.id}`)}
                          className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
                          title="Ver detalhes completos"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                          title="Mais opções"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProcesses.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum processo encontrado com os filtros aplicados</p>
            <button
              onClick={() => setFilters({
                especialidade: [],
                tipo_demanda: [],
                prioridade_gestao: [],
                status_semaforo: [],
                valor_causa_min: 0,
                valor_causa_max: 1000000,
                urgencia_min: 1,
                apenas_ativos: false,
                busca: '',
                escalacao_executiva: false,
                risco_multa: false,
              })}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}