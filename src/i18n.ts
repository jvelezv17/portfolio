// Textos de la interfaz en los dos idiomas del sitio, y las rutas equivalentes entre ellos.
// El CONTENIDO (perfil, casos, experiencia, stack) vive en src/data/ (español) y src/data/en/ (inglés).

export type Idioma = 'es' | 'en';

export const textos = {
  es: {
    saltar: 'Saltar al contenido',
    menu: { proyectos: 'Proyectos', experiencia: 'Experiencia', stack: 'Stack', contacto: 'Contacto' },
    cambiarIdioma: 'View this page in English',
    pie: 'Hecho con Astro y probado con Playwright',
    verCodigo: 'ver código',
    remoto: 'COL · Remoto',
    bandera: 'Bandera de Colombia',
    verCasos: 'Ver casos de estudio',
    contactarme: 'Contactarme',
    descargarCv: 'Descargar CV',
    avatar: 'Avatar de',
    terminalOk: 'todas las pruebas pasan',
    terminalAria: 'Resultado de las pruebas de este sitio',
    casosEyebrow: 'Casos de estudio',
    casosTitulo: 'Problemas reales, cómo los resolví y qué cambió',
    casosNota:
      'Trabajo en una plataforma SaaS de HR-tech. Por confidencialidad, los casos se cuentan sin nombres de la empresa ni de sus clientes, y sin código ni datos reales.',
    leerCaso: 'Leer caso →',
    proyectosPropios: 'Proyectos propios',
    trayectoria: 'Trayectoria',
    experiencia: 'Experiencia',
    formacion: 'Formación',
    idiomas: 'Idiomas',
    herramientas: 'Herramientas',
    stack: 'Stack',
    formaDeTrabajo: 'Forma de trabajo',
    hablemos: 'Hablemos',
    contacto: 'Contacto',
    contactoTexto: '¿Buscas a alguien que automatice tus pruebas o que arme un área de QA? Escríbeme.',
    globo: '¡Hablemos!',
    avatarCelebrando: 'celebrando',
    caso: 'Caso de estudio',
    todosLosCasos: '← Todos los casos',
    problema: 'El problema',
    queHice: 'Qué hice',
    resultado: 'Resultado',
    siguienteCaso: 'Siguiente caso',
    bicho: 'Un bug anda suelto: atrápalo',
    atrapado: '¡Atrapado!',
  },
  en: {
    saltar: 'Skip to content',
    menu: { proyectos: 'Projects', experiencia: 'Experience', stack: 'Stack', contacto: 'Contact' },
    cambiarIdioma: 'Ver esta página en español',
    pie: 'Built with Astro and tested with Playwright',
    verCodigo: 'view source',
    remoto: 'COL · Remote',
    bandera: 'Flag of Colombia',
    verCasos: 'See case studies',
    contactarme: 'Get in touch',
    descargarCv: 'Download CV',
    avatar: 'Avatar of',
    terminalOk: 'all tests passed',
    terminalAria: 'Test results for this site',
    casosEyebrow: 'Case studies',
    casosTitulo: 'Real problems, how I solved them, and what changed',
    casosNota:
      'I work at an HR-tech SaaS platform. For confidentiality, these cases leave out the names of the company and its clients, and include no code or real data.',
    leerCaso: 'Read case →',
    proyectosPropios: 'Side projects',
    trayectoria: 'Career',
    experiencia: 'Experience',
    formacion: 'Education',
    idiomas: 'Languages',
    herramientas: 'Tools',
    stack: 'Stack',
    formaDeTrabajo: 'How I work',
    hablemos: "Let's talk",
    contacto: 'Contact',
    contactoTexto: 'Looking for someone to automate your testing or build a QA team? Drop me a line.',
    globo: "Let's talk!",
    avatarCelebrando: 'celebrating',
    caso: 'Case study',
    todosLosCasos: '← All case studies',
    problema: 'The problem',
    queHice: 'What I did',
    resultado: 'Outcome',
    siguienteCaso: 'Next case',
    bicho: 'A bug is on the loose: catch it',
    atrapado: 'Caught it!',
  },
} as const;

/** Prefijo de URL de cada idioma: el español en la raíz, el inglés en /en. */
export const prefijo = (idioma: Idioma) => (idioma === 'en' ? '/en' : '');

/** Rutas de las páginas sueltas en cada idioma. */
export const rutas = {
  inicio: { es: '/', en: '/en/' },
  casos: { es: '/proyectos/', en: '/en/projects/' }, // + slug + '/'
  bugEncontrado: { es: '/bug-encontrado/', en: '/en/bug-found/' },
} as const;
