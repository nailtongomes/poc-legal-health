import React, { createContext, useContext, useState, useEffect } from 'react';

export type DataSource = 'pgm' | 'unimed';

interface DataContextType {
  dataSource: DataSource;
  setDataSource: (source: DataSource) => void;
  processData: any[];
  loadProcessData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

const loadSqliteData = async (): Promise<any[]> => {
  try {
    // In a real implementation, this would make an API call to the backend
    // For demo purposes, we'll create mock Unimed data with different characteristics
    const mockUnimedData = [];
    
    for (let i = 1; i <= 50; i++) {
      const prazoResposta = new Date();
      prazoResposta.setDate(prazoResposta.getDate() + Math.floor(Math.random() * 30) + 1);
      
      const processo = {
        id: (i + 1000).toString(),
        numeroProcesso: `0800${i.toString().padStart(3, '0')}-34.2023.8.19.0212`,
        assunto: i % 3 === 0 ? 'Serviços Hospitalares' : i % 3 === 1 ? 'Reajuste Contratual' : 'Plano de Saúde',
        tribunal: 'TJRJ - 2ª Vara Cível de Niterói',
        valorCausa: Math.floor(Math.random() * 200000) + 20000,
        dataAutuacao: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        prazoResposta: prazoResposta.toISOString().split('T')[0],
        departamentoResponsavel: 'saude',
        status: i % 5 === 0 ? 'nova' : i % 5 === 1 ? 'em_analise' : i % 5 === 2 ? 'minuta_gerada' : i % 5 === 3 ? 'concluida' : 'vencida',
        prioridade: i % 5 === 0 ? 'critica' : i % 5 === 1 ? 'alta' : i % 5 === 2 ? 'media' : 'baixa',
        complexidade: i % 4 === 0 ? 'complexo' : i % 4 === 1 ? 'medio' : 'simples',
        workflowStatus: i % 4 === 0 ? 'aguardando_classificacao' : i % 4 === 1 ? 'em_analise' : i % 4 === 2 ? 'aguardando_revisao' : 'finalizado',
        confiancaIA: Math.floor(Math.random() * 30) + 70,
        partes: {
          ativo: ['Unimed Rio'],
          passivo: [`Beneficiário ${i}`]
        },
        responsavel: i % 3 === 0 ? {
          id: 'user1',
          nome: 'Dr. João Silva',
          role: 'procurador'
        } : i % 3 === 1 ? {
          id: 'user2', 
          nome: 'Dra. Maria Santos',
          role: 'assistente'
        } : null,
        tags: [
          {
            id: `dept-${i}`,
            categoria: 'departamento',
            valor: 'Saúde',
            cor: 'bg-red-100 text-red-800',
            confianca: 95
          },
          {
            id: `complex-${i}`,
            categoria: 'complexidade',
            valor: i % 4 === 0 ? 'Complexo' : i % 4 === 1 ? 'Médio' : 'Simples',
            cor: i % 4 === 0 ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800',
            confianca: 88
          }
        ]
      };
      mockUnimedData.push(processo);
    }
    
    return mockUnimedData;
  } catch (error) {
    console.error('Error loading SQLite data:', error);
    return [];
  }
};

const loadPgmData = async (): Promise<any[]> => {
  try {
    const response = await fetch('/data-samples/processo_sample.json');
    const sampleProcess = await response.json();
    
    // Generate multiple processes for demo
    const processes = [];
    for (let i = 1; i <= 20; i++) {
      processes.push({
        ...sampleProcess,
        numero_processo: `5000${i.toString().padStart(3, '0')}-12.2024.8.19.0001`,
        id: i,
        valor_causa: Math.floor(Math.random() * 1000000) + 10000,
        intimacoes: sampleProcess.intimacoes?.map((int: any) => ({
          ...int,
          prazo: Math.floor(Math.random() * 30) + 1
        })) || []
      });
    }
    
    return processes;
  } catch (error) {
    console.error('Error loading PGM data:', error);
    return [];
  }
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dataSource, setDataSource] = useState<DataSource>('pgm');
  const [processData, setProcessData] = useState<any[]>([]);

  const loadProcessData = async () => {
    let data: any[] = [];
    
    if (dataSource === 'pgm') {
      data = await loadPgmData();
    } else if (dataSource === 'unimed') {
      data = await loadSqliteData();
    }
    
    setProcessData(data);
  };

  useEffect(() => {
    loadProcessData();
  }, [dataSource]);

  return (
    <DataContext.Provider value={{
      dataSource,
      setDataSource,
      processData,
      loadProcessData
    }}>
      {children}
    </DataContext.Provider>
  );
};