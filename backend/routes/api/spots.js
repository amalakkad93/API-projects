const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../utils/auth");
const {
  Spot,
  User,
  Review,
  SpotImage,
  ReviewImage,
  Booking,
  sequelize,
} = require("../../db/models");
const uuid = require("uuid");

const { check, validationResult } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const spot = require("../../db/models/spot");
const { json } = require("sequelize");
const { Op } = require("sequelize");
const {
  singleMulterUpload,
  singleFileUpload,
  multipleFilesUpload,
  multipleMulterUpload,
} = require("../../awsS3");

//**************************************handleErrorResponse**************************************************** */

const errorAuth = function (err, req, res, next) {
  res.status(401);
  res.setHeader("Content-Type", "application/json");
  res.json({
    message: "Authentication required",
  });
};

const validateSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required."),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude is not valid"),
  check("lng")
    .exists({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude is not valid"),
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ min: 1, max: 49 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .withMessage("Price per day is required"),
  handleValidationErrors,
];

//***********************************

const validateQueryParams = [
  check("page")
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage("Page must be an integer between 1 and 10"),
  check("size")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Size must be an integer between 1 and 20"),
  check("minLat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Minimum latitude is invalid"),
  check("maxLat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Maximum latitude is invalid"),
  check("minLng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Minimum longitude is invalid"),
  check("maxLng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Maximum longitude is invalid"),
  check("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be greater than or equal to 0"),
  check("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum price must be greater than or equal to 0"),
  handleValidationErrors,
];

//***********************************

const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars")
    .isIn([1, 2, 3, 4, 5])
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

//***********************************

// const validateBooking = [
//   check("startDate")
//     .exists({ checkFalsy: true }),

//     // .withMessage("Review text is required"),
//   check("endDate")
//     .isAfter(new Date().toISOString())
//     .withMessage("endDate cannot come before startDate"),
//   handleValidationErrors,
// ];

const validateBooking = [
  check("startDate")
    .exists({ checkFalsy: true })
    .withMessage("startDate is required"),

  check("endDate")
    .exists({ checkFalsy: true })
    .withMessage("endDate is required")
    .custom((endDate, { req }) => {
      // Get the startDate value from the request body
      const { startDate } = req.body;

      // Check if the endDate is after the startDate
      if (endDate <= startDate) {
        throw new Error("endDate cannot come before startDate");
      }

      // Return true if the validation passes
      return true;
    }),

  handleValidationErrors,
];

//***********************************

const queryParamValidationErrors = (err, req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorResponse = {
      message: "Bad Request",
      errors: err.errors,
    };

    return res.status(400).json(errorResponse);
  }

  next();
};

const authCatch = (err, req, res, next) => {
  res.status(401).setHeader("Content-Type", "application/json").json({
    message: "Authentication required",
  });
};

//***********************************

const errorResponse403 = (err, req, res, next) => {
  res
    .status(403)
    .setHeader("Content-Type", "application/json")
    .json({ message: "Forbidden" });
};

//***********************************

const displayvaldErr = (err, req, res, next) => {
  res.status(400);
  res.setHeader("Content-Type", "application/json");
  res.json({
    message: "Bad Request",
    errors: err.errors,
  });
};
//******************************************************** */
const createErrorHandler = (statusCode, message, data = {}, res) => {
  return res.status(statusCode).json({ message, ...data });
};

//****************************************************************************************** */

//======== Search for Spots based on a query ========
router.get("/search", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Please provide a search query." });
  }

  try {
    const spots = await Spot.findAll({
      where: {
        [Op.or]: [
          sequelize.where(
            sequelize.fn("LOWER", sequelize.col("city")),
            "LIKE",
            "%" + query.toLowerCase() + "%"
          ),
          sequelize.where(
            sequelize.fn("LOWER", sequelize.col("state")),
            "LIKE",
            "%" + query.toLowerCase() + "%"
          ),
          sequelize.where(
            sequelize.fn("LOWER", sequelize.col("country")),
            "LIKE",
            "%" + query.toLowerCase() + "%"
          ),
          sequelize.where(
            sequelize.fn("LOWER", sequelize.col("name")),
            "LIKE",
            "%" + query.toLowerCase() + "%"
          ),
        ],
      },
      include: [
        { model: Review, attributes: ["stars"] },
        { model: SpotImage, attributes: ["url", "preview"] },
      ],
    });

    const spotsList = processSpots(spots);
    res.json(spotsList);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//======== Get all Spots owned by the Current User ========
router.get("/current", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const spots = await Spot.findAll({
    where: { ownerId: userId },
    include: [
      { model: Review, attributes: ["stars"] },
      { model: SpotImage, attributes: ["url", "preview"] },
    ],
  });

  let spotsList = processSpots(spots);
  res.json(spotsList);
  // res.json({Spots: spotsList})
});

