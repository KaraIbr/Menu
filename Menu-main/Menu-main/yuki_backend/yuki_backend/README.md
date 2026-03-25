# Yuki Backend

API REST para el sistema de kiosk POS Yuki.

## Setup rápido

```bash
# 1. Entorno virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 2. Dependencias
pip install -r requirements.txt

# 3. Variables de entorno
cp .env.example .env
# Edita .env con tus credenciales de PostgreSQL

# 4. Base de datos (PostgreSQL debe estar corriendo)
createdb yuki_db  # o desde psql: CREATE DATABASE yuki_db;

# 5. Migraciones
python manage.py makemigrations
python manage.py migrate

# 6. Superusuario para el admin
python manage.py createsuperuser

# 7. Servidor
python manage.py runserver 0.0.0.0:8000
```

## URLs principales

| URL | Descripción |
|-----|-------------|
| http://localhost:8000/admin/ | Panel de administración Django |
| http://localhost:8000/api/menu/ | Menú completo |
| http://localhost:8000/api/orders/ | Crear orden (POST) |
| http://localhost:8000/api/auth/token/ | Login JWT |

## Estructura del proyecto

```
yuki_backend/
├── apps/
│   ├── menu/       # Category, Product, ModifierGroup, Modifier
│   └── orders/     # Order, OrderItem, OrderItemModifier
├── yuki_backend/   # settings, urls, wsgi
├── media/          # imágenes subidas
├── manage.py
├── requirements.txt
└── .env
```
