# Instrucciones Para Agentes

## Proyecto

Este repositorio contiene el portafolio profesional de Juan Miguel Leon Gomez, programador e ingeniero informatico. La aplicacion esta construida con Next.js y presenta servicios, proyectos, experiencia profesional, animaciones, fondo 3D y un flujo real de contacto.

El objetivo principal del proyecto es mantener una experiencia visual de alto nivel, rapida, responsive, accesible y lista para produccion.

## Stack Principal

- Framework: Next.js 15 con App Router.
- Lenguaje: TypeScript.
- UI: React 19 y Tailwind CSS 4.
- Animacion: Framer Motion.
- 3D: Three.js, React Three Fiber, Drei y maath.
- Iconos: lucide-react y @heroicons/react.
- Backend de contacto: API route de Next.js y Nodemailer.

## Comandos Del Proyecto

- `npm run dev`: inicia el servidor local con Turbopack.
- `npm run build`: genera el build de produccion.
- `npm run start`: inicia el servidor de produccion.
- `npm run lint`: ejecuta las validaciones de ESLint.

## Estructura Relevante

- `src/app`: rutas, layout global, estilos globales y API routes.
- `src/app/api/contact/route.ts`: endpoint de contacto.
- `src/components/main`: secciones principales del portafolio.
- `src/components/sub`: componentes auxiliares reutilizables.
- `src/utils`: utilidades compartidas.
- `public`: assets publicos.

## Reglas Generales De Trabajo

- Mantener los cambios enfocados en la solicitud del usuario.
- Respetar los patrones existentes del proyecto antes de introducir abstracciones nuevas.
- Usar TypeScript de forma clara y estricta.
- Preservar el caracter premium, profesional y moderno del portafolio.
- Priorizar rendimiento, accesibilidad, responsive design y consistencia visual.
- Evitar refactors amplios si no son necesarios para completar la tarea.
- No romper el flujo de contacto ni las variables de entorno esperadas por Nodemailer.
- Antes de terminar cambios de codigo, ejecutar la verificacion mas relevante disponible, como `npm run lint` o `npm run build`, segun el alcance del cambio.

## Politica Obligatoria De Skills

Las skills instaladas en `.agents/skills` son parte del flujo de trabajo de este proyecto. Todo agente debe usarlas siempre que correspondan a la tarea. Si una skill aplica, es obligatorio consultarla y seguir sus instrucciones antes de actuar.

Si una skill parece relevante pero finalmente no se usa, el agente debe explicar brevemente por que no aplica en ese caso.

Skills instaladas:

- `impeccable`
- `ui-ux-pro-max`
- `git-commit`
- `grill-me`

### Skills De Diseno E Interfaces

Las skills de diseno son especialmente importantes en este proyecto. Cuando una tarea toque interfaz, experiencia de usuario, estilos, componentes visuales, layout, animaciones, accesibilidad, responsive design, copy visible o calidad visual, el agente debe usar las skills de UI disponibles.

Uso obligatorio:

- Usar `impeccable` para disenar, rediseniar, auditar, pulir, clarificar, endurecer, optimizar o mejorar cualquier interfaz.
- Usar `ui-ux-pro-max` para decisiones de UI/UX, paletas, tipografia, estilos visuales, componentes, layouts, dashboards, landing sections, formularios, navegacion y mejoras visuales.
- Usar `impeccable` y `ui-ux-pro-max` juntas cuando el cambio afecte componentes visibles o la experiencia del usuario.

Al trabajar en UI:

- Mantener coherencia visual con el portafolio existente.
- Cuidar jerarquia, espaciado, contraste, alineacion y estados interactivos.
- Verificar que el texto no se superponga ni se corte en mobile o desktop.
- Usar iconos de `lucide-react` o `@heroicons/react` cuando exista un icono apropiado.
- Usar Framer Motion para animaciones de interfaz cuando encaje con los patrones existentes.
- Usar React Three Fiber y Drei para experiencias 3D cuando el cambio lo requiera.
- Evitar cambios visuales genericos que debiliten la identidad del portafolio.

### Otras Skills

- Usar `git-commit` cuando el usuario pida crear commits, preparar commits o use `/commit`.
- Usar `grill-me` cuando el usuario pida cuestionar, validar, debatir o stress-testear un plan, una arquitectura o una decision.

## Criterios De Calidad

- La aplicacion debe seguir viendose profesional en desktop y mobile.
- Los componentes deben ser mantenibles y faciles de entender.
- Las interacciones deben sentirse fluidas sin sacrificar rendimiento.
- Los cambios deben evitar regresiones en rutas, navegacion, formulario de contacto y secciones principales.
- El resultado final debe poder desplegarse en Vercel sin pasos manuales innecesarios.

