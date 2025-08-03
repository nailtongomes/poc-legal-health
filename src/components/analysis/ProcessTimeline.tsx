import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  FileText,
  Gavel,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  ArrowRight,
  ArrowDown,
  Filter,
  Download,
  Search,
  Activity,
  BookOpen,
  Scale,
  Users,
  Bell,
  Upload
} from 'lucide-react';
import { clsx } from 'clsx';
import { HealthInsuranceProcess } from '../../types/healthInsurance';
import { formatDistanceToNow, parseISO, format, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProcessTimelineProps {
  process: HealthInsuranceProcess;
}

interface TimelineEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
  type: 'petition' | 'decision' | 'deadline' | 'document' | 'hearing' | 'notification' | 'movement';
  status: 'completed' | 'pending' | 'overdue';
  documents?: string[];
  importance: 'high' | 'medium' | 'low';
  actor: 'court' | 'plaintiff' | 'defendant' | 'system';
}

const ProcessTimeline: React.FC<ProcessTimelineProps> = ({ process }) => {
  const [filter, setFilter] = useState<'all' | 'important' | 'recent'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'detailed' | 'compact'>('detailed');

  // Generate timeline events from process data
  const timelineEvents = generateTimelineEvents(process);

  // Filter and sort events
  const filteredEvents = timelineEvents
    .filter(event => {
      if (filter === 'important' && event.importance !== 'high') return false;
      if (filter === 'recent') {
        const daysDiff = Math.abs(new Date().getTime() - event.date.getTime()) / (1000 * 60 * 60 * 24);
        if (daysDiff > 30) return false;
      }
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          event.documents?.some(doc => doc.toLowerCase().includes(searchLower))
        );
      }
      return true;
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const getEventIcon = (type: TimelineEvent['type'], status: TimelineEvent['status']) => {
    const baseClasses = "h-5 w-5";
    
    switch (type) {
      case 'petition':
        return <FileText className={clsx(baseClasses, status === 'completed' ? 'text-blue-600' : 'text-gray-400')} />;
      case 'decision':
        return <Gavel className={clsx(baseClasses, status === 'completed' ? 'text-purple-600' : 'text-gray-400')} />;
      case 'deadline':
        return status === 'overdue' ? 
          <AlertTriangle className={clsx(baseClasses, 'text-red-600')} /> :
          <Clock className={clsx(baseClasses, status === 'completed' ? 'text-green-600' : 'text-yellow-600')} />;
      case 'document':
        return <BookOpen className={clsx(baseClasses, 'text-indigo-600')} />;
      case 'hearing':
        return <Users className={clsx(baseClasses, 'text-orange-600')} />;
      case 'notification':
        return <Bell className={clsx(baseClasses, 'text-cyan-600')} />;
      default:
        return <Activity className={clsx(baseClasses, 'text-gray-600')} />;
    }
  };

  const getEventColor = (type: TimelineEvent['type'], importance: TimelineEvent['importance']) => {
    if (importance === 'high') return 'border-red-200 bg-red-50';
    
    switch (type) {
      case 'decision':
        return 'border-purple-200 bg-purple-50';
      case 'deadline':
        return 'border-yellow-200 bg-yellow-50';
      case 'petition':
        return 'border-blue-200 bg-blue-50';
      case 'document':
        return 'border-indigo-200 bg-indigo-50';
      case 'hearing':
        return 'border-orange-200 bg-orange-50';
      case 'notification':
        return 'border-cyan-200 bg-cyan-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getActorBadge = (actor: TimelineEvent['actor']) => {
    const actorConfig = {
      court: { name: 'Tribunal', color: 'bg-purple-100 text-purple-800' },
      plaintiff: { name: 'Requerente', color: 'bg-blue-100 text-blue-800' },
      defendant: { name: 'Requerido', color: 'bg-orange-100 text-orange-800' },
      system: { name: 'Sistema', color: 'bg-gray-100 text-gray-800' }
    };

    const config = actorConfig[actor];
    return (
      <span className={clsx('px-2 py-1 rounded text-xs font-medium', config.color)}>
        {config.name}
      </span>
    );
  };

  const exportTimeline = () => {
    const timelineData = {
      processo: process.numero_processo,
      data_exportacao: new Date().toISOString(),
      eventos: filteredEvents.map(event => ({
        data: event.date.toISOString(),
        titulo: event.title,
        descricao: event.description,
        tipo: event.type,
        status: event.status,
        importancia: event.importance,
        ator: event.actor,
        documentos: event.documents
      }))
    };

    const blob = new Blob([JSON.stringify(timelineData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timeline_${process.numero_processo.replace(/[^\w]/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">📅 Timeline Processual</h2>
            <p className="text-indigo-100">
              Cronologia completa dos eventos e movimentações do processo
            </p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">{filteredEvents.length}</div>
            <div className="text-indigo-200">Eventos</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar eventos, documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Filters and Actions */}
          <div className="flex items-center space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Todos os Eventos</option>
              <option value="important">Apenas Importantes</option>
              <option value="recent">Últimos 30 dias</option>
            </select>

            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => setViewMode('detailed')}
                className={clsx(
                  'px-3 py-2 text-sm transition-colors',
                  viewMode === 'detailed' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                )}
              >
                Detalhado
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={clsx(
                  'px-3 py-2 text-sm transition-colors border-l border-gray-300',
                  viewMode === 'compact' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                )}
              >
                Compacto
              </button>
            </div>

            <button
              onClick={exportTimeline}
              className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm flex items-center space-x-1"
            >
              <Download className="h-4 w-4" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {searchTerm && (
          <div className="mt-3 text-sm text-gray-600">
            {filteredEvents.length} eventos encontrados para "{searchTerm}"
          </div>
        )}
      </div>

      {/* Timeline Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-indigo-600">
                {timelineEvents.filter(e => e.importance === 'high').length}
              </div>
              <div className="text-sm text-gray-600">Eventos Críticos</div>
            </div>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-purple-600">
                {timelineEvents.filter(e => e.type === 'decision').length}
              </div>
              <div className="text-sm text-gray-600">Decisões</div>
            </div>
            <Gavel className="h-5 w-5 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-yellow-600">
                {timelineEvents.filter(e => e.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pendentes</div>
            </div>
            <Clock className="h-5 w-5 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-blue-600">
                {timelineEvents.filter(e => e.type === 'document').length}
              </div>
              <div className="text-sm text-gray-600">Documentos</div>
            </div>
            <FileText className="h-5 w-5 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum evento encontrado</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-0">
              {filteredEvents.map((event, index) => (
                <div key={event.id} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute left-6 top-6 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full z-10"></div>
                  
                  {/* Event content */}
                  <div className="ml-16 pb-8">
                    <div className={clsx(
                      'rounded-lg border p-4 transition-all hover:shadow-md',
                      getEventColor(event.type, event.importance)
                    )}>
                      {viewMode === 'detailed' ? (
                        <div>
                          {/* Event header */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-white rounded-lg">
                                {getEventIcon(event.type, event.status)}
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{event.title}</h3>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="text-sm text-gray-500">
                                    {format(event.date, "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    ({formatDistanceToNow(event.date, { addSuffix: true, locale: ptBR })})
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getActorBadge(event.actor)}
                              {event.importance === 'high' && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                                  IMPORTANTE
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Event description */}
                          {event.description && (
                            <p className="text-gray-700 text-sm leading-relaxed mb-3">
                              {event.description}
                            </p>
                          )}

                          {/* Documents */}
                          {event.documents && event.documents.length > 0 && (
                            <div className="border-t border-gray-200 pt-3">
                              <div className="flex items-center space-x-2 mb-2">
                                <FileText className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">Documentos:</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {event.documents.map((doc, docIndex) => (
                                  <span key={docIndex} className="px-2 py-1 bg-white border rounded text-xs text-gray-600">
                                    {doc}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Status indicator */}
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-center space-x-2">
                              {event.status === 'completed' && (
                                <>
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="text-xs text-green-700 font-medium">Concluído</span>
                                </>
                              )}
                              {event.status === 'pending' && (
                                <>
                                  <Clock className="h-4 w-4 text-yellow-500" />
                                  <span className="text-xs text-yellow-700 font-medium">Pendente</span>
                                </>
                              )}
                              {event.status === 'overdue' && (
                                <>
                                  <XCircle className="h-4 w-4 text-red-500" />
                                  <span className="text-xs text-red-700 font-medium">Vencido</span>
                                </>
                              )}
                            </div>
                            <span className="text-xs text-gray-400">
                              Evento #{filteredEvents.length - index}
                            </span>
                          </div>
                        </div>
                      ) : (
                        /* Compact view */
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getEventIcon(event.type, event.status)}
                            <div>
                              <span className="font-medium text-gray-900">{event.title}</span>
                              <span className="text-sm text-gray-500 ml-2">
                                {format(event.date, 'dd/MM/yyyy')}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {event.importance === 'high' && (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                            {getActorBadge(event.actor)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to generate timeline events from process data
function generateTimelineEvents(process: HealthInsuranceProcess): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  const analise_llm = process.analise_llm || {};

  // Add process initiation
  const dataAutuacao = parseDate(extractDateFromDetails(process.detalhes_capa_processual));
  if (dataAutuacao) {
    events.push({
      id: 'process_start',
      date: dataAutuacao,
      title: 'Distribuição do Processo',
      description: `Processo distribuído envolvendo ${process.partes_principais}. Valor da causa: R$ ${process.aspectos_financeiros.valor_inicial_causa.toLocaleString('pt-BR')}.`,
      type: 'petition',
      status: 'completed',
      importance: 'high',
      actor: 'system',
      documents: ['Petição Inicial']
    });
  }

  // Add timeline events from linha_tempo_otimizada
  if (process.linha_tempo_otimizada && Array.isArray(process.linha_tempo_otimizada)) {
    process.linha_tempo_otimizada.forEach((item, index) => {
      const eventDate = parseDate(item.data);
      if (eventDate) {
        const isDecision = item.descricao.toLowerCase().includes('decisão') || 
                          item.descricao.toLowerCase().includes('sentença') ||
                          item.descricao.toLowerCase().includes('despacho');
        
        const isImportant = item.descricao.toLowerCase().includes('liminar') ||
                           item.descricao.toLowerCase().includes('urgente') ||
                           item.descricao.toLowerCase().includes('multa') ||
                           isDecision;

        events.push({
          id: `timeline_${index}`,
          date: eventDate,
          title: extractEventTitle(item.descricao),
          description: item.descricao,
          type: isDecision ? 'decision' : 'movement',
          status: 'completed',
          importance: isImportant ? 'high' : 'medium',
          actor: determineActor(item.descricao),
          documents: Array.isArray(item.documento) ? item.documento : []
        });
      }
    });
  }

  // Add court decisions
  if (process.decisoes_judiciais?.liminar_antecipacao?.deferida) {
    const liminarDate = parseDate(process.decisoes_judiciais.liminar_antecipacao.data_decisao);
    if (liminarDate) {
      events.push({
        id: 'liminar_decision',
        date: liminarDate,
        title: 'Liminar Deferida',
        description: `Liminar de antecipação de tutela deferida. ${process.aspectos_financeiros.valor_multa_diaria ? `Multa diária: R$ ${process.aspectos_financeiros.valor_multa_diaria.toLocaleString('pt-BR')}.` : ''}`,
        type: 'decision',
        status: 'completed',
        importance: 'high',
        actor: 'court',
        documents: ['Decisão Liminar']
      });
    }
  }

  // Add current status events
  if (process.status_atual.risco_multa_crescente && process.aspectos_financeiros.valor_multa_diaria) {
    events.push({
      id: 'multa_ativa',
      date: new Date(),
      title: 'Multa Diária Ativa',
      description: `Multa diária de R$ ${process.aspectos_financeiros.valor_multa_diaria.toLocaleString('pt-BR')} em curso. Requer atenção imediata.`,
      type: 'deadline',
      status: 'pending',
      importance: 'high',
      actor: 'system'
    });
  }

  // Add escalation alerts
  if (process.metricas_dashboard.requer_escalacao_executiva) {
    events.push({
      id: 'escalacao_executiva',
      date: new Date(),
      title: 'Escalação Executiva Requerida',
      description: 'Caso identificado como crítico pelo sistema de IA. Requer atenção da diretoria.',
      type: 'notification',
      status: 'pending',
      importance: 'high',
      actor: 'system'
    });
  }

  return events.sort((a, b) => b.date.getTime() - a.date.getTime());
}

// Helper functions
function parseDate(dateString: string | undefined): Date | null {
  if (!dateString) return null;
  
  try {
    // Try parsing ISO format first
    const isoDate = parseISO(dateString);
    if (isValid(isoDate)) return isoDate;
    
    // Try Brazilian date format (dd/mm/yyyy)
    const brDateMatch = dateString.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (brDateMatch) {
      const [, day, month, year] = brDateMatch;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (isValid(date)) return date;
    }
    
    // Try other common formats
    const date = new Date(dateString);
    return isValid(date) ? date : null;
  } catch {
    return null;
  }
}

function extractDateFromDetails(detalhes: string | undefined): string | undefined {
  if (!detalhes) return undefined;
  
  // Look for autuação date
  const autuacaoMatch = detalhes.match(/Autuação<\/dt>\s*<dd>([^<]+)/);
  if (autuacaoMatch) return autuacaoMatch[1].trim();
  
  return undefined;
}

function extractEventTitle(description: string): string {
  // Extract the first meaningful part of the description
  const cleanDesc = description.replace(/\[.*?\]/g, '').trim();
  const firstSentence = cleanDesc.split('.')[0];
  return firstSentence.length > 80 ? firstSentence.substring(0, 80) + '...' : firstSentence;
}

function determineActor(description: string): TimelineEvent['actor'] {
  const desc = description.toLowerCase();
  
  if (desc.includes('juiz') || desc.includes('decisão') || desc.includes('despacho') || desc.includes('sentença')) {
    return 'court';
  }
  if (desc.includes('requerente') || desc.includes('autor')) {
    return 'plaintiff';
  }
  if (desc.includes('requerido') || desc.includes('réu')) {
    return 'defendant';
  }
  return 'system';
}

export default ProcessTimeline;