// ======== Get details of a Spot from an id ========
router.get("/:spotId", async (req, res) => {
  const spotId = req.params.spotId;

  const spot = await Spot.findByPk(spotId, {
    include: [
      { model: Review },
      { model: SpotImage, attributes: ["id", "url", "preview"] },
      { model: User, attributes: ["id", "firstName", "lastName"] },
    ],
    order: [[SpotImage, "preview", "DESC"]],
  });

  if (spot) {
    const numReviews = spot.Reviews.length;
    const avgStarRating =
      spot.Reviews.reduce((sum, review) => sum + review.stars, 0) / numReviews;

    const response = {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      numReviews,
      avgStarRating,
      SpotImages: spot.SpotImages,
      User: spot.User,
    };

    return res.json(response);
  } else {
    return createErrorHandler(404, "Spot couldn't be found", {}, res);
  }
});

//======== Create a Spot ========
router.post("/", requireAuth, validateSpot, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  const { user } = req;
  if (user) {
    const spot = await Spot.create({
      ownerId: user.id,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    });

    res.status(201);
    res.json(spot);
  } else {
    return createErrorHandler(400, "Forbidden", {}, res);
  }
});

//======== Add an Image to a Spot based on the Spot's id ========
router.post(
  "/:spotId/images",
  requireAuth,
  multipleMulterUpload("image"),
  async (req, res) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);
    if (!spot || spot.ownerId !== req.user.id) {
      return res
        .status(404)
        .json({ message: "Spot not found or unauthorized" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No image files provided" });
    }

    try {
      const previewImageName = req.body.previewImageName;

      const uploadResults = await multipleFilesUpload(req.files, true);

      let uploadedURLs = new Set();
      let spotImages = [];

      for (let i = 0; i < uploadResults.length; i++) {
        const url = uploadResults[i];
        if (uploadedURLs.has(url)) {
          continue;
        }
        uploadedURLs.add(url);

        const file = req.files[i];
        const isPreview = file.originalname === previewImageName;

        const spotImage = await SpotImage.create({
          spotId,
          url,
          preview: isPreview,
        });
        spotImages.push(spotImage);
      }

      return res.json({ spotImages });
    } catch (error) {
      console.error("Failed to upload images:", error);
      return res
        .status(500)
        .json({ message: "Failed to upload images", error: error.message });
    }
  }
);

//======== Add an Image to a Spot based on the Spot's id ========
// router.post("/:spotId/images", requireAuth, singleMulterUpload("image"), async (req, res) => {
//   const { spotId } = req.params;
//   const { user } = req;
//   const spot = await Spot.findByPk(spotId);

//   if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });
//   if (spot.ownerId !== user.id) return res.status(403).json({ message: "Forbidden" });

//   const file = req.file;
//   const result = await singleFileUpload({ file, public: true });

//   const spotImage = await SpotImage.create({
//     spotId,
//     url: result.Location,
//     preview: true,
//   });

//   return res.json({ spotImage });
// });

