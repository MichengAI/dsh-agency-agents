import type { CollaborationMethods } from './team-collaboration.js'

export const TEAM_METHODS_PT = {
  general: {
    preparation: ["Problema a resolver e decisão final","Materiais disponíveis e caminhos acessíveis","Escopo, restrições, formato e incógnitas"],
    reviewChecklist: ["As conclusões respondem ao objetivo do usuário com evidências rastreáveis","Fatos, hipóteses, recomendações e escopo não coberto estão separados","As ações indicam prioridades, pré-condições e critérios de aceitação"],
    synthesis: "Entregue conclusão geral, evidências e limitações, divergências relevantes, ações priorizadas e questões em aberto.",
  },
  product: {
    preparation: ["Usuários-alvo, cenários e problemas principais","Propostas, feedback e evidências dos requisitos","Escopo da primeira versão, recursos e métricas de sucesso"],
    reviewChecklist: ["A divisão entre essencial, recomendado e adiável tem base em valor e restrições","Os problemas de uso correspondem a etapas específicas, com feedback separado de hipóteses","A recomendação define uma entrega mínima verificável e sinaliza custos desconhecidos"],
    synthesis: "Alinhe valor, usabilidade e viabilidade por requisito. Entregue uma tabela com requisitos, prioridades, evidências, custos e métricas de aceitação; explique inclusões e adiamentos. Valide itens de alto valor e custo desconhecido antes de planejar; não invente prazos.",
  },
  technical: {
    preparation: ["Objetivo da mudança, arquitetura, interfaces e fluxos de dados","Ambiente de implantação, limites de autorização e dependências","Compatibilidade, metas de desempenho e condições de teste"],
    reviewChecklist: ["Cada risco tem localização, gatilho, impacto e método de verificação","Problemas reproduzidos, riscos potenciais e pontos não verificados estão separados","Cada bloqueio tem correção mínima e caso de regressão correspondente"],
    synthesis: "Relacione arquitetura, segurança e aceitação por componente ou interface. Entregue riscos com gravidade, localização, gatilhos, impacto, correção e verificação, além das condições de liberação. Testes não executados são apenas planos.",
  },
  content: {
    preparation: ["Público, plataforma, posicionamento do perfil e objetivos","Tema, fatos conhecidos, materiais e fontes disponíveis","Extensão, formato, estilo, período e conteúdo excluído"],
    reviewChecklist: ["Cada pauta tem valor para o público, abordagem distinta e evidências utilizáveis","Títulos e argumentos centrais têm respaldo, com lacunas marcadas","As recomendações contemplam a plataforma, roteiros executáveis e métricas observáveis"],
    synthesis: "Alinhe abordagem, motivos de divulgação e evidência por pauta. Entregue pautas priorizadas, títulos, roteiros, materiais a reunir e métricas pós-publicação. Alcance não substitui a checagem de fatos; não prometa tráfego.",
  },
  data: {
    preparation: ["Questão de negócio, fontes e arquivos ou tabelas acessíveis","Campos, unidades, períodos, amostras, deduplicação e denominadores","Referências de comparação, problemas conhecidos e entregáveis esperados"],
    reviewChecklist: ["As comparações usam períodos, unidades, amostras e denominadores consistentes","Os números principais são verificáveis por fontes, cálculos ou consultas","Os gráficos usam campos e valores verificados, com limites de qualidade e correlação"],
    synthesis: "Concilie qualidade e definições antes de aceitar achados e gráficos. Não calcule médias de métricas incompatíveis nem as combine. Entregue definições, métricas centrais e anomalias, evidências reproduzíveis, planos de visualização e ações. Sem dados suficientes, entregue só um plano de análise.",
  },
  research: {
    preparation: ["Questão de pesquisa, finalidade da decisão e alternativas","Região, período, critérios de comparação e fontes disponíveis","Juízos prévios, hipóteses centrais e evidências contrárias a procurar"],
    reviewChecklist: ["Fontes rastreáveis, datas e definições adequadas, sem duplicar relatos da mesma origem","Inferências sobre tendências têm fatores, possíveis refutações e condições de validade","As opções usam critérios consistentes, com custos e condições que poderiam invalidar a recomendação"],
    synthesis: "Relacione fontes a afirmações antes de conciliar tendências e opções. Entregue conclusões centrais, tabela de evidências, comparações, evidências contrárias e questões em aberto. Relatos repetidos não são validação independente; evite falsa precisão.",
  },
} satisfies CollaborationMethods

export const MEMBER_HANDOFF_PT = ["Conclusão: responda apenas pela sua atribuição; faça uma recomendação clara quando for preciso decidir.","Evidências e localização: indique caminhos, trechos, fontes ou cálculos. Informe quais pesquisas e testes não foram executados.","Riscos e condições: explique impacto, gatilhos, hipóteses e evidências que poderiam invalidar a conclusão.","Ações e aceitação: proponha ações executáveis, prioridades e critérios de conclusão.","Pendências para a coordenação: liste questões a verificar com outras funções, materiais ausentes e escopo não coberto. Se não houver, diga isso."]

export const TEAM_COLLABORATION_PT = {
  steps: ["A coordenação prepara um briefing","Os membros analisam de forma independente e em paralelo","Os membros retornam conclusões e evidências","A coordenação verifica pendências e divergências","A equipe entrega um resultado com cobertura explícita"],
  customReview: "Regras personalizadas: verifique os resultados conforme o prompt e os entregáveis da equipe, sem aplicar um modelo anterior.",
  customSynthesis: "Sintetize os resultados conforme as regras de coordenação personalizadas e os entregáveis.",
}
