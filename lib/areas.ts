export type AreaKey = 'eng' | 'ger' | 'esg' | 'oeg' | 'com';

export interface Area {
  key: AreaKey;
  label: string;
  icon: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  focus: string;
  intro: string;
  probes: string[];
  hotTopic: string;
}

export const AREAS: Area[] = [
  {
    key: 'eng',
    label: 'Diretoria de Engenharia',
    icon: '🏗️',
    color: '#2980B9',
    badgeBg: '#D6EAF8',
    badgeText: '#1A5276',
    focus: 'Eficiência técnica e qualidade de entrega',
    intro: 'A engenharia pensa em termos de fluxo técnico, normas, ferramentas e interdependências entre disciplinas. O interlocutor será mais analítico e orientado a dados.',
    probes: [
      'Onde as disciplinas (elétrica, mecânica, civil, O&G) mais "colidem" no fluxo de trabalho? Há interferências recorrentes?',
      'Qual etapa do ciclo de projeto consome tempo desproporcionalmente? (levantamento? modelagem? revisão? compatibilização?)',
      'Existe retrabalho significativo entre o projetado e o executado? De onde vem a distorção?',
      'Como é a gestão de mudanças de escopo técnico? Qual a velocidade de resposta a um "As Built" vs. "As Designed"?',
      'A tecnologia atual (CAD, BIM, ferramentas de cálculo) é gargalo ou é subaproveitada?',
    ],
    hotTopic: 'Compatibilização multidisciplinar, automação de tarefas repetitivas de projeto, rastreabilidade de revisões, integração entre etapas de projeto e obra.',
  },
  {
    key: 'ger',
    label: 'Diretoria de Gerenciamento e Fiscalização',
    icon: '📐',
    color: '#E67E22',
    badgeBg: '#FDEBD0',
    badgeText: '#935116',
    focus: 'Visibilidade, controle e comunicação em campo',
    intro: 'Essa diretoria vive na interface entre projeto e obra. Os problemas geralmente envolvem informação que não flui, controle que não chega em tempo real, e documentação que atrasa decisões.',
    probes: [
      'Qual é o tempo médio entre uma ocorrência em campo e a informação chegar ao gestor? É aceitável?',
      'Os diários de obra, RDOs e medições físicas são feitos como? Papel, planilha, app? Qual o gargalo?',
      'As equipes de fiscalização conseguem verificar conformidade (qualidade, prazo, segurança) em tempo real?',
      'Onde acontece a maior "perda de informação" entre campo e escritório?',
      'Como é o processo de aprovar medições e liberar pagamentos? Há gargalos de aprovação?',
    ],
    hotTopic: 'Digitalização de processos de campo, rastreabilidade de não-conformidades, dashboards de acompanhamento em tempo real, integração de dados de obra com planejamento.',
  },
  {
    key: 'esg',
    label: 'Comitê de ESG',
    icon: '🌱',
    color: '#1E8449',
    badgeBg: '#D5F5E3',
    badgeText: '#1E8449',
    focus: 'Coleta de dados, reporte e conformidade',
    intro: 'ESG costuma ter um desafio de coleta descentralizada e reporte estruturado. Os dados vêm de múltiplas fontes e precisam ser consolidados com credibilidade para stakeholders internos e externos.',
    probes: [
      'De onde vêm os dados para os relatórios de ESG? Quantas fontes diferentes alimentam o reporte?',
      'Qual é o maior gargalo: coletar os dados, padronizá-los, ou transformá-los em relatório?',
      'Há indicadores ESG que vocês gostariam de monitorar mas não conseguem pela dificuldade de obtenção?',
      'Como é o controle de conformidade ambiental e de segurança nas obras? É reativo ou preventivo?',
      'Os requisitos de ESG dos clientes (editais, ISO 14001, etc.) geram demandas extras que o processo atual não absorve bem?',
    ],
    hotTopic: 'Automação de coleta de indicadores, centralização de dados ESG, monitoramento ambiental em tempo real, rastreabilidade de conformidade para auditorias.',
  },
  {
    key: 'oeg',
    label: 'Diretoria de Óleo & Gás',
    icon: '🛢️',
    color: '#6C3483',
    badgeBg: '#E8DAEF',
    badgeText: '#6C3483',
    focus: 'Operações de produção, integridade e rastreabilidade',
    intro: 'As operações de O&G exigem controle rigoroso de parâmetros de produção, conformidade regulatória com a ANP e rastreabilidade de intervenções. A integração entre subsuperfície e operações de campo é frequentemente um gargalo crítico.',
    probes: [
      'Como é feito o monitoramento de parâmetros de produção (vazão, pressão, BSW) nos poços e instalações? Os dados chegam em tempo real ao escritório?',
      'Qual é o maior gargalo no ciclo de intervenções em poços (workover, manutenção)? (planejamento, aprovações, mobilização, execução, relatório?)',
      'Como é gerenciada a rastreabilidade das operações de campo — perfuração, completação, testes de poço? Há registro sistemático?',
      'O processo de gestão de não-conformidades e anomalias operacionais é eficiente? Há análise de causa-raiz e registro de lições aprendidas?',
      'Como é feita a integração entre dados de subsuperfície (reservatório, geologia) e decisões de operação de campo? Existe gap de tempo ou de informação nessa troca?',
    ],
    hotTopic: 'Monitoramento de produção em tempo real, rastreabilidade de intervenções em poços, integração subsuperfície-operações, conformidade ANP e gestão de anomalias.',
  },
  {
    key: 'com',
    label: 'Diretoria Comercial',
    icon: '💼',
    color: '#1A5276',
    badgeBg: '#D6EAF8',
    badgeText: '#1A5276',
    focus: 'Pipeline comercial, propostas e inteligência competitiva',
    intro: 'A área comercial opera em ciclos de oportunidade que exigem velocidade, precisão e memória institucional. Gargalos frequentemente aparecem na formação de preço, na coordenação entre técnico e comercial, e na falta de rastreabilidade do funil.',
    probes: [
      'Como é feito o acompanhamento do pipeline de oportunidades e propostas? Há visibilidade consolidada do funil comercial em tempo real?',
      'Qual é o tempo médio entre a identificação de uma oportunidade e a entrega de proposta técnica e comercial? Esse prazo é competitivo frente ao mercado?',
      'Onde ocorrem os maiores gargalos no processo comercial? (pré-qualificação, dimensionamento técnico, formação de preço, aprovações internas?)',
      'Como é gerenciado o histórico de concorrências, preços praticados e lições aprendidas? Esse conhecimento é acessível e reutilizável para novas propostas?',
      'O processo de precificação, formação de margens e aprovações tem rastreabilidade e controle suficientes para auditorias internas e análise de rentabilidade?',
    ],
    hotTopic: 'Visibilidade do funil comercial, aceleração do ciclo de proposta, memória institucional de concorrências, rastreabilidade de precificação e análise de margens.',
  },
];

export const AREA_MAP: Record<AreaKey, Area> = Object.fromEntries(
  AREAS.map((a) => [a.key, a])
) as Record<AreaKey, Area>;
