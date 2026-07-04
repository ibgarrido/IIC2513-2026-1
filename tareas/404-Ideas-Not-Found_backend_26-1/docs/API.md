# API Reference

Esta API se puede probar con Postman. Configurá la variable de entorno `{{baseUrl}}` según el entorno que uses:

| Entorno | Valor |
|---------|-------|
| Local   | `http://localhost:3000` |
| Remoto  | `https://four04-ideas-not-found-backend-26-1.onrender.com` |

Ver [Postman.md](Postman.md) para instrucciones de configuración del entorno y autenticación.

Todos los request bodies y responses usan `Content-Type: application/json`.  
Las rutas autenticadas requieren el header: `Authorization: Bearer <token>`

---

## Índice

- [Auth](#auth)
  - [Register](#register)
  - [Login](#login)
- [Catalog](#catalog)
  - [List / search products](#list--search-products)
  - [Get single product](#get-single-product)
- [Categoria](#categoria)
  - [List categories](#list-categories)
  - [Create category](#create-category)
  - [Update category](#update-category)
  - [Delete category](#delete-category)
- [Cart](#cart)
  - [Get cart](#get-cart)
  - [Add item to cart](#add-item-to-cart)
  - [Update item quantity](#update-item-quantity)
  - [Remove item from cart](#remove-item-from-cart)
- [User](#user)
  - [Get current user profile](#get-current-user-profile)
  - [Update profile & address](#update-profile--address)
  - [Delete account](#delete-account)
  - [Get user by ID (admin only)](#get-user-by-id-admin-only)
- [Order](#order)
  - [Get orders](#get-orders)
  - [Create order](#create-order)
- [Admin](#admin)
  - [Categorias](#categorias)
    - [Create category](#create-category-1)
    - [Update category](#update-category-1)
    - [Delete category](#delete-category-1)
  - [Products](#products)
    - [List all products (including inactive)](#list-all-products-including-inactive)
    - [Create product (with variantes)](#create-product-with-variantes)
    - [Update product](#update-product)
    - [Deactivate product](#deactivate-product)
    - [List variantes of a product](#list-variantes-of-a-product)
    - [Add variante to existing product](#add-variante-to-existing-product)
  - [Variantes](#variantes)
    - [Update variante](#update-variante)
    - [Delete variante](#delete-variante)
  - [Users (admin)](#users-admin)
    - [List all users](#list-all-users)
  - [Orders (admin)](#orders-admin)
    - [List all orders](#list-all-orders)
    - [Get single order](#get-single-order)
    - [Update order status](#update-order-status)

---

## Auth

### Register
`POST {{baseUrl}}/auth/register`

**Body**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@correo.com",
  "password": "contrasena"
}
```

**Response `201`**
```json
{
  "message": "User created successfully",
  "token": "<jwt>",
  "user": {
    "id": "uuid",
    "nombre": "Juan Pérez",
    "cartId": "uuid"
  }
}
```

**Errors**
| Status | Reason |
|--------|--------|
| `400` | Missing `nombre`, `email`, or `password` |
| `409` | Username or email already taken |

> El email se almacena en mayúsculas (`JUAN@CORREO.COM`). Al hacer login podés enviarlo en cualquier capitalización.

---

### Login
`POST {{baseUrl}}/auth/login`

**Body**
```json
{
  "email": "admin@tienda.com",
  "password": "admin123"
}
```

**Response `200`**
```json
{
  "message": "Login OK",
  "token": "<jwt>",
  "user": {
    "nombre": "Juan Pérez",
    "carrito": "uuid"
  }
}
```

**Errors**
| Status | Reason |
|--------|--------|
| `400` | Missing `email` or `password` |
| `401` | User not found or wrong password |

> El JWT expira en 1 hora. Guardalo y adjuntalo a cada request protegido.  
> El email se normaliza a mayúsculas internamente — podés enviarlo en cualquier capitalización.

---

## Catalog

### List / search products
`GET {{baseUrl}}/catalog`

| Query param | Required | Description |
|-------------|----------|-------------|
| `search` | No | Búsqueda case-insensitive en el nombre del producto. Omitir para traer todos. |
| `categoriaId` | No | UUID de la categoría. Filtra productos de esa categoría únicamente. |
| `precioMin` | No | Precio mínimo efectivo (`precioBase + extraPrice`). Requiere `precioMax`. |
| `precioMax` | No | Precio máximo efectivo (`precioBase + extraPrice`). Requiere `precioMin`. |
| `page` | No | Número de página (default: 1) |
| `limit` | No | Resultados por página (default: 10) |

> El filtro de precio considera el precio efectivo de cada variante (`precioBase + extraPrice`). Se retornan productos donde **al menos una variante** caiga en el rango. Si solo se envía uno de los dos (`precioMin`/`precioMax`), el filtro de precio no se aplica.

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "nombre": "Nike Air Max",
      "descripcion": "Zapatillas deportivas Nike",
      "precioBase": 89990,
      "image_url": "https://placehold.co/400x400?text=Nike",
      "activo": true,
      "variantes": [
        {
          "id": "uuid",
          "talla": "42",
          "color": "Negro",
          "extraPrice": 2310
        }
      ],
      "categoria": {
        "nombre": "Zapatillas",
        "descripcion": "Calzado deportivo y casual"
      }
    }
  ]
}
```

**Field notes**
- `precioBase` — precio base en CLP (entero, sin decimales)
- `extraPrice` — monto a sumar al `precioBase` para esa variante
- `activo` — si es `false`, el producto no debe mostrarse al cliente
- `variantes[].id` — usá este UUID para agregar el ítem al carrito

**Errors**
| Status | Reason |
|--------|--------|
| `400` | `page` supera el total de páginas disponibles |

---

### Get single product
`GET {{baseUrl}}/catalog/:id`

**Response `200`**
```json
{
  "data": {
    "id": "uuid",
    "nombre": "Nike Air Max",
    "descripcion": "Zapatillas deportivas Nike",
    "precioBase": 89990,
    "image_url": "https://placehold.co/400x400?text=Nike",
    "activo": true,
    "variantes": [
      {
        "id": "uuid",
        "talla": "42",
        "color": "Negro",
        "extraPrice": 2310
      }
    ],
    "categoria": {
      "nombre": "Zapatillas",
      "descripcion": "Calzado deportivo y casual"
    }
  }
}
```

**Errors**
| Status | Reason |
|--------|--------|
| `404` | Product not found |

---

## Categoria

### List categories
`GET {{baseUrl}}/categoria`

Retorna todas las categorías con la cantidad de productos activos que tienen al menos una variante asociada.

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "nombre": "Zapatillas",
      "descripcion": "Calzado deportivo y casual",
      "totalProductos": "5"
    },
    {
      "id": "uuid",
      "nombre": "Ropa",
      "descripcion": "Prendas de vestir",
      "totalProductos": "8"
    }
  ]
}
```

**Field notes**
- `totalProductos` — cantidad de productos con `activo: true` que tienen al menos una variante en esa categoría. Útil para mostrar badges o deshabilitar categorías vacías.

---

## Cart

Todas las rutas de carrito requieren autenticación (`Authorization: Bearer <token>`).

### Get cart
`GET {{baseUrl}}/cart`

**Response `200`**
```json
{
  "data": {
    "id": "uuid",
    "cartItems": [
      {
        "id": "uuid",
        "quantity": 2,
        "variante": {
          "id": "uuid",
          "talla": "42",
          "color": "Negro",
          "extraPrice": 2310,
          "stock": 30,
          "productId": "uuid"
        }
      }
    ]
  }
}
```

**Errors**
| Status | Reason |
|--------|--------|
| `401` | Missing or invalid token |
| `404` | Cart not found |

---

### Add item to cart
`POST {{baseUrl}}/cart`

Si la variante ya está en el carrito, se incrementa la cantidad en lugar de crear una fila duplicada.

**Body**
```json
{
  "varianteId": "uuid",
  "quantity": 1
}
```

**Response `201`**
```json
{
  "data": {
    "id": "uuid",
    "cartId": "uuid",
    "varianteId": "uuid",
    "quantity": 1
  }
}
```

**Errors**
| Status | Reason |
|--------|--------|
| `400` | Requested quantity exceeds available stock |
| `401` | Missing or invalid token |
| `404` | Variante not found |

---

### Update item quantity
`PATCH {{baseUrl}}/cart/:cartItemId`

Reemplaza la cantidad del ítem por el valor dado (no suma, reemplaza).

**Body**
```json
{
  "quantity": 3
}
```

**Response `200`**
```json
{
  "data": {
    "id": "uuid",
    "cartId": "uuid",
    "varianteId": "uuid",
    "quantity": 3
  }
}
```

**Errors**
| Status | Reason |
|--------|--------|
| `400` | Requested quantity exceeds available stock |
| `401` | Missing or invalid token |
| `404` | Item not found in user's cart |

---

### Remove item from cart
`DELETE {{baseUrl}}/cart/:cartItemId`

**Response `200`**
```json
{
  "message": "Item eliminado del carrito."
}
```

**Errors**
| Status | Reason |
|--------|--------|
| `401` | Missing or invalid token |
| `404` | Item not found in user's cart |

---

## User

### Get current user profile
`GET {{baseUrl}}/user/me` *(requiere auth)*

**Response `200`**
```json
{
  "data": {
    "id": "uuid",
    "nombre": "Juan Pérez",
    "email": "juan@correo.com",
    "rol": "client",
    "userDirection": {
      "calle": "Av. Providencia",
      "numero": 1234,
      "ciudad": "Santiago",
      "comuna": "Providencia",
      "region": "Metropolitana",
      "codigoPostal": 7500000
    }
  }
}
```

> `userDirection` puede ser `null` si el usuario no ha guardado una dirección aún.

**Errors**
| Status | Reason |
|--------|--------|
| `401` | Missing or invalid token |
| `404` | User not found |

---

### Update profile & address
`PATCH {{baseUrl}}/user/me/data` *(requiere auth)*

Todos los campos son opcionales. Para cambiar la contraseña se deben enviar `password` y `oldPassword` juntos. Si el usuario no tiene dirección guardada, se crea; si ya tiene, se actualiza.

**Body**
```json
{
  "email": "nuevo@correo.com",
  "password": "nuevaContrasena",
  "oldPassword": "contrasenaActual",
  "calle": "Av. Providencia",
  "numero": 1234,
  "ciudad": "Santiago",
  "comuna": "Providencia",
  "region": "Metropolitana",
  "codigoPostal": 7500000
}
```

**Response `200`**
```json
{
  "data": {
    "id": "uuid",
    "nombre": "Juan Pérez",
    "email": "nuevo@correo.com",
    "userDirection": {
      "calle": "Av. Providencia",
      "numero": 1234,
      "ciudad": "Santiago",
      "comuna": "Providencia",
      "region": "Metropolitana",
      "codigoPostal": 7500000
    }
  },
  "updatedPass": true
}
```

**Errors**
| Status | Reason |
|--------|--------|
| `401` | Missing or invalid token, or incorrect `oldPassword` |
| `404` | User not found |

---

### Delete account
`DELETE {{baseUrl}}/user/me/:userId` *(requiere auth)*

Los usuarios normales solo pueden eliminar su propia cuenta. Los administradores pueden eliminar cualquier cuenta. Siempre se requiere la contraseña como confirmación.

**Body**
```json
{
  "password": "contrasena"
}
```

**Response `200`**
```json
{
  "message": "Perfil eliminado"
}
```

**Errors**
| Status | Reason |
|--------|--------|
| `401` | Missing or invalid token, or wrong password |
| `403` | Non-admin attempting to delete another user's account |
| `404` | User not found |

---

### Get user by ID (admin only)
`GET {{baseUrl}}/user/:userId` *(requiere auth + rol admin)*

Retorna el perfil completo del usuario junto a su historial de órdenes.

**Response `200`**
```json
{
  "data": {
    "id": "uuid",
    "nombre": "Juan Pérez",
    "email": "juan@correo.com",
    "rol": "client",
    "userDirection": {
      "calle": "Av. Providencia",
      "numero": 1234,
      "ciudad": "Santiago",
      "comuna": "Providencia",
      "region": "Metropolitana",
      "codigoPostal": 7500000
    },
    "userOrders": [
      {
        "id": "uuid",
        "total": 92300,
        "statuses": [
          {
            "status": "procesando",
            "fecha": "2024-01-15T10:30:00.000Z"
          }
        ]
      }
    ]
  }
}
```

**Errors**
| Status | Reason |
|--------|--------|
| `401` | Missing or invalid token |
| `403` | User is not admin |
| `404` | User not found |

---

## Order

Todas las rutas de orden requieren autenticación (`Authorization: Bearer <token>`).

### Get orders
`GET {{baseUrl}}/order`

Retorna todas las órdenes del usuario autenticado con ítems, historial de estados y dirección de entrega.

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "total": 92300,
      "orderItems": [
        {
          "id": "uuid",
          "cantidad": 1,
          "unitPrice": 92300,
          "productName": "Nike Air Max",
          "varianteTalla": "42",
          "varianteColor": "Negro",
          "variante": {
            "id": "uuid",
            "talla": "42",
            "color": "Negro",
            "extraPrice": 2310,
            "product": {
              "id": "uuid",
              "nombre": "Nike Air Max",
              "precioBase": 89990
            }
          }
        }
      ],
      "statuses": [
        {
          "id": "uuid",
          "status": "procesando",
          "descripcion": null,
          "fecha": "2024-01-15T10:30:00.000Z"
        }
      ],
      "user": {
        "id": "uuid",
        "nombre": "Juan Pérez",
        "email": "juan@correo.com",
        "rol": "client"
      },
      "direction": {
        "calle": "Av. Providencia",
        "numero": 1234,
        "ciudad": "Santiago",
        "comuna": "Providencia",
        "region": "Metropolitana",
        "codigoPostal": 7500000
      }
    }
  ]
}
```

**Errors**
| Status | Reason |
|--------|--------|
| `401` | Missing or invalid token |

---

### Create order
`POST {{baseUrl}}/order`

Crea una orden a partir del carrito del usuario. No requiere body — usa los datos del carrito y la dirección guardada en el perfil.

El proceso automáticamente:
- Valida que el usuario tenga una dirección guardada
- Valida que el carrito no esté vacío
- Verifica stock disponible para todos los ítems
- Calcula el precio unitario (`precioBase + extraPrice`) por ítem
- Crea la orden con estado inicial `"recibido"`
- Descuenta el stock de cada variante
- Vacía el carrito

> Antes de crear una orden asegurate de tener una dirección guardada vía `PATCH /user/me/data`.

**Response `201`**
```json
{
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "total": 92300,
    "orderItems": [
      {
        "id": "uuid",
        "cantidad": 1,
        "unitPrice": 92300,
        "productName": "Nike Air Max",
        "varianteTalla": "42",
        "varianteColor": "Negro"
      }
    ],
    "statuses": [
      {
        "id": "uuid",
        "status": "recibido",
        "descripcion": "Pedido ingresado con éxito",
        "fecha": "2024-01-15T10:30:00.000Z"
      }
    ],
    "user": {
      "id": "uuid",
      "nombre": "Juan Pérez",
      "email": "juan@correo.com",
      "rol": "client"
    },
    "direction": {
      "calle": "Av. Providencia",
      "numero": 1234,
      "ciudad": "Santiago",
      "comuna": "Providencia",
      "region": "Metropolitana",
      "codigoPostal": 7500000
    }
  }
}
```

**Errors**
| Status | Reason |
|--------|--------|
| `400` | Cart is empty |
| `400` | User has no saved address |
| `400` | Insufficient stock for one or more items |
| `401` | Missing or invalid token |

---

## Admin

Todas las rutas bajo `/admin` requieren autenticación con un usuario de rol `admin` (`Authorization: Bearer <token>`). Un token de cliente recibirá `403`.

---

### Categorias

#### Create category
`POST {{baseUrl}}/categoria` *(requiere auth + rol admin)*

**Body**
```json
{
  "nombre": "Zapatillas",
  "descripcion": "Calzado deportivo y casual"
}
```

**Response `201`**
```json
{
  "data": {
    "id": "uuid",
    "nombre": "Zapatillas",
    "descripcion": "Calzado deportivo y casual",
    "updatedAt": "...",
    "createdAt": "..."
  }
}
```

**Errors**
| Status | Reason |
|--------|--------|
| `400` | `nombre` faltante |
| `401` | Missing or invalid token |
| `403` | User is not admin |

---

#### Update category
`PATCH {{baseUrl}}/categoria/:categoriaId` *(requiere auth + rol admin)*

Todos los campos son opcionales — solo se actualizan los que se envíen.

**Body**
```json
{
  "nombre": "Nuevo nombre",
  "descripcion": "Nueva descripción"
}
```

**Response `200`** — retorna la categoría actualizada (mismo schema que create).

**Errors**
| Status | Reason |
|--------|--------|
| `401` | Missing or invalid token |
| `403` | User is not admin |
| `404` | Category not found |

---

#### Delete category
`DELETE {{baseUrl}}/categoria/:categoriaId` *(requiere auth + rol admin)*

No se puede eliminar una categoría que tenga productos activos asociados.

**Response `200`**
```json
{ "message": "Categoría eliminada" }
```

**Errors**
| Status | Reason |
|--------|--------|
| `401` | Missing or invalid token |
| `403` | User is not admin |
| `404` | Category not found |
| `409` | Category has active products — reassign or deactivate them first |

---

### Products

#### List all products (including inactive)
`GET {{baseUrl}}/admin/products` *(requiere auth + rol admin)*

A diferencia de `GET /catalog`, retorna todos los productos independientemente del campo `activo`.

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "nombre": "Nike Air Max",
      "descripcion": "Zapatillas deportivas Nike",
      "precioBase": 89990,
      "image_url": "https://...",
      "activo": false,
      "categoriaId": "uuid",
      "categoria": { "id": "uuid", "nombre": "Zapatillas" },
      "variantes": [
        {
          "id": "uuid",
          "talla": "42",
          "color": "Negro",
          "stock": 0,
          "extraPrice": 2310
        }
      ]
    }
  ]
}
```

---

#### Create product (with variantes)
`POST {{baseUrl}}/admin/products` *(requiere auth + rol admin)*

Crea el producto y sus variantes en una sola transacción. Se requiere al menos una variante.

**Body**
```json
{
  "nombre": "Nike Air Max",
  "descripcion": "Zapatillas deportivas Nike",
  "precioBase": 89990,
  "image_url": "https://...",
  "categoriaId": "uuid",
  "variantes": [
    {
      "talla": "42",
      "color": "Negro",
      "stock": 10,
      "extraPrice": 0
    },
    {
      "talla": "43",
      "color": "Blanco",
      "stock": 5,
      "extraPrice": 2000
    }
  ]
}
```

> `image_url` es opcional. `stock` y `extraPrice` tienen default `0` si se omiten.

**Response `201`**
```json
{
  "data": {
    "product": {
      "id": "uuid",
      "nombre": "Nike Air Max",
      "descripcion": "Zapatillas deportivas Nike",
      "precioBase": 89990,
      "image_url": "https://...",
      "activo": true,
      "categoriaId": "uuid"
    },
    "variantes": [
      { "id": "uuid", "productId": "uuid", "talla": "42", "color": "Negro", "stock": 10, "extraPrice": 0 },
      { "id": "uuid", "productId": "uuid", "talla": "43", "color": "Blanco", "stock": 5, "extraPrice": 2000 }
    ]
  }
}
```

**Errors**
| Status | Reason |
|--------|--------|
| `400` | `nombre`, `precioBase`, o `categoriaId` faltantes |
| `400` | `variantes` vacío o ausente |
| `401` | Missing or invalid token |
| `403` | User is not admin |
| `404` | `categoriaId` no existe |

---

#### Update product
`PATCH {{baseUrl}}/admin/products/:productId` *(requiere auth + rol admin)*

Todos los campos son opcionales. Para desactivar/reactivar un producto usá `activo: false/true`.

**Body**
```json
{
  "nombre": "Nuevo nombre",
  "descripcion": "Nueva descripción",
  "precioBase": 99990,
  "image_url": "https://...",
  "activo": true,
  "categoriaId": "uuid"
}
```

**Response `200`** — retorna el producto actualizado con su categoría y variantes (mismo schema que list).

**Errors**
| Status | Reason |
|--------|--------|
| `401` | Missing or invalid token |
| `403` | User is not admin |
| `404` | Product or new `categoriaId` not found |

---

#### Deactivate product
`DELETE {{baseUrl}}/admin/products/:productId` *(requiere auth + rol admin)*

Realiza un soft-delete: setea `activo: false`. El producto deja de aparecer en el catálogo público pero se conserva en el historial de órdenes.

**Response `200`**
```json
{ "message": "Producto desactivado" }
```

**Errors**
| Status | Reason |
|--------|--------|
| `401` | Missing or invalid token |
| `403` | User is not admin |
| `404` | Product not found |

---

### Variantes

#### List variantes of a product
`GET {{baseUrl}}/admin/products/:productId/variantes` *(requiere auth + rol admin)*

**Response `200`**
```json
{
  "data": [
    { "id": "uuid", "productId": "uuid", "talla": "42", "color": "Negro", "stock": 10, "extraPrice": 0 }
  ]
}
```

**Errors**
| Status | Reason |
|--------|--------|
| `401` | Missing or invalid token |
| `403` | User is not admin |
| `404` | Product not found |

---

#### Add variante to existing product
`POST {{baseUrl}}/admin/products/:productId/variantes` *(requiere auth + rol admin)*

**Body**
```json
{
  "talla": "44",
  "color": "Rojo",
  "stock": 8,
  "extraPrice": 1000
}
```

> `stock` y `extraPrice` tienen default `0` si se omiten.

**Response `201`**
```json
{
  "data": { "id": "uuid", "productId": "uuid", "talla": "44", "color": "Rojo", "stock": 8, "extraPrice": 1000 }
}
```

**Errors**
| Status | Reason |
|--------|--------|
| `401` | Missing or invalid token |
| `403` | User is not admin |
| `404` | Product not found |

---

#### Update variante
`PATCH {{baseUrl}}/admin/variantes/:varianteId` *(requiere auth + rol admin)*

Todos los campos son opcionales.

**Body**
```json
{
  "talla": "43",
  "color": "Azul",
  "stock": 15,
  "extraPrice": 500
}
```

**Response `200`** — retorna la variante actualizada.

**Errors**
| Status | Reason |
|--------|--------|
| `400` | `stock` negativo |
| `401` | Missing or invalid token |
| `403` | User is not admin |
| `404` | Variante not found |

---

#### Delete variante
`DELETE {{baseUrl}}/admin/variantes/:varianteId` *(requiere auth + rol admin)*

No se puede eliminar una variante que esté en carritos activos o que tenga órdenes asociadas.

**Response `200`**
```json
{ "message": "Variante eliminada" }
```

**Errors**
| Status | Reason |
|--------|--------|
| `401` | Missing or invalid token |
| `403` | User is not admin |
| `404` | Variante not found |
| `409` | Variante está en carritos activos u órdenes — no puede eliminarse |

---

### Users (admin)

#### List all users
`GET {{baseUrl}}/admin/users` *(requiere auth + rol admin)*

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "nombre": "Juan Pérez",
      "email": "JUAN@CORREO.COM",
      "rol": "client",
      "createdAt": "2024-01-10T08:00:00.000Z",
      "totalOrders": "3"
    }
  ]
}
```

**Errors**
| Status | Reason |
|--------|--------|
| `401` | Missing or invalid token |
| `403` | User is not admin |

---

### Orders (admin)

#### List all orders
`GET {{baseUrl}}/admin/orders` *(requiere auth + rol admin)*

Retorna todas las órdenes de todos los usuarios, ordenadas de más reciente a más antigua. Mismo schema de respuesta que `GET /order`.

**Errors**
| Status | Reason |
|--------|--------|
| `401` | Missing or invalid token |
| `403` | User is not admin |

---

#### Get single order
`GET {{baseUrl}}/admin/orders/:orderId` *(requiere auth + rol admin)*

Retorna el detalle completo de cualquier orden. Mismo schema de respuesta que una entrada de `GET /order`.

**Errors**
| Status | Reason |
|--------|--------|
| `401` | Missing or invalid token |
| `403` | User is not admin |
| `404` | Order not found |

---

#### Update order status
`PATCH {{baseUrl}}/admin/orders/:orderId` *(requiere auth + rol admin)*

Avanza el estado de una orden. Los estados deben seguir el flujo en orden — no se puede saltar hacia atrás ni repetir el estado actual.

**Flujo de estados (en orden):**
`recibido` → `confirmado` → `procesando` → `embalando` → `enviado` → `terminado`

**Body**
```json
{
  "status": "confirmado",
  "descripcion": "Pago verificado, orden confirmada"
}
```

> `descripcion` es opcional.

**Response `200`** — retorna la orden completa con el historial de estados actualizado (mismo schema que `GET /order`).

**Errors**
| Status | Reason |
|--------|--------|
| `400` | `status` faltante o valor inválido |
| `400` | El nuevo estado no es posterior al estado actual |
| `401` | Missing or invalid token |
| `403` | User is not admin |
| `404` | Order not found |
