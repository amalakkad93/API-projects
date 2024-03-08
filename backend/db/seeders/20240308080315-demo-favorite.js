"use strict";
const { Favorite } = require("../models");
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Favorite.bulkCreate([
      {
        spotId: 1,
        userId: 1,

      },
      {
        spotId: 2,
        userId: 2,
      },
      {
        spotId: 3,
        userId: 3,
      },
    ], options);
  },

  async down(queryInterface, Sequelize) {

    options.tableName = "Favorites";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        userId: { [Op.in]: [1, 2, 3] },
      },
      {}
    );
  },
};
