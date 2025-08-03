import React from 'react';
import { Database, Building2 } from 'lucide-react';
import { useData, DataSource } from '../context/DataContext';

const DataSourceSelector: React.FC = () => {
  const { dataSource, setDataSource } = useData();

  const dataSources = [
    {
      id: 'pgm' as DataSource,
      name: 'PGM - Procuradoria Geral',
      description: 'Sistema de Gestão de Minutas Jurídicas',
      icon: Building2,
      color: 'blue'
    },
    {
      id: 'unimed' as DataSource,
      name: 'Unimed',
      description: 'Base de Dados Unimed',
      icon: Database,
      color: 'green'
    }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Fonte de Dados</h3>
      <div className="flex gap-2">
        {dataSources.map((source) => {
          const Icon = source.icon;
          const isActive = dataSource === source.id;
          
          return (
            <button
              key={source.id}
              onClick={() => setDataSource(source.id)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive 
                  ? `bg-${source.color}-100 text-${source.color}-700 border border-${source.color}-200` 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <div className="text-left">
                <div className="font-medium">{source.name}</div>
                <div className="text-xs opacity-75">{source.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DataSourceSelector;