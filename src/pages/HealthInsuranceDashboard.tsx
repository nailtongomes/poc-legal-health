import React from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  Activity, 
  DollarSign, 
  Clock, 
  Heart,
  Shield,
  FileText
} from 'lucide-react';
import { useHealthInsurance } from '../context/HealthInsuranceContext';

const HealthInsuranceDashboard: React.FC = () => {
  const { kpis, alerts, loading } = useHealthInsurance();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg text-gray-600">Carregando dados jurídicos...</span>
      </div>
    );
  }

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatNumber = (value: number) => 
    new Intl.NumberFormat('pt-BR').format(value);

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🏥 Health Legal Intelligence</h1>
            <p className="text-blue-100 text-lg">
              Dashboard Executivo - Saúde Suplementar
            </p>
            <p className="text-blue-200 text-sm mt-1">
              Powered by RPA + AI Analytics | Atualização em tempo real
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{formatNumber(kpis.total_processos || 0)}</div>
            <div className="text-blue-200">Processos Ativos</div>
          </div>
        </div>
      </div>

      {/* Executive KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Processes */}
        <div className="bg-white rounded-lg border-l-4 border-blue-500 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {formatNumber(kpis.total_processos || 0)}
              </div>
              <div className="text-gray-600 font-medium">Processos Totais</div>
              <div className="text-sm text-gray-500">
                {formatNumber(kpis.processos_ativos || 0)} ativos ({((kpis.processos_ativos || 0) / (kpis.total_processos || 1) * 100).toFixed(1)}%)
              </div>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        {/* Financial Exposure */}
        <div className="bg-white rounded-lg border-l-4 border-red-500 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-red-600">
                {formatCurrency((kpis.exposicao_total || 0) / 1000000)}M
              </div>
              <div className="text-gray-600 font-medium">Exposição Total</div>
              <div className="text-sm text-gray-500">Causa + Multas</div>
            </div>
            <DollarSign className="h-8 w-8 text-red-500" />
          </div>
        </div>

        {/* Executive Escalation */}
        <div className="bg-white rounded-lg border-l-4 border-orange-500 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-orange-600">
                {formatNumber(kpis.casos_escalacao_executiva || 0)}
              </div>
              <div className="text-gray-600 font-medium">Escalação Executiva</div>
              <div className="text-sm text-gray-500">
                {((kpis.casos_escalacao_executiva || 0) / (kpis.total_processos || 1) * 100).toFixed(1)}% do total
              </div>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        {/* Active Penalties */}
        <div className="bg-white rounded-lg border-l-4 border-yellow-500 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-yellow-600">
                {formatNumber(kpis.multas_ativas || 0)}
              </div>
              <div className="text-gray-600 font-medium">Multas Crescentes</div>
              <div className="text-sm text-gray-500">
                Potencial: {formatCurrency((kpis.multas_ativas || 0) * 500 * 30)}/mês
              </div>
            </div>
            <Activity className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        {/* Average Time */}
        <div className="bg-white rounded-lg border-l-4 border-green-500 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-600">
                {formatNumber(kpis.tempo_medio_tramitacao || 0)}
              </div>
              <div className="text-gray-600 font-medium">Dias Médios</div>
              <div className="text-sm text-gray-500">
                {kpis.tempo_medio_tramitacao > 365 ? '⏰ LONGO' : '📅 NORMAL'}
              </div>
            </div>
            <Clock className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Critical Alerts Section */}
      {alerts.length > 0 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
            <h2 className="text-xl font-bold text-red-800">
              🚨 CASOS PARA ESCALAÇÃO EXECUTIVA
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alerts.slice(0, 6).map((alert) => (
              <div key={alert.id} className="bg-white border border-red-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-medium px-2 py-1 bg-red-100 text-red-800 rounded">
                    {alert.tipo.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-gray-500">
                    {alert.prazo_acao}d
                  </span>
                </div>
                <div className="font-medium text-gray-900 mb-1">
                  {alert.processo}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {alert.mensagem}
                </div>
                <div className="text-xs text-gray-500">
                  <strong>Ação:</strong> {alert.acao_recomendada}
                </div>
                <div className="text-xs text-gray-500">
                  <strong>Responsável:</strong> {alert.responsavel_sugerido}
                </div>
                {alert.valor_impacto && (
                  <div className="text-xs font-medium text-red-600 mt-1">
                    Impacto: {formatCurrency(alert.valor_impacto)}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {alerts.length > 6 && (
            <div className="mt-4 text-center">
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Ver todos os {alerts.length} alertas críticos
              </button>
            </div>
          )}
        </div>
      )}

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Medical Specialties Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Heart className="h-5 w-5 text-red-500 mr-2" />
            Distribuição por Especialidade Médica
          </h3>
          
          <div className="space-y-3">
            {Object.entries(kpis.distribuicao_especialidades || {})
              .sort(([,a], [,b]) => b - a)
              .slice(0, 8)
              .map(([specialty, count]) => {
                const percentage = ((count / (kpis.total_processos || 1)) * 100);
                const specialtyNames: Record<string, string> = {
                  cardiologia: 'Cardiologia',
                  oncologia: 'Oncologia',
                  neurologia: 'Neurologia',
                  ortopedia: 'Ortopedia',
                  psiquiatria: 'Psiquiatria',
                  gastroenterologia: 'Gastroenterologia',
                  ginecologia: 'Ginecologia',
                  pediatria: 'Pediatria',
                  urologia: 'Urologia',
                  oftalmologia: 'Oftalmologia'
                };
                
                return (
                  <div key={specialty} className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className="w-32 text-sm font-medium text-gray-700">
                        {specialtyNames[specialty] || specialty}
                      </div>
                      <div className="flex-1 mx-3">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 w-16 text-right">
                        {count} ({percentage.toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Demand Types Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="h-5 w-5 text-blue-500 mr-2" />
            Tipos de Demanda Mais Frequentes
          </h3>
          
          <div className="space-y-3">
            {Object.entries(kpis.distribuicao_tipos_demanda || {})
              .sort(([,a], [,b]) => b - a)
              .slice(0, 8)
              .map(([demandType, count]) => {
                const percentage = ((count / (kpis.total_processos || 1)) * 100);
                const demandNames: Record<string, string> = {
                  cobertura_negada: 'Cobertura Negada',
                  reajuste_contratual: 'Reajuste Contratual',
                  prazo_autorizacao: 'Prazo de Autorização',
                  urgencia_emergencia: 'Urgência/Emergência',
                  medicamento_alto_custo: 'Medicamento Alto Custo',
                  cirurgia_eletiva: 'Cirurgia Eletiva',
                  exames_diagnosticos: 'Exames Diagnósticos',
                  terapias: 'Terapias',
                  home_care: 'Home Care',
                  rede_credenciada: 'Rede Credenciada'
                };
                
                return (
                  <div key={demandType} className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className="w-32 text-sm font-medium text-gray-700">
                        {demandNames[demandType] || demandType}
                      </div>
                      <div className="flex-1 mx-3">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 w-16 text-right">
                        {count} ({percentage.toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Management Priority Distribution */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 text-purple-500 mr-2" />
          Distribuição de Prioridade de Gestão
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(kpis.distribuicao_prioridades || {}).map(([priority, count]) => {
            const priorityConfig = {
              critica: { name: 'Crítica', color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50' },
              alta: { name: 'Alta', color: 'bg-orange-500', textColor: 'text-orange-700', bgColor: 'bg-orange-50' },
              media: { name: 'Média', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgColor: 'bg-yellow-50' },
              baixa: { name: 'Baixa', color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50' }
            };
            
            const config = priorityConfig[priority as keyof typeof priorityConfig];
            const percentage = ((count / (kpis.total_processos || 1)) * 100);
            
            return (
              <div key={priority} className={`${config?.bgColor} rounded-lg p-4 border`}>
                <div className={`text-2xl font-bold ${config?.textColor}`}>
                  {formatNumber(count)}
                </div>
                <div className="text-gray-600 font-medium">
                  {config?.name}
                </div>
                <div className="text-sm text-gray-500">
                  {percentage.toFixed(1)}% do total
                </div>
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-1">
                    <div 
                      className={`${config?.color} h-1 rounded-full transition-all duration-300`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 py-4 border-t">
        <div className="font-semibold text-gray-700">Health Legal Intelligence Platform</div>
        <div className="text-sm">
          Automatização: RPA + IA | Última atualização: {new Date().toLocaleString('pt-BR')} | Próxima coleta: 15min
        </div>
      </div>
    </div>
  );
};

export default HealthInsuranceDashboard;