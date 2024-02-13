import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserBookings } from "../../../store/bookings";
import BookingDetailModal from "./BookingDetailModal";
import CancelBooking from "../CancelBooking";
import ClearBooking from "../ClearBooking";
import "./UserBookings.css";

const UserBookings = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const userBookings = useSelector(
    (state) => state.bookings.userBookings || {}
  );
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (sessionUser) {
      dispatch(getUserBookings(sessionUser.id)).then((bookingsFromStore) => {
        setBookings(bookingsFromStore);
      });
    }
  }, [dispatch, sessionUser]);

  const isPastEndDate = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    return end < today;
  };

  const getPreviewImageUrl = (spotImages) => {
    const previewImage =
      spotImages.find((image) => image.preview) || spotImages[0];
    return previewImage ? previewImage.url : "default-image-url.jpg";
  };
  return (
    <div className="user-bookings-container">
      <h2>Your Bookings</h2>
      <div className="bookings-grid">
        {bookings.length > 0 ? (
          bookings.map((booking, index) => (
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
              {isPastEndDate(booking.endDate) && (
                <ClearBooking bookingId={booking.id} onClearSuccess={() => dispatch(getUserBookings(sessionUser.id))} />
              )}
              <CancelBooking
                bookingId={booking.id}
                startDate={booking.startDate}
                onCancellationSuccess={() =>
                  dispatch(getUserBookings(sessionUser.id))
                }
              />
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
