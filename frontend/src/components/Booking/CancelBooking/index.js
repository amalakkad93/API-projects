import React from 'react';
import { useDispatch } from 'react-redux';
import { cancelBooking } from '../../../store/bookings';
import './CancelBooking.css';

const CancelBooking = ({ bookingId, startDate, onCancellationSuccess }) => {
  const dispatch = useDispatch();

  const handleCancel = async () => {
    const confirmed = window.confirm('Are you sure you want to cancel this booking?');
    if (confirmed) {
      await dispatch(cancelBooking(bookingId));
      onCancellationSuccess();
    }
  };

  const isBookingStarted = new Date(startDate) < new Date();

  if (isBookingStarted) {
    return null;
  }

  return (
    <button onClick={handleCancel} className="cancel-booking-btn">
      Cancel Booking
    </button>
  );
};

export default CancelBooking;
