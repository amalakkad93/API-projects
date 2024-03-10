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

const processSpots = (spots) => {
  return spots.map((spot) => {

    const spotData = spot.toJSON ? spot.toJSON() : spot;

    const avgRating = spotData.Reviews.reduce((sum, review) => sum + review.stars, 0) / spotData.Reviews.length || 0;
    spotData.avgRating = avgRating.toFixed(1);

    // Process images
    const previewImage = spotData.SpotImages.find(image => image.preview === true);
    const otherImages = spotData.SpotImages.filter(image => !image.preview);

    spotData.previewImage = previewImage ? previewImage.url : "https://flask3.s3.amazonaws.com/Spot+Default+image+URL.webp";
    spotData.otherImages = otherImages.map(image => ({
      id: image.id,
      url: image.url,
      preview: image.preview
    }));

    // Clean up spotData by removing the original Reviews and SpotImages arrays
    delete spotData.Reviews;
    delete spotData.SpotImages;

    return spotData;
  });
};


// Get all favorites for a user
router.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  const favorites = await Favorite.findAll({
    where: { userId },
    include: [{
      model: Spot,
      include: [
        {
          model: Review,
          attributes: ['stars']
        },
        {
          model: SpotImage,
          attributes: ['url', 'preview']
        }
      ]
    }]
  });


  const processedFavorites = favorites.map(favorite => {
    const favoriteJSON = favorite.toJSON();

    const processedSpot = processSpots([favoriteJSON.Spot])[0];
    favoriteJSON.Spot = processedSpot;
    return favoriteJSON;
  });

  res.json({ favorites: processedFavorites });
});


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
