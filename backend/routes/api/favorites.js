const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../utils/auth");
const {
  Spot,
  Booking,
  User,
  Review,
  SpotImage,
  ReviewImage,
  sequelize,
  Favorite
} = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const spot = require("../../db/models/spot");
const { json } = require("sequelize");
const { Op } = require("sequelize");

// Get all favorites for a user
router.get('/user/:userId', (async (req, res) => {
  const userId = req.params.userId;
  const favorites = await Favorite.findAll({
    where: { userId },
    include: [{ model: Spot }]
  });
  res.json({ favorites });
}));

// Add a favorite
router.post('/', requireAuth, (async (req, res) => {
  const { userId, spotId } = req.body;
  const favorite = await Favorite.create({ userId, spotId });
  res.status(201).json({ favorite });
}));

// Remove a favorite
router.delete('/:id', requireAuth, (async (req, res) => {
  const favoriteId = req.params.id;
  const favorite = await Favorite.findByPk(favoriteId);
  if (favorite) {
    await favorite.destroy();
    res.status(204).end();
  } else {
    res.status(404).json({ message: 'Favorite not found' });
  }
}));

module.exports = router;
