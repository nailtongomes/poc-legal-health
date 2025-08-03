import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  BarChart3,
} from 'lucide-react';
import MetricCard from '../components/common/MetricCard';
import Badge from '../components/common/Badge';
import { mockDashboardMetrics, mockProcessos, departmentConfig } from '../data/mockData';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const navigate = useNavigate();
  const metrics = mockDashboardMetrics;
  
  // Get urgent processes (deadline within 3 days)
  const urgentProcesses = mockProcessos.filter(p => {
    const daysUntilDeadline = Math.ceil(
      (new Date(p.prazoResposta).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilDeadline <= 3 && p.status !== 'concluida';
  });

  // Get recent processes
  const recentProcesses = mockProcessos
    .slice()
    .sort((a, b) => new Date(b.dataRecebimento).getTime() - new Date(a.dataRecebimento).getTime())
    .slice(0, 5);

  const handleMetricClick = (filter: string) => {
    navigate(`/processos?${filter}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema de gestão de minutas jurídicas</p>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Intimações Recebidas"
          value={metrics.intimacoesRecebidas}
          icon={FileText}
          color="bg-blue-600"
          change={12}
          onClick={() => handleMetricClick('status=nova')}
        />
        <MetricCard
          title="Minutas Pendentes"
          value={metrics.minutasPendentes}
          icon={Clock}
          color="bg-orange-600"
          onClick={() => handleMetricClick('status=em_analise,minuta_gerada')}
        />
        <MetricCard
          title="Minutas Concluídas"
          value={metrics.minutasConcluidas}
          icon={CheckCircle}
          color="bg-green-600"
          change={8}
          onClick={() => handleMetricClick('status=concluida')}
        />
        <MetricCard
          title="Prazos Urgentes"
          value={metrics.prazosUrgentes}
          icon={AlertTriangle}
          color="bg-red-600"
          onClick={() => handleMetricClick('prazo=urgentes')}
        />
      </div>

      {/* AI Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard
          title="Eficiência da IA"
          value={`${metrics.eficienciaIA}%`}
          icon={TrendingUp}
          color="bg-purple-600"
          subtitle="Minutas aprovadas sem alteração"
        />
        <MetricCard
          title="Tempo Médio por Minuta"
          value={`${metrics.tempoMedioPorMinuta} min`}
          icon={BarChart3}
          color="bg-indigo-600"
          subtitle="Redução de 80% vs. processo manual"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent Processes */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Processos Urgentes</h2>
            <Badge 
              tag={{
                id: 'urgent-count',
                categoria: 'prioridade',
                valor: `${urgentProcesses.length} casos`,
                cor: 'bg-red-100 text-red-800',
                confianca: 100,
              }}
            />
          </div>
          <div className="space-y-3">
            {urgentProcesses.slice(0, 5).map((processo) => {
              const daysLeft = Math.ceil(
                (new Date(processo.prazoResposta).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );
              return (
                <div
                  key={processo.id}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200 cursor-pointer hover:bg-red-100 transition-colors"
                  onClick={() => navigate(`/processos/${processo.id}`)}
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{processo.numeroProcesso}</p>
                    <p className="text-gray-600 text-xs">{processo.assunto}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-600 font-semibold text-xs">
                      {daysLeft <= 0 ? 'Vencido' : `${daysLeft} dia${daysLeft !== 1 ? 's' : ''}`}
                    </p>
                    <Badge 
                      tag={{
                        id: `dept-${processo.departamentoResponsavel}`,
                        categoria: 'departamento',
                        valor: departmentConfig[processo.departamentoResponsavel].name,
                        cor: departmentConfig[processo.departamentoResponsavel].color,
                        confianca: 100,
                      }}
                      size="sm"
                    />
                  </div>
                </div>
              );
            })}
            {urgentProcesses.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                <p>Nenhum processo urgente no momento</p>
              </div>
            )}
          </div>
        </div>

        {/* Department Distribution */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Distribuição por Departamento</h2>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {Object.entries(metrics.distribuicaoDepartamentos)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 6)
              .map(([dept, count]) => {
                const config = departmentConfig[dept as keyof typeof departmentConfig];
                const percentage = (count / Object.values(metrics.distribuicaoDepartamentos).reduce((a, b) => a + b, 0) * 100);
                
                return (
                  <div
                    key={dept}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    onClick={() => handleMetricClick(`departamento=${dept}`)}
                  >
                    <div className="flex items-center">
                      <Badge 
                        tag={{
                          id: `dept-${dept}`,
                          categoria: 'departamento',
                          valor: config.name,
                          cor: config.color,
                          confianca: 100,
                        }}
                        size="sm"
                      />
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{count}</p>
                      <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h2>
        <div className="space-y-4">
          {recentProcesses.map((processo) => (
            <div
              key={processo.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              onClick={() => navigate(`/processos/${processo.id}`)}
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <p className="font-medium text-gray-900">{processo.numeroProcesso}</p>
                  <Badge 
                    tag={{
                      id: `status-${processo.status}`,
                      categoria: 'prioridade',
                      valor: processo.status === 'nova' ? 'Nova' : 
                             processo.status === 'em_analise' ? 'Em Análise' :
                             processo.status === 'minuta_gerada' ? 'Minuta Gerada' :
                             processo.status === 'concluida' ? 'Concluída' : 'Vencida',
                      cor: processo.status === 'nova' ? 'bg-blue-100 text-blue-800' :
                           processo.status === 'em_analise' ? 'bg-yellow-100 text-yellow-800' :
                           processo.status === 'minuta_gerada' ? 'bg-purple-100 text-purple-800' :
                           processo.status === 'concluida' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                      confianca: 100,
                    }}
                    size="sm"
                  />
                </div>
                <p className="text-gray-600 text-sm mt-1">{processo.assunto}</p>
                <div className="flex items-center space-x-2 mt-2">
                  {processo.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag.id} tag={tag} size="sm" />
                  ))}
                  {processo.tags.length > 2 && (
                    <span className="text-xs text-gray-500">+{processo.tags.length - 2} mais</span>
                  )}
                </div>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>{formatDistanceToNow(new Date(processo.dataRecebimento), { addSuffix: true })}</p>
                <p className="text-xs">IA: {processo.confiancaIA}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}