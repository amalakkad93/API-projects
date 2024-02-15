import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faSignInAlt,
  faSignOutAlt,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { getUserBookings } from "../../../store/bookings";
import { formatDate } from ".././../../assets/HelperFunctions";
import BookingDetailModal from "./BookingDetailModal";
import CancelBooking from "../CancelBooking";
import EditBooking from "../EditBooking";

import "./UserBookings.css";

const UserBookings = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const bookings = useSelector((state) =>
    Object.values(state.bookings.userBookings || {})
  );
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [clearedBookings, setClearedBookings] = useState([]);
  const [editMode, setEditMode] = useState(null);

  useEffect(() => {
    if (sessionUser) {
      dispatch(getUserBookings(sessionUser.id));
    }
  }, [dispatch, sessionUser]);

  const toggleEditMode = (bookingId, e) => {
    e.stopPropagation();
    if (editMode === bookingId) {
      setEditMode(null);
    } else {
      setEditMode(bookingId);
    }
  };

  const getPreviewImageUrl = (spotImages) => {
    const previewImage =
      spotImages.find((image) => image.preview) || spotImages[0];
    return previewImage ? previewImage.url : "default-image-url.jpg";
  };

  const getBookedDatesForSpot = (currentBookingId, spotId) => {
    return bookings
      .filter(
        (booking) =>
          booking.spotId === spotId && booking.id !== currentBookingId
      )
      .reduce((dates, booking) => {
        dates.push(new Date(booking.startDate));
        dates.push(new Date(booking.endDate));
        return dates;
      }, []);
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

                <div
                  className="booking-action-buttons"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CancelBooking
                    bookingId={booking.id}
                    startDate={booking.startDate}
                    onCancellationSuccess={() => {
                      dispatch(getUserBookings(sessionUser.id));
                    }}
                    className="cancel-booking-button"
                  />
                  {new Date(booking.endDate) > new Date() && (
                    <button
                      onClick={(e) => toggleEditMode(booking.id, e)}
                      className="edit-booking-button"
                    >
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                  )}
                </div>
                {editMode === booking.id && (
                  <EditBooking
                    bookingId={booking.id}
                    spotId={booking.spotId}
                    userId={sessionUser.id}
                    bookedDates={getBookedDatesForSpot(
                      booking.id,
                      booking.spotId
                    )}
                    onSuccess={() => {
                      dispatch(getUserBookings(sessionUser.id));
                      setEditMode(null);
                    }}
                  />
                )}
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
