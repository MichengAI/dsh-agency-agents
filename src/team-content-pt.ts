import type { BuiltinTeamContent } from './team-content-en.js'

export const TEAM_CONSTRAINTS_PT = "Apenas analise e revise. Declare se as evidências forem insuficientes; não modifique nem publique sem autorização."

export const TEAM_CONTENT_PT = {
  'team-product': {
    name: "Equipe de avaliação de produto",
    description: "Avalie requisitos, compare opções e planeje iterações. Equilibre valor, usabilidade e custo de implementação para definir escopo, prioridades e próximos passos.",
    goal: "Avaliar o valor, a usabilidade e a viabilidade de uma proposta de produto.",
    tags: ["Requisitos","Comparação","Planejamento"],
    deliveryRequirements: "Decisões priorizadas e lista de ações",
    examples: ["Revise estes requisitos e separe o que é essencial para a primeira versão do que pode esperar.","Compare as opções e explique as diferenças de valor, usabilidade e custo.","Planeje a próxima iteração com base nas funcionalidades atuais e no feedback dos usuários."],
    assignments: [
      ["Valor e prioridade dos requisitos","Confira os usuários-alvo, os problemas principais e o escopo. Para cada requisito, indique o que é essencial, recomendado ou adiável, com evidências de valor e métricas de sucesso. Separe feedback de hipóteses. Encaminhe lacunas de usabilidade e custos desconhecidos à coordenação; não decida pelos demais especialistas."],
      ["Necessidades e barreiras de uso","Percorra as etapas da tarefa do usuário. Identifique quem é afetado, o feedback disponível e as hipóteses não verificadas. Proponha validação de baixo custo e sinais de aceitação por barreira. Encaminhe achados que possam mudar prioridades; não substitua o planejamento de produto nem as estimativas técnicas."],
      ["Custo de implementação e restrições","Por requisito, avalie escopo, capacidades existentes, dependências e restrições técnicas. Proponha um caminho mínimo de entrega e alternativas. Indique a base e as incógnitas da estimativa sem inventar prazos. Encaminhe restrições que possam mudar o escopo ou o fluxo de uso."],
    ],
  },
  'team-technical': {
    name: "Equipe de revisão técnica",
    description: "Revise arquitetura, segurança e prontidão para entrega. Identifique riscos, correções mínimas e critérios de aceitação executáveis.",
    goal: "Revisar arquitetura, riscos de segurança e critérios de aceitação.",
    tags: ["Arquitetura","Segurança","Aceitação"],
    deliveryRequirements: "Registro de riscos e lista de aceitação",
    examples: ["Revise a proposta técnica e identifique impedimentos à entrega, com correções mínimas.","Verifique o desenho das interfaces e das permissões e liste as validações que faltam.","Crie uma lista de aceitação clara e executável para esta mudança."],
    assignments: [
      ["Arquitetura e extensibilidade","Siga os componentes, as interfaces e os fluxos de dados para avaliar responsabilidades, dependências, compatibilidade e manutenção. Para cada achado, indique localização, gatilho, impacto e correção mínima. Sinalize o que deve ser comparado com achados de segurança e casos de regressão. Não afirme que testes não executados passaram."],
      ["Autorização e segurança","Siga os pontos de entrada, as verificações de autorização e os fluxos de dados sensíveis. Indique localização, pré-condições, impacto e correção mínima. Distinga falhas verificadas, riscos de desenho e material ausente. Encaminhe bloqueios de entrega e cenários de validação necessários."],
      ["Limites de aceitação e qualidade","Liste de forma independente cenários normais, de exceção, de fronteira, de compatibilidade e de reversão, com pré-condições, ações e resultados esperados. Separe resultados executados de testes propostos. Encaminhe a cobertura que precisa ser cruzada com arquitetura e segurança, sem presumir acesso a outros relatórios."],
    ],
  },
  'team-content': {
    name: "Equipe de planejamento de conteúdo",
    description: "Planeje pautas com base no público, na plataforma e nas fontes disponíveis. Receba sugestões de títulos, roteiros e materiais a complementar.",
    goal: "Encontrar pautas relevantes e maneiras adequadas de alcançar o público.",
    tags: ["Pautas","Distribuição","Checagem"],
    deliveryRequirements: "Pautas recomendadas e roteiros de conteúdo",
    examples: ["Sugira três pautas relevantes com base no posicionamento do perfil e no material disponível.","Ordene estas propostas pelo valor para o público e pelas evidências disponíveis.","Transforme o tema em um roteiro para a plataforma e identifique o material que falta."],
    assignments: [
      ["Abordagem e linguagem","Use o tema e as propostas disponíveis para sugerir ângulos, títulos, roteiros e aberturas distintos e úteis para o público. Vincule os argumentos centrais a materiais ou sinalize lacunas. Encaminhe fatos que exigem checagem e ajustes de linguagem para a plataforma. Não invente exemplos."],
      ["Público e distribuição","Avalie o público-alvo, os contextos da plataforma e os motivos para clicar ou compartilhar. Sugira a apresentação e métricas observáveis, indicando fundamentos e limitações. Não prometa tráfego. Encaminhe títulos exagerados ou materiais sem respaldo à coordenação."],
      ["Fontes e lacunas de evidência","Monte uma tabela de afirmações e fontes para os temas e materiais fornecidos. Confira fonte, data, contexto e alcance. Separe afirmações fundamentadas, não verificadas e impróprias para uso; sugira como obter evidências. Não diga que checou títulos ou roteiros novos que não recebeu."],
    ],
  },
  'team-data': {
    name: "Equipe de análise de dados",
    description: "Revise métricas e investigue anomalias. Confira a qualidade e as definições dos dados, explique mudanças, sugira gráficos e sinalize dúvidas.",
    goal: "Verificar definições de métricas, identificar problemas e explicar resultados.",
    tags: ["Qualidade","Análise","Gráficos"],
    deliveryRequirements: "Conclusões da análise e sugestões de visualização",
    examples: ["Analise estes dados: confira primeiro as definições e depois explique as anomalias principais.","Compare estes períodos e separe mudanças reais de diferenças nas definições.","Sugira gráficos para estes campos e indique quais conclusões eles sustentam."],
    assignments: [
      ["Qualidade e definições das métricas","Confira campos, períodos, unidades, amostras, valores ausentes, registros duplicados e denominadores. Prepare as definições e os achados de qualidade para conciliação. Indique quais métricas são afetadas e quais comparações são inválidas. Liste campos ausentes sem inventar resultados de limpeza ou consultas."],
      ["Métricas de negócio e anomalias","Analise métricas e anomalias à luz da questão de negócio. Junte fonte, período, unidade, denominador e cálculo a cada número relevante. Declare hipóteses de qualidade e explicações alternativas. Não confunda correlação com causalidade. Encaminhe definições a verificar e mantenha conclusões condicionais até a conferência."],
      ["Gráficos e comunicação","Recomende gráficos com base nos campos disponíveis e na questão de negócio. Especifique eixos, unidades, agregação, referências de comparação e anotações. Aponte escalas ou amostras que possam induzir ao erro. Sem números verificados, proponha um plano de visualização sem inventar valores e sinalize dependências das definições."],
    ],
  },
  'team-research': {
    name: "Equipe de pesquisa",
    description: "Pesquise temas, avalie tendências e compare opções. Use evidências confiáveis para recomendar caminhos, com condições e incertezas explícitas.",
    goal: "Organizar evidências, tendências e as diferenças entre as alternativas.",
    tags: ["Evidências","Tendências","Comparação"],
    deliveryRequirements: "Conclusões de pesquisa com fontes",
    examples: ["Organize evidências confiáveis e separe achados confirmados de afirmações em disputa.","Compare as soluções e explique condições de aplicação e contrapartidas.","Analise as tendências e seus fatores, incluindo evidências que poderiam invalidar a conclusão."],
    assignments: [
      ["Confiabilidade das evidências e fontes","Monte uma tabela de afirmações, fontes, datas e escopo. Priorize fontes primárias e separe evidências independentes de relatos repetidos. Identifique conflitos, informações desatualizadas e juízos sem respaldo. Encaminhe os limites para análise de tendências e comparação de opções. Se não puder pesquisar, indique o material disponível."],
      ["Mudanças e fatores","Analise mudanças, fatores e explicações alternativas no período e na região solicitados. Distinga fatos, inferências e cenários. Vincule cada avaliação a evidências e a possíveis refutações ou condições de falha. Encaminhe dúvidas de prazo e definição; republicações da mesma fonte não aumentam a confiança."],
      ["Alternativas e contrapartidas","Compare alternativas com critérios consistentes ligados ao objetivo da decisão. Explique condições, benefícios, custos, riscos e reversibilidade. Recomende uma opção e diga que evidência poderia invalidá-la, sem inventar pontuações precisas. Encaminhe hipóteses centrais para conferência com fontes e tendências."],
    ],
  },
} satisfies BuiltinTeamContent
