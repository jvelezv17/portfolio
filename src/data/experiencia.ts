// Línea de tiempo de trabajos. El más reciente va primero.
// La empresa actual va anónima. Si tu jefe aprueba nombrarla, cambia `empresa`.

export type Trabajo = {
  empresa: string;
  rol: string;
  desde: string;
  hasta: string;
  logros: string[];
};

export const experiencia: Trabajo[] = [
  {
    empresa: 'Plataforma SaaS de HR-tech con IA',
    rol: 'QA Automation Lead',
    desde: 'Nov 2026',
    hasta: 'Actual',
    logros: [
      'Lidero el área de QA: prioridades, procesos y acompañamiento del equipo.',
      'Armé la guía de onboarding y el script de instalación para que una persona nueva corra la suite el primer día.',
    ],
  },
  {
    empresa: 'Plataforma SaaS de HR-tech con IA',
    rol: 'QA Tester · Automatización',
    desde: 'Ene 2026',
    hasta: 'Nov 2026',
    logros: [
      'Construí desde cero el framework de automatización del equipo con Playwright y TypeScript; corre sobre más de 40 instancias del producto y redujo los ciclos de regresión.',
      'Diseñé y ejecuté pruebas funcionales, de integración y de regresión sobre el agente de IA del producto, evaluando sus respuestas contra la fuente de verdad con escenarios en YAML y JSON versionados en Git.',
      'Ayudé a formalizar los procesos de QA en Jira con Xray.',
      'Consultas SQL a diario para verificar datos y comunicar hallazgos a desarrollo.',
    ],
  },
  {
    empresa: 'ITAC IT Applications Consulting',
    rol: 'Analista de Pruebas Junior',
    desde: 'Mar 2025',
    hasta: 'Nov 2025',
    logros: [
      'Automaticé casos de prueba con Cypress y Selenium, mejorando la detección temprana de errores.',
      'Integré la ejecución de pruebas automatizadas en pipelines CI/CD.',
      'Probé servicios web con SoapUI y validé integraciones y transferencias de archivos por FTPS.',
      'Pruebas funcionales y de regresión documentadas en SpiraTeam; propuse mejoras al proceso con IA y Power Automate, bajo Scrum.',
    ],
  },
  {
    empresa: 'RocketEdge Labs',
    rol: 'QA Manual',
    desde: 'Ene 2024',
    hasta: 'Ago 2024',
    logros: [
      'Pruebas funcionales, de usabilidad y de regresión en aplicaciones web y móviles.',
      'Reporte de defectos en Jira con pasos reproducibles y evidencias.',
      'Gestión de tickets de soporte en Zendesk, documentando cada caso y su solución.',
    ],
  },
];
