// import React, { useState, useMemo } from "react";
// import ReactDatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import "./DatePicker.css";



// const DatePicker = ({ onDateSelect, existingBookings, initialStartDate, initialEndDate }) => {
//   const [startDate, setStartDate] = useState(initialStartDate || new Date());
//   const [endDate, setEndDate] = useState(initialEndDate || new Date());

//   const highlightedDates = useMemo(() => {
//     let allHighlightedDates = [];
//     existingBookings.forEach(booking => {
//       const start = new Date(booking.startDate);
//       const end = new Date(booking.endDate);
//       let currentDate = new Date(start);

//       while (currentDate <= end) {
//         allHighlightedDates.push(new Date(currentDate));
//         currentDate.setDate(currentDate.getDate() + 1);
//       }
//     });
//     return allHighlightedDates;
//   }, [existingBookings]);


//   // Logging for debugging purposes
//   console.log("Highlighted Dates:", highlightedDates.map(date => date.toISOString().split('T')[0]));
//   console.log("Existing Bookings:", existingBookings);

//   return (
//     <div className="date-pickers-container">
//       <div className="date-picker-section">
//         <ReactDatePicker
//           selected={startDate}
//           onChange={(date) => {
//             setStartDate(date);
//             onDateSelect({ startDate: date, endDate });
//           }}
//           startDate={startDate}
//           endDate={endDate}
//           selectsStart
//           dateFormat="MM/dd/yyyy"
//           minDate={new Date()}
//           highlightDates={highlightedDates}
//         />
//       </div>
//       <div className="date-picker-section">
//         <ReactDatePicker
//           selected={endDate}
//           onChange={(date) => {
//             setEndDate(date);
//             onDateSelect({ startDate, endDate: date });
//           }}
//           startDate={startDate}
//           endDate={endDate}
//           selectsEnd
//           dateFormat="MM/dd/yyyy"
//           minDate={startDate}
//           highlightDates={highlightedDates}
//         />
//       </div>
//     </div>
//   );
// };

// export default DatePicker;

import React, { useState, useEffect } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePicker.css";

const DatePicker = ({ onDateSelect, existingBookings, initialStartDate, initialEndDate }) => {
  const [startDate, setStartDate] = useState(initialStartDate || new Date());
  const [endDate, setEndDate] = useState(initialEndDate || new Date());
  const [error, setError] = useState("");

 // Function to check for booking conflicts
const isDateConflict = (start, end) => {
  const bookings = existingBookings || [];
  return bookings.some((booking) => {
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
          dateFormat="MM/dd/yyyy"
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
          dateFormat="MM/dd/yyyy"
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
