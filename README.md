# YUKI — Kiosk POS (Menu + Orders)

YUKI is a kiosk-style Point of Sale system designed for beverage shops (matcha bars, coffee shops, etc.). Customers can place customized orders from a touchscreen kiosk, while staff manage active orders from an internal panel. The menu and configuration are maintained through Django Admin.

## Key Features

### Kiosk (Customer)
- Browse categories and products
- Customize products with modifier groups (e.g., milk type, extras, toppings)
- Add notes per item and per order
- Place an order and receive an order number

### Barista Panel (Internal)
- Authenticate via JWT
- View active orders (filter by status)
- Update order status (e.g., pending → preparing → ready → delivered)

### Admin (Backoffice)
- Full catalog management via Django Admin
- Search, filters, and relevant fields configured for fast operation
- Menu models are administered internally, while the public API remains read-only

## Tech Stack

Backend
- Django
- Django REST Framework (DRF)
- JWT Auth (SimpleJWT)
- CORS support (django-cors-headers)

Frontend
- React + Vite
- Tailwind CSS
- Axios
- Zustand

Database
- SQLite (local development)
- PostgreSQL (recommended for production / deployment)

## Repository Structure

> Note: paths may vary slightly by branch. The backend is currently located under `yuki_backend/yuki_backend/` in the `Backend` branch.

- `yuki_backend/yuki_backend/` — Django backend (DRF + Admin)
- (Frontend directory) — React app (kiosk + barista)

## User Flows (High Level)

1. Kiosk loads the full menu
- `GET /api/menu/`

2. Customer selects products and modifiers, then places an order
- `POST /api/orders/`

3. Barista logs in to manage orders
- `POST /api/auth/token/`

4. Barista views and updates orders
- `GET /api/orders/` (JWT required)
- `PATCH /api/orders/{id}/estado/` (JWT required)

## API Overview

### Public (No Auth)

Menu (read-only)
- `GET /api/menu/`
- `GET /api/menu/categories/`
- `GET /api/menu/products/`
- `GET /api/menu/products/{id}/`

Orders
- `POST /api/orders/` — create new order from kiosk

### Internal (JWT Required)

- `GET /api/orders/` — list orders (supports `?estado=pendiente`)
- `GET /api/orders/{id}/` — order detail
- `PATCH /api/orders/{id}/estado/` — update order status

Auth
- `POST /api/auth/token/`
- `POST /api/auth/token/refresh/`

## Method Restriction (GET-only) — Important

Catalog endpoints are intentionally exposed as **read-only**.  
If you try to create or modify catalog data through the public API you should receive:

- `POST /api/menu/products/` → `405 Method Not Allowed`

Catalog changes must be done through Django Admin.

## Backend Setup (Local)

### Requirements
- Python 3.11+
- (Optional) PostgreSQL for production-like environments

### 1) Create and activate a virtual environment
```bash
cd yuki_backend/yuki_backend
python -m venv venv
# macOS/Linux
source venv/bin/activate
# Windows (PowerShell)
venv\Scripts\Activate.ps1
```

### 2) Install dependencies
```bash
pip install -r requirements.txt
```

### 3) Environment variables
Create a `.env` file next to `manage.py` (you can copy `.env.example`):

```bash
cp .env.example .env
```

### 4) Run migrations
```bash
python manage.py migrate
```

### 5) Create admin user
```bash
python manage.py createsuperuser
```

### 6) Start server
```bash
python manage.py runserver 0.0.0.0:8000
```

### URLs
- Admin: `http://localhost:8000/admin/`
- API root: `http://localhost:8000/api/`
- Menu: `http://localhost:8000/api/menu/`

## Quick API Tests (cURL)

### 1) Menu (public)
```bash
curl -s http://localhost:8000/api/menu/ | head
```

### 2) Confirm GET-only behavior
```bash
curl -i -X POST http://localhost:8000/api/menu/products/ -H "Content-Type: application/json" -d "{}"
# Expected: HTTP/1.1 405 Method Not Allowed
```

### 3) Obtain JWT token (barista)
```bash
curl -s -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"YOUR_USER","password":"YOUR_PASSWORD"}'
```

### 4) List orders (JWT required)
```bash
ACCESS="PASTE_ACCESS_TOKEN_HERE"
curl -s http://localhost:8000/api/orders/ \
  -H "Authorization: Bearer $ACCESS"
```

## Database Notes (SQLite → PostgreSQL)

SQLite is used for fast local development.  
When moving to PostgreSQL you will need to update:

- `DATABASES` in Django settings
- Environment variables:
  - `DB_NAME`
  - `DB_USER`
  - `DB_PASSWORD`
  - `DB_HOST`
  - `DB_PORT`
  - `DB_SSLMODE=require` (commonly required in managed DB providers)

Then run:
```bash
python manage
