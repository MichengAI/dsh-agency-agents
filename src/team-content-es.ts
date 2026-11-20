import type { BuiltinTeamContent } from './team-content-en.js'

export const TEAM_CONSTRAINTS_ES = 'Limítate a analizar y revisar. Indica si las pruebas son insuficientes; no modifiques ni publiques sin autorización.'

export const TEAM_CONTENT_ES = {
  'team-product': {
    name: "Equipo de evaluación de producto",
    description: "Revisa requisitos, compara opciones y planifica iteraciones. Equilibra valor, facilidad de uso y coste para definir alcance y prioridades.",
    goal: "Evaluar el valor, la facilidad de uso y la viabilidad de una propuesta de producto.",
    tags: ["Requisitos","Comparación","Planificación"],
    deliveryRequirements: "Decisiones priorizadas y lista de acciones",
    examples: ["Revisa estos requisitos y separa lo esencial para la primera versión de lo que puede esperar.","Compara las opciones y explica las diferencias de valor, facilidad de uso y coste.","Planifica la próxima iteración con las funciones actuales y los comentarios de usuarios."],
    assignments: [
      ["Valor y prioridad de los requisitos","Comprueba los usuarios objetivo, los problemas principales y el alcance. Para cada requisito, señala qué es esencial, recomendable o aplazable, con pruebas de valor y métricas de éxito. Separa los comentarios de las suposiciones. Remite las carencias de usabilidad y los costes desconocidos a la coordinación; no decidas por otros especialistas."],
      ["Necesidades y barreras de uso","Recorre los pasos que sigue el usuario. Identifica a las personas afectadas, los comentarios disponibles y las suposiciones sin verificar. Propón una validación de bajo coste y criterios de aceptación para cada barrera. Remite hallazgos que puedan cambiar las prioridades; no sustituyas la planificación ni las estimaciones técnicas."],
      ["Coste de implementación y restricciones","Por requisito, evalúa alcance, capacidades existentes, dependencias y restricciones técnicas. Propón una vía mínima de entrega y alternativas. Indica las pruebas y las incógnitas de las estimaciones sin inventar plazos. Remite las restricciones que puedan cambiar el alcance o los flujos de uso."],
    ],
  },
  'team-technical': {
    name: "Equipo de revisión técnica",
    description: "Revisa arquitectura, seguridad y preparación para la entrega. Identifica riesgos, correcciones mínimas y criterios de aceptación ejecutables.",
    goal: "Revisar la arquitectura, los riesgos de seguridad y los criterios de aceptación.",
    tags: ["Arquitectura","Seguridad","Aceptación"],
    deliveryRequirements: "Registro de riesgos y lista de aceptación",
    examples: ["Revisa la propuesta técnica e identifica los impedimentos para la entrega, con correcciones mínimas.","Comprueba el diseño de interfaces y permisos y enumera las validaciones pendientes.","Crea una lista de aceptación clara y ejecutable para este cambio."],
    assignments: [
      ["Arquitectura y extensibilidad","Sigue componentes, interfaces y flujos de datos para revisar responsabilidades, dependencias, compatibilidad y mantenimiento. Por hallazgo, indica ubicación, desencadenante, impacto y corrección mínima. Señala qué contrastar con seguridad y casos de regresión. No des por aprobadas pruebas que no se ejecutaron."],
      ["Autorización y seguridad","Sigue los puntos de entrada, los controles de autorización y los flujos de datos sensibles. Indica ubicación, condiciones previas, impacto y corrección mínima. Distingue fallos verificados, riesgos de diseño y carencias de material. Remite bloqueos de entrega y escenarios de validación."],
      ["Límites de aceptación y calidad","Define de forma independiente escenarios normales, excepcionales, límite, de compatibilidad y de reversión, con requisitos previos, pasos y resultados esperados. Separa resultados ejecutados de pruebas propuestas. Remite la cobertura que se deba contrastar con arquitectura y seguridad, sin presuponer acceso a otros informes."],
    ],
  },
  'team-content': {
    name: "Equipo de planificación de contenidos",
    description: "Planifica temas según el público, la plataforma y las fuentes disponibles. Obtén títulos, esquemas y una lista de materiales pendientes.",
    goal: "Encontrar temas que merezcan tratarse y formas adecuadas de llegar al público.",
    tags: ["Temas","Distribución","Verificación"],
    deliveryRequirements: "Temas recomendados y esquemas de contenido",
    examples: ["Sugiere tres temas valiosos según el posicionamiento del perfil y el material disponible.","Ordena estas propuestas por valor para el público y por pruebas disponibles.","Convierte este tema en un esquema para la plataforma e identifica el material que falta."],
    assignments: [
      ["Enfoque y expresión","Usa el tema y las propuestas para sugerir ángulos, títulos, esquemas e introducciones útiles para el público. Vincula cada argumento central con material o marca la carencia. Remite los hechos que precisen revisión y los ajustes de expresión para la plataforma. No inventes ejemplos."],
      ["Público y distribución","Evalúa los públicos objetivo, los contextos de la plataforma y los motivos para hacer clic o compartir. Recomienda una presentación y métricas observables, indicando fundamentos y límites. No prometas tráfico. Remite los títulos exagerados o el material sin respaldo."],
      ["Fuentes y carencias de pruebas","Crea una tabla de afirmaciones y fuentes para el material entregado. Comprueba fuente, fecha, contexto y alcance. Distingue afirmaciones respaldadas, no verificadas e inadecuadas e indica cómo reunir pruebas. No digas que verificaste títulos o esquemas nuevos que no has recibido."],
    ],
  },
  'team-data': {
    name: "Equipo de análisis de datos",
    description: "Revisa métricas e investiga anomalías. Comprueba calidad y definiciones, explica cambios, recomienda gráficos y señala preguntas pendientes.",
    goal: "Comprobar las definiciones de las métricas, identificar problemas y explicar los resultados.",
    tags: ["Calidad de datos","Análisis","Gráficos"],
    deliveryRequirements: "Conclusiones del análisis y recomendaciones de visualización",
    examples: ["Analiza estos datos: comprueba primero las definiciones y luego explica las principales anomalías.","Compara ambos períodos y distingue los cambios reales de las diferencias de definición.","Sugiere gráficos para estos campos e indica qué conclusiones respaldan."],
    assignments: [
      ["Calidad y definiciones de métricas","Comprueba campos, períodos, unidades, muestras, valores ausentes, duplicados y denominadores. Prepara definiciones y hallazgos de calidad para su contraste. Indica las métricas afectadas y las comparaciones inválidas. Enumera los campos ausentes sin inventar resultados de limpieza o de consultas."],
      ["Métricas de negocio y anomalías","Analiza métricas y anomalías según la pregunta de negocio. Añade fuente, período, unidad, denominador y cálculo a cada cifra clave. Declara suposiciones sobre calidad y explicaciones alternativas. No confundas correlación con causalidad. Remite definiciones que se deban verificar y deja las conclusiones condicionadas hasta la comprobación."],
      ["Gráficos y comunicación","Recomienda gráficos según los campos disponibles y la pregunta de negocio. Indica ejes, unidades, agregación, referencias de comparación y anotaciones. Señala escalas o muestras engañosas. Si no hay cifras verificadas, propón un plan sin inventar valores y señala las dependencias de las definiciones."],
    ],
  },
  'team-research': {
    name: "Equipo de investigación",
    description: "Investiga temas, evalúa tendencias y compara opciones. Conecta pruebas fiables con las recomendaciones y explicita las condiciones y la incertidumbre.",
    goal: "Organizar las pruebas, las tendencias y las diferencias entre alternativas.",
    tags: ["Pruebas","Tendencias","Comparación"],
    deliveryRequirements: "Conclusiones de investigación con fuentes",
    examples: ["Organiza pruebas fiables y distingue los hallazgos confirmados de las afirmaciones discutidas.","Compara estas soluciones, explicando sus condiciones de aplicación y contrapartidas.","Analiza las tendencias y sus factores, incluidas pruebas que podrían invalidar la conclusión."],
    assignments: [
      ["Fiabilidad de las pruebas y las fuentes","Crea una tabla de afirmaciones, fuentes, fechas y alcance. Prioriza fuentes primarias y distingue pruebas independientes de información repetida. Identifica conflictos, información obsoleta y valoraciones sin respaldo. Remite los límites para análisis de tendencias y opciones. Si no puedes buscar, indica el material disponible."],
      ["Cambios y factores","Analiza cambios, factores y explicaciones alternativas en el período y la región solicitados. Distingue hechos, inferencias y escenarios. Vincula cada valoración a pruebas y posibles refutaciones o condiciones de fallo. Remite dudas de vigencia y definición; repetir una misma fuente no aumenta la confianza."],
      ["Alternativas y contrapartidas","Compara alternativas con criterios coherentes que respondan al propósito de la decisión. Explica condiciones, beneficios, costes, riesgos y reversibilidad. Recomienda una opción e indica qué pruebas podrían invalidarla sin inventar puntuaciones precisas. Remite las suposiciones clave para contrastarlas con fuentes y tendencias."],
    ],
  },
} satisfies BuiltinTeamContent
