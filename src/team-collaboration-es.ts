import type { CollaborationMethods } from './team-collaboration.js'

export const TEAM_METHODS_ES = {
  general: {
    preparation: ["Problema y decisión final","Materiales disponibles y ubicaciones accesibles","Alcance, restricciones, formato e incógnitas"],
    reviewChecklist: ["Las conclusiones responden al objetivo del usuario con pruebas rastreables","Se distinguen hechos, suposiciones, recomendaciones y alcance no cubierto","Las acciones indican prioridades, requisitos previos y criterios de aceptación"],
    synthesis: "Entrega la conclusión general, las pruebas y sus límites, discrepancias relevantes, acciones priorizadas y cuestiones pendientes.",
  },
  product: {
    preparation: ["Usuarios objetivo, escenarios y problemas principales","Propuestas, comentarios de usuarios y pruebas de los requisitos","Alcance de la primera versión, recursos y métricas de éxito"],
    reviewChecklist: ["La división entre imprescindible, recomendable y aplazable se justifica por valor y restricciones","Los problemas de uso se vinculan con pasos concretos y se separan comentarios de suposiciones","La recomendación define una entrega mínima verificable y señala costes desconocidos"],
    synthesis: "Alinea valor, usabilidad y viabilidad por requisito. Entrega una tabla con requisitos, prioridades, pruebas, costes y métricas de aceptación; explica las inclusiones y los aplazamientos. Valida los trabajos de alto valor y coste desconocido antes de planificar; no inventes plazos.",
  },
  technical: {
    preparation: ["Objetivo del cambio, arquitectura, interfaces y flujos de datos","Entorno de despliegue, límites de autorización y dependencias","Compatibilidad, objetivos de rendimiento y condiciones de prueba"],
    reviewChecklist: ["Cada riesgo tiene ubicación, desencadenante, impacto y método de verificación","Se distinguen problemas reproducidos, riesgos potenciales y puntos sin verificar","Cada bloqueo tiene una corrección mínima y un caso de regresión asociado"],
    synthesis: "Relaciónalo por componente o interfaz: arquitectura, seguridad y aceptación. Entrega riesgos con gravedad, ubicación, desencadenantes, impacto, corrección y verificación, además de las condiciones de entrega. Las pruebas no ejecutadas solo son planes.",
  },
  content: {
    preparation: ["Público, plataforma, posicionamiento del perfil y objetivos","Tema, hechos conocidos, materiales y fuentes disponibles","Extensión, formato, estilo, período y contenido excluido"],
    reviewChecklist: ["Cada tema aporta valor al público, un enfoque distinto y pruebas utilizables","Los títulos y argumentos centrales cuentan con respaldo y se marcan las carencias","Las recomendaciones contemplan la plataforma, esquemas ejecutables y métricas observables"],
    synthesis: "Alinea el enfoque, las razones de difusión y las pruebas por tema. Entrega temas priorizados, títulos, esquemas, materiales pendientes y métricas tras la publicación. El alcance no sustituye la verificación de hechos; no prometas tráfico.",
  },
  data: {
    preparation: ["Pregunta de negocio, fuentes y archivos o tablas accesibles","Campos, unidades, períodos, muestras, deduplicación y denominadores","Referencias de comparación, problemas conocidos y entregables esperados"],
    reviewChecklist: ["Las comparaciones usan períodos, unidades, muestras y denominadores coherentes","Las cifras clave se pueden comprobar mediante fuentes, cálculos o consultas","Los gráficos usan campos y valores verificados e indican los límites de calidad y correlación"],
    synthesis: "Concilia calidad y definiciones antes de aceptar hallazgos y gráficos. No promedies ni combines métricas incompatibles. Entrega definiciones, métricas clave y anomalías, pruebas reproducibles, planes de visualización y acciones. Si no hay datos suficientes, entrega solo un plan de análisis.",
  },
  research: {
    preparation: ["Pregunta de investigación, uso de la decisión y alternativas","Región, período, criterios de comparación y fuentes disponibles","Valoraciones previas, suposiciones clave y pruebas en contra que conviene buscar"],
    reviewChecklist: ["Las fuentes son rastreables, las fechas y definiciones encajan y no se cuentan dos veces informes de la misma fuente","Las inferencias de tendencia incluyen factores, posibles refutaciones y condiciones de validez","Las opciones usan criterios coherentes, con costes y condiciones que podrían invalidar la recomendación"],
    synthesis: "Vincula fuentes con afirmaciones antes de conciliar tendencias y opciones. Entrega conclusiones principales, tabla de pruebas, comparaciones, pruebas en contra y preguntas pendientes. La información repetida no es validación independiente; evita la falsa precisión.",
  },
} satisfies CollaborationMethods

export const MEMBER_HANDOFF_ES = ["Conclusión: responde solo a tu asignación; da una recomendación clara cuando haya que decidir.","Pruebas y ubicación: indica rutas, pasajes, fuentes o cálculos. Señala qué búsquedas y pruebas no se ejecutaron.","Riesgos y condiciones: explica impacto, desencadenantes, suposiciones y pruebas que podrían invalidar la conclusión.","Acciones y aceptación: propone acciones ejecutables, prioridades y criterios de finalización.","Traspaso a la coordinación: enumera las cuestiones a contrastar con otras funciones, los materiales ausentes y el alcance sin cubrir. Si no hay nada pendiente, indícalo."]

export const TEAM_COLLABORATION_ES = {
  steps: ["La coordinación prepara un briefing","Los miembros analizan de forma independiente y en paralelo","Los miembros devuelven conclusiones y pruebas","La coordinación comprueba traspasos y discrepancias","El equipo entrega un resultado con cobertura explícita"],
  customReview: "Reglas personalizadas: comprueba los resultados según el prompt y los entregables del equipo, sin aplicar una plantilla anterior.",
  customSynthesis: "Sintetiza los resultados según las reglas de coordinación personalizadas y los entregables.",
}
