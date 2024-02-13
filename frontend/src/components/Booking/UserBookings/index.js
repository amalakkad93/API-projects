import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserBookings } from "../../../store/bookings";
import BookingDetailModal from "./BookingDetailModal";
import "./UserBookings.css";

const UserBookings = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const userBookings = useSelector(
    (state) => state.bookings.userBookings || {}
  );
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    if (sessionUser) {
      dispatch(getUserBookings(sessionUser.id));
    }
  }, [dispatch, sessionUser]);

  const getPreviewImageUrl = (spotImages) => {
    const previewImage =
      spotImages.find((image) => image.preview) || spotImages[0];
    return previewImage ? previewImage.url : "default-image-url.jpg";
  };
  return (
    <div className="user-bookings-container">
      <h2>Your Bookings</h2>
      <div className="bookings-grid">
        {Object.keys(userBookings).length > 0 ? (
          Object.values(userBookings).map((booking, index) => (
            <div
              key={index}
              className="booking-card"
              onClick={() => setSelectedBooking(booking)}
            >
              <img
                src={getPreviewImageUrl(booking.Spot.SpotImages)}
                alt="Spot"
                className="booking-image"
              />
              <div className="booking-details">
                <h3>{booking.Spot.name}</h3>
                <p>
                  {booking.Spot.city}, {booking.Spot.state}
                </p>
                <p>Check-in: {booking.startDate}</p>
                <p>Check-out: {booking.endDate}</p>
              </div>
            </div>
          ))
        ) : (
          <p>You have no bookings.</p>
        )}
      </div>
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
};

export default UserBookings;
