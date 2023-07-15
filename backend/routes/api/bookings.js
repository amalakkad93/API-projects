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
} = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const spot = require("../../db/models/spot");
const { json } = require("sequelize");
const { Op } = require('sequelize');


const validateBooking = [
  check("startDate")
    .exists({ checkFalsy: true }),
  check("endDate")
    .isAfter(new Date().toISOString())
    .withMessage("endDate cannot come before startDate"),
  handleValidationErrors,
];

const errorResponse403 = (err, req, res, next) => {
  res.status(403)
      .setHeader('Content-Type', 'application/json')
      .json({ message: 'Forbidden' })
}

const createErrorHandler = (statusCode, message, data = {}, res) => {
  return res.status(statusCode).json({ message, ...data });
};

router.get("/current", requireAuth, async (req, res) => {
  const allBookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: [
          {
              model: Spot,
              attributes: { exclude: ["createdAt", "updatedAt"] },
              include: [
                  {
                      model: SpotImage,
                  },
              ],
          },
      ],
  });

  const bookings = allBookings.map((booking) => {
      const bookingJSON = booking.toJSON();

      const previewImage = bookingJSON.Spot.SpotImages.find((spotImage) => spotImage.preview);
      bookingJSON.Spot.previewImage = previewImage ? previewImage.url : null;

      delete bookingJSON.Spot.SpotImages;

      return {
          id: bookingJSON.id,
          spotId: bookingJSON.spotId,
          Spot: bookingJSON.Spot,
          userId: bookingJSON.userId,
          startDate: bookingJSON.startDate,
          endDate: bookingJSON.endDate,
          createdAt: bookingJSON.createdAt,
          updatedAt: bookingJSON.updatedAt,
      };
  });

  res.json({Bookings: bookings});
});

//======== Edit a Booking ========
router.put("/:bookingId", requireAuth, async (req, res, next) => {
  const { startDate, endDate } = req.body;

  const bookingId = req.params.bookingId;
  const spotId = req.params.spotId;
  const userId = req.user.id;

  const currentDate = new Date();

  const booking = await Booking.findByPk(bookingId);
  if (!booking) return createErrorHandler(404, "Booking couldn't be found", {}, res);

  const checkingPreviousStartDate = await Booking.findAll({
    where: {
      spotId: booking.spotId,
      startDate: { [Op.between]: [startDate, endDate] }
    }
  })
  const checkingPreviousEndDate = await Booking.findAll({
    where: {
      spotId: booking.spotId,
        endDate: { [Op.between]: [startDate, endDate] }
    }
  })

  if (booking.userId != req.user.id) return createErrorHandler(403, 'Forbidden', {}, res);
  if (new Date(booking.endDate) < currentDate) return createErrorHandler(403, "Past bookings can't be modified", {}, res);
  if (endDate < startDate) return createErrorHandler(400, 'Bad Request', { errors: { endDate: "endDate cannot come before startDate"} }, res);

  if(checkingPreviousStartDate.length > 0 && checkingPreviousEndDate.length === 0) {
    return createErrorHandler(403, 'Sorry, this spot is already booked for the specified dates', { errors: { endDate: "End date conflicts with an existing booking" } }, res);
  }
  if(checkingPreviousStartDate.length === 0 && checkingPreviousEndDate.length > 0) {
    return createErrorHandler(403, 'Sorry, this spot is already booked for the specified dates', { errors: { startDate: "Start date conflicts with an existing booking" } }, res);
  }

  if(checkingPreviousStartDate.length > 0 && checkingPreviousEndDate.length > 0) {
    return createErrorHandler(403, 'Sorry, this spot is already booked for the specified dates', { errors: { startDate: "Start date conflicts with an existing booking", endDate: "End date conflicts with an existing booking" } }, res);
  }
  else {
  const updatedBooking = await booking.update({ startDate, endDate });
  return res.json(updatedBooking);
}

});

//======== Delete a Booking ========
router.delete('/:bookingId', requireAuth, async (req, res) => {
  const bookingId = req.params.bookingId;
  const { user } = req;

  const bookingOwner = await  Booking.findByPk(bookingId)

  const bookedReview = await  Booking.destroy({ where: { id: bookingId, userId: req.user.id } })

  if(!bookingOwner) return res.status(404).json({ message: "Review couldn't be found" })
  else if(bookedReview) return res.status(200).json({ message: "Successfully deleted" })
  else if(bookingOwner && bookingOwner.reviewId !== req.user.id) next(err)
}, errorResponse403)

module.exports = router;
