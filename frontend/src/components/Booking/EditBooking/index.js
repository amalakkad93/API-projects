import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateBooking, getUserBookings } from "../../../store/bookings";
import DateSelection from "../DatePicker/DateSelection";

import { useModal } from "../../../context/Modal";
import "./EditBooking.css";

const EditBooking = ({
  bookingId,
  spotId,
  userId,
  bookedDates,
  initialStartDate,
  initialEndDate,
  onSuccess,
}) => {
  const dispatch = useDispatch();
  const { setModalContent, closeModal } = useModal();
  const [startDate, setStartDate] = useState(
    initialStartDate ? new Date(initialStartDate) : new Date()
  );
  const [endDate, setEndDate] = useState(
    initialEndDate ? new Date(initialEndDate) : new Date()
  );

  const [error, setError] = useState("");

  const handleDatesSelected = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
    submitEditBooking(startDate, endDate);
  };

  const submitEditBooking = async (startDate, endDate) => {
    const updatedBooking = {
      id: bookingId,
      spotId,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };

    try {
      await dispatch(updateBooking(updatedBooking));
      setModalContent(
        <div className="modal-success-message">
          <p>Booking updated successfully!</p>
          <button className="modal-success-button" onClick={closeModal}>
            Close
          </button>
        </div>
      );

      dispatch(getUserBookings(userId));
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || "Failed to update booking. Please try again.");
    }
  };

  return (
    <div
      className="edit-booking-container"
      onClick={(e) => e.stopPropagation()}
    >
      <h3>Edit Booking</h3>
      {error && <p className="error">{error}</p>}
      <DateSelection
        initialStartDate={startDate}
        initialEndDate={endDate}
        onDatesSelected={handleDatesSelected}
        // bookedDates={bookedDates}
        bookedDates={bookedDates.filter(
          (date) =>
            new Date(date) < new Date(initialStartDate) ||
            new Date(date) > new Date(initialEndDate)
        )}
        currentBookingDates={{
          startDate: initialStartDate,
          endDate: initialEndDate,
        }}
      />
    </div>
  );
};

export default EditBooking;
