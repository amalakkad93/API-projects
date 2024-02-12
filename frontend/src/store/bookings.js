import { csrfFetch } from "./csrf";

const GET_BOOKINGS_FOR_SPOT = "/bookings/getForSpot";
const CREATE_BOOKING = "/bookings/create";
const UPDATE_BOOKING = "/bookings/update";
const DELETE_BOOKING = "/bookings/delete";
const GET_USER_BOOKINGS = "/bookings/getUserBookings";

const actionGetBookingsForSpot = (bookings) => ({
  type: GET_BOOKINGS_FOR_SPOT,
  bookings,
});
const actionCreateBooking = (booking) => ({ type: CREATE_BOOKING, booking });
const actionUpdateBooking = (booking) => ({ type: UPDATE_BOOKING, booking });
const actionDeleteBooking = (bookingId) => ({
  type: DELETE_BOOKING,
  bookingId,
});
const actionGetUserBookings = (bookings) => ({
  type: GET_USER_BOOKINGS,
  bookings,
});

export const fetchBookingsForSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/bookings`);
  if (response.ok) {
    const { Bookings } = await response.json();
    console.log("--Fetched Bookings for Spot:", Bookings);
    dispatch(actionGetBookingsForSpot(Bookings));
    return Bookings;
  } else {
    const errors = await response.json();
    return errors;
  }
};

export const createBooking = (spotId, bookingData) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${spotId}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(bookingData)
  });

  const data = await response.json();

  if (!response.ok) {
    // Throw an error with the response so it can be caught
    throw {ok: response.ok, ...data};
  }

  dispatch(actionCreateBooking(data));
  return data;
};



export const updateBooking = (updatedBooking) => async (dispatch) => {
  const response = await csrfFetch(`/api/bookings/${updatedBooking.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedBooking),
  });

  if (response.ok) {
    const booking = await response.json();
    dispatch(actionUpdateBooking(booking));
    return booking;
  } else {
    const errors = await response.json();
    return errors;
  }
};

export const deleteBooking = (bookingId) => async (dispatch) => {
  const response = await csrfFetch(`/api/bookings/${bookingId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    dispatch(actionDeleteBooking(bookingId));
    return bookingId;
  } else {
    const errors = await response.json();
    return errors;
  }
};

export const getUserBookings = () => async (dispatch) => {
  const response = await csrfFetch("/api/bookings/user");

  if (response.ok) {
    const { Bookings } = await response.json();
    dispatch(actionGetUserBookings(Bookings));
    return Bookings;
  } else {
    const errors = await response.json();
    return errors;
  }
};

function normalizeArr(bookings) {
  const normalizedBookings = {};
  bookings.forEach((booking) => (normalizedBookings[booking.id] = booking));
  return normalizedBookings;
}

const initialState = {
  bookingsForSpot: {},
  userBookings: {},
  currentBooking: {},
};

export default function bookingReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case GET_BOOKINGS_FOR_SPOT:
      // newState = { ...state, bookingsForSpot: {} };
      // newState.bookingsForSpot = normalizeArr(action.bookings);
      // return newState;
      newState = { ...state, bookingsForSpot: action.bookings };
      return newState;

    case CREATE_BOOKING:
      newState = { ...state };
      newState.currentBooking = action.booking;
      return newState;

    case UPDATE_BOOKING:
      newState = { ...state, currentBooking: {} };
      newState.currentBooking = action.booking;
      return newState;

    case DELETE_BOOKING:
      newState = { ...state, bookingsForSpot: { ...state.bookingsForSpot } };
      delete newState.bookingsForSpot[action.bookingId];
      return newState;

    case GET_USER_BOOKINGS:
      newState = { ...state, userBookings: {} };
      newState.userBookings = normalizeArr(action.bookings);
      return newState;

    default:
      return state;
  }
}
