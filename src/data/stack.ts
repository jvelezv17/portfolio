// `icono` es el nombre en la librería simple-icons (https://simpleicons.org).
// Sin `icono`, el sitio muestra un monograma con las iniciales.

export type Tecnologia = { nombre: string; icono?: string; mono?: string };

export const stack: { grupo: string; items: Tecnologia[] }[] = [
  {
    grupo: 'Automatización',
    items: [
      { nombre: 'Playwright', mono: 'PW' },
      { nombre: 'Cypress', icono: 'siCypress' },
      { nombre: 'Selenium', icono: 'siSelenium' },
      { nombre: 'Cucumber', icono: 'siCucumber' },
    ],
  },
  {
    grupo: 'Lenguajes',
    items: [
      { nombre: 'TypeScript', icono: 'siTypescript' },
      { nombre: 'JavaScript', icono: 'siJavascript' },
      { nombre: 'SQL', icono: 'siMysql' },
      { nombre: 'Java', icono: 'siOpenjdk' },
      { nombre: 'Python', icono: 'siPython' },
    ],
  },
  {
    grupo: 'APIs y datos',
    items: [
      { nombre: 'Postman', icono: 'siPostman' },
      { nombre: 'SoapUI', mono: 'SU' },
      { nombre: 'JSON', icono: 'siJson' },
      { nombre: 'YAML', icono: 'siYaml' },
    ],
  },
  {
    grupo: 'Gestión de pruebas',
    items: [
      { nombre: 'Jira', icono: 'siJira' },
      { nombre: 'Xray', mono: 'XR' },
      { nombre: 'TestRail', mono: 'TR' },
      { nombre: 'SpiraTeam', mono: 'ST' },
    ],
  },
  {
    grupo: 'Código y CI/CD',
    items: [
      { nombre: 'Git', icono: 'siGit' },
      { nombre: 'GitHub', icono: 'siGithub' },
      { nombre: 'GitHub Actions', icono: 'siGithubactions' },
      { nombre: 'Node.js', icono: 'siNodedotjs' },
      { nombre: 'HTML', icono: 'siHtml5' },
      { nombre: 'CSS', icono: 'siCss' },
    ],
  },
];

// Lo que no es una herramienta, pero también es parte del trabajo.
export const formaDeTrabajo = ['Scrum', 'Equipos remotos', 'Onboarding técnico', 'Análisis de causa raíz', 'Pruebas exploratorias'];
