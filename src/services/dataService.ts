// JSON data service for browser environment
export interface SqliteProcess {
  numero_processo: string;
  link_processo: string;
  data_extracao_dados: string;
  detalhes_capa_processual: string;
  partes_principais: string;
  data_ultimo_documento_visivel: string;
  titlo_ultimo_documento_visivel: string;
  ultimo_movimento_processo: string;
  linha_tempo_otimizada: Array<{
    data: string;
    descricao: string;
    documento: string[];
  }>;
  [key: string]: any;
}

class DataService {
  private cachedProcesses: SqliteProcess[] | null = null;

  constructor() {
    // JSON-based implementation for browser
  }

  async getUnimedProcesses(): Promise<SqliteProcess[]> {
    if (this.cachedProcesses) {
      return this.cachedProcesses;
    }

    try {
      const response = await fetch('/data/processos.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const processes = await response.json();
      this.cachedProcesses = processes;
      return processes;
    } catch (error) {
      console.error('Error loading processes from JSON:', error);
      return [];
    }
  }

  close() {
    // Clear cache
    this.cachedProcesses = null;
  }
}

export default DataService;