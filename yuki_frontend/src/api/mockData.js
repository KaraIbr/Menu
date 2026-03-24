export const mockMenu = {
  tenant: { id: 1, nombre: 'Yuki', slug: 'yuki', color_primary: '#7F77DD' },
  categories: [
    {
      id: 1,
      nombre: 'Matcha',
      icono: 'leaf',
      orden: 1,
      products: [
        {
          id: 1,
          nombre: 'Matcha Latte',
          precio_base: '75.00',
          descripcion: 'Matcha ceremonial con leche oat y espuma',
          imagen: null,
          disponible: true,
          modifier_groups: [
            {
              id: 1,
              nombre: 'Tipo de leche',
              requerido: true,
              min_select: 1,
              max_select: 1,
              orden: 1,
              modifiers: [
                { id: 1, nombre: 'Oat milk', precio_extra: '0.00', activo: true },
                { id: 2, nombre: 'Entera', precio_extra: '0.00', activo: true },
                { id: 3, nombre: 'Almendra', precio_extra: '10.00', activo: true },
              ]
            },
            {
              id: 2,
              nombre: 'Temperatura',
              requerido: true,
              min_select: 1,
              max_select: 1,
              orden: 2,
              modifiers: [
                { id: 4, nombre: 'Caliente', precio_extra: '0.00', activo: true },
                { id: 5, nombre: 'Frío con hielo', precio_extra: '0.00', activo: true },
              ]
            },
            {
              id: 3,
              nombre: 'Extras',
              requerido: false,
              min_select: 0,
              max_select: 3,
              orden: 3,
              modifiers: [
                { id: 6, nombre: 'Shot extra', precio_extra: '15.00', activo: true },
                { id: 7, nombre: 'Colágeno', precio_extra: '20.00', activo: true },
                { id: 8, nombre: 'Boba', precio_extra: '18.00', activo: true },
              ]
            }
          ]
        },
        {
          id: 2,
          nombre: 'Matcha Frappé',
          precio_base: '90.00',
          descripcion: 'Frozen de matcha con crema oat',
          imagen: null,
          disponible: true,
          modifier_groups: []
        },
        {
          id: 3,
          nombre: 'Matcha Lemon',
          precio_base: '80.00',
          descripcion: 'Matcha frío con limón fresco',
          imagen: null,
          disponible: true,
          modifier_groups: []
        }
      ]
    },
    {
      id: 2,
      nombre: 'Café',
      icono: 'coffee',
      orden: 2,
      products: [
        {
          id: 4,
          nombre: 'Latte',
          precio_base: '65.00',
          descripcion: 'Espresso doble con leche vaporizada',
          imagen: null,
          disponible: true,
          modifier_groups: [
            {
              id: 4,
              nombre: 'Tipo de leche',
              requerido: true,
              min_select: 1,
              max_select: 1,
              orden: 1,
              modifiers: [
                { id: 9, nombre: 'Oat milk', precio_extra: '0.00', activo: true },
                { id: 10, nombre: 'Entera', precio_extra: '0.00', activo: true },
                { id: 11, nombre: 'Descremada', precio_extra: '0.00', activo: true },
              ]
            },
            {
              id: 5,
              nombre: 'Temperatura',
              requerido: true,
              min_select: 1,
              max_select: 1,
              orden: 2,
              modifiers: [
                { id: 12, nombre: 'Caliente', precio_extra: '0.00', activo: true },
                { id: 13, nombre: 'Frío', precio_extra: '0.00', activo: true },
              ]
            }
          ]
        },
        {
          id: 5,
          nombre: 'Americano',
          precio_base: '55.00',
          descripcion: 'Espresso doble con agua',
          imagen: null,
          disponible: true,
          modifier_groups: []
        },
        {
          id: 6,
          nombre: 'Cappuccino',
          precio_base: '70.00',
          descripcion: 'Espresso con leche y espuma',
          imagen: null,
          disponible: false,
          modifier_groups: []
        }
      ]
    },
    {
      id: 3,
      nombre: 'Bebidas Frías',
      icono: 'cup-soda',
      orden: 3,
      products: [
        {
          id: 7,
          nombre: 'Limonada Rosa',
          precio_base: '60.00',
          descripcion: 'Limonada casera con un toque de jamaica',
          imagen: null,
          disponible: true,
          modifier_groups: []
        },
        {
          id: 8,
          nombre: 'Horchata',
          precio_base: '55.00',
          descripcion: 'Horchata de arroz con canela',
          imagen: null,
          disponible: true,
          modifier_groups: []
        },
        {
          id: 9,
          nombre: 'Agua de Tamarindo',
          precio_base: '50.00',
          descripcion: 'Agua fresca de tamarindo',
          imagen: null,
          disponible: true,
          modifier_groups: []
        }
      ]
    },
    {
      id: 4,
      nombre: 'Snacks',
      icono: 'cookie',
      orden: 4,
      products: [
        {
          id: 10,
          nombre: 'Cookie de Chispas',
          precio_base: '45.00',
          descripcion: 'Galleta suave con chispas de chocolate',
          imagen: null,
          disponible: true,
          modifier_groups: []
        },
        {
          id: 11,
          nombre: 'Brownie',
          precio_base: '55.00',
          descripcion: 'Brownie de chocolate amargo',
          imagen: null,
          disponible: true,
          modifier_groups: []
        },
        {
          id: 12,
          nombre: 'Croissant',
          precio_base: '50.00',
          descripcion: 'Croissant hojaldrado',
          imagen: null,
          disponible: true,
          modifier_groups: []
        }
      ]
    }
  ]
};

export const mockOrders = [
  {
    id: 1,
    numero_orden: '001',
    estado: 'pendiente',
    tenant: 1,
    metodo_pago: 'tarjeta',
    notas: 'Sin hielo',
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    items: [
      {
        id: 1,
        product: { id: 1, nombre: 'Matcha Latte' },
        cantidad: 2,
        notas: '',
        selected_modifiers: [
          { modifier: { id: 1, nombre: 'Oat milk' }, precio_extra: '0.00' },
          { modifier: { id: 4, nombre: 'Caliente' }, precio_extra: '0.00' }
        ]
      }
    ],
    total: '150.00'
  },
  {
    id: 2,
    numero_orden: '002',
    estado: 'preparando',
    tenant: 1,
    metodo_pago: 'efectivo',
    notas: '',
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    items: [
      {
        id: 2,
        product: { id: 4, nombre: 'Latte' },
        cantidad: 1,
        notas: '',
        selected_modifiers: [
          { modifier: { id: 9, nombre: 'Oat milk' }, precio_extra: '0.00' },
          { modifier: { id: 12, nombre: 'Caliente' }, precio_extra: '0.00' }
        ]
      }
    ],
    total: '65.00'
  },
  {
    id: 3,
    numero_orden: '003',
    estado: 'listo',
    tenant: 1,
    metodo_pago: 'qr',
    notas: 'Para llevar',
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    items: [
      {
        id: 3,
        product: { id: 2, nombre: 'Matcha Frappé' },
        cantidad: 1,
        notas: '',
        selected_modifiers: []
      }
    ],
    total: '90.00'
  }
];
