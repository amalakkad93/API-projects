import React, { useState, useEffect } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./GetSpotDetail.css";

const DatePicker = ({ onDateSelect, existingBookings }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [error, setError] = useState("");

  // Function to check for booking conflicts
  const isDateConflict = (start, end) => {
    return existingBookings.some(booking => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      return (start <= bookingEnd && start >= bookingStart) ||
             (end >= bookingStart && end <= bookingEnd) ||
             (start <= bookingStart && end >= bookingEnd);
    });
  };

  useEffect(() => {
    if (isDateConflict(startDate, endDate)) {
      setError("Selected dates conflict with an existing booking.");
    } else {
      setError(""); // Clear error if dates are okay
      onDateSelect({ startDate, endDate });
    }
  }, [startDate, endDate, existingBookings, onDateSelect]);

  return (
    // <div className="date-picker-container" style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
    <div className="date-picker-container" >
      {error && <div className="error-message">{error}</div>}
      <ReactDatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        minDate={new Date()}
        dateFormat="dd/MM/yyyy"
        className="date-picker"
      />
      <ReactDatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        dateFormat="dd/MM/yyyy"
        className="date-picker"
      />

    </div>
  );
};

export default DatePicker;
