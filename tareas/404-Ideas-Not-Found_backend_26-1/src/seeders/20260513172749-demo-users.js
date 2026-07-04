'use strict';

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // ── IDs ──────────────────────────────────────────────
    const adminId = uuidv4();
    const juanId = uuidv4();
    const mariaId = uuidv4();

    const dirJuanId = uuidv4();
    const dirMariaId = uuidv4();

    const catRopaId = uuidv4();
    const catZapId = uuidv4();
    const catAccId = uuidv4();

    const prodPoleraId = uuidv4();
    const prodNikeId = uuidv4();
    const prodMochilaId = uuidv4();
    // Ropa
    const prodPoleraNegId = uuidv4();
    const prodCamisetaId = uuidv4();
    const prodPoleraMangaId = uuidv4();
    const prodBuzoId = uuidv4();
    const prodHoodieId = uuidv4();
    // Zapatillas
    const prodAdidasId = uuidv4();
    const prodConverseId = uuidv4();
    const prodVansId = uuidv4();
    const prodNewBalanceId = uuidv4();
    const prodPumaId = uuidv4();
    const prodNikeRevId = uuidv4();
    const prodNikeDunkId = uuidv4();
    const prodAdidasSambId = uuidv4();
    const prodAdidasGazId = uuidv4();
    const prodAdidasForumId = uuidv4();

    const varPoleraMId = uuidv4();
    const varNike42Id = uuidv4();
    const varMochilaId = uuidv4();
    // variantes nuevas
    const varPoleraNegSId = uuidv4();
    const varPoleraNegMId = uuidv4();
    const varCamisetaBlId = uuidv4();
    const varCamisetaNavId = uuidv4();
    const varMangaGrisId = uuidv4();
    const varBuzoGrisId = uuidv4();
    const varBuzoNegroId = uuidv4();
    const varHoodieNegroId = uuidv4();
    const varHoodieGrisId = uuidv4();
    const varAdidas41Id = uuidv4();
    const varAdidas42Id = uuidv4();
    const varConverse40Id = uuidv4();
    const varVans41Id = uuidv4();
    const varNB42Id = uuidv4();
    const varPuma43Id = uuidv4();
    const varNikeRev41Id = uuidv4();
    const varNikeRev43Id = uuidv4();
    const varNikeDunk40Id = uuidv4();
    const varNikeDunk42Id = uuidv4();
    const varSamba41Id = uuidv4();
    const varSamba43Id = uuidv4();
    const varGaz40Id = uuidv4();
    const varGaz42Id = uuidv4();
    const varForum41Id = uuidv4();
    const varForum44Id = uuidv4();

    const ordenJuanId = uuidv4();
    const ordenMariaId = uuidv4();

    const carritoAdminId = uuidv4();
    const carritoJuanId = uuidv4();
    const carritoMariaId = uuidv4();

    // ── Passwords ─────────────────────────────────────────
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    // ── 1. Users ──────────────────────────────────────────
    await queryInterface.bulkInsert('Users', [
      {
        id: adminId,
        nombre: 'Administrador',
        email: 'ADMIN@TIENDA.COM',
        password: adminPassword,
        rol: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: juanId,
        nombre: 'Juan Pérez',
        email: 'JUAN@CORREO.COM',
        password: userPassword,
        rol: 'client',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: mariaId,
        nombre: 'María González',
        email: 'MARIA@CORREO.COM',
        password: userPassword,
        rol: 'client',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // ── 2. Directions ─────────────────────────────────────
    await queryInterface.bulkInsert('Directions', [
      {
        id: dirJuanId,
        userId: juanId,
        calle: 'Av. Providencia',
        numero: 1234,
        ciudad: 'Santiago',
        comuna: 'Providencia',
        region: 'Metropolitana',
        codigoPostal: 7500000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: dirMariaId,
        userId: mariaId,
        calle: 'Los Carrera',
        numero: 456,
        ciudad: 'Concepción',
        comuna: 'Concepción',
        region: 'Biobío',
        codigoPostal: 4030000,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // ── 3. Categorias ─────────────────────────────────────
    await queryInterface.bulkInsert('Categorias', [
      {
        id: catRopaId,
        nombre: 'Ropa',
        descripcion: 'Prendas de vestir para hombres y mujeres',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: catZapId,
        nombre: 'Zapatillas',
        descripcion: 'Calzado deportivo y casual',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: catAccId,
        nombre: 'Accesorios',
        descripcion: 'Complementos para tu estilo diario',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // ── 4. Products ───────────────────────────────────────
    await queryInterface.bulkInsert('Products', [
      {
        id: prodPoleraId,
        categoriaId: catRopaId,
        nombre: 'Polera Oversize',
        descripcion: 'Polera oversize color blanco',
        precioBase: 19990,
        image_url: 'https://placehold.co/400x400?text=Polera',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: prodNikeId,
        categoriaId: catZapId,
        nombre: 'Nike Air Max',
        descripcion: 'Zapatillas deportivas Nike',
        precioBase: 89990,
        image_url: 'https://placehold.co/400x400?text=Nike',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: prodMochilaId,
        categoriaId: catAccId,
        nombre: 'Mochila Urbana',
        descripcion: 'Mochila negra impermeable',
        precioBase: 29990,
        image_url: 'https://placehold.co/400x400?text=Mochila',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // ── Ropa ──────────────────────────────────────────────
      {
        id: prodPoleraNegId,
        categoriaId: catRopaId,
        nombre: 'Polera Básica',
        descripcion: 'Polera de algodón 100%, corte regular',
        precioBase: 14990,
        image_url: 'https://placehold.co/400x400?text=Polera+Basica',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: prodCamisetaId,
        categoriaId: catRopaId,
        nombre: 'Camiseta Manga Corta',
        descripcion: 'Camiseta deportiva de secado rápido',
        precioBase: 17990,
        image_url: 'https://placehold.co/400x400?text=Camiseta',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: prodPoleraMangaId,
        categoriaId: catRopaId,
        nombre: 'Polera Manga Larga',
        descripcion: 'Polera térmica de manga larga para días fríos',
        precioBase: 24990,
        image_url: 'https://placehold.co/400x400?text=Manga+Larga',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: prodBuzoId,
        categoriaId: catRopaId,
        nombre: 'Buzo Jogger',
        descripcion: 'Pantalón jogger con puños ajustados, ideal para entrenamiento',
        precioBase: 34990,
        image_url: 'https://placehold.co/400x400?text=Buzo',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: prodHoodieId,
        categoriaId: catRopaId,
        nombre: 'Hoodie Canguro',
        descripcion: 'Polera con capucha y bolsillo canguro, interior felpa',
        precioBase: 44990,
        image_url: 'https://placehold.co/400x400?text=Hoodie',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // ── Zapatillas ────────────────────────────────────────
      {
        id: prodAdidasId,
        categoriaId: catZapId,
        nombre: 'Adidas Ultraboost',
        descripcion: 'Zapatillas de running con suela Boost',
        precioBase: 99990,
        image_url: 'https://placehold.co/400x400?text=Adidas',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: prodConverseId,
        categoriaId: catZapId,
        nombre: 'Converse All Star',
        descripcion: 'Clásicas zapatillas de lona con puntera de goma',
        precioBase: 59990,
        image_url: 'https://placehold.co/400x400?text=Converse',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: prodVansId,
        categoriaId: catZapId,
        nombre: 'Vans Old Skool',
        descripcion: 'Zapatillas skate con franja lateral característica',
        precioBase: 64990,
        image_url: 'https://placehold.co/400x400?text=Vans',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: prodNewBalanceId,
        categoriaId: catZapId,
        nombre: 'New Balance 574',
        descripcion: 'Zapatilla retro con amortiguación ENCAP',
        precioBase: 79990,
        image_url: 'https://placehold.co/400x400?text=New+Balance',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: prodPumaId,
        categoriaId: catZapId,
        nombre: 'Puma Suede Classic',
        descripcion: 'Zapatilla urbana de gamuza, ícono de la cultura urbana',
        precioBase: 69990,
        image_url: 'https://placehold.co/400x400?text=Puma',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: prodNikeRevId,
        categoriaId: catZapId,
        nombre: 'Nike Revolution 7',
        descripcion: 'Zapatilla de running ligera con amortiguación suave, ideal para entrenamientos diarios',
        precioBase: 74990,
        image_url: 'https://placehold.co/400x400?text=Nike+Revolution',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: prodNikeDunkId,
        categoriaId: catZapId,
        nombre: 'Nike Dunk Low',
        descripcion: 'Icónica silueta de basketball adaptada al streetwear, con cuero de alta calidad',
        precioBase: 109990,
        image_url: 'https://placehold.co/400x400?text=Nike+Dunk',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: prodAdidasSambId,
        categoriaId: catZapId,
        nombre: 'Adidas Samba OG',
        descripcion: 'Clásica zapatilla de fútbol sala con upper de cuero y suela de goma',
        precioBase: 84990,
        image_url: 'https://placehold.co/400x400?text=Adidas+Samba',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: prodAdidasGazId,
        categoriaId: catZapId,
        nombre: 'Adidas Gazelle',
        descripcion: 'Zapatilla vintage de gamuza con tres franjas icónicas, look retro urbano',
        precioBase: 79990,
        image_url: 'https://placehold.co/400x400?text=Adidas+Gazelle',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: prodAdidasForumId,
        categoriaId: catZapId,
        nombre: 'Adidas Forum Low',
        descripcion: 'Zapatilla de basketball retro con correa de tobillo y construcción en cuero',
        precioBase: 94990,
        image_url: 'https://placehold.co/400x400?text=Adidas+Forum',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // ── 5. Variantes ──────────────────────────────────────
    await queryInterface.bulkInsert('Variantes', [
      {
        id: varPoleraMId,
        productId: prodPoleraId,
        talla: 'M',
        color: 'Blanco',
        stock: 50,
        extraPrice: 4000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: varNike42Id,
        productId: prodNikeId,
        talla: '42',
        color: 'Negro',
        stock: 30,
        extraPrice: 2310,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: varMochilaId,
        productId: prodMochilaId,
        talla: 'XL',
        color: 'Azul',
        stock: 20,
        extraPrice: 120,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // ── Polera Básica ──────────────────────────────────────
      {
        id: varPoleraNegSId,
        productId: prodPoleraNegId,
        talla: 'S',
        color: 'Negro',
        stock: 40,
        extraPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: varPoleraNegMId,
        productId: prodPoleraNegId,
        talla: 'M',
        color: 'Negro',
        stock: 35,
        extraPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // ── Camiseta Manga Corta ───────────────────────────────
      {
        id: varCamisetaBlId,
        productId: prodCamisetaId,
        talla: 'M',
        color: 'Blanco',
        stock: 25,
        extraPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: varCamisetaNavId,
        productId: prodCamisetaId,
        talla: 'L',
        color: 'Azul Navy',
        stock: 20,
        extraPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // ── Polera Manga Larga ────────────────────────────────
      {
        id: varMangaGrisId,
        productId: prodPoleraMangaId,
        talla: 'L',
        color: 'Gris',
        stock: 30,
        extraPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // ── Buzo Jogger ───────────────────────────────────────
      {
        id: varBuzoGrisId,
        productId: prodBuzoId,
        talla: 'M',
        color: 'Gris',
        stock: 25,
        extraPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: varBuzoNegroId,
        productId: prodBuzoId,
        talla: 'L',
        color: 'Negro',
        stock: 20,
        extraPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // ── Hoodie Canguro ────────────────────────────────────
      {
        id: varHoodieNegroId,
        productId: prodHoodieId,
        talla: 'M',
        color: 'Negro',
        stock: 18,
        extraPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: varHoodieGrisId,
        productId: prodHoodieId,
        talla: 'XL',
        color: 'Gris Melange',
        stock: 15,
        extraPrice: 2000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // ── Adidas Ultraboost ─────────────────────────────────
      {
        id: varAdidas41Id,
        productId: prodAdidasId,
        talla: '41',
        color: 'Blanco',
        stock: 12,
        extraPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: varAdidas42Id,
        productId: prodAdidasId,
        talla: '42',
        color: 'Negro',
        stock: 10,
        extraPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // ── Converse All Star ─────────────────────────────────
      {
        id: varConverse40Id,
        productId: prodConverseId,
        talla: '40',
        color: 'Blanco',
        stock: 22,
        extraPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // ── Vans Old Skool ────────────────────────────────────
      {
        id: varVans41Id,
        productId: prodVansId,
        talla: '41',
        color: 'Negro/Blanco',
        stock: 18,
        extraPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // ── New Balance 574 ───────────────────────────────────
      {
        id: varNB42Id,
        productId: prodNewBalanceId,
        talla: '42',
        color: 'Gris',
        stock: 14,
        extraPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // ── Puma Suede Classic ────────────────────────────────
      {
        id: varPuma43Id,
        productId: prodPumaId,
        talla: '43',
        color: 'Azul Marino',
        stock: 16,
        extraPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // ── Nike Revolution 7 ─────────────────────────────────
      {
        id: varNikeRev41Id,
        productId: prodNikeRevId,
        talla: '41',
        color: 'Negro',
        stock: 20,
        extraPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: varNikeRev43Id,
        productId: prodNikeRevId,
        talla: '43',
        color: 'Azul/Blanco',
        stock: 15,
        extraPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // ── Nike Dunk Low ─────────────────────────────────────
      {
        id: varNikeDunk40Id,
        productId: prodNikeDunkId,
        talla: '40',
        color: 'Blanco/Negro',
        stock: 10,
        extraPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: varNikeDunk42Id,
        productId: prodNikeDunkId,
        talla: '42',
        color: 'Verde/Blanco',
        stock: 8,
        extraPrice: 5000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // ── Adidas Samba OG ───────────────────────────────────
      {
        id: varSamba41Id,
        productId: prodAdidasSambId,
        talla: '41',
        color: 'Blanco/Negro',
        stock: 18,
        extraPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: varSamba43Id,
        productId: prodAdidasSambId,
        talla: '43',
        color: 'Negro/Goma',
        stock: 14,
        extraPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // ── Adidas Gazelle ────────────────────────────────────
      {
        id: varGaz40Id,
        productId: prodAdidasGazId,
        talla: '40',
        color: 'Verde Oscuro',
        stock: 12,
        extraPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: varGaz42Id,
        productId: prodAdidasGazId,
        talla: '42',
        color: 'Borgoña',
        stock: 10,
        extraPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // ── Adidas Forum Low ──────────────────────────────────
      {
        id: varForum41Id,
        productId: prodAdidasForumId,
        talla: '41',
        color: 'Blanco/Azul',
        stock: 12,
        extraPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: varForum44Id,
        productId: prodAdidasForumId,
        talla: '44',
        color: 'Negro',
        stock: 9,
        extraPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // ── 6. Orders ─────────────────────────────────────────
    await queryInterface.bulkInsert('Orders', [
      {
        id: ordenJuanId,
        userId: juanId,
        directionId: dirJuanId,
        total: 109980,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: ordenMariaId,
        userId: mariaId,
        directionId: dirMariaId,
        total: 29990,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // ── 7. OrderItems ─────────────────────────────────────
    await queryInterface.bulkInsert('OrderItems', [
      {
        id: uuidv4(),
        orderId: ordenJuanId,
        varianteId: varPoleraMId,
        cantidad: 2,
        unitPrice: 23990,
        productName: 'Polera Oversize',
        varianteTalla: 'M',
        varianteColor: 'Blanco',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        orderId: ordenJuanId,
        varianteId: varNike42Id,
        cantidad: 1,
        unitPrice: 92300,
        productName: 'Nike Air Max',
        varianteTalla: '42',
        varianteColor: 'Negro',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        orderId: ordenMariaId,
        varianteId: varMochilaId,
        cantidad: 1,
        unitPrice: 30110,
        productName: 'Mochila Urbana',
        varianteTalla: 'XL',
        varianteColor: 'Azul',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // ── 8. OrderStatuses ──────────────────────────────────
    await queryInterface.bulkInsert('OrderStatuses', [
      {
        id: uuidv4(),
        orderId: ordenJuanId,
        status: 'recibido',
        descripcion: 'La orden fue recibida correctamente',
        fecha: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        orderId: ordenMariaId,
        status: 'recibido',
        descripcion: 'La orden fue recibida correctamente',
        fecha: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // ── 9. Carts ──────────────────────────────────────────
    await queryInterface.bulkInsert('Carts', [
      {
        id: carritoAdminId,
        userId: adminId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: carritoJuanId,
        userId: juanId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: carritoMariaId,
        userId: mariaId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // ── 10. CartItems ─────────────────────────────────────
    await queryInterface.bulkInsert('CartItems', [
      {
        id: uuidv4(),
        cartId: carritoJuanId,
        varianteId: varPoleraMId,
        quantity: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        cartId: carritoJuanId,
        varianteId: varNike42Id,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('CartItems', null, {});
    await queryInterface.bulkDelete('Carts', null, {});
    await queryInterface.bulkDelete('OrderStatuses', null, {});
    await queryInterface.bulkDelete('OrderItems', null, {});
    await queryInterface.bulkDelete('Orders', null, {});
    await queryInterface.bulkDelete('Variantes', null, {});
    await queryInterface.bulkDelete('Products', null, {});
    await queryInterface.bulkDelete('Categorias', null, {});
    await queryInterface.bulkDelete('Directions', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
