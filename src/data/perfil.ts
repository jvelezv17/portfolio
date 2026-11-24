// Datos personales. Deja en '' lo que no quieras mostrar y desaparece del sitio.
// Para ver si queda algo por completar: npm run pendientes

export const perfil = {
  nombre: 'Juan Esteban Vélez',
  rol: 'QA Automation Lead',
  frase:
    'Construyo pruebas automatizadas que encuentran los bugs antes que los usuarios, y explican de quién es el problema.',
  ubicacion: 'Colombia · Remoto (disponible para Medellín o Bogotá)',
  resumen:
    'Más de 2,5 años en automatización de pruebas y aseguramiento de calidad de aplicaciones web y móviles. Hoy lidero el área de QA en una plataforma SaaS de HR-tech, donde construí desde cero el framework de automatización con Playwright y TypeScript. Vengo del desarrollo de software, así que entiendo el código que pruebo.',
  email: 'juesveva17@gmail.com',
  linkedin: 'https://www.linkedin.com/in/juan-esteban-v%C3%A9lez-vanegas-74215b304',
  github: 'https://github.com/jvelezv17',
  cv: '', // CV en español, ej. '/cv-juan-velez-es.pdf' (el PDF va en public/). El de inglés va en en/perfil.ts
  // Repo de este mismo sitio (para el enlace "Este sitio está probado con Playwright")
  repoSitio: 'https://github.com/jvelezv17/portfolio', // cámbialo si el repo se llama distinto
};

// Cifras destacadas bajo el inicio. Solo números que puedas defender en una entrevista.
export const cifras = [
  { valor: '2,5+ años', texto: 'en QA y automatización de pruebas' },
  { valor: '40+', texto: 'instancias de un SaaS cubiertas por una sola suite' },
  { valor: '3', texto: 'frameworks en producción: Playwright, Cypress y Selenium' },
];

export const formacion = [
  { titulo: 'Ingeniería de Software', lugar: 'Universidad Tecnológica del Oriente', fechas: 'Último semestre (en curso)' },
  { titulo: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)', lugar: 'SENA', fechas: 'Mar 2023 – Sep 2025' },
];

export const idiomas = ['Español: nativo', 'Inglés: intermedio (B1+)'];

// Proyectos propios y públicos (aquí sí se puede enseñar código).
export const proyectosPersonales = [
  {
    nombre: 'RutaExpress',
    descripcion:
      'Planificador de rutas de domicilios (proyecto académico): calcula rutas con Dijkstra y compara cuatro estrategias de entrega. Patrones Strategy, Observer, Command e Iterator, con pruebas automatizadas y despliegue en GitHub Pages.',
    tecnologias: ['JavaScript', 'HTML', 'CSS', 'GitHub Pages'],
    url: 'https://github.com/jvelezv17', // [POR COMPLETAR] enlace directo al repo de RutaExpress
  },
  {
    nombre: 'Este portfolio',
    descripcion:
      'Hecho con Astro y probado con Playwright: carga, navegación, enlaces rotos, accesibilidad y vista móvil, en GitHub Actions en cada cambio.',
    tecnologias: ['Astro', 'Playwright', 'GitHub Actions'],
    url: 'https://github.com/jvelezv17/portfolio',
  },
];