// ***********************************************************************************************************************
//======== Edit a Spot ========*****************
router.put(
  "/:spotId",
  requireAuth,
  authCatch,
  validateSpot,
  displayvaldErr,
  async (req, res) => {
    const spotId = req.params.spotId;

    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;
    const spot = await Spot.findOne({ where: { id: spotId } });

    if (spot && spot.ownerId === req.user.id) {
      const updatedSpot = await spot.update({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
      });
      res.json(updatedSpot);
    } else if (!spot) {
      return createErrorHandler(404, "Spot couldn't be found", {}, res);
    } else if (spot && spot.ownerId !== req.user.id) {
      next(err);
    }
  },
  errorResponse403
);
// ***********************************************************************************************************************
//======== Delete a Spot ========
router.delete(
  "/:spotId",
  requireAuth,
  authCatch,
  errorAuth,
  async (req, res) => {
    const spotId = req.params.spotId;
    const { user } = req;

    const spotOwner = await Spot.findByPk(spotId);

    const deletedSpot = await Spot.destroy({
      where: { id: spotId, ownerId: req.user.id },
    });

    if (!spotOwner)
      return createErrorHandler(404, "Spot couldn't be found", {}, res);
    else if (deletedSpot)
      return res.status(200).json({ message: "Successfully deleted" });
    else if (spotOwner && spotOwner.ownerId !== req.user.id) next(err);
  },
  errorResponse403
);

//======== Get all Reviews by a Spot's id ========
router.get("/:spotId/reviews", async (req, res) => {
  const reviews = await Review.findAll({
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
    where: { spotId: req.params.spotId },
    order: [["createdAt", "DESC"]],
  });

  // if (reviews.length === 0) return createErrorHandler(404, "Spot not found", {}, res);
  if (reviews.length === 0) return res.json({ Reviews: [] });

  const updatedReviews = reviews.map((review) => {
    const reviewJSON = review.toJSON();
    if (reviewJSON.Spot) {
      reviewJSON.Spot.previewImage = reviewJSON.Spot.SpotImages[0]?.url || null;
      delete reviewJSON.Spot.SpotImages;
    }
    return reviewJSON;
  });

  res.json({ Reviews: updatedReviews });
});

// ======== Create a Review for a Spot based on the Spot's id ========
// router.post('/:spotId/reviews', requireAuth, authCatch, validateReview, async (req, res) => {
//   const { review, stars } = req.body;
//   const spotId = req.params.spotId;
//   const userId = req.user.id;

//   const oldReview = await Review.findOne({ where: { userId: req.user.id, spotId: req.params.spotId } });

//   if (oldReview) return createErrorHandler(500, "User already has a review for this spot", {}, res);

//   const spot = await Spot.findOne({ where: { id: spotId } });

//   if (spot) {
//     const newReview = await Review.create({ userId, spotId, review, stars });
//     return res.json(newReview);

//   } else if (res.status(404)) {
//     return createErrorHandler(404, "Spot couldn't be found", {}, res);
//   }

// });
//*********************************************************************************************************** */
//*********************************************************************************************************** */
// ======== Create a Review for a Spot based on the Spot's id ========
router.post(
  "/:spotId/reviews",
  requireAuth,
  authCatch,
  validateReview,
  async (req, res) => {
    const { review, stars } = req.body;
    const spotId = req.params.spotId;
    const userId = req.user.id;

    const oldReview = await Review.findOne({ where: { userId, spotId } });

    if (oldReview)
      return createErrorHandler(
        409,
        "User already has a review for this spot",
        {},
        res
      );

    const spot = await Spot.findOne({ where: { id: spotId } });

    if (!spot)
      return createErrorHandler(404, "Spot couldn't be found", {}, res);

    const newReview = await Review.create({ userId, spotId, review, stars });
    return res.json(newReview);
  }
);

//*********************************************************************************************************** */
//*********************************************************************************************************** */

// Helper function to format dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

