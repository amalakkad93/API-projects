import React, { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useModal } from '../../../context/Modal';

import './DateSelection.css';

const DateSelection = ({ initialStartDate, initialEndDate, onDatesSelected }) => {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const { closeModal } = useModal();

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleSubmit = () => {
    onDatesSelected({
      startDate: startDate,
      endDate: endDate
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
        />
        <button className='date-save-btn' onClick={handleSubmit}>Dates</button>
      </div>
    </div>
  );

};

export default DateSelection;
