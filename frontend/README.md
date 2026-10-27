# Level-Up Gamer — Frontend (React)

Aplicación React de la tienda Level-Up Gamer. La descripción completa del proyecto está en el [README principal](../README.md).

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm install` | Instala las dependencias |
| `npm run dev` | Abre la tienda en modo desarrollo (http://localhost:5173) |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm test` | Corre las pruebas de Jasmine con Karma y genera la cobertura en `coverage-karma/` |
| `npm run test:chrome` | Corre las pruebas en Chrome con ventana y las repite al guardar cambios |
| `npm run test:vitest` | Corre las pruebas complementarias de Vitest |
| `npm run lint` | Revisa el código con oxlint |

## Pruebas

- Archivos de prueba: `tests-karma/*.spec.jsx` (Jasmine).
- Configuración: `karma.conf.cjs`.
- Instrumentación para la cobertura: `tests-karma/support/coverage-loader.cjs`.
