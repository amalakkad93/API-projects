import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useModal } from "../../../context/Modal";

import "./DateSelection.css";

const DateSelection = ({
  initialStartDate,
  initialEndDate,
  onDatesSelected,
  bookedDates,
  currentBookingDates,
}) => {
  const { closeModal } = useModal();
  const [startDate, setStartDate] = useState(new Date(initialStartDate));
  const [endDate, setEndDate] = useState(new Date(initialEndDate));


  const bookedHighlight = bookedDates.map(date => new Date(date.setHours(0, 0, 0, 0)));

  let currentBookingHighlight = {};
  if (currentBookingDates.startDate && currentBookingDates.endDate) {
    let start = new Date(currentBookingDates.startDate).setHours(0, 0, 0, 0);
    let end = new Date(currentBookingDates.endDate).setHours(0, 0, 0, 0);
    currentBookingHighlight = {
      "react-datepicker__day--highlighted-current": [new Date(start), new Date(end)]
    };
  }

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleSubmit = () => {
    onDatesSelected({
      startDate: startDate,
      endDate: endDate,
    });
    closeModal();
  };

  return (
    <div className="date-selection-modal">
      <div className="date-selection-container">
        <ReactDatePicker
          selected={startDate}
          onChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
          minDate={new Date()}
          highlightDates={[...bookedHighlight, currentBookingHighlight]}
        />
        <button className="date-save-btn" onClick={handleSubmit}>
          Save Dates
        </button>
      </div>
    </div>
  );
};

export default DateSelection;
