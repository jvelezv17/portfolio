// Todo el contenido del sitio en el idioma pedido.
import type { Idioma } from '../i18n';
import * as perfilEs from './perfil';
import * as perfilEn from './en/perfil';
import { proyectos as proyectosEs } from './proyectos';
import { proyectos as proyectosEn } from './en/proyectos';
import { experiencia as experienciaEs } from './experiencia';
import { experiencia as experienciaEn } from './en/experiencia';
import * as stackEs from './stack';
import * as stackEn from './en/stack';

export function contenido(idioma: Idioma) {
  const p = idioma === 'en' ? perfilEn : perfilEs;
  const s = idioma === 'en' ? stackEn : stackEs;
  return {
    perfil: p.perfil,
    cifras: p.cifras,
    formacion: p.formacion,
    idiomas: p.idiomas,
    proyectosPersonales: p.proyectosPersonales,
    proyectos: idioma === 'en' ? proyectosEn : proyectosEs,
    experiencia: idioma === 'en' ? experienciaEn : experienciaEs,
    stack: s.stack,
    formaDeTrabajo: s.formaDeTrabajo,
  };
}
