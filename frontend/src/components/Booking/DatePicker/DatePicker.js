import React, { useState, useEffect, useMemo } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePicker = ({ onDateSelect, existingBookings }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const bookedDates = useMemo(() => existingBookings.reduce((acc, booking) => {
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);

    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      acc.push(new Date(d));
    }

    return acc;
  }, []), [existingBookings]);

  const isDateBooked = date => {
    return bookedDates.some(bookedDate =>
      date.getDate() === bookedDate.getDate() &&
      date.getMonth() === bookedDate.getMonth() &&
      date.getFullYear() === bookedDate.getFullYear()
    );
  };

  const filterDates = date => {
    return !isDateBooked(date);
  };

  useEffect(() => {
    onDateSelect({ startDate, endDate });
  }, [startDate, endDate, onDateSelect]);

  return (
    <div className="date-picker-container">
      <ReactDatePicker
        selected={startDate}
        onChange={date => setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        minDate={new Date()}
        filterDate={filterDates}
        dateFormat="MM/dd/yyyy"
      />
      <ReactDatePicker
        selected={endDate}
        onChange={date => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        filterDate={filterDates}
        dateFormat="MM/dd/yyyy"
      />
    </div>
  );
};

export default DatePicker;



// import React, { useState, useEffect, useMemo } from "react";
// import ReactDatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import "./DatePicker.css";

// const DatePicker = ({ onDateSelect, existingBookings }) => {
//   const [startDate, setStartDate] = useState();
//   const [endDate, setEndDate] = useState();

//   useEffect(() => {
//     if (existingBookings.length > 0 && !startDate) {
//       // Sort bookings by end date
//       const sortedBookings = [...existingBookings].sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
//       const lastBooking = sortedBookings[sortedBookings.length - 1];
//       const firstAvailableDate = new Date(lastBooking.endDate);
//       firstAvailableDate.setDate(firstAvailableDate.getDate() + 1);

//       // Check if the first available date is in the past
//       const today = new Date();
//       if (firstAvailableDate < today) {
//         firstAvailableDate.setDate(today.getDate());
//       }

//       setStartDate(firstAvailableDate);
//       setEndDate(firstAvailableDate);
//       onDateSelect({ startDate: firstAvailableDate, endDate: firstAvailableDate });
//     }
//   }, [existingBookings, onDateSelect]); // Removed startDate from dependencies

//   const highlightedDates = useMemo(() => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Reset time to start of the day for comparison

//     const dates = existingBookings.flatMap(booking => {
//       let currentDate = new Date(booking.startDate);
//       const endDate = new Date(booking.endDate);
//       const datesArray = [];

//       while (currentDate <= endDate) {
//         if (currentDate >= today) {
//           datesArray.push(new Date(currentDate));
//         }
//         currentDate.setDate(currentDate.getDate() + 1);
//       }

//       return datesArray;
//     });

//     return dates;
//   }, [existingBookings]);


//   return (
//     <div className="date-pickers-container">
//       <div className="date-picker-section">
//       <span className="date-picker-label">CHECK-IN</span>
//         <ReactDatePicker
//           selected={startDate}
//           onChange={(date) => {
//             setStartDate(date);
//             setEndDate(endDate < date ? date : endDate);
//             onDateSelect({ startDate: date, endDate: endDate < date ? date : endDate });
//           }}
//           selectsStart
//           startDate={startDate}
//           endDate={endDate}
//           minDate={new Date()}
//           highlightDates={highlightedDates}
//           dateFormat="MM/dd/yyyy"
//         />
//       </div>
//       <div className="date-picker-section">
//         <span className="date-picker-label">CHECKOUT</span>
//         <ReactDatePicker
//           selected={endDate}
//           onChange={(date) => {
//             setEndDate(date);
//             onDateSelect({ startDate, endDate: date });
//           }}
//           selectsEnd
//           startDate={startDate}
//           endDate={endDate}
//           minDate={startDate}
//           highlightDates={highlightedDates}
//           dateFormat="MM/dd/yyyy"
//         />
//       </div>
//     </div>
//   );
// };

// export default DatePicker;