//======== Get all Bookings for a Spot based on the Spot's id ========
router.get("/:spotId/bookings", requireAuth, authCatch, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) return createErrorHandler(404, "Spot couldn't be found", {}, res);

  let bookings;
  // if (spot.ownerId === req.user.id) {
  if (req.user && spot.ownerId === req.user.id) {
    bookings = await Booking.findAll({
      where: { spotId: req.params.spotId },
      // attributes: ['spotId', 'startDate', 'endDate'],
      include: { model: User, attributes: ["id", "firstName", "lastName"] },
    });
  } else {
    bookings = await Booking.findAll({
      where: { spotId: req.params.spotId },
      attributes: ["spotId", "startDate", "endDate"],
    });
  }

  res.json({ Bookings: bookings });
});
//======== Create a Booking from a Spot based on the Spot's id ========
router.post(
  "/:spotId/bookings",
  requireAuth,
  authCatch,
  validateBooking,
  displayvaldErr,
  async (req, res) => {
    const { startDate, endDate } = req.body;
    const spotId = req.params.spotId;
    const userId = req.user.id;

    const startBooking = await Booking.findOne({
      where: {
        spotId: spotId,
        startDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    const endBooking = await Booking.findOne({
      where: {
        spotId: spotId,
        endDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    const spot = await Spot.findOne({ where: { id: spotId } });

    if (!spot)
      return res.status(404).json({ message: "Spot couldn't be found" });

    if (spot && spot.ownerId === req.user.id) return next(err);
    if (!startBooking && !endBooking) {
      const newBooking = await Booking.create({
        spotId,
        userId,
        startDate,
        endDate,
      });
      return res.json(newBooking);
    } else if (startBooking && endBooking) {
      res.status(403);
      res.json({
        message: "Sorry, this spot is already booked for the specified dates.",
        errors: {
          startDate: "Start date conflicts with an existing booking.",
          endDate: "End date conflicts with an existing booking.",
        },
      });
    }
    //=====================
    else if (startBooking) {
      res.status(403);
      res.json({
        message: "Sorry, this spot is already booked for the specified dates.",
        errors: {
          endDate: "Start date conflicts with an existing booking.",
        },
      });
    } else if (endBooking) {
      res.status(403);
      res.json({
        message: "Sorry, this spot is already booked for the specified dates.",
        errors: {
          endDate: "End date conflicts with an existing booking.",
        },
      });
    }
  },
  errorResponse403
);

//======== Get all Spots ========
router.get(
  "/",
  validateQueryParams,
  queryParamValidationErrors,
  async (req, res) => {
    let { page = 1, size = 20 } = req.query;

    const spots = await Spot.findAll({
      ...getPagination(req.query),
      include: [
        {
          model: Review,
          attributes: ["stars"],
        },
        {
          model: SpotImage,
          attributes: ["url", "preview"],
        },
      ],
    });

    let spotsList = processSpots(spots);
    return res.json({ Spots: spotsList, page, size });
  }
);

//***********Helper functions***********

// const processSpots = (spots) => {
//   return spots.map((spot) => {
//     spot = spot.toJSON();
//     const avgRating =
//       spot.Reviews.reduce((sum, review) => sum + review.stars, 0) /
//         spot.Reviews.length || 0;
//     spot.avgRating = avgRating;

//     const previewImage = spot.SpotImages.find(
//       (image) => image.preview === true
//     );
//     const otherImages = spot.SpotImages.filter((image) => !image.preview);

//     spot.previewImage = previewImage
//       ? previewImage.url
//       : "No preview image found";
//     spot.otherImages = otherImages.map((image) => ({
//       id: image.id,
//       url: image.url,
//       preview: image.preview,
//     }));

//     delete spot.Reviews;
//     delete spot.SpotImages;

//     return spot;
//   });
// };

const processSpots = (spots) => {
  return spots.map((spot) => {
    spot = spot.toJSON();
    console.log(`Processing spot: ${spot.id}`);

    const avgRating =
      spot.Reviews.reduce((sum, review) => sum + review.stars, 0) /
        spot.Reviews.length || 0;
    spot.avgRating = avgRating;

    const previewImage = spot.SpotImages.find(
      (image) => image.preview === true
    );
    let otherImages = spot.SpotImages.filter((image) => !image.preview);

    console.log(`Other images before any modification: ${otherImages.length}`);

    if (otherImages.length === 0 && previewImage) {
      console.log(
        `No other images found for spot ${spot.id}, using preview image.`
      );
      otherImages.push(previewImage);
    }

    spot.previewImage = previewImage
      ? previewImage.url
      : "No preview image found";
    spot.otherImages = otherImages.map((image) => ({
      url: image.url,
      preview: image.preview,
    }));

    console.log(
      `Final other images count for spot ${spot.id}: ${spot.otherImages.length}`
    );

    delete spot.Reviews;
    delete spot.SpotImages;

    return spot;
  });
};

const getPagination = (queryParams) => {
  let { page, size } = queryParams;

  page = page === undefined ? 1 : parseInt(page);
  size = size === undefined ? 20 : parseInt(size);
  const limit = parseInt(size, 20);
  const offset = (parseInt(page, 20) - 1) * limit;

  return { limit, offset };
};

//*********************************

module.exports = router;
