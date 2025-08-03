import { useState } from 'react';
import {
  X,
  User,
  Calendar,
  UserCheck,
  AlertTriangle,
} from 'lucide-react';
import { clsx } from 'clsx';
import { Processo, User as UserType, WorkflowStatus } from '../../types';
import { mockUsers, roleConfig, workflowConfig } from '../../data/mockData';
import Badge from '../common/Badge';

interface AssignmentModalProps {
  processo: Processo;
  isOpen: boolean;
  onClose: () => void;
  onAssign: (processo: Processo, user: UserType, status: WorkflowStatus, observacoes?: string) => void;
}

export default function AssignmentModal({ processo, isOpen, onClose, onAssign }: AssignmentModalProps) {
  const [selectedUser, setSelectedUser] = useState<UserType | null>(processo.responsavel || null);
  const [selectedStatus, setSelectedStatus] = useState<WorkflowStatus>(processo.workflowStatus);
  const [observacoes, setObservacoes] = useState(processo.observacoes || '');
  const [priority, setPriority] = useState<'normal' | 'alta' | 'urgente'>('normal');

  if (!isOpen) return null;

  // Filter users by department compatibility
  const compatibleUsers = mockUsers.filter(user => 
    user.departamentos.includes(processo.departamentoResponsavel)
  );

  const handleAssign = () => {
    if (selectedUser) {
      onAssign(processo, selectedUser, selectedStatus, observacoes);
      onClose();
    }
  };

  const canAssign = selectedUser && selectedStatus !== 'nao_atribuido';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Atribuir Responsável</h2>
            <p className="text-sm text-gray-600">{processo.numeroProcesso} - {processo.assunto}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Status */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Status Atual</h3>
            <div className="flex items-center space-x-4">
              <Badge 
                tag={{
                  id: 'current-status',
                  categoria: 'workflow',
                  valor: workflowConfig[processo.workflowStatus].name,
                  cor: workflowConfig[processo.workflowStatus].color,
                  confianca: 100,
                }}
              />
              {processo.responsavel && (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{processo.responsavel.nome}</span>
                  <Badge 
                    tag={{
                      id: 'current-role',
                      categoria: 'responsavel',
                      valor: roleConfig[processo.responsavel.role].name,
                      cor: roleConfig[processo.responsavel.role].color,
                      confianca: 100,
                    }}
                    size="sm"
                  />
                </div>
              )}
            </div>
          </div>

          {/* User Selection */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Selecionar Responsável</h3>
            <div className="grid grid-cols-1 gap-3">
              {compatibleUsers.map((user) => (
                <div
                  key={user.id}
                  className={clsx(
                    'p-4 border-2 rounded-lg cursor-pointer transition-all',
                    selectedUser?.id === user.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  )}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={clsx(
                        'w-10 h-10 rounded-full flex items-center justify-center text-white font-medium',
                        user.role === 'procurador' ? 'bg-purple-500' :
                        user.role === 'assessor' ? 'bg-blue-500' :
                        user.role === 'estagiario' ? 'bg-green-500' : 'bg-red-500'
                      )}>
                        {user.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.nome}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge 
                            tag={{
                              id: `role-${user.id}`,
                              categoria: 'responsavel',
                              valor: roleConfig[user.role].name,
                              cor: roleConfig[user.role].color,
                              confianca: 100,
                            }}
                            size="sm"
                          />
                          <span className="text-xs text-gray-500">
                            {user.departamentos.length} dept(s)
                          </span>
                        </div>
                      </div>
                    </div>
                    {selectedUser?.id === user.id && (
                      <UserCheck className="h-5 w-5 text-primary-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Definir Status</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(workflowConfig)
                .filter(([key]) => key !== 'nao_atribuido') // Can't assign with "não atribuído"
                .map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedStatus(key as WorkflowStatus)}
                    className={clsx(
                      'p-3 text-left border-2 rounded-lg transition-all',
                      selectedStatus === key
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    )}
                  >
                    <Badge 
                      tag={{
                        id: `status-${key}`,
                        categoria: 'workflow',
                        valor: config.name,
                        cor: config.color,
                        confianca: 100,
                      }}
                      size="sm"
                    />
                  </button>
                ))}
            </div>
          </div>

          {/* Priority Selection */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Prioridade da Atribuição</h3>
            <div className="flex space-x-3">
              {[
                { value: 'normal', label: 'Normal', color: 'bg-gray-100 text-gray-800' },
                { value: 'alta', label: 'Alta', color: 'bg-orange-100 text-orange-800' },
                { value: 'urgente', label: 'Urgente', color: 'bg-red-100 text-red-800' },
              ].map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPriority(p.value as 'normal' | 'alta' | 'urgente')}
                  className={clsx(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    priority === p.value
                      ? `${p.color} ring-2 ring-offset-2 ring-primary-500`
                      : `${p.color} hover:ring-2 hover:ring-offset-2 hover:ring-gray-300`
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Observations */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Observações (Opcional)</h3>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Instruções especiais, pontos de atenção, prazo específico..."
              className="w-full input-field h-24 resize-none"
            />
          </div>

          {/* Warnings */}
          {processo.prioridade === 'urgente' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Processo Urgente</p>
                  <p className="text-sm text-yellow-700">
                    Este processo tem prazo crítico. Certifique-se de que o responsável 
                    está ciente da urgência.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            <Calendar className="h-4 w-4 inline mr-1" />
            Atribuição será registrada em {new Date().toLocaleDateString('pt-BR')}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              onClick={handleAssign}
              disabled={!canAssign}
              className="btn-primary disabled:opacity-50"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Atribuir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}