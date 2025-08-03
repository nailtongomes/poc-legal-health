import { Processo, Minuta } from '../types';

export interface GenerateMinuteOptions {
  tipo: 'contestacao' | 'recurso' | 'manifestacao' | 'peticao' | 'embargo';
  instrucoes?: string;
}

export const generateMinute = async (processo: Processo, options: GenerateMinuteOptions): Promise<Minuta> => {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 2000));

  const templates = {
    contestacao: generateContestacao,
    manifestacao: generateManifestacao,
    recurso: generateRecurso,
    peticao: generatePeticao,
    embargo: generateEmbargo,
  };

  const generator = templates[options.tipo];
  const conteudo = generator(processo, options.instrucoes);

  return {
    id: `minuta-${Date.now()}`,
    processoId: processo.id,
    tipo: options.tipo,
    conteudo,
    dataGeracao: new Date().toISOString(),
    status: 'rascunho',
    metadados: {
      templateUtilizado: `template-${options.tipo}-v1.0`,
      fundamentosLegais: extractFundamentosLegais(processo),
      precedentesUtilizados: [],
      confiancaIA: processo.confiancaIA,
      tempoGeracao: 2000,
    },
    revisoes: [],
  };
};

function generateContestacao(processo: Processo, instrucoes?: string): string {
  return `EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO

Processo: ${processo.numeroProcesso}
Assunto: ${processo.assunto}

O MUNICÍPIO DE NATAL, pessoa jurídica de direito público interno, inscrito no CNPJ sob o nº 08.241.747/0001-43, com sede na Rua Princesa Isabel, 711, Cidade Alta, Natal/RN, por meio de sua Procuradoria Geral, vem, respeitosamente, à presença de Vossa Excelência, apresentar

CONTESTAÇÃO

aos autos da ação em epígrafe, com fulcro no art. 335 do Código de Processo Civil, pelas razões de fato e de direito a seguir expostas:

I - DOS FATOS

${processo.analiseFireac?.fatos.map(fato => 
  `Em ${fato.data}, ${fato.descricao.toLowerCase()}.`
).join('\n\n') || 'Os fatos descritos na inicial demandam análise pormenorizada.'}

II - DO DIREITO

${processo.analiseFireac?.regras.map(regra => 
  `Conforme dispõe o ${regra.dispositivo}: "${regra.descricao}"`
).join('\n\n') || 'Aplicam-se ao caso os dispositivos legais pertinentes à matéria.'}

III - DA ANÁLISE JURÍDICA

${processo.analiseFireac?.analise.pontos_fortes.map(ponto => 
  `• ${ponto}`
).join('\n') || 'A análise dos autos demonstra a improcedência do pedido inicial.'}

IV - DOS PEDIDOS

Diante do exposto, requer-se:

a) O reconhecimento da legitimidade passiva do Município de Natal;
b) A total improcedência dos pedidos iniciais;
c) A condenação da parte autora ao pagamento das custas processuais e honorários advocatícios.

${instrucoes ? `\nOBSERVAÇÕES ESPECIAIS:\n${instrucoes}` : ''}

Protesta-se provar o alegado por todos os meios de prova em direito admitidos.

Termos em que,
Pede deferimento.

Natal/RN, ${new Date().toLocaleDateString('pt-BR')}.

_________________________________
Procuradoria Geral do Município
OAB/RN nº [número]`;
}

function generateManifestacao(processo: Processo, instrucoes?: string): string {
  return `EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO

Processo: ${processo.numeroProcesso}
Assunto: ${processo.assunto}

O MUNICÍPIO DE NATAL, já qualificado nos autos, vem, respeitosamente, à presença de Vossa Excelência, apresentar

MANIFESTAÇÃO

nos autos em epígrafe, conforme determinação judicial, pelos fundamentos que passa a expor:

I - DA MANIFESTAÇÃO REQUERIDA

Em cumprimento à determinação de Vossa Excelência, o Município manifesta-se sobre os pontos suscitados, esclarecendo que:

${processo.analiseFireac?.conclusao.acoes_recomendadas.map((acao, index) => 
  `${index + 1}. ${acao};`
).join('\n') || '1. Os fatos e fundamentos apresentados merecem a devida consideração;'}

II - DOS ARGUMENTOS JURÍDICOS

${processo.analiseFireac?.analise.correlacoes.map(correlacao => 
  `Quanto ao fato de que ${correlacao.fato.toLowerCase()}, aplicando-se ${correlacao.norma}, tem-se como implicação ${correlacao.implicacao.toLowerCase()}.`
).join('\n\n') || 'Os argumentos jurídicos aplicáveis ao caso demonstram a correção da posição municipal.'}

III - DA CONCLUSÃO

${processo.analiseFireac?.conclusao.estrategia || 'Com base nos elementos apresentados, requer-se a consideração dos argumentos expostos.'}

${instrucoes ? `\nCONSIDERAÇÕES ADICIONAIS:\n${instrucoes}` : ''}

Termos em que,
Pede deferimento.

Natal/RN, ${new Date().toLocaleDateString('pt-BR')}.

_________________________________
Procuradoria Geral do Município
OAB/RN nº [número]`;
}

