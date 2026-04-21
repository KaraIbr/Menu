# Yuki Backend API Documentation

Base URL: `https://https://menu-ojc3.onrender.com/api`

---

## Autenticacion

### Login de Personal
```http
POST /auth/personal/login/
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

**Respuesta (200):**
```json
{
  "access": "eyJ0e...",
  "id": 1,
  "nombre": "string",
  "username": "string",
  "rol": "admin|barista|cocinero"
}
```

**Errores:**
- `401`: Credenciales invalidas

**Nota:** El token `access` es un JWT que expira en 120 minutos. Include en headers:
```
Authorization: Bearer eyJ0e...
```

---

## Menu (Publico)

### Obtener Menu Completo
```http
GET /menu/
```

**Respuesta (200):**
```json
{
  "categories": [
    {
      "id": 1,
      "nombre": "string",
      "descripcion": "string",
      "tipo": "comida|bebida",
      "products": [
        {
          "id": 1,
          "nombre": "string",
          "descripcion": "string",
          "precio_base": "50.00",
          "imagen": "/media/products/img.jpg",
          "activo": true,
          "disponible": true,
          "modifier_groups": [
            {
              "id": 1,
              "nombre": "string",
              "requerido": false,
              "min_select": 0,
              "max_select": 1,
              "modifiers": [
                {
                  "id": 1,
                  "nombre": "string",
                  "precio_extra": "10.00"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### Listar Categorias
```http
GET /menu/categories/
```

### Listar Productos
```http
GET /menu/products/
GET /menu/products/?category=1
GET /menu/products/?solo_disponibles=false
```

### Detalle Producto
```http
GET /menu/products/{id}/
```

---

## Pedidos

### Crear Pedido (Publico)
```http
POST /orders/
Content-Type: application/json

{
  "metodo_pago": "efectivo|tarjeta|qr",
  "notas": "string (opcional)",
  "items": [
    {
      "product": 1,
      "cantidad": 1,
      "notas": "string (opcional)",
      "selected_modifiers": [
        { "modifier": 1 }
      ]
    }
  ]
}
```

**Respuesta (201):**
```json
{
  "id": 1,
  "numero_orden": 1,
  "estado": "pendiente",
  "metodo_pago": "efectivo",
  "notas": "string",
  "total": "60.00",
  "created_at": "2024-01-01T00:00:00Z",
  "items": [
    {
      "id": 1,
      "product": { "id": 1, "nombre": "Cafe" },
      "product_name": "Cafe",
      "cantidad": 1,
      "notas": "string",
      "precio_unitario": "50.00",
      "subtotal": "60.00",
      "selected_modifiers": [
        { "id": 1, "modifier": 1, "nombre": "Leche extra", "precio_extra": "10.00" }
      ]
    }
  ]
}
```

**Validaciones:**
- Minimo 1 producto
- Producto debe estar activo y disponible
- Modificadores deben pertenecer al producto
- Grupo requerido: minimo `min_select` selections
- Grupo: maximo `max_select` selections

---

## Gestion de Pedidos (Requiere Auth)

### Listar Pedidos
```http
GET /orders/list
GET /orders/list?estado=pendiente
```

**Estados validos:** `pendiente`, `preparando`, `listo`, `entregado`, `cancelado`

**Headers:**
```
Authorization: Bearer <token>
```

### Ver Pedido
```http
GET /orders/{id}/
```

### Actualizar Estado
```http
PATCH /orders/{id}/estado/
Content-Type: application/json

{ "estado": "preparando" }
```

**Transiciones permitidas:**
```
pendiente    -> preparando, cancelado
preparando  -> listo, cancelado
listo       -> entregado, cancelado
entregado   -> (ninguna)
cancelado   -> (ninguna)
```

---

## Administracion (Requiere Auth + rol=admin)

### Personal

#### Listar/Crear
```http
GET  /admin/personal/
POST /admin/personal/
```

**POST body:**
```json
{
  "nombre": "string",
  "username": "string",
  "password": "string (min 4 chars)",
  "rol": "admin|barista|cocinero",
  "activo": true
}
```

#### Ver/Editar/Eliminar
```http
GET    /admin/personal/{id}/
PUT    /admin/personal/{id}/
PATCH /admin/personal/{id}/
DELETE /admin/personal/{id}/
```

### Categorias

#### Listar/Crear
```http
GET  /admin/categories/
POST /admin/categories/
```

**POST body:**
```json
{
  "nombre": "string",
  "descripcion": "string (opcional)",
  "tipo": "comida|bebida",
  "orden": 0,
  "activo": true
}
```

#### Ver/Editar/Eliminar
```http
GET    /admin/categories/{id}/
PUT    /admin/categories/{id}/
PATCH /admin/categories/{id}/
DELETE /admin/categories/{id}/
```

### Productos

#### Listar/Crear
```http
GET  /admin/products/
POST /admin/products/
GET  /admin/products/?rol=barista
GET  /admin/products/?rol=cocinero
GET  /admin/products/?category=1
```

**POST body:**
```json
{
  "category": 1,
  "nombre": "string",
  "descripcion": "string (opcional)",
  "precio_base": "50.00",
  "imagen": "file (opcional)",
  "activo": true,
  "disponible": true,
  "destacado": false
}
```

#### Ver/Editar/Eliminar
```http
GET    /admin/products/{id}/
PUT    /admin/products/{id}/
PATCH /admin/products/{id}/
DELETE /admin/products/{id}/
```

### Grupos de Modificadores

#### Listar/Crear
```http
GET  /admin/modifier-groups/
POST /admin/modifier-groups/
```

**POST body:**
```json
{
  "product": 1,
  "nombre": "string",
  "requerido": false,
  "min_select": 0,
  "max_select": 1,
  "activo": true
}
```

#### Ver/Editar/Eliminar
```http
GET    /admin/modifier-groups/{id}/
PUT    /admin/modifier-groups/{id}/
PATCH /admin/modifier-groups/{id}/
DELETE /admin/modifier-groups/{id}/
```

### Modificadores

#### Listar/Crear
```http
GET  /admin/modifiers/
POST /admin/modifiers/
```

**POST body:**
```json
{
  "group": 1,
  "nombre": "string",
  "precio_extra": "10.00",
  "activo": true
}
```

#### Ver/Editar/Eliminar
```http
GET    /admin/modifiers/{id}/
PUT    /admin/modifiers/{id}/
PATCH /admin/modifiers/{id}/
DELETE /admin/modifiers/{id}/
```

---

## Modelos

### Category
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | int | PK |
| nombre | string | Nombre de categoria |
| descripcion | text | Descripcion opcional |
| tipo | choice | `comida`, `bebida` |
| orden | int | Orden de exhibicion |
| activo | bool | Visibilidad |
| created_at | datetime | Auto |
| updated_at | datetime | Auto |

### Product
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | int | PK |
| category | FK | Categoria |
| nombre | string | Nombre del producto |
| descripcion | text | Descripcion opcional |
| precio_base | decimal | Precio base |
| imagen | image | Imagen opcional |
| activo | bool | Visibilidad en menu |
| disponible | bool | Disponibilidad para venta |
| destacado | bool | Producto destacado |

### ModifierGroup
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | int | PK |
| product | FK | Producto |
| nombre | string | Nombre del grupo |
| requerido | bool | Seleccion obligatoria |
| min_select | int | Minimo selections |
| max_select | int | Maximo selections |

### Modifier
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | int | PK |
| group | FK | Grupo |
| nombre | string | Nombre |
| precio_extra | decimal | Precio adicional |

### Order
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | int | PK |
| numero_orden | int | Numero secuencial unico |
| estado | choice | `pendiente`, `preparando`, `listo`, `entregado`, `cancelado` |
| metodo_pago | choice | `efectivo`, `tarjeta`, `qr` |
| notas | text | Notas del cliente |
| total | decimal | Total calculado |
| created_at | datetime | Fecha de creacion |

### OrderItem
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | int | PK |
| order | FK | Orden |
| product | FK | Producto (opcional, puede ser null) |
| product_name | string | Nombre congelado |
| cantidad | int | Cantidad |
| notas | text | Notas del item |
| precio_unitario | decimal | Precio con modificadores |
| subtotal | decimal | precio_unitario * cantidad |

### OrderItemModifier
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | int | PK |
| order_item | FK | Item de orden |
| modifier | FK | Modificador (opcional) |
| nombre | string | Nombre congelado |
| precio_extra | decimal | Precio congelado |

### Personal
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | int | PK |
| nombre | string | Nombre completo |
| username | string | Usuario unico |
| password | string | Hasheado |
| rol | choice | `admin`, `barista`, `cocinero` |
| activo | bool | Estado |
| created_at | datetime | Auto |
| updated_at | datetime | Auto |

---

## Roles

| Rol | Permisos |
|----|----------|
| admin | CRUD en /admin/* + ver/modificar ordenes |
| barista | Ver ordenes tipo `bebida`, cambiar estado |
| cocinero | Ver ordenes tipo `comida`, cambiar estado |