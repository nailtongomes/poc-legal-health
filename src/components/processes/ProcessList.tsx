import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  MoreVertical,
  Eye,
  Edit,
  CheckSquare,
} from 'lucide-react';
import { clsx } from 'clsx';
import Badge from '../common/Badge';
import { mockProcessos, departmentConfig, complexityConfig, priorityConfig, workflowConfig, roleConfig, mockUsers } from '../../data/mockData';
import { FilterState, Department, PriorityLevel, ComplexityLevel, ProcessStatus, WorkflowStatus, UserRole, Tag } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { useData } from '../../context/DataContext';

const statusConfig = {
  nova: { name: 'Nova', color: 'bg-blue-100 text-blue-800', icon: FileText },
  em_analise: { name: 'Em Análise', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  minuta_gerada: { name: 'Minuta Gerada', color: 'bg-purple-100 text-purple-800', icon: Edit },
  concluida: { name: 'Concluída', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  vencida: { name: 'Vencida', color: 'bg-red-100 text-red-800', icon: AlertCircle },
};

export default function ProcessList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProcesses, setSelectedProcesses] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const { processData, dataSource } = useData();

  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterState>({
    departamento: (searchParams.get('departamento') as Department) || 'todos',
    prioridade: searchParams.get('prioridade')?.split(',') as PriorityLevel[] || [],
    complexidade: searchParams.get('complexidade')?.split(',') as ComplexityLevel[] || [],
    prazo: (searchParams.get('prazo') as FilterState['prazo']) || 'todos',
    status: searchParams.get('status')?.split(',') as ProcessStatus[] || [],
    busca: searchParams.get('busca') || '',
    tags: searchParams.get('tags')?.split(',') || [],
    workflowStatus: searchParams.get('workflowStatus')?.split(',') as WorkflowStatus[] || [],
    responsavel: searchParams.get('responsavel') || 'todos',
    role: (searchParams.get('role') as UserRole) || 'todos',
  });

  // Use data from context or fallback to mock data
  const processes = processData.length > 0 ? processData : mockProcessos;

  // Filter processes based on current filters
  const filteredProcesses = useMemo(() => {
    return processes.filter((processo) => {
      // Department filter
      if (filters.departamento !== 'todos' && processo.departamentoResponsavel !== filters.departamento) {
        return false;
      }

      // Priority filter
      if (filters.prioridade.length > 0 && !filters.prioridade.includes(processo.prioridade)) {
        return false;
      }

      // Complexity filter
      if (filters.complexidade.length > 0 && !filters.complexidade.includes(processo.complexidade)) {
        return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(processo.status)) {
        return false;
      }

      // Deadline filter
      if (filters.prazo !== 'todos') {
        const daysUntilDeadline = Math.ceil(
          (new Date(processo.prazoResposta).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (filters.prazo === 'urgentes' && daysUntilDeadline > 3) return false;
        if (filters.prazo === 'vencendo' && (daysUntilDeadline <= 3 || daysUntilDeadline > 7)) return false;
        if (filters.prazo === 'normais' && daysUntilDeadline <= 7) return false;
      }

      // Workflow status filter
      if (filters.workflowStatus.length > 0 && !filters.workflowStatus.includes(processo.workflowStatus)) {
        return false;
      }

      // Responsible person filter
      if (filters.responsavel !== 'todos') {
        if (!processo.responsavel || processo.responsavel.id !== filters.responsavel) {
          return false;
        }
      }

      // Role filter
      if (filters.role !== 'todos') {
        if (!processo.responsavel || processo.responsavel.role !== filters.role) {
          return false;
        }
      }

      // Search filter
      if (filters.busca) {
        const searchTerm = filters.busca.toLowerCase();
        const searchableText = [
          processo.numeroProcesso,
          processo.assunto,
          processo.tribunal,
          ...processo.partes.ativo,
          ...processo.partes.passivo,
          processo.responsavel?.nome || '',
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
      if (v && v !== 'todos' && (Array.isArray(v) ? v.length > 0 : true)) {
        newParams.set(k, Array.isArray(v) ? v.join(',') : v);
      }
    });
    setSearchParams(newParams);
  };

  const getDaysUntilDeadline = (prazoResposta: string) => {
    return Math.ceil((new Date(prazoResposta).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 0) return 'text-red-600';
    if (days <= 3) return 'text-orange-600';
    if (days <= 7) return 'text-yellow-600';
    return 'text-gray-600';
  };

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
    // Simulate bulk tag validation
    alert(`Validando tags de ${selectedProcesses.length} processos...`);
    setSelectedProcesses([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Processos</h1>
          <p className="text-gray-600">
            {filteredProcesses.length} de {processes.length} processos
            {dataSource === 'unimed' && <span className="ml-2 text-sm">• Dados Unimed</span>}
            {dataSource === 'pgm' && <span className="ml-2 text-sm">• Dados PGM</span>}
            {filters.departamento !== 'todos' && (
              <span className="ml-2 text-sm">
                • {departmentConfig[filters.departamento as keyof typeof departmentConfig].name}
              </span>
            )}
          </p>
        </div>
        
        {selectedProcesses.length > 0 && (
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <span className="text-sm text-gray-600">{selectedProcesses.length} selecionados</span>
            <button
              onClick={handleBulkValidation}
              className="btn-primary text-sm"
            >
              <CheckSquare className="h-4 w-4 mr-1" />
              Validar Tags
            </button>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar processos..."
              value={filters.busca}
              onChange={(e) => updateFilter('busca', e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={clsx(
                'btn-secondary text-sm',
                showFilters && 'bg-primary-100 text-primary-700'
              )}
            >
              <Filter className="h-4 w-4 mr-1" />
              Filtros
            </button>
            
            <select
              value={filters.departamento}
              onChange={(e) => updateFilter('departamento', e.target.value)}
              className="input-field text-sm w-auto"
            >
              <option value="todos">Todos os Departamentos</option>
              {Object.entries(departmentConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.name}</option>
              ))}
            </select>

            <select
              value={filters.prazo}
              onChange={(e) => updateFilter('prazo', e.target.value)}
              className="input-field text-sm w-auto"
            >
              <option value="todos">Todos os Prazos</option>
              <option value="urgentes">Urgentes (≤3 dias)</option>
              <option value="vencendo">Vencendo (4-7 dias)</option>
              <option value="normais">Normais (&gt;7 dias)</option>
            </select>

            <select
              value={filters.responsavel}
              onChange={(e) => updateFilter('responsavel', e.target.value)}
              className="input-field text-sm w-auto"
            >
              <option value="todos">Todos os Responsáveis</option>
              {mockUsers.map((user) => (
                <option key={user.id} value={user.id}>{user.nome}</option>
              ))}
            </select>

            <select
              value={filters.role}
              onChange={(e) => updateFilter('role', e.target.value)}
              className="input-field text-sm w-auto"
            >
              <option value="todos">Todas as Funções</option>
              {Object.entries(roleConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Extended Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
                <div className="space-y-1">
                  {Object.entries(priorityConfig).map(([key, config]) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.prioridade.includes(key as PriorityLevel)}
                        onChange={(e) => {
                          const newPriorities = e.target.checked
                            ? [...filters.prioridade, key as PriorityLevel]
                            : filters.prioridade.filter(p => p !== key);
                          updateFilter('prioridade', newPriorities);
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{config.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Complexity Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Complexidade</label>
                <div className="space-y-1">
                  {Object.entries(complexityConfig).map(([key, config]) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.complexidade.includes(key as ComplexityLevel)}
                        onChange={(e) => {
                          const newComplexity = e.target.checked
                            ? [...filters.complexidade, key as ComplexityLevel]
                            : filters.complexidade.filter(c => c !== key);
                          updateFilter('complexidade', newComplexity);
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{config.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="space-y-1">
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.status.includes(key as ProcessStatus)}
                        onChange={(e) => {
                          const newStatus = e.target.checked
                            ? [...filters.status, key as ProcessStatus]
                            : filters.status.filter(s => s !== key);
                          updateFilter('status', newStatus);
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{config.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Workflow Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Workflow</label>
                <div className="space-y-1">
                  {Object.entries(workflowConfig).map(([key, config]) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.workflowStatus.includes(key as WorkflowStatus)}
                        onChange={(e) => {
                          const newWorkflowStatus = e.target.checked
                            ? [...filters.workflowStatus, key as WorkflowStatus]
                            : filters.workflowStatus.filter(w => w !== key);
                          updateFilter('workflowStatus', newWorkflowStatus);
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{config.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Process List */}
      <div className="card overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedProcesses.length === filteredProcesses.length && filteredProcesses.length > 0}
              onChange={handleSelectAll}
              className="mr-4"
            />
            <div className="grid grid-cols-12 gap-4 flex-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-2">Processo</div>
              <div className="col-span-2">Departamento</div>
              <div className="col-span-2">Status/Workflow</div>
              <div className="col-span-2">Responsável</div>
              <div className="col-span-2">Prazo</div>
              <div className="col-span-1">IA</div>
              <div className="col-span-1">Ações</div>
            </div>
          </div>
        </div>

        {/* Process Rows */}
        <div className="divide-y divide-gray-200">
          {filteredProcesses.map((processo) => {
            const daysLeft = getDaysUntilDeadline(processo.prazoResposta);
            const StatusIcon = statusConfig[processo.status as keyof typeof statusConfig].icon;
            
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
                    className="mr-4"
                  />
                  
                  <div className="grid grid-cols-12 gap-4 flex-1 items-center">
                    {/* Process Info */}
                    <div className="col-span-2">
                      <div 
                        className="cursor-pointer hover:text-primary-600"
                        onClick={() => navigate(`/processos/${processo.id}`)}
                      >
                        <p className="font-medium text-gray-900 text-sm">{processo.numeroProcesso}</p>
                        <p className="text-gray-600 text-xs truncate">{processo.assunto}</p>
                        <p className="text-gray-500 text-xs">
                          {processo.partes.ativo[0]} vs {processo.partes.passivo[0]}
                        </p>
                      </div>
                    </div>

                    {/* Department */}
                    <div className="col-span-2">
                      <Badge 
                        tag={{
                          id: `dept-${processo.departamentoResponsavel}`,
                          categoria: 'departamento',
                          valor: departmentConfig[processo.departamentoResponsavel as keyof typeof departmentConfig].name,
                          cor: departmentConfig[processo.departamentoResponsavel as keyof typeof departmentConfig].color,
                          confianca: 100,
                        }}
                        size="sm"
                      />
                    </div>

                    {/* Status & Workflow */}
                    <div className="col-span-2">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <StatusIcon className="h-3 w-3 text-gray-400" />
                          <Badge 
                            tag={{
                              id: `status-${processo.status}`,
                              categoria: 'prioridade',
                              valor: statusConfig[processo.status as keyof typeof statusConfig].name,
                              cor: statusConfig[processo.status as keyof typeof statusConfig].color,
                              confianca: 100,
                            }}
                            size="sm"
                          />
                        </div>
                        <Badge 
                          tag={{
                            id: `workflow-${processo.workflowStatus}`,
                            categoria: 'workflow',
                            valor: workflowConfig[processo.workflowStatus as keyof typeof workflowConfig].name,
                            cor: workflowConfig[processo.workflowStatus as keyof typeof workflowConfig].color,
                            confianca: 100,
                          }}
                          size="sm"
                        />
                      </div>
                    </div>

                    {/* Responsible */}
                    <div className="col-span-2">
                      {processo.responsavel ? (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-900">{processo.responsavel.nome}</p>
                          <Badge 
                            tag={{
                              id: `role-${processo.responsavel.id}`,
                              categoria: 'responsavel',
                              valor: roleConfig[processo.responsavel.role as keyof typeof roleConfig].name,
                              cor: roleConfig[processo.responsavel.role as keyof typeof roleConfig].color,
                              confianca: 100,
                            }}
                            size="sm"
                          />
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Não atribuído</span>
                      )}
                    </div>

                    {/* Deadline */}
                    <div className="col-span-2">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className={clsx('text-sm font-medium', getUrgencyColor(daysLeft))}>
                          {daysLeft <= 0 ? 'Vencido' : `${daysLeft}d`}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(processo.prazoResposta))}
                      </p>
                    </div>

                    {/* AI Confidence */}
                    <div className="col-span-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={clsx(
                              'h-2 rounded-full',
                              processo.confiancaIA >= 90 ? 'bg-green-500' :
                              processo.confiancaIA >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                            )}
                            style={{ width: `${processo.confiancaIA}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{processo.confiancaIA}%</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {processo.tags.slice(0, 2).map((tag: Tag) => (
                          <Badge key={tag.id} tag={tag} size="sm" />
                        ))}
                        {processo.tags.length > 2 && (
                          <span className="text-xs text-gray-500">+{processo.tags.length - 2}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => navigate(`/processos/${processo.id}`)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded"
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-gray-600 rounded"
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
          </div>
        )}
      </div>
    </div>
  );
}