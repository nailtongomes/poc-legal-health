import React, { useState } from 'react';
import {
  Database,
  FileText,
  Users,
  Calendar,
  Gavel,
  DollarSign,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  Search,
  Filter,
  Eye,
  Code,
  BookOpen,
  Activity,
  Clock,
  Scale,
  Building,
  Phone,
  Mail,
  MapPin,
  Link,
  FileCheck,
  Briefcase
} from 'lucide-react';
import { clsx } from 'clsx';
import { HealthInsuranceProcess } from '../../types/healthInsurance';

interface CompleteDataViewerProps {
  process: HealthInsuranceProcess;
}

interface DataSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  data: any;
  description: string;
}

const CompleteDataViewer: React.FC<CompleteDataViewerProps> = ({ process }) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic_info']);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'structured' | 'json'>('structured');

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const copyToClipboard = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    // You could add a toast notification here
  };

  const downloadJSON = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${process.numero_processo.replace(/[^\w]/g, '_')}_${filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Organize data into structured sections
  const dataSections: DataSection[] = [
    {
      id: 'basic_info',
      title: 'Informações Básicas',
      icon: FileText,
      color: 'blue',
      description: 'Dados fundamentais do processo judicial',
      data: {
        numero_processo: process.numero_processo,
        link_processo: process.link_processo,
        data_extracao_dados: process.data_extracao_dados,
        partes_principais: process.partes_principais,
        detalhes_capa_processual: process.detalhes_capa_processual,
        ultimo_movimento_processo: process.ultimo_movimento_processo
      }
    },
    {
      id: 'parties',
      title: 'Partes e Advogados',
      icon: Users,
      color: 'green',
      description: 'Informações sobre as partes processuais e representação legal',
      data: extractPartiesData(process)
    },
    {
      id: 'classification',
      title: 'Classificação da Demanda',
      icon: Scale,
      color: 'purple',
      description: 'Categorização jurídica e médica do caso',
      data: {
        classificacao_demanda: process.classificacao_demanda,
        metricas_dashboard: process.metricas_dashboard
      }
    },
    {
      id: 'financial',
      title: 'Aspectos Financeiros',
      icon: DollarSign,
      color: 'orange',
      description: 'Valores, multas e impacto econômico',
      data: process.aspectos_financeiros
    },
    {
      id: 'timeline',
      title: 'Cronologia Processual',
      icon: Clock,
      color: 'indigo',
      description: 'Histórico temporal e movimentações',
      data: {
        cronologia_processual: process.cronologia_processual,
        linha_tempo_otimizada: process.linha_tempo_otimizada
      }
    },
    {
      id: 'decisions',
      title: 'Decisões Judiciais',
      icon: Gavel,
      color: 'red',
      description: 'Liminares, sentenças e decisões do processo',
      data: process.decisoes_judiciais
    },
    {
      id: 'status', 
      title: 'Status Atual',
      icon: Activity,
      color: 'cyan',
      description: 'Situação atual e próximos passos',
      data: process.status_atual
    },
    {
      id: 'documents',
      title: 'Documentos',
      icon: FileCheck,
      color: 'pink',
      description: 'Peças processuais e documentos anexados',
      data: extractDocumentsData(process)
    },
    {
      id: 'complete_analysis',
      title: 'Análise Completa da IA',
      icon: Database,
      color: 'gray',
      description: 'Dados completos da análise LLM do SQLite',
      data: process.analise_llm
    }
  ];

  // Filter sections based on search
  const filteredSections = dataSections.filter(section => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      section.title.toLowerCase().includes(searchLower) ||
      section.description.toLowerCase().includes(searchLower) ||
      JSON.stringify(section.data).toLowerCase().includes(searchLower)
    );
  });

  const renderStructuredData = (data: any, depth: number = 0): React.ReactNode => {
    if (data === null || data === undefined) {
      return <span className="text-gray-400 italic">null</span>;
    }

    if (typeof data === 'string') {
      // Check if it's HTML content
      if (data.includes('<') && data.includes('>')) {
        return (
          <div className="bg-gray-100 p-3 rounded text-sm font-mono">
            <div className="text-xs text-gray-500 mb-2">HTML Content:</div>
            <div dangerouslySetInnerHTML={{ __html: data }} className="prose prose-sm max-w-none" />
          </div>
        );
      }
      
      // Check if it's a URL
      if (data.startsWith('http')) {
        return (
          <a 
            href={data} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline flex items-center"
          >
            <Link className="h-3 w-3 mr-1" />
            {data}
          </a>
        );
      }
      
      return <span className="text-gray-900">{data}</span>;
    }

    if (typeof data === 'number') {
      return <span className="text-blue-600 font-mono">{data.toLocaleString('pt-BR')}</span>;
    }

    if (typeof data === 'boolean') {
      return (
        <span className={clsx(
          'px-2 py-1 rounded text-xs font-medium',
          data ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        )}>
          {data ? 'Sim' : 'Não'}
        </span>
      );
    }

    if (Array.isArray(data)) {
      if (data.length === 0) {
        return <span className="text-gray-400 italic">Array vazio</span>;
      }
      
      return (
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="border-l-2 border-gray-200 pl-3">
              <div className="text-xs text-gray-500 mb-1">Item {index + 1}:</div>
              {renderStructuredData(item, depth + 1)}
            </div>
          ))}
        </div>
      );
    }

    if (typeof data === 'object') {
      const entries = Object.entries(data);
      if (entries.length === 0) {
        return <span className="text-gray-400 italic">Objeto vazio</span>;
      }

      return (
        <div className="space-y-3">
          {entries.map(([key, value]) => (
            <div key={key} className={clsx(
              'border-l-2 border-gray-200 pl-3',
              depth > 0 && 'ml-2'
            )}>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-gray-700">{key}:</span>
                {typeof value === 'object' && value !== null && (
                  <span className="text-xs text-gray-400">
                    {Array.isArray(value) ? `Array[${value.length}]` : 'Object'}
                  </span>
                )}
              </div>
              <div className="ml-2">
                {renderStructuredData(value, depth + 1)}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return <span className="text-gray-600">{String(data)}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">🗄️ Dados Completos - SQLite</h2>
            <p className="text-gray-300">
              Visualização estruturada de todos os dados extraídos do banco de dados
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => copyToClipboard(process)}
              className="px-3 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm flex items-center space-x-1 transition-colors"
            >
              <Copy className="h-4 w-4" />
              <span>Copiar JSON</span>
            </button>
            <button
              onClick={() => downloadJSON(process, 'complete_data')}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm flex items-center space-x-1 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
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
              placeholder="Buscar nos dados..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Visualização:</span>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => setViewMode('structured')}
                className={clsx(
                  'px-3 py-2 text-sm flex items-center space-x-1 transition-colors',
                  viewMode === 'structured' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                )}
              >
                <Eye className="h-4 w-4" />
                <span>Estruturada</span>
              </button>
              <button
                onClick={() => setViewMode('json')}
                className={clsx(
                  'px-3 py-2 text-sm flex items-center space-x-1 transition-colors border-l border-gray-300',
                  viewMode === 'json' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                )}
              >
                <Code className="h-4 w-4" />
                <span>JSON</span>
              </button>
            </div>
          </div>
        </div>

        {searchTerm && (
          <div className="mt-3 text-sm text-gray-600">
            Encontradas {filteredSections.length} seções correspondentes à busca "{searchTerm}"
          </div>
        )}
      </div>

      {/* JSON Raw View */}
      {viewMode === 'json' && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
            <h3 className="font-medium">Dados JSON Completos</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => copyToClipboard(process)}
                className="p-1 hover:bg-gray-700 rounded"
                title="Copiar JSON"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={() => downloadJSON(process, 'raw_data')}
                className="p-1 hover:bg-gray-700 rounded"
                title="Download JSON"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="p-4">
            <pre className="text-xs font-mono text-gray-800 whitespace-pre-wrap overflow-x-auto max-h-96 overflow-y-auto">
              {JSON.stringify(process, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Structured Data Sections */}
      {viewMode === 'structured' && (
        <div className="space-y-4">
          {filteredSections.map((section) => {
            const isExpanded = expandedSections.includes(section.id);
            const SectionIcon = section.icon;
            const hasData = section.data && (
              typeof section.data === 'object' 
                ? Object.keys(section.data).length > 0 
                : true
            );
            
            return (
              <div key={section.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={clsx(
                        'p-2 rounded-lg',
                        section.color === 'blue' && 'bg-blue-100',
                        section.color === 'green' && 'bg-green-100', 
                        section.color === 'purple' && 'bg-purple-100',
                        section.color === 'orange' && 'bg-orange-100',
                        section.color === 'indigo' && 'bg-indigo-100',
                        section.color === 'red' && 'bg-red-100',
                        section.color === 'cyan' && 'bg-cyan-100',
                        section.color === 'pink' && 'bg-pink-100',
                        section.color === 'gray' && 'bg-gray-100'
                      )}>
                        <SectionIcon className={clsx(
                          'h-5 w-5',
                          section.color === 'blue' && 'text-blue-600',
                          section.color === 'green' && 'text-green-600',
                          section.color === 'purple' && 'text-purple-600',
                          section.color === 'orange' && 'text-orange-600',
                          section.color === 'indigo' && 'text-indigo-600',
                          section.color === 'red' && 'text-red-600',
                          section.color === 'cyan' && 'text-cyan-600',
                          section.color === 'pink' && 'text-pink-600',
                          section.color === 'gray' && 'text-gray-600'
                        )} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                        <p className="text-sm text-gray-500">{section.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!hasData && (
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                          Sem dados
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(section.data);
                        }}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Copiar seção"
                      >
                        <Copy className="h-4 w-4 text-gray-400" />
                      </button>
                      {isExpanded ? 
                        <ChevronDown className="h-5 w-5 text-gray-400" /> : 
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      }
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <div className="mt-4">
                      {hasData ? (
                        <div className="bg-gray-50 rounded-lg p-4">
                          {renderStructuredData(section.data)}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Info className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p>Nenhum dado disponível nesta seção</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Helper functions
function extractPartiesData(process: HealthInsuranceProcess) {
  const analise_llm = process.analise_llm || {};
  return {
    partes_principais: process.partes_principais,
    polo_ativo: analise_llm.polo_ativo,
    polo_passivo: analise_llm.polo_passivo,
    advogados_polo_ativo: analise_llm.advogados_polo_ativo,
    advogados_polo_passivo: analise_llm.advogados_polo_passivo
  };
}

function extractDocumentsData(process: HealthInsuranceProcess) {
  const analise_llm = process.analise_llm || {};
  return {
    documentos_judiciario: analise_llm.documentos_judiciario,
    documentos_processo: analise_llm.documentos_processo,
    linha_tempo_documentos: process.linha_tempo_otimizada?.map(item => ({
      data: item.data,
      documento: item.documento
    }))
  };
}

export default CompleteDataViewer;