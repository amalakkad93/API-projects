// 'use strict';
// const { Booking } = require('../models')
// /** @type {import('sequelize-cli').Migration} */

// let options = {};
// if (process.env.NODE_ENV === 'production') {
//   options.schema = process.env.SCHEMA; // define your schema in options object
// }

// module.exports = {
//   async up (queryInterface, Sequelize) {
//     await Booking.bulkCreate([
//       {
//          // should edit booking
//         spotId: 1,
//         userId: 1,
//         startDate: "2026-07-14",
//         endDate: "2026-12-26"
//       },
//       {
//         // should not edit booking
//         spotId: 1,
//         userId: 1,
//         startDate: "2023-07-10",
//         endDate: "2023-07-13",
//       },
//       {
//          // should not edit booking
//         spotId: 3,
//         userId: 1,
//         startDate: "1984-11-19",
//         endDate: "2000-11-19"
//       },
//       {
//         spotId: 1,
//         userId: 2,
//         startDate: "1984-11-19",
//         endDate: "2023-11-19"
//       },
//       {
//         spotId: 2,
//         userId: 2,
//         startDate: "2021-11-19",
//         endDate: "2022-11-30"
//       },
//       {
//         spotId: 2,
//         userId: 2,
//         startDate: "2023-08-10",
//         endDate: "2023-08-13",
//       },
//       {
//         spotId: 3,
//         userId: 3,
//         startDate: "2022-09-07",
//         endDate: "2022-09-11"
//       },
//       {
//         spotId: 3,
//         userId: 3,
//         startDate: "2023-09-10",
//         endDate: "2023-09-13",
//       }
//     ], { validate: true })
//   },

//   async down (queryInterface, Sequelize) {
//     options.tableName = 'Bookings';
//     const Op = Sequelize.Op;
//     return queryInterface.bulkDelete(options, {
//       spotId: { [Op.in]: [1, 2, 3] }
//     }, {});
//   }
// };

'use strict';
const { Booking } = require('../models');
const bcrypt = require("bcryptjs");


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        startDate: '2023-08-12',
        endDate: '2023-08-16',
      },
      {
        spotId: 2,
        userId: 1,
        startDate: '2023-07-14',
        endDate: '2023-08-16',
      },
      {
        spotId: 3,
        userId: 1,
        startDate: '1985-07-14',
        endDate: '1986-08-16',
      },
      {
        spotId: 2,
        userId: 2,
        startDate: '2023-09-15',
        endDate: '2023-09-22',
      },
      {
        spotId: 3,
        userId: 3,
        startDate: '2023-10-01',
        endDate: '2023-10-10',
      },])
  },


  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: {[Op.in]:[1,2,3]}
    }, {});
  }
};
