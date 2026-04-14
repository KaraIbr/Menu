# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Backend (Django + DRF)

The folder `backend/` now contains a Django REST API that powers the kiosk and barista flows used by the frontend.

### Instalacion rapida

1. Crear entorno: `python -m venv .venv && .venv\Scripts\activate` (Windows).
2. Instalar deps: `pip install -r backend/requirements.txt`.
3. Migrar BD: `python backend/manage.py makemigrations api && python backend/manage.py migrate`.
4. (Opcional) Cargar datos demo y usuario barista: `python backend/manage.py seed_demo` (crea usuario `barista` / `Barista123!`).
5. Ejecutar: `python backend/manage.py runserver 0.0.0.0:8000`.

### Endpoints claves (prefijo /api)
- `GET  /api/menu/` -> categorias + productos con modificadores (solo lectura).
- `GET  /api/menu/categories/`, `GET /api/menu/products/`, `GET /api/menu/products/<id>/` -> vistas publicas solo lectura.
- `POST /api/orders/` -> crea pedido sin autenticacion.
- `GET  /api/orders/list` -> lista de pedidos (requiere JWT).
- `GET  /api/orders/<id>/` -> detalle (JWT).
- `PATCH /api/orders/<id>/estado/` -> cambio de estado con transiciones controladas (JWT).
- `POST /api/auth/token/` y `/api/auth/token/refresh/` -> JWT (SimpleJWT).

### Notas
- Base de datos por defecto: SQLite en `backend/db.sqlite3`.
- CORS abierto y `APPEND_SLASH=False` para coincidir con las rutas del frontend.
- Modelos incluyen `__str__` y validacion de modificadores y grupos requeridos al crear un pedido.
