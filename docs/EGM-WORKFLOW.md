# EGM — Protocolo de cambios seguros (The Soul Nation)

Este repositorio usa un flujo inspirado en Elephant–Goldfish: planificación con contexto completo, revisión independiente con contexto mínimo y ejecución verificada. No se presupone que haya agentes autónomos instalados; si no los hay, cada fase se realiza y documenta explícitamente.

## Alcance y prioridad
- Complementa `AGENTS.md`, `brand.md` y las instrucciones existentes; nunca las sustituye.
- Protege sitio público, roster Crew/Waves/Legends, fichas, fotografías, videos, logos, administrador, StreamPack Studio, noticias y despliegues.
- No mezclar ramas completas, cambiar producción, borrar datos ni modificar configuraciones sin autorización explícita.

## 1. Elephant — especificación antes del código
- Identificar objetivo, rama de trabajo, archivos afectados, arquitectura, dependencias y estado actual.
- Registrar comportamiento esperado, casos límite, compatibilidad móvil/escritorio, riesgos de regresión, plan de pruebas y reversión.
- Distinguir hechos verificados de supuestos; detenerse si faltan datos esenciales.

## 2. Goldfish — revisión independiente
- Entregar a un revisor distinto (o una sesión separada sin historial) solo la especificación y los contratos relevantes.
- Pedir que busque ambigüedades, dependencias ocultas, efectos secundarios, pérdida de datos, problemas de seguridad y pruebas faltantes.
- Resolver objeciones antes de implementar. No afirmar independencia si revisó el mismo agente sin aislamiento.

## 3. Implementación acotada
- Trabajar en rama dedicada y cambios mínimos; no reescribir módulos ajenos al objetivo.
- Conservar activos y funcionalidades existentes. No agregar secretos ni credenciales al repositorio.
- No desplegar ni fusionar sin aprobación cuando el cambio afecte producción.

## 4. Verificación
- Ejecutar lint, typecheck, build y tests disponibles; reportar cualquier comando no ejecutado.
- Probar rutas y flujos afectados, incluyendo perfiles desde roster y admin, enlaces directos, fotos y videos, y exportaciones de StreamPack cuando corresponda.
- Validar visualmente escritorio y móvil cuando existan medios; nunca declarar pruebas no realizadas.
- Documentar cambios, evidencias, riesgos residuales y rollback en la descripción del PR.

## Plantilla para cada PR
### Objetivo y alcance
### Estado inicial y dependencias
### Plan Elephant
### Hallazgos Goldfish y resolución
### Archivos modificados
### Pruebas ejecutadas (con resultados)
### Pruebas pendientes / riesgos
### Plan de reversión
### Aprobación para fusionar o desplegar
