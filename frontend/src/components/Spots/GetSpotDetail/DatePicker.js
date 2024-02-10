import React, { useState, useEffect } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePicker.css";

const DatePicker = ({ onDateSelect, existingBookings }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [error, setError] = useState("");

  // Function to check for booking conflicts
  const isDateConflict = (start, end) => {
    return existingBookings.some((booking) => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      return (
        (start <= bookingEnd && start >= bookingStart) ||
        (end >= bookingStart && end <= bookingEnd) ||
        (start <= bookingStart && end >= bookingEnd)
      );
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

    <div className="date-pickers-container">
      <div className="date-picker-section">
        <label htmlFor="startDate" className="date-picker-label">
          CHECK-IN
        </label>
        <ReactDatePicker
          id="startDate"
          selected={startDate}
          onChange={(date) => {
            setStartDate(date);
            onDateSelect({ startDate: date, endDate });
          }}
          dateFormat="dd/MM/yyyy"
          wrapperClassName="date-picker-wrapper"
          className="date-picker-input"
          onFocus={(e) => e.currentTarget.parentNode.classList.add('focused')}
          onBlur={(e) => e.currentTarget.parentNode.classList.remove('focused')}

        />
      </div>
      <div className="date-picker-section">
        <label htmlFor="endDate" className="date-picker-label">
          CHECKOUT
        </label>
        <ReactDatePicker
          id="endDate"
          selected={endDate}
          onChange={(date) => {
            setEndDate(date);
            onDateSelect({ startDate, endDate: date });
          }}
          dateFormat="dd/MM/yyyy"
          wrapperClassName="date-picker-wrapper"
          className="date-picker-input"
          onFocus={(e) => e.currentTarget.parentNode.classList.add('focused')}
          onBlur={(e) => e.currentTarget.parentNode.classList.remove('focused')}
        />
      </div>
    </div>
  );
};

export default DatePicker;
