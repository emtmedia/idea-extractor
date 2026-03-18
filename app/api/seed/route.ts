import { prisma } from '@/lib/db';

export async function GET() {
  return POST();
}

export async function POST() {
  // Seed cargos if empty
  const cargoCount = await prisma.cargo.count();
  if (cargoCount === 0) {
    const defaultCargos = [
      'Diretor(a) de Engenharia',
      'Diretor(a) de Gerenciamento',
      'Diretor(a) Comercial',
      'Gerente de Projetos',
      'Gerente de Contratos',
      'Coordenador(a) de Projetos',
      'Coordenador(a) de Obras',
      'Engenheiro(a) Sênior',
      'Engenheiro(a) de Campo',
      'Fiscal de Obras',
      'Superintendente',
      'Analista de ESG',
      'Consultor(a) Técnico(a)',
      'Especialista Técnico(a)',
    ];
    await prisma.cargo.createMany({
      data: defaultCargos.map((label, i) => ({ label, order: i + 1 })),
    });
  }

  const count = await prisma.question.count();
  if (count > 0) {
    return Response.json({ skipped: true, message: 'Banco de perguntas já populado.' });
  }

  const questions = [
    // ── Standard questions (P1–P8) ────────────────────────────────────────
    {
      area: 'all', type: 'standard', phase: 'warmup', phaseLabel: 'Aquecimento', phaseColor: '#1ABC9C', order: 1,
      text: 'Me conte sobre o fluxo típico de um projeto/demanda na sua diretoria, do início ao fim.',
      note: 'Deixe o diretor narrar. Anote os pontos onde ele demonstra frustração ou pausa.',
    },
    {
      area: 'all', type: 'standard', phase: 'warmup', phaseLabel: 'Aquecimento', phaseColor: '#1ABC9C', order: 2,
      text: 'Se eu acompanhasse sua equipe por uma semana, o que eu veria que te incomoda em termos de produtividade?',
      note: 'Força uma resposta concreta e observável, não abstrata.',
    },
    {
      area: 'all', type: 'standard', phase: 'deep', phaseLabel: 'Aprofundamento', phaseColor: '#E67E22', order: 3,
      text: 'Você mencionou [gargalo X]. Me ajude a entender: por que isso acontece?',
      note: 'Repita "e por que isso?" até 5 vezes, anotando cada camada.',
      tip: 'Exemplo dos 5 Porquês:\n① "Prazos atrasam." → Por quê?\n② "Porque as revisões demoram." → Por quê?\n③ "Porque as disciplinas trabalham em silos." → Por quê?\n④ "Porque não há checkpoint interdisciplinar." → Por quê?\n⑤ "Porque o processo foi desenhado para 2 disciplinas."\n→ Raiz real: processo desatualizado para a complexidade atual.',
    },
    {
      area: 'all', type: 'standard', phase: 'deep', phaseLabel: 'Aprofundamento', phaseColor: '#E67E22', order: 4,
      text: 'Quem mais é afetado por isso? Quais equipes ou processos a jusante sofrem?',
      note: 'Mapeia o impacto sistêmico — essencial para o Challenge Canvas.',
    },
    {
      area: 'all', type: 'standard', phase: 'deep', phaseLabel: 'Aprofundamento', phaseColor: '#E67E22', order: 5,
      text: 'Vocês já tentaram resolver isso antes? O que aconteceu?',
      note: 'Revela restrições e tentativas anteriores. Evita que os grupos reinventem o que já falhou.',
    },
    {
      area: 'all', type: 'standard', phase: 'impact', phaseLabel: 'Impacto', phaseColor: '#E74C3C', order: 6,
      text: 'Se eu pudesse resolver esse problema amanhã, qual seria o impacto concreto? Em horas, dinheiro, retrabalho, risco?',
      note: 'Busque números, mesmo que aproximados. "~40h/mês" é melhor que "melhoraria muito".',
    },
    {
      area: 'all', type: 'standard', phase: 'impact', phaseLabel: 'Impacto', phaseColor: '#E74C3C', order: 7,
      text: 'Em uma escala de 1 a 5, quanto esse problema impacta: a entrega ao cliente, o custo operacional e a satisfação da equipe?',
      note: 'Escala: 1 (baixo) a 5 (crítico). Ajuda a triangular a prioridade.',
    },
    {
      area: 'all', type: 'standard', phase: 'frame', phaseLabel: 'Enquadramento', phaseColor: '#2980B9', order: 8,
      text: 'Então, se eu entendi bem, o desafio central seria [sua síntese em uma frase]. Isso captura a essência?',
      note: 'Leia em voz alta sua frase-síntese e deixe o diretor ajustar. Momento crucial para o alinhamento.',
    },

    // ── Engenharia probes ─────────────────────────────────────────────────
    {
      area: 'eng', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#2980B9', order: 1,
      text: 'Onde as disciplinas (elétrica, mecânica, civil, O&G) mais "colidem" no fluxo de trabalho? Há interferências recorrentes que atrasam a entrega?',
    },
    {
      area: 'eng', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#2980B9', order: 2,
      text: 'Qual etapa do ciclo de projeto consome tempo desproporcionalmente? (levantamento, modelagem, revisão ou compatibilização?)',
    },
    {
      area: 'eng', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#2980B9', order: 3,
      text: 'Existe retrabalho significativo entre o projetado e o executado? De onde vem a principal distorção?',
    },
    {
      area: 'eng', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#2980B9', order: 4,
      text: 'Como é a gestão de mudanças de escopo técnico? Qual a velocidade de resposta a um "As Built" vs. "As Designed"?',
    },
    {
      area: 'eng', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#2980B9', order: 5,
      text: 'A tecnologia atual (CAD, BIM, ferramentas de cálculo) é um gargalo ou está sendo subaproveitada pela equipe?',
    },
    {
      area: 'eng', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#2980B9', order: 6,
      text: 'Como é feito o controle de versões de documentos técnicos? Existem casos de equipes trabalhando com revisões desatualizadas?',
    },
    {
      area: 'eng', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#2980B9', order: 7,
      text: 'Qual é o processo de aprovação e liberação de projetos para execução? Quais são os principais pontos de espera ou reprovação?',
    },
    {
      area: 'eng', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#2980B9', order: 8,
      text: 'Como é feita a interface entre projetos básico e executivo? Há perda de informação ou de contexto entre essas fases?',
    },
    {
      area: 'eng', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#2980B9', order: 9,
      text: 'Existe algum processo estruturado de lições aprendidas após a conclusão de projetos? Esse conhecimento é efetivamente reutilizado?',
    },
    {
      area: 'eng', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#2980B9', order: 10,
      text: 'Como é a gestão de normas e padrões técnicos? A equipe tem acesso fácil e atualizado às normas aplicáveis ao seu trabalho?',
    },

    // ── Gerenciamento probes ──────────────────────────────────────────────
    {
      area: 'ger', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#E67E22', order: 1,
      text: 'Qual é o tempo médio entre uma ocorrência em campo e a informação chegar ao gestor responsável? Esse tempo é aceitável?',
    },
    {
      area: 'ger', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#E67E22', order: 2,
      text: 'Os diários de obra, RDOs e medições físicas são feitos como? (papel, planilha, app?) Qual é o principal gargalo nesse processo?',
    },
    {
      area: 'ger', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#E67E22', order: 3,
      text: 'As equipes de fiscalização conseguem verificar conformidade — qualidade, prazo e segurança — em tempo real, ou dependem de relatórios posteriores?',
    },
    {
      area: 'ger', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#E67E22', order: 4,
      text: 'Onde acontece a maior "perda de informação" entre o campo e o escritório? Em qual etapa o dado se perde ou se distorce?',
    },
    {
      area: 'ger', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#E67E22', order: 5,
      text: 'Como é o processo de aprovar medições e liberar pagamentos a subcontratados? Há gargalos de aprovação ou pendências frequentes?',
    },
    {
      area: 'ger', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#E67E22', order: 6,
      text: 'Como é feito o controle de subcontratados? Existe visibilidade consolidada sobre o avanço físico e a conformidade deles em tempo real?',
    },
    {
      area: 'ger', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#E67E22', order: 7,
      text: 'Como são gerenciadas as não-conformidades e pendências de qualidade? Elas são registradas, acompanhadas e fechadas sistematicamente?',
    },
    {
      area: 'ger', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#E67E22', order: 8,
      text: 'Como são feitas as inspeções de qualidade? Existe registro fotográfico vinculado ao local e rastreabilidade das aprovações?',
    },
    {
      area: 'ger', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#E67E22', order: 9,
      text: 'Com que frequência o cronograma físico é atualizado e comparado com o programado? Quem tem visibilidade sobre os desvios?',
    },
    {
      area: 'ger', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#E67E22', order: 10,
      text: 'Em situações de crise ou interferência em campo, como é feita a comunicação e a tomada de decisão? Existe um processo formal definido?',
    },

    // ── ESG probes ────────────────────────────────────────────────────────
    {
      area: 'esg', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#1E8449', order: 1,
      text: 'De onde vêm os dados para os relatórios de ESG? Quantas fontes diferentes — obras, RH, fornecedores, ambiental — alimentam o reporte?',
    },
    {
      area: 'esg', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#1E8449', order: 2,
      text: 'Qual é o maior gargalo no processo de reporte: coletar os dados, padronizá-los, ou transformá-los em relatório estruturado?',
    },
    {
      area: 'esg', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#1E8449', order: 3,
      text: 'Há indicadores ESG que vocês gostariam de monitorar mas não conseguem pela dificuldade de coleta ou pela falta de processo definido?',
    },
    {
      area: 'esg', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#1E8449', order: 4,
      text: 'Como é feito o controle de conformidade ambiental e de segurança nas obras? O processo é reativo (responde a problemas) ou preventivo?',
    },
    {
      area: 'esg', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#1E8449', order: 5,
      text: 'Os requisitos de ESG dos clientes — editais, ISO 14001, ISO 45001 — geram demandas extras que o processo atual não absorve bem?',
    },
    {
      area: 'esg', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#1E8449', order: 6,
      text: 'Como é feito o inventário de emissões de GHG (gases de efeito estufa)? Os dados de escopo 1, 2 e 3 são rastreados sistematicamente?',
    },
    {
      area: 'esg', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#1E8449', order: 7,
      text: 'Existe um processo de due diligence ESG para fornecedores e subcontratados? Como ele é conduzido e documentado?',
    },
    {
      area: 'esg', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#1E8449', order: 8,
      text: 'Como é feito o acompanhamento de indicadores de segurança (LTIR, TRIR, horas-sem-acidente)? Os dados chegam em tempo real para a gestão?',
    },
    {
      area: 'esg', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#1E8449', order: 9,
      text: 'O processo de reporte ESG para clientes e stakeholders é eficiente? Qual é o lead time típico para gerar um relatório trimestral ou anual?',
    },
    {
      area: 'esg', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#1E8449', order: 10,
      text: 'Existe algum programa de engajamento de stakeholders em ESG — comunidades, fornecedores, colaboradores? Como ele é monitorado e evidenciado?',
    },

    // ── Óleo & Gás probes ─────────────────────────────────────────────────
    {
      area: 'oeg', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#6C3483', order: 1,
      text: 'Como é feito o monitoramento de parâmetros de produção (vazão, pressão, BSW) nos poços e instalações? Os dados chegam em tempo real ao escritório?',
    },
    {
      area: 'oeg', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#6C3483', order: 2,
      text: 'Qual é o maior gargalo no ciclo de intervenções em poços (workover, manutenção)? (planejamento, aprovações, mobilização, execução ou relatório final?)',
    },
    {
      area: 'oeg', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#6C3483', order: 3,
      text: 'Como é gerenciada a rastreabilidade das operações de campo — perfuração, completação e testes de poço? Existe registro sistemático e acessível?',
    },
    {
      area: 'oeg', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#6C3483', order: 4,
      text: 'O processo de gestão de não-conformidades e anomalias operacionais é eficiente? Há análise de causa-raiz e registro formal de lições aprendidas?',
    },
    {
      area: 'oeg', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#6C3483', order: 5,
      text: 'Como é feita a integração entre dados de subsuperfície (reservatório, geologia) e decisões de operação de campo? Existe gap de tempo ou de informação nessa troca?',
    },
    {
      area: 'oeg', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#6C3483', order: 6,
      text: 'Como é feito o planejamento e controle de manutenção preventiva de equipamentos de produção (separadores, bombas, compressores, manifolds)?',
    },
    {
      area: 'oeg', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#6C3483', order: 7,
      text: 'Qual é o processo de elaboração e aprovação dos relatórios operacionais para a ANP? Há gargalos de dados ou de aprovação interna?',
    },
    {
      area: 'oeg', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#6C3483', order: 8,
      text: 'Como é feito o controle de integridade de dutos, válvulas e equipamentos de segurança? Existe um programa de inspeção sistemático e rastreável?',
    },
    {
      area: 'oeg', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#6C3483', order: 9,
      text: 'Como são gerenciadas as paradas programadas de produção (turnarounds)? O planejamento antecipado é suficiente para minimizar perda de produção?',
    },
    {
      area: 'oeg', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#6C3483', order: 10,
      text: 'Existe visibilidade consolidada da performance de produção (realizado vs. meta) para tomada de decisão em tempo hábil pela gerência?',
    },

    // ── Comercial probes ──────────────────────────────────────────────────
    {
      area: 'com', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#1A5276', order: 1,
      text: 'Como é feito o acompanhamento do pipeline de oportunidades e propostas? Há visibilidade consolidada do funil comercial em tempo real para a liderança?',
    },
    {
      area: 'com', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#1A5276', order: 2,
      text: 'Qual é o tempo médio entre a identificação de uma oportunidade e a entrega de proposta técnica e comercial? Esse prazo é competitivo frente ao mercado?',
    },
    {
      area: 'com', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#1A5276', order: 3,
      text: 'Onde ocorrem os maiores gargalos no processo comercial? (pré-qualificação, dimensionamento técnico, formação de preço ou aprovações internas?)',
    },
    {
      area: 'com', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#1A5276', order: 4,
      text: 'Como é gerenciado o histórico de concorrências, preços praticados e lições aprendidas? Esse conhecimento é acessível e reutilizável para novas propostas?',
    },
    {
      area: 'com', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#1A5276', order: 5,
      text: 'O processo de precificação, formação de margens e aprovações tem rastreabilidade e controle suficientes para auditorias e análise de rentabilidade?',
    },
    {
      area: 'com', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#1A5276', order: 6,
      text: 'Como é feita a inteligência competitiva? Existe processo sistemático de monitoramento de concorrentes, preços de mercado e tendências setoriais?',
    },
    {
      area: 'com', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#1A5276', order: 7,
      text: 'Como é o processo de pré-qualificação em editais e licitações? Existe algum gargalo na gestão documental, certidões ou habilitações técnicas?',
    },
    {
      area: 'com', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#1A5276', order: 8,
      text: 'Como é feita a passagem de bastão entre área comercial e equipe de execução após fechamento de contrato? Há perda de informação ou de contexto?',
    },
    {
      area: 'com', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#1A5276', order: 9,
      text: 'Existe um CRM ou ferramenta de gestão de relacionamento com clientes? Ela é usada de forma consistente e atualizada pela equipe comercial?',
    },
    {
      area: 'com', type: 'probe', phase: 'probe', phaseLabel: 'Sonda', phaseColor: '#1A5276', order: 10,
      text: 'Como é avaliada a satisfação dos clientes ao longo e ao final dos contratos? Esse feedback é capturado sistematicamente e usado para melhoria?',
    },
  ];

  await prisma.question.createMany({ data: questions });

  return Response.json({ seeded: true, count: questions.length });
}
