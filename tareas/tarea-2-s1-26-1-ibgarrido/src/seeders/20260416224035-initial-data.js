'use strict';
// Importamos bcrypt para hashear las contraseñas antes de guardarlas
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. Hasheamos una contraseña genérica ("Lolla2026") para usarla en los 3 usuarios
    const hashedPassword = await bcrypt.hash('Lolla2026', 10);

    await queryInterface.bulkInsert('Users', [
      { id: 1, username: 'admin_jose', password: hashedPassword, balance: 5000, image: 'https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, username: 'fan_maria', password: hashedPassword, balance: 1500, image: 'https://img.freepik.com/free-vector/smiling-woman-with-braided-hair_1308-174961.jpg?semt=ais_hybrid&w=740&q=80', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, username: 'user_pedro', password: hashedPassword, balance: 800, image: null, createdAt: new Date(), updatedAt: new Date() }
    ]);

    await queryInterface.bulkInsert('Artists', [
      // 3 Artistas contratados (ownerId: 1, 2 y 3)
      { id: 1, name: 'Dua Lipa', hypeLevel: 95, genres: '{Pop, Dance}', price: 1500, imageUrl: 'https://wwd.com/wp-content/uploads/2026/02/9-16-sRGB-JPEG_2825_IMAGINE_JR_BULGARI_251209_BVLGARI_DL_JRogac_02_839_9_16_sRGB_F1.jpg?crop=0px%2C1998px%2C3700px%2C2075px&resize=1000%2C563', ownerId: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Arctic Monkeys', hypeLevel: 90, genres: '{Indie Rock}', price: 1800, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0j0dSyL7QGNp-sZOZagUDk7wvFdrqVhk5cL7RUbkzjf5XqQ7qCNa_iVSWY0BsRExThhPFhy2RHMZNXjZROk9-ITLcx57gZ5-pxmqYmw&s=10', ownerId: 2, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'Rosalía', hypeLevel: 88, genres: '{Urbano, Flamenco}', price: 1200, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSnl9txcDeaboMelxBl1nr6-YsgXhfJFUjiP9A2vatOnZ3rp47Md31gIQM5l6UeESRbeYf-nw_kgCEDPkdbF2wgH6i6Hm4QisDQ45XKDE&s=10', ownerId: 3, createdAt: new Date(), updatedAt: new Date() },

      // 12 Artistas libres (ownerId: null)
      { id: 4, name: 'The Strokes', hypeLevel: 85, genres: '{Indie Rock}', price: 1000, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqcdoLCwg71EjJIZz4Jg_5wYt2rADMTvsOjwqGBb1G6L8xd0alaYWPourf06sVIXM9xHfikOK5oFuir1H7szemntRfMPFNs3DHKS3YxA&s=10', ownerId: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 5, name: 'Bad Bunny', hypeLevel: 99, genres: '{Reggaeton, Trap}', price: 2000, imageUrl: 'https://www.latercera.com/resizer/v2/HIPH6PHQABGJLO7VGUD64HEILY.jpg?auth=a8842da5a863bdaffca0b8ba2b8ec84ac1c8b4a0a6c604b6b5274976e74bf1ed&smart=true&width=800&height=542&quality=70', ownerId: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 6, name: 'Tame Impala', hypeLevel: 82, genres: '{Psychedelic Pop}', price: 900, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo9pt2w7OlGZIt8M1dqjhMDY3h38JJ7zHqbrii_0Yxh0fCbZO1Ykv5e4UH9Wj1Ij68ca0oM7q9bRX0RVb-wnuNW-5LBPKtBwClV97xNqQ&s=10', ownerId: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 7, name: 'Feid', hypeLevel: 87, genres: '{Reggaeton}', price: 850, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9CposefY1pOAk5ybR4mlTr527d76hWvzX6qxdHtJnF8rT_LmpLAmb_2JkPlkj3fy-Qwm07mdqY0-khtxWiwiDNEThdLlAhdNiGaYl4-8&s=10', ownerId: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 8, name: 'Gorillaz', hypeLevel: 80, genres: '{Alternative}', price: 700, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDfped2fUULfv14ngmhvpqyQ7dWLc1qY-eyWrVjafc8Zkaez1zN8yLxO8FMA9faTSbnOnBWCAXdu_kZPxkG6QWp259LNZ6NteT3I0KhP8&s=10', ownerId: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 9, name: 'Blink-182', hypeLevel: 75, genres: '{Pop Punk}', price: 600, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-a_XJpY-WzMLUPOc7rlA_o7JtttX98S-X3ABCAdHCpucJFic5jfbo2Ycz4-iXQTZBZHB4HBtecWBCgBeKKpyPDBjOpnRAeTOmRj8RhsM&s=10', ownerId: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 10, name: 'The Weeknd', hypeLevel: 96, genres: '{R&B, Pop}', price: 2100, imageUrl: 'https://placehold.co/400x400/1a1a1a/FF007A?text=The+Weeknd', ownerId: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 11, name: 'Billie Eilish', hypeLevel: 94, genres: '{Pop, Alternative}', price: 1900, imageUrl: 'https://placehold.co/400x400/1a1a1a/FF007A?text=Billie+Eilish', ownerId: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 12, name: 'Travis Scott', hypeLevel: 93, genres: '{Hip Hop, Trap}', price: 1950, imageUrl: 'https://placehold.co/400x400/1a1a1a/FF007A?text=Travis+Scott', ownerId: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 13, name: 'Kali Uchis', hypeLevel: 86, genres: '{R&B, Latin Pop}', price: 1100, imageUrl: 'https://placehold.co/400x400/1a1a1a/FF007A?text=Kali+Uchis', ownerId: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 14, name: 'Muse', hypeLevel: 84, genres: '{Alternative Rock}', price: 1050, imageUrl: 'https://placehold.co/400x400/1a1a1a/FF007A?text=Muse', ownerId: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 15, name: 'Paramore', hypeLevel: 83, genres: '{Pop Rock}', price: 980, imageUrl: 'https://placehold.co/400x400/1a1a1a/FF007A?text=Paramore', ownerId: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 16, name: 'Taylor Swift', hypeLevel: 98, genres: '{Pop, Country Pop}', price: 2200, imageUrl: 'https://placehold.co/400x400/1a1a1a/FF007A?text=Taylor+Swift', ownerId: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 17, name: 'Drake', hypeLevel: 97, genres: '{Hip Hop, R&B}', price: 2150, imageUrl: 'https://placehold.co/400x400/1a1a1a/FF007A?text=Drake', ownerId: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 18, name: 'Karol G', hypeLevel: 92, genres: '{Reggaeton, Latin Pop}', price: 1700, imageUrl: 'https://placehold.co/400x400/1a1a1a/FF007A?text=Karol+G', ownerId: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 19, name: 'Rauw Alejandro', hypeLevel: 89, genres: '{Reggaeton, Urbano}', price: 1450, imageUrl: 'https://placehold.co/400x400/1a1a1a/FF007A?text=Rauw+Alejandro', ownerId: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 20, name: 'SZA', hypeLevel: 91, genres: '{R&B, Neo Soul}', price: 1650, imageUrl: 'https://placehold.co/400x400/1a1a1a/FF007A?text=SZA', ownerId: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 21, name: 'Lana Del Rey', hypeLevel: 88, genres: '{Alternative Pop, Indie}', price: 1400, imageUrl: 'https://placehold.co/400x400/1a1a1a/FF007A?text=Lana+Del+Rey', ownerId: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 22, name: 'Coldplay', hypeLevel: 90, genres: '{Pop Rock, Alternative}', price: 1850, imageUrl: 'https://placehold.co/400x400/1a1a1a/FF007A?text=Coldplay', ownerId: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 23, name: 'Post Malone', hypeLevel: 87, genres: '{Hip Hop, Pop}', price: 1350, imageUrl: 'https://placehold.co/400x400/1a1a1a/FF007A?text=Post+Malone', ownerId: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 24, name: 'Doja Cat', hypeLevel: 89, genres: '{Pop, Hip Hop}', price: 1500, imageUrl: 'https://placehold.co/400x400/1a1a1a/FF007A?text=Doja+Cat', ownerId: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 25, name: 'Imagine Dragons', hypeLevel: 86, genres: '{Alternative Rock, Pop Rock}', price: 1250, imageUrl: 'https://placehold.co/400x400/1a1a1a/FF007A?text=Imagine+Dragons', ownerId: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 26, name: 'Shakira', hypeLevel: 93, genres: '{Latin Pop, Pop Rock}', price: 1750, imageUrl: 'https://placehold.co/400x400/1a1a1a/FF007A?text=Shakira', ownerId: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 27, name: 'Twenty One Pilots', hypeLevel: 85, genres: '{Alternative, Electropop}', price: 1180, imageUrl: 'https://placehold.co/400x400/1a1a1a/FF007A?text=Twenty+One+Pilots', ownerId: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 28, name: 'Olivia Rodrigo', hypeLevel: 90, genres: '{Pop, Pop Rock}', price: 1600, imageUrl: 'https://placehold.co/400x400/1a1a1a/FF007A?text=Olivia+Rodrigo', ownerId: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 29, name: 'A$AP Rocky', hypeLevel: 84, genres: '{Hip Hop, Trap}', price: 1120, imageUrl: 'https://placehold.co/400x400/1a1a1a/FF007A?text=A$AP+Rocky', ownerId: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 30, name: 'Måneskin', hypeLevel: 82, genres: '{Rock, Glam Rock}', price: 1080, imageUrl: 'https://placehold.co/400x400/1a1a1a/FF007A?text=Maneskin', ownerId: null, createdAt: new Date(), updatedAt: new Date() }
    ]);

    await queryInterface.bulkInsert('Reviews', [
      { id: 1, rating: 5, comment: '¡El mejor concierto de mi vida!', userId: 1, artistId: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, rating: 4, comment: 'Muy buen show, pero empezó tarde.', userId: 2, artistId: 2, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, rating: 5, comment: 'Motomami tour fue una locura.', userId: 3, artistId: 3, createdAt: new Date(), updatedAt: new Date() }
    ]);

    await queryInterface.bulkInsert('FavoriteArtists', [
      { id: 1, userId: 1, artistId: 4, createdAt: new Date(), updatedAt: new Date() }, // admin_jose sigue a The Strokes
      { id: 2, userId: 2, artistId: 5, createdAt: new Date(), updatedAt: new Date() }, // fan_maria sigue a Bad Bunny
      { id: 3, userId: 3, artistId: 6, createdAt: new Date(), updatedAt: new Date() }  // user_pedro sigue a Tame Impala
    ]);

    await queryInterface.sequelize.query(
      'SELECT setval(\'"Users_id_seq"\', (SELECT MAX(id) FROM "Users"));'
    );
    await queryInterface.sequelize.query( // Esto es para asegurarnos de que las secuencias de ID estén actualizadas después de insertar datos con IDs específicos (al momento de crear artistas nuevos)
      'SELECT setval(\'"Artists_id_seq"\', (SELECT MAX(id) FROM "Artists"));'
    );
  },

  async down (queryInterface, Sequelize) {
    // Aquí definimos cómo borrar todo en caso de querer revertir la semilla
    await queryInterface.bulkDelete('FavoriteArtists', null, {});
    await queryInterface.bulkDelete('Reviews', null, {});
    await queryInterface.bulkDelete('Artists', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
