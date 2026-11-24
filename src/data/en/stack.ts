// English version of the stack: same tools and icons, translated group names.
import { stack as stackEs } from '../stack';

const grupos: Record<string, string> = {
  Automatización: 'Automation',
  Lenguajes: 'Languages',
  'APIs y datos': 'APIs & data',
  'Gestión de pruebas': 'Test management',
  'Código y CI/CD': 'Code & CI/CD',
};

export const stack = stackEs.map((g) => ({
  grupo: grupos[g.grupo] ?? g.grupo,
  items: g.items, // los nombres de las herramientas no se traducen
}));

export const formaDeTrabajo = ['Scrum', 'Remote teams', 'Technical onboarding', 'Root cause analysis', 'Exploratory testing'];