function generateRecurso(processo: Processo, instrucoes?: string): string {
  return `EXCELENTÍSSIMO(A) SENHOR(A) DESEMBARGADOR(A) RELATOR(A)

Processo: ${processo.numeroProcesso}
Assunto: ${processo.assunto}

O MUNICÍPIO DE NATAL, já qualificado nos autos, inconformado com a r. decisão proferida, vem, tempestivamente, por meio de sua Procuradoria Geral, interpor

RECURSO DE APELAÇÃO

contra a sentença de fls. ___, pelas razões de fato e de direito que passa a expor:

I - DA TEMPESTIVIDADE E ADMISSIBILIDADE

O presente recurso é tempestivo, conforme se verifica da intimação ocorrida em ___, sendo cabível a apelação nos termos do art. 1009 do CPC.

II - DOS FUNDAMENTOS RECURSAIS

${processo.analiseFireac?.analise.vulnerabilidades.map((vuln, index) => 
  `${index + 1}. ${vuln};`
).join('\n') || '1. A decisão recorrida merece reforma pelos fundamentos a seguir expostos;'}

III - DO MÉRITO

${processo.analiseFireac?.regras.map(regra => 
  `Nos termos do ${regra.dispositivo}, ${regra.descricao.toLowerCase()}.`
).join('\n\n') || 'O mérito da questão demonstra a necessidade de reforma da decisão.'}

IV - DOS PEDIDOS

Diante do exposto, requer-se:

a) O conhecimento e provimento do presente recurso;
b) A reforma da sentença recorrida;
c) A inversão dos ônus sucumbenciais.

${instrucoes ? `\nARGUMENTOS ESPECIAIS:\n${instrucoes}` : ''}

Termos em que,
Pede deferimento.

Natal/RN, ${new Date().toLocaleDateString('pt-BR')}.

_________________________________
Procuradoria Geral do Município
OAB/RN nº [número]`;
}

function generatePeticao(processo: Processo, instrucoes?: string): string {
  return `EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO

Processo: ${processo.numeroProcesso}
Assunto: ${processo.assunto}

O MUNICÍPIO DE NATAL, pessoa jurídica de direito público interno, já qualificado nos autos, vem, respeitosamente, à presença de Vossa Excelência, apresentar a presente

PETIÇÃO

pelos fundamentos que passa a expor:

I - DO REQUERIMENTO

${processo.analiseFireac?.conclusao.acoes_recomendadas[0] || 'Requer-se a análise das questões apresentadas nos autos.'} 

II - DA FUNDAMENTAÇÃO

${processo.analiseFireac?.analise.pontos_fortes.map(ponto => 
  `• ${ponto};`
).join('\n') || '• Os fundamentos jurídicos aplicáveis sustentam o pleito municipal;'}

III - DA LEGISLAÇÃO APLICÁVEL

${processo.analiseFireac?.regras.map(regra => 
  `${regra.dispositivo} - ${regra.descricao}`
).join('\n') || 'Aplicam-se os dispositivos legais pertinentes à questão.'}

${instrucoes ? `\nREQUERIMENTOS ESPECÍFICOS:\n${instrucoes}` : ''}

Termos em que,
Pede deferimento.

Natal/RN, ${new Date().toLocaleDateString('pt-BR')}.

_________________________________
Procuradoria Geral do Município
OAB/RN nº [número]`;
}

function generateEmbargo(processo: Processo, instrucoes?: string): string {
  return `EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO

Processo: ${processo.numeroProcesso}
Assunto: ${processo.assunto}

O MUNICÍPIO DE NATAL, pessoa jurídica de direito público interno, já qualificado nos autos, vem, respeitosamente, à presença de Vossa Excelência, opor

EMBARGOS DE DECLARAÇÃO

contra a r. decisão de fls. ___, nos termos do art. 1022 do CPC, pelas razões que passa a expor:

I - DA CABIMENTO E TEMPESTIVIDADE

Os presentes embargos são cabíveis e tempestivos, tendo em vista a existência de omissão/contradição/obscuridade na decisão embargada.

II - DA OMISSÃO/CONTRADIÇÃO/OBSCURIDADE

A r. decisão embargada apresenta vício que demanda correção:

${processo.analiseFireac?.questoes.map(questao => 
  `• ${questao.descricao}`
).join('\n') || '• Questão não analisada adequadamente na decisão;'}

III - DO PEDIDO

Requer-se o acolhimento dos presentes embargos para que seja sanado o vício apontado, com a consequente integração/correção da decisão.

${instrucoes ? `\nPONTOS ESPECÍFICOS:\n${instrucoes}` : ''}

Termos em que,
Pede deferimento.

Natal/RN, ${new Date().toLocaleDateString('pt-BR')}.

_________________________________
Procuradoria Geral do Município
OAB/RN nº [número]`;
}

function extractFundamentosLegais(processo: Processo): string[] {
  const fundamentos = [];
  
  if (processo.analiseFireac?.regras) {
    fundamentos.push(...processo.analiseFireac.regras.map(regra => regra.dispositivo));
  }
  
  // Add common legal foundations based on case type
  if (processo.classe.includes('FAZENDA PÚBLICA')) {
    fundamentos.push('Lei 8.429/92', 'Lei 4.717/65', 'Decreto-Lei 201/67');
  }
  
  if (processo.assunto.includes('Enquadramento') || processo.assunto.includes('Servidor')) {
    fundamentos.push('Lei 8.112/90', 'Lei Complementar Municipal');
  }
  
  if (processo.classe.includes('CUMPRIMENTO')) {
    fundamentos.push('CPC, art. 523 e seguintes', 'Lei 10.166/2017');
  }
  
  return [...new Set(fundamentos)]; // Remove duplicates
}