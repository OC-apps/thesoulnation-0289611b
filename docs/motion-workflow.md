# Flujo de motion graphics por código (TSN)

## Skills incorporadas

Se instalaron como archivos de proyecto bajo `.agents/skills/` las siguientes skills:
- Motion Graphics Skills, de `charlie947/motion-graphics-skills`: `brand-intake`, `motion-brief-writer`, `reference-to-motion`, `motion-effects`, `title-sequence-3d`.
- Skills oficiales de Remotion, de `remotion-dev/skills`: `remotion-create`, `remotion-markup`, `remotion-render`, con referencias selectas para composición, efectos, desenfoque de movimiento, imágenes, fuentes y transparencia.

Fuentes:
- https://github.com/charlie947/motion-graphics-skills
- https://github.com/remotion-dev/skills
- https://www.remotion.dev/docs/ai/skills

Estas son copias de instrucciones de terceros utilizadas por asistentes de programación compatibles. **No son una instalación permanente de skills en ChatGPT**, ni una instalación de paquetes npm en el sitio existente. La aplicación pública TSN permanece sin nuevas dependencias.

## Para crear una nueva animación

1. Leer `AGENTS.md`, `brand.md` y `MOTION.md`.
2. Revisar los activos oficiales existentes y seleccionar la versión correcta del logotipo.
3. Elaborar 2–3 rutas visuales (storyboards cortos); escoger una. No repetir automáticamente un efecto que el usuario rechazó.
4. Programar en una carpeta independiente `motion-projects/<nombre>/`; no tocar el runtime de la web.
5. Usar temporización reproducible por frame y preview controlable. Para Remotion usar `useCurrentFrame()`, `useVideoConfig()` e `interpolate()`; evitar animaciones CSS que no rendericen de forma determinista.
6. Renderizar primero fotogramas clave y revisarlos.
7. Exportar WebM VP9 con alfa para OBS si es stinger. Validar alfa real y cobertura en punto de corte; entregar el código y los medios.
8. Documentar resoluciones, FPS, duración, transición en milisegundos y prueba real o pendiente de OBS.

## Cómo usar herramientas

En un agente de desarrollo compatible con Agent Skills, las instrucciones en `.agents/skills` pueden ser descubiertas y leídas. En caso de que el agente no cargue las skills automáticamente, pedirle que abra los archivos `SKILL.md` pertinentes.

Para trabajar con Remotion, crear un proyecto aislado cuando se solicite una animación nueva; **no instalar Remotion dentro del Vite de la web TSN** sin aprobación. Los comandos de render deben ejecutarse en el proyecto de motion, una vez configurado.

La exportación de WebM transparente depende del motor, del códec VP9, de FFmpeg y de las capacidades del host. Nunca afirmar que la exportación es funcional sin verificar el archivo final.

## Límites y seguridad

- No introducir secretos, tokens ni licencias en el repositorio.
- No incorporar código de terceros no inspeccionado como ejecutable dentro del sitio público.
- No confundir instalación de recetas/instrucciones con instalación del framework o mejoras automáticas de calidad.
- Revisión de dirección de arte antes de exportación final.
