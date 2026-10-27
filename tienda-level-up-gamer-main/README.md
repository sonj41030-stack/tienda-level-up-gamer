# Level-Up Gamer — Tienda online

Tienda online de productos gamer (consolas, accesorios, juegos de mesa, ropa y servicio técnico) desarrollada para la asignatura **DSY1104 Desarrollo Fullstack II** (Duoc UC).

La plantilla original en HTML, CSS y JavaScript se migró a una aplicación **React** con **React Bootstrap**, navegación con **React Router** y **pruebas unitarias con Jasmine y Karma**.

## Estructura del repositorio

```
├── frontend/          Aplicación React (la versión actual del proyecto)
├── html/ css/ js/     Plantilla original en HTML, CSS y JavaScript (referencia)
├── images/            Imágenes de la plantilla original
└── index.html         Página de inicio de la plantilla original
```

## Tecnologías

| Área | Herramientas |
| --- | --- |
| Frontend | React 19, React Router 7, React Bootstrap 2 y Bootstrap 5, Vite |
| Pruebas | Jasmine, Karma, Testing Library, istanbul + karma-coverage |
| Datos | `localStorage` del navegador y la API pública [mindicador.cl](https://mindicador.cl) (dólar y euro) |

## Cómo ejecutar

Requisitos: [Node.js](https://nodejs.org) 22 o superior y Google Chrome (para las pruebas).

```bash
cd frontend
npm install
npm run dev        # abre la tienda en http://localhost:5173
```

Para generar la versión de producción: `npm run build` (queda en `frontend/dist/`).

## Pruebas unitarias (Jasmine + Karma)

```bash
cd frontend
npm test               # corre las 125 pruebas en Chrome sin ventana y muestra la cobertura
npm run test:chrome    # abre Chrome y vuelve a correr las pruebas al guardar cambios
```

- Las pruebas están en `frontend/tests-karma/` y la configuración en `frontend/karma.conf.cjs`.
- El reporte de cobertura queda en `frontend/coverage-karma/index.html`.
- Cobertura actual: **100%** de sentencias, ramas, funciones y líneas. Karma marca la ejecución como fallida si baja del 80%.
- El proyecto conserva además pruebas anteriores con Vitest: `npm run test:vitest`.

## Funcionalidades

| Ruta | Página | Qué permite |
| --- | --- | --- |
| `/` | Inicio | Portada y 4 productos destacados |
| `/productos` | Productos | Catálogo con búsqueda por nombre y orden por precio |
| `/carrito` | Carrito | Cambiar cantidades, eliminar, vaciar y finalizar la compra (con descuento por nivel) |
| `/registro` | Registro | RUN con dígito verificador, región y comuna, y código de referido |
| `/login` | Iniciar sesión | Ingreso con correo y contraseña |
| `/perfil` | Mi perfil | Nivel LevelUp, puntos, código de referido y canje de puntos (requiere sesión) |
| `/nosotros` | Nosotros | Historia, misión, visión, valores y equipo |
| `/blogs` | Blogs | Artículos con lectura en ventana modal |
| `/contacto` | Contacto | Formulario de contacto con validación |
| `/admin` | Panel de administración | Resumen, productos, órdenes, usuarios y mensajes (solo administradores) |

**Sistema LevelUp:** al registrarse con el código de un amigo, quien invita gana 500 puntos y el nuevo usuario 200. Con 1.000 puntos el usuario es *Pro Gamer* (5% de descuento) y con 3.000 es *Leyenda* (10%). En el perfil se pueden canjear 500 puntos por un cupón de $5.000.

**Administrador:** para entrar al panel, registra una cuenta con el correo `admin@duoc.cl` e inicia sesión con ella.

## Estructura de `frontend/src`

```
src/
├── App.jsx              Rutas de la aplicación
├── main.jsx             Punto de entrada (Router + CarritoProvider)
├── components/          Header, Footer, ProductCard, BlogCard y tablas del panel admin
├── context/             CarritoContext: estado global del carrito
├── hooks/               useLocalStorage: estado que se guarda en localStorage
├── pages/               Una página por ruta
├── utils/               Lógica pura: niveles, validaciones (RUN), sesión y órdenes
└── data/                Productos, artículos del blog, regiones y comunas
```

## Datos guardados en el navegador

| Clave de `localStorage` | Contenido |
| --- | --- |
| `carrito` | Productos del carrito y sus cantidades |
| `lug_users` | Usuarios registrados (con puntos y código de referido) |
| `lug_current_user` | Sesión iniciada |
| `lug_orders` | Órdenes de compra |
| `lug_mensajes` | Mensajes del formulario de contacto |

## Integrantes

- *Completar con los nombres del equipo*
