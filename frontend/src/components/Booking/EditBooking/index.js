import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateBooking, getUserBookings } from '../../../store/bookings';
import DateSelection from '../DatePicker/DateSelection';

const EditBooking = ({ bookingId, spotId, userId, bookedDates, onSuccess }) => {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [error, setError] = useState('');

  const handleDatesSelected = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
    submitEditBooking(startDate, endDate);
  };

  const submitEditBooking = async (startDate, endDate) => {
    const updatedBooking = {
      id: bookingId,
      spotId,
      startDate: startDate.toISOString().split('T')[0], 
      endDate: endDate.toISOString().split('T')[0],
    };

    try {
      await dispatch(updateBooking(updatedBooking));
      alert('Booking updated successfully!');
      dispatch(getUserBookings(userId));
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to update booking. Please try again.');
    }
  };

  return (
    <div className="edit-booking-container">
      <h3>Edit Booking</h3>
      {error && <p className="error">{error}</p>}
      <DateSelection
        initialStartDate={startDate}
        initialEndDate={endDate}
        onDatesSelected={handleDatesSelected}
        bookedDates={bookedDates}
      />
    </div>
  );
};

export default EditBooking;
