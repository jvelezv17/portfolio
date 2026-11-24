// Casos de estudio. Contados de forma ANÓNIMA: sin nombre de la empresa,
// sin clientes, sin capturas con datos reales y sin código de la empresa.
// Cada caso: problema → qué hice → resultado.

export type Proyecto = {
  slug: string;
  titulo: string;
  resumen: string; // una línea para la tarjeta
  etiquetas: string[];
  problema: string[];
  queHice: string[];
  resultado: string[];
};

export const proyectos: Proyecto[] = [
  {
    slug: 'suite-e2e-multi-instancia',
    titulo: 'Una suite E2E para más de 40 instancias, sin código por instancia',
    resumen:
      'Pruebas Playwright que se adaptan solas a cada instalación del producto en lugar de copiar y pegar un script por cliente.',
    etiquetas: ['Playwright', 'TypeScript', 'Arquitectura de pruebas'],
    problema: [
      'El producto es una plataforma SaaS de HR-tech que se instala por separado para cada cliente. Son más de 40 instancias con el mismo flujo, pero con diferencias: campos obligatorios distintos, botones con otros textos y pasos que en algunas no existen.',
      'Un script por instancia era imposible de mantener: cada cambio en el producto obligaba a tocar decenas de copias.',
    ],
    queHice: [
      'Diseñé un motor de formularios dinámico: lee el formulario en pantalla, detecta qué campos son obligatorios y decide qué valor poner en cada uno (configuración de la instancia → valores base → reglas por tipo de campo). Si un campo obligatorio queda sin valor, la prueba falla con un mensaje claro en vez de fallar en silencio.',
      'Cada instancia tiene un archivo de configuración que solo declara lo que es distinto. La instancia de desarrollo es la referencia; las demás son variaciones.',
      'Definí una regla de oro: una variación entre instancias no es un fallo. Si un paso no aplica, se marca como omitido con su captura y la prueba sigue. Solo un error crítico (por ejemplo, no poder iniciar sesión) detiene la ejecución.',
      'El motor tiene sus propias pruebas unitarias, que corren sin navegador visible y en segundos.',
    ],
    resultado: [
      'Una sola suite corre sobre cualquier instancia cambiando una variable de entorno.',
      'Llevar un flujo a una instancia nueva se volvió un archivo de configuración corto, no un script nuevo.',
      'Los cambios del producto se arreglan en un solo lugar.',
    ],
  },
  {
    slug: 'reporte-por-causa',
    titulo: 'Un reporte que dice de quién es cada fallo',
    resumen:
      'Cada error se clasifica como bug de la aplicación, prerequisito de negocio o fallo de la automatización, con evidencia.',
    etiquetas: ['Reportes', 'Diagnóstico', 'Comunicación con desarrollo'],
    problema: [
      'Un “test en rojo” no dice nada. El equipo de desarrollo perdía tiempo investigando fallos que en realidad eran datos de prueba mal preparados o un selector roto en la automatización.',
      'Eso desgasta la confianza en las pruebas automatizadas: si la mitad de las alertas son ruido, nadie las mira.',
    ],
    queHice: [
      'Cada paso de la suite devuelve un resultado estructurado y, cuando falla, se clasifica por causa: bug de la aplicación, prerequisito de negocio no cumplido o fallo de la automatización.',
      'Al fallar se captura la evidencia visible en pantalla (mensajes de error, alertas) y una captura, para que el reporte se entienda sin volver a correr nada.',
      'Al final de cada corrida se imprime un resumen de una línea por instancia: pasos OK, omitidos y fallos separados por causa.',
      'Lo que ya se reportó y desarrollo aceptó como comportamiento conocido queda registrado, para no volver a reportarlo.',
    ],
    resultado: [
      'A desarrollo solo le llegan bugs reales de la plataforma; lo que es nuestro (datos o automatización) lo arreglamos antes de reportar.',
      'Los tickets llegan con causa, evidencia y pasos, y se resuelven más rápido.',
    ],
  },
  {
    slug: 'health-check-errores-500',
    titulo: 'Health-checks que cazan errores 500 silenciosos',
    resumen:
      'Pruebas de solo lectura que recorren pantallas y reportes escuchando la red, para encontrar errores que el usuario no ve.',
    etiquetas: ['Monitoreo', 'Red y AJAX', 'Solo lectura'],
    problema: [
      'Muchos errores del servidor no se ven en pantalla: una petición en segundo plano falla, la tabla queda vacía y nadie se entera hasta que un cliente se queja.',
      'Revisar a mano cada pantalla de cada instancia no escala.',
    ],
    queHice: [
      'Construí un detector reutilizable que escucha todas las respuestas de red mientras la prueba navega y registra cualquier error 500, separando los de datos de los de archivos estáticos.',
      'Las pruebas descubren solas las pantallas y reportes disponibles en cada instancia, en vez de tener una lista fija.',
      'Son de solo lectura: no crean ni modifican datos, así que se pueden correr con tranquilidad y con frecuencia.',
    ],
    resultado: [
      'Errores que antes pasaban desapercibidos se detectan y se reportan con la petición exacta que falló.',
      'Se volvió un chequeo rápido antes de entregar una instancia nueva o una versión.',
    ],
  },
  {
    slug: 'causa-raiz-en-el-codigo',
    titulo: 'Del síntoma a la línea de código',
    resumen:
      'Cuando una prueba encuentra un bug, leo el código del backend para reportar la causa raíz, no solo el síntoma.',
    etiquetas: ['Causa raíz', 'Lectura de código', 'Colaboración'],
    problema: [
      'Un reporte del tipo “la pantalla da error” obliga a desarrollo a reproducir y buscar desde cero. En bugs que dependen de los datos o de la configuración de cada instancia, eso puede tomar días.',
    ],
    queHice: [
      'Con acceso de solo lectura al código, sigo el error desde la petición que falla hasta la función que lo produce.',
      'El reporte incluye la causa probable y la ubicación en el código, además de los pasos para reproducirlo y la evidencia.',
      'Las pruebas siguen siendo de caja negra: el código explica el fallo, pero no reemplaza probarlo en la interfaz.',
    ],
    resultado: [
      'Desarrollo arranca directamente en la corrección en lugar de investigar.',
      'Mejoró la relación entre QA y desarrollo: los reportes se perciben como ayuda, no como ruido.',
    ],
  },
  {
    slug: 'liderazgo-qa',
    titulo: 'Liderar el área de QA',
    resumen:
      'Onboarding del equipo, procesos estandarizados y documentación viva para que la calidad no dependa de una sola persona.',
    etiquetas: ['Liderazgo', 'Onboarding', 'Procesos'],
    problema: [
      'El conocimiento de cómo probar cada flujo y cada instancia estaba en la cabeza de pocas personas. Sumar a alguien nuevo era lento y cada quien reportaba distinto.',
    ],
    queHice: [
      'Escribí una guía de onboarding y un script de instalación para que una persona nueva clone el repositorio y corra la suite el primer día.',
      'Mantengo un documento de estado del proyecto: qué cubre cada flujo, qué trampas se encontraron y dónde retomar.',
      'Estandaricé cómo se reporta: buscar duplicados primero, una plantilla fija, prioridad alta para lo que bloquea un flujo principal.',
      'Integración por Pull Request con revisión: nada llega a la rama principal sin pasar por ahí.',
    ],
    resultado: [
      'Hoy lidero el área de QA.',
      'El onboarding pasó de depender de explicaciones uno a uno a una guía que se sigue sola.',
    ],
  },
];
