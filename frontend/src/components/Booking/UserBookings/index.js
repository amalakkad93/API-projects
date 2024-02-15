import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { getUserBookings } from "../../../store/bookings";
import { formatDate } from ".././../../assets/HelperFunctions";
import BookingDetailModal from "./BookingDetailModal";
import CancelBooking from "../CancelBooking";
import ClearBooking from "../ClearBooking";

import "./UserBookings.css";

const UserBookings = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  // const [bookings, setBookings] = useState([]);
  const bookings = useSelector((state) =>
    Object.values(state.bookings.userBookings || {})
  );
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [clearedBookings, setClearedBookings] = useState([]);
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
        {bookings.length > 0 ? (
          bookings
            .filter((booking) => !clearedBookings.includes(booking.id))
            .map((booking, index) => (
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
                {/* <div className="booking-details">
                  <h3>{booking.Spot.name}</h3>
                  <p>
                    {booking.Spot.city}, {booking.Spot.state}
                  </p>
                  <p>Check-in: {formatDate(booking.startDate)}</p>
                  <p>Check-out: {formatDate(booking.endDate)}</p>
                </div> */}

                <div className="booking-details">
                  <h3>{booking.Spot.name}</h3>
                  <p>
                    <span className="booking-detail-icon">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                    </span>
                    {booking.Spot.city}, {booking.Spot.state}
                  </p>
                  <p>
                    <span className="booking-detail-icon">
                      <FontAwesomeIcon icon={faSignInAlt} />
                    </span>
                    Check-in: {formatDate(booking.startDate)}
                  </p>
                  <p>
                    <span className="booking-detail-icon">
                      <FontAwesomeIcon icon={faSignOutAlt} />
                    </span>
                    Check-out: {formatDate(booking.endDate)}
                  </p>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                  <CancelBooking
                    bookingId={booking.id}
                    startDate={booking.startDate}
                    onCancellationSuccess={() => {
                      dispatch(getUserBookings(sessionUser.id));
                    }}
                  />
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
