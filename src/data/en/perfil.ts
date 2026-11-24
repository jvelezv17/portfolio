// English version of src/data/perfil.ts. Name, email and links come from the Spanish file
// (they don't change between languages); only the text is translated here.
import { perfil as perfilEs, proyectosPersonales as personalesEs } from '../perfil';

export const perfil = {
  ...perfilEs,
  rol: 'QA Automation Lead',
  frase: 'I build automated tests that catch bugs before users do, and explain whose problem they are.',
  ubicacion: 'Colombia · Remote (open to Medellín or Bogotá)',
  resumen:
    '2.5+ years in test automation and quality assurance for web and mobile apps. I lead QA at an HR-tech SaaS platform, where I built the automation framework from scratch with Playwright and TypeScript. I come from software development, so I understand the code I test.',
};

export const cifras = [
  { valor: '2.5+ years', texto: 'in QA and test automation' },
  { valor: '40+', texto: 'instances of a SaaS product covered by a single suite' },
  { valor: '3', texto: 'frameworks used in production: Playwright, Cypress and Selenium' },
];

export const formacion = [
  { titulo: 'B.Sc. in Software Engineering', lugar: 'Universidad Tecnológica del Oriente', fechas: 'Final semester (in progress)' },
  {
    titulo: 'Software Analysis and Development Technologist',
    lugar: 'SENA (Colombian national technical institute)',
    fechas: 'Mar 2023 – Sep 2025',
  },
];

export const idiomas = ['Spanish: native', 'English: intermediate (B1+)'];

export const proyectosPersonales = [
  {
    ...personalesEs[0],
    descripcion:
      'Delivery route planner (academic project): computes routes with Dijkstra and compares four delivery strategies. Strategy, Observer, Command and Iterator patterns, with automated tests and deployed on GitHub Pages.',
  },
  {
    ...personalesEs[1],
    nombre: 'This portfolio',
    descripcion:
      'Built with Astro and tested with Playwright: page load, navigation, broken links, accessibility and mobile layout, on GitHub Actions for every change.',
  },
];
