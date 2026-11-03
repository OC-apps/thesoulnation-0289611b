# Motion design system — The Soul Nation

## Principios obligatorios

1. El movimiento explica una transición o enfatiza información; no añadir efectos solo por decoración.
2. Acabado premium: movimientos fluidos, capas limpias, buen contraste, jerarquía visual y ritmo intencional.
3. Evitar: glitch, humo, partículas sin propósito, excesos de glow, barras onduladas repetidas, barridos genéricos y loops que distraigan del gameplay.
4. Respetar `brand.md`; proteger logotipos y fuentes.
5. Revisar arte en 4 o más fotogramas de control y en tamaño real.
6. Primero desarrollar un animatic o preview controlable. Exportar cuando el movimiento sea aprobado o se pida expresamente.

## Stinger OBS

- Formato de trabajo: composición HTML/Canvas/SVG/React/Remotion con tiempo determinista; ofrecer función `window.seek(seconds)` en versiones HTML.
- Render deseado: WebM VP9 con transparencia alfa real; verificar mediante FFprobe/FFmpeg y revisión de canal alfa, sin suponer que transparencia visual implica canal alfa correcto.
- Base: 1920×1080, 60 FPS. Duración orientativa 0.8–1.6 segundos, según storyboard; no convertir una sugerencia en regla rígida.
- Punto de transición: al momento en que **toda la pantalla está completamente cubierta**; registrar el milisegundo exacto comprobado.
- Inicio y fin: alfa 0, salvo petición contraria. Centro totalmente cubierto durante el corte.
- Animación del logotipo: traslación, escala proporcional u opacidad; sin deformaciones ni cambios de colores.
- Entrega: HTML fuente, assets originales referenciados, WebM y notas de configuración OBS. Audio opcional, original y solo si se solicita.

## Dirección visual: explorar variantes

- A: geometría editorial con máscaras precisas.
- B: planos de profundidad y parallax sobrio.
- C: transformaciones de bloques de interfaz con cortes cinéticos.

Seleccionar por storyboard y no volver automáticamente a la misma curva azul/naranja de transiciones anteriores.

## Control de calidad

- Revisar fotogramas: inicial, entrada, antes del corte, corte, salida y final.
- Comprobar ocultamiento completo en el corte y transparencia al principio/final.
- Auditar pixelación, artefactos de bordes, clipping y peso del archivo.
- Comprobar en OBS real si hay entorno disponible; de no ser posible, indicar que no se probó en OBS.
