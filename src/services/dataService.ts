// SQLite service for Node.js environment
import Database from 'better-sqlite3';
import path from 'path';

export interface SqliteProcess {
  numero_processo: string;
  link_processo: string;
  data_extracao_dados: string;
  detalhes_capa_processual: string;
  [key: string]: any;
}

class DataService {
  private db: Database.Database | null = null;

  constructor() {
    // Initialize SQLite connection
    try {
      const dbPath = path.join(process.cwd(), 'data-samples', 'unimed.sqlite');
      this.db = new Database(dbPath, { readonly: true });
    } catch (error) {
      console.error('Failed to initialize database:', error);
    }
  }

  async getUnimedProcesses(): Promise<SqliteProcess[]> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const stmt = this.db.prepare('SELECT data FROM temp_data WHERE category = ?');
      const rows = stmt.all('processos');
      
      return rows.map((row: any) => {
        try {
          return JSON.parse(row.data);
        } catch (error) {
          console.error('Error parsing process data:', error);
          return null;
        }
      }).filter(Boolean);
    } catch (error) {
      console.error('Error fetching Unimed processes:', error);
      return [];
    }
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

export default DataService;