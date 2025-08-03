import { useState, useRef } from 'react';
import {
  Save,
  Download,
  Eye,
  EyeOff,
  Bold,
  Italic,
  Underline,
  FileText,
  Loader,
  X,
  User,
  Calendar,
} from 'lucide-react';
import { clsx } from 'clsx';
import { Minuta, Processo, User as UserType } from '../../types';
import { generateMinute, GenerateMinuteOptions } from '../../utils/minuteGenerator';
import Badge from '../common/Badge';
import { mockUsers, roleConfig } from '../../data/mockData';

interface MinuteEditorProps {
  processo: Processo;
  minuta?: Minuta;
  onSave: (minuta: Minuta) => void;
  onClose?: () => void;
}

export default function MinuteEditor({ processo, minuta, onSave, onClose }: MinuteEditorProps) {
  const [content, setContent] = useState(minuta?.conteudo || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedType, setSelectedType] = useState<GenerateMinuteOptions['tipo']>('manifestacao');
  const [instructions, setInstructions] = useState('');
  const [currentMinuta, setCurrentMinuta] = useState(minuta);
  const [assignedUser, setAssignedUser] = useState<UserType | null>(currentMinuta?.responsavel || null);
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const documentTypes = [
    { value: 'manifestacao', label: 'Manifestação' },
    { value: 'contestacao', label: 'Contestação' },
    { value: 'recurso', label: 'Recurso' },
    { value: 'peticao', label: 'Petição' },
    { value: 'embargo', label: 'Embargos de Declaração' },
  ] as const;

  const handleGenerateMinute = async () => {
    setIsGenerating(true);
    try {
      const generatedMinuta = await generateMinute(processo, {
        tipo: selectedType,
        instrucoes: instructions || undefined,
      });
      
      setContent(generatedMinuta.conteudo);
      setCurrentMinuta(generatedMinuta);
    } catch (error) {
      console.error('Erro ao gerar minuta:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedMinuta: Minuta = {
        ...(currentMinuta || {
          id: `minuta-${Date.now()}`,
          processoId: processo.id,
          tipo: selectedType,
          dataGeracao: new Date().toISOString(),
          status: 'rascunho',
          metadados: {
            templateUtilizado: `template-${selectedType}-v1.0`,
            fundamentosLegais: [],
            precedentesUtilizados: [],
            confiancaIA: processo.confiancaIA,
            tempoGeracao: 0,
          },
          revisoes: [],
        }),
        conteudo: content,
        status: assignedUser ? 'revisao' : 'rascunho',
        responsavel: assignedUser || undefined,
        dataAtribuicao: assignedUser ? new Date().toISOString() : undefined,
        revisoes: [
          ...(currentMinuta?.revisoes || []),
          {
            data: new Date().toISOString(),
            usuario: 'Sistema',
            alteracoes: 'Minuta salva',
            comentarios: assignedUser ? `Atribuída para ${assignedUser.nome}` : 'Salva como rascunho',
          },
        ],
      };

      onSave(updatedMinuta);
      setCurrentMinuta(updatedMinuta);
    } catch (error) {
      console.error('Erro ao salvar minuta:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFormatting = (command: string) => {
    if (editorRef.current) {
      const start = editorRef.current.selectionStart;
      const end = editorRef.current.selectionEnd;
      const selectedText = content.substring(start, end);
      
      let newContent = content;
      let replacement = '';
      
      switch (command) {
        case 'bold':
          replacement = `**${selectedText}**`;
          break;
        case 'italic':
          replacement = `*${selectedText}*`;
          break;
        case 'underline':
          replacement = `_${selectedText}_`;
          break;
        default:
          return;
      }
      
      newContent = content.substring(0, start) + replacement + content.substring(end);
      setContent(newContent);
    }
  };

  const formatContentForPreview = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<u>$1</u>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <FileText className="h-6 w-6 text-primary-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Editor de Minutas - {processo.numeroProcesso}
            </h2>
            <p className="text-sm text-gray-600">{processo.assunto}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {currentMinuta?.status && (
            <Badge 
              tag={{
                id: 'status',
                categoria: 'workflow',
                valor: currentMinuta.status === 'rascunho' ? 'Rascunho' :
                       currentMinuta.status === 'revisao' ? 'Em Revisão' :
                       currentMinuta.status === 'aprovada' ? 'Aprovada' : 'Protocolada',
                cor: currentMinuta.status === 'rascunho' ? 'bg-gray-100 text-gray-800' :
                     currentMinuta.status === 'revisao' ? 'bg-yellow-100 text-yellow-800' :
                     currentMinuta.status === 'aprovada' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800',
                confianca: 100,
              }}
            />
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          {/* Generation Controls */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">Gerar Minuta com IA</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Documento
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as GenerateMinuteOptions['tipo'])}
                  className="w-full input-field text-sm"
                >
                  {documentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instruções Especiais (Opcional)
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Ex: Incluir argumento sobre prescrição..."
                  className="w-full input-field text-sm h-20 resize-none"
                />
              </div>

              <button
                onClick={handleGenerateMinute}
                disabled={isGenerating}
                className="w-full btn-primary text-sm disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Gerar Minuta
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Assignment */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">Atribuir Responsável</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuário
                </label>
                <select
                  value={assignedUser?.id || ''}
                  onChange={(e) => {
                    const user = mockUsers.find(u => u.id === e.target.value);
                    setAssignedUser(user || null);
                  }}
                  className="w-full input-field text-sm"
                >
                  <option value="">Não atribuído</option>
                  {mockUsers
                    .filter(user => user.departamentos.includes(processo.departamentoResponsavel))
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.nome} ({roleConfig[user.role].name})
                      </option>
                    ))}
                </select>
              </div>

              {assignedUser && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">{assignedUser.nome}</span>
                  </div>
                  <Badge 
                    tag={{
                      id: 'role',
                      categoria: 'responsavel',
                      valor: roleConfig[assignedUser.role].name,
                      cor: roleConfig[assignedUser.role].color,
                      confianca: 100,
                    }}
                    size="sm"
                  />
                  <p className="text-xs text-blue-700 mt-1">{assignedUser.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          {currentMinuta && (
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Informações</h3>
              
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Gerada em:</span>
                  <div className="flex items-center space-x-1 mt-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span>{new Date(currentMinuta.dataGeracao).toLocaleString('pt-BR')}</span>
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-500">Confiança da IA:</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: `${currentMinuta.metadados.confiancaIA}%` }}
                      />
                    </div>
                    <span className="text-xs">{currentMinuta.metadados.confiancaIA}%</span>
                  </div>
                </div>

                {currentMinuta.metadados.fundamentosLegais.length > 0 && (
                  <div>
                    <span className="text-gray-500">Fundamentos:</span>
                    <div className="mt-1">
                      {currentMinuta.metadados.fundamentosLegais.slice(0, 3).map((fund, index) => (
                        <span key={index} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded mr-1 mb-1">
                          {fund}
                        </span>
                      ))}
                      {currentMinuta.metadados.fundamentosLegais.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{currentMinuta.metadados.fundamentosLegais.length - 3} mais
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleFormatting('bold')}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                title="Negrito"
              >
                <Bold className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleFormatting('italic')}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                title="Itálico"
              >
                <Italic className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleFormatting('underline')}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                title="Sublinhado"
              >
                <Underline className="h-4 w-4" />
              </button>
              
              <div className="w-px h-6 bg-gray-300 mx-2" />
              
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={clsx(
                  'p-1.5 rounded flex items-center space-x-1',
                  showPreview 
                    ? 'text-primary-600 bg-primary-100' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                )}
                title="Visualizar"
              >
                {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="text-sm">{showPreview ? 'Editor' : 'Preview'}</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleSave}
                disabled={isSaving || !content.trim()}
                className="btn-primary text-sm disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader className="h-4 w-4 mr-1 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    Salvar
                  </>
                )}
              </button>
              
              <button className="btn-secondary text-sm">
                <Download className="h-4 w-4 mr-1" />
                Exportar
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 relative">
            {showPreview ? (
              <div className="h-full overflow-y-auto">
                <div 
                  className="p-6 max-w-4xl mx-auto font-mono text-sm leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: formatContentForPreview(content) }}
                />
              </div>
            ) : (
              <textarea
                ref={editorRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  content 
                    ? '' 
                    : `Clique em "Gerar Minuta" para criar um documento automaticamente ou digite manualmente...`
                }
                className="w-full h-full p-6 border-none outline-none resize-none font-mono text-sm leading-relaxed"
                style={{ fontFamily: 'Monaco, Consolas, "Courier New", monospace' }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}