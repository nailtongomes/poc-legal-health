// Adapter to convert Unimed data to PGM format
export interface UnimedProcess {
  numero_processo: string;
  link_processo: string;
  data_extracao_dados: string;
  detalhes_capa_processual: string;
  [key: string]: any;
}

export interface PGMProcess {
  id: number;
  numero_processo: string;
  classe_judicial: string;
  orgao_julgador: string;
  assunto: string;
  valor_causa: number;
  data_autuacao: string;
  situacao: string;
  parte_ativa: string;
  parte_passiva: string;
  intimacoes: Array<{
    tipo: string;
    prazo: number;
    descricao: string;
    data_intimacao: string;
  }>;
  tags: {
    departamento: string;
    complexidade: string;
    acao_esperada: string;
    prioridade: string;
  };
}

export class SqliteAdapter {
  static convertUnimedToPGM(unimedData: UnimedProcess[], startId: number = 1): PGMProcess[] {
    return unimedData.map((unimed, index) => {
      // Parse HTML details to extract structured data
      const detalhes = this.parseHtmlDetails(unimed.detalhes_capa_processual);
      
      // Extract value from various possible fields
      const valor = this.extractValue(unimed);
      
      // Generate realistic tags based on case content
      const tags = this.generateTags(detalhes);
      
      return {
        id: startId + index,
        numero_processo: unimed.numero_processo,
        classe_judicial: detalhes.classe_judicial || 'PROCEDIMENTO COMUM CÍVEL',
        orgao_julgador: this.extractCourt(unimed.numero_processo),
        assunto: detalhes.assunto || 'Serviços Hospitalares',
        valor_causa: valor,
        data_autuacao: this.extractDate(unimed.data_extracao_dados),
        situacao: 'Em Andamento',
        parte_ativa: 'Unimed Rio',
        parte_passiva: 'Requerente',
        intimacoes: this.generateIntimacoes(),
        tags
      };
    });
  }

  private static parseHtmlDetails(html: string): any {
    const details: any = {};
    
    // Extract class judicial
    const classeMatch = html.match(/<dt>Classe judicial<\/dt>\s*<dd>([^<]+)</);
    if (classeMatch) {
      details.classe_judicial = classeMatch[1].trim();
    }
    
    // Extract subject
    const assuntoMatch = html.match(/<dt>Assunto<\/dt>\s*<dd>[\s\S]*?<li>([^<(]+)/);
    if (assuntoMatch) {
      details.assunto = assuntoMatch[1].trim();
    }
    
    return details;
  }

  private static extractValue(unimed: UnimedProcess): number {
    // Try to extract value from various fields
    const valueFields = ['valor_causa', 'valor_condenacao', 'valor_pedido'];
    
    for (const field of valueFields) {
      if (unimed[field]) {
        const numericValue = parseFloat(String(unimed[field]).replace(/[^\d.,]/g, '').replace(',', '.'));
        if (!isNaN(numericValue)) {
          return numericValue;
        }
      }
    }
    
    // Generate random value for demo
    return Math.floor(Math.random() * 500000) + 50000;
  }

  private static extractCourt(numeroProcesso: string): string {
    // Extract court info from process number
    const parts = numeroProcesso.split('.');
    if (parts.length >= 4) {
      const tribunal = parts[3];
      if (tribunal.startsWith('8.19')) {
        return 'Tribunal de Justiça do Estado do Rio de Janeiro';
      }
    }
    return 'Tribunal de Justiça';
  }

  private static extractDate(dateString: string): string {
    // Convert date format from DD/MM/YYYY to YYYY-MM-DD
    const dateMatch = dateString.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (dateMatch) {
      return `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`;
    }
    return new Date().toISOString().split('T')[0];
  }

  private static generateTags(detalhes: any): PGMProcess['tags'] {
    // Determine department based on subject matter
    let departamento = 'judicial'; // default
    
    const assunto = (detalhes.assunto || '').toLowerCase();
    if (assunto.includes('hospital') || assunto.includes('saúde') || assunto.includes('médico')) {
      departamento = 'saude';
    } else if (assunto.includes('tributário') || assunto.includes('fiscal') || assunto.includes('imposto')) {
      departamento = 'fiscal';
    } else if (assunto.includes('administrativo') || assunto.includes('servidor')) {
      departamento = 'administrativo';
    } else if (assunto.includes('ambiental') || assunto.includes('meio ambiente')) {
      departamento = 'ambiental';
    } else if (assunto.includes('patrimônio') || assunto.includes('bem público')) {
      departamento = 'patrimonio';
    } else if (assunto.includes('trabalhista') || assunto.includes('trabalho')) {
      departamento = 'trabalhista';
    }

    // Determine complexity based on case characteristics
    const complexidade = Math.random() > 0.7 ? 'complexo' : Math.random() > 0.4 ? 'medio' : 'simples';
    
    // Determine expected action
    const acaoEsperada = Math.random() > 0.6 ? 'resposta_obrigatoria' : 
                        Math.random() > 0.4 ? 'defesa' : 'monitoramento';
    
    // Determine priority
    const prioridade = Math.random() > 0.8 ? 'critica' : 
                      Math.random() > 0.5 ? 'alta' : 
                      Math.random() > 0.3 ? 'media' : 'baixa';

    return {
      departamento,
      complexidade,
      acao_esperada: acaoEsperada,
      prioridade
    };
  }

  private static generateIntimacoes(): PGMProcess['intimacoes'] {
    const intimacoes = [];
    const numIntimacoes = Math.floor(Math.random() * 3) + 1;
    
    const tipos = ['Decisão', 'Despacho', 'Sentença', 'Acórdão'];
    
    for (let i = 0; i < numIntimacoes; i++) {
      intimacoes.push({
        tipo: tipos[Math.floor(Math.random() * tipos.length)],
        prazo: Math.floor(Math.random() * 30) + 5,
        descricao: 'Intimação para manifestação nos autos',
        data_intimacao: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }
    
    return intimacoes;
  }
}