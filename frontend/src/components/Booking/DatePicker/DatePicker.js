import React, { useState, useMemo, useEffect } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePicker.css";

const DatePicker = ({ onDateSelect, existingBookings }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {

    const bookings = existingBookings.map(booking => ({
      start: new Date(booking.startDate),
      end: new Date(booking.endDate)
    })).sort((a, b) => a.start - b.start);

    let firstAvailableDate = new Date();
    firstAvailableDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < bookings.length; i++) {
      const booking = bookings[i];

      if (firstAvailableDate < booking.start) {
        break;
      } else if (firstAvailableDate <= booking.end) {

        firstAvailableDate = new Date(booking.end);
        firstAvailableDate.setDate(firstAvailableDate.getDate() + 1);
      }
    }

    setStartDate(firstAvailableDate);
    setEndDate(new Date(firstAvailableDate));
  }, [existingBookings]);

  const highlightedDates = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return existingBookings.reduce((acc, booking) => {
      let currentDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);

      while (currentDate <= endDate) {
        if (currentDate >= today) {
          acc.push(currentDate);
        }
        currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
      }
      return acc;
    }, []);
  }, [existingBookings]);


  return (
    <div className="date-pickers-container">

      <div className="date-picker-section">
        <ReactDatePicker
          selected={startDate}
          onChange={date => {
            setStartDate(date);
            onDateSelect({ startDate: date, endDate });
          }}
          startDate={startDate}
          endDate={endDate}
          selectsStart
          dateFormat="MM/dd/yyyy"
          minDate={new Date()}
          highlightDates={highlightedDates}
        />
      </div>

      <div className="date-picker-section">
        <ReactDatePicker
          selected={endDate}
          onChange={date => {
            setEndDate(date);
            onDateSelect({ startDate, endDate: date });
          }}
          startDate={startDate}
          endDate={endDate}
          selectsEnd
          dateFormat="MM/dd/yyyy"
          minDate={startDate || new Date()}
          highlightDates={highlightedDates}
        />
      </div>
    </div>
  );
};

export default DatePicker;



//==================================
// import React, { useState, useMemo, useEffect } from "react";
// import ReactDatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import "./DatePicker.css";

// const DatePicker = ({ onDateSelect, existingBookings }) => {

//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);


//   useEffect(() => {

//     const bookings = existingBookings.map(booking => ({
//       start: new Date(booking.startDate),
//       end: new Date(booking.endDate)
//     })).sort((a, b) => a.start - b.start);

//     let firstAvailableDate = new Date();
//     firstAvailableDate.setHours(0, 0, 0, 0);

//     for (let i = 0; i < bookings.length; i++) {
//       const booking = bookings[i];

//       if (firstAvailableDate < booking.start) {
//         break;
//       } else if (firstAvailableDate <= booking.end) {

//         firstAvailableDate = new Date(booking.end);
//         firstAvailableDate.setDate(firstAvailableDate.getDate() + 1);
//       }
//     }

//     setStartDate(firstAvailableDate);
//     setEndDate(new Date(firstAvailableDate));
//   }, [existingBookings]);

//   const highlightedDates = useMemo(() => existingBookings.reduce((acc, booking) => {
//     let currentDate = new Date(booking.startDate);
//     const endDate = new Date(booking.endDate);

//     while (currentDate <= endDate) {
//       acc.push(new Date(currentDate));
//       currentDate.setDate(currentDate.getDate() + 1);
//     }

//     return acc;
//   }, []), [existingBookings]);



//   return (
//     <div className="date-pickers-container">
//       <div className="date-picker-section">
//         <ReactDatePicker
//           selected={startDate}
//           onChange={date => {
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
//           onChange={date => {
//             setEndDate(date);
//             onDateSelect({ startDate, endDate: date });
//           }}
//           startDate={startDate}
//           endDate={endDate}
//           selectsEnd
//           dateFormat="MM/dd/yyyy"
//           minDate={startDate || new Date()}
//           highlightDates={highlightedDates}
//         />
//       </div>
//     </div>
//   );
// };

// export default DatePicker;
