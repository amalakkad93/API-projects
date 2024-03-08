import { csrfFetch } from "./csrf";

export const SET_FAVORITES = "favorites/SET_FAVORITES";
export const ADD_FAVORITE = "favorites/ADD_FAVORITE";
export const REMOVE_FAVORITE = "favorites/REMOVE_FAVORITE";

// Actions for handling errors
export const SET_FAVORITES_ERROR = "favorites/SET_FAVORITES_ERROR";
export const ADD_FAVORITE_ERROR = "favorites/ADD_FAVORITE_ERROR";
export const REMOVE_FAVORITE_ERROR = "favorites/REMOVE_FAVORITE_ERROR";

const actionGetFavorites = (favorites) => ({
  type: SET_FAVORITES,
  payload: favorites,
});

const actionAddFavorite = (favorite) => ({
  type: ADD_FAVORITE,
  payload: favorite,
});

const actionRemoveFavorite = (favoriteId) => ({
  type: REMOVE_FAVORITE,
  payload: favoriteId,
});

// Action creators for handling errors
const actionSetFavoritesError = (error) => ({
  type: SET_FAVORITES_ERROR,
  payload: error,
});

const actionAddFavoriteError = (error) => ({
  type: ADD_FAVORITE_ERROR,
  payload: error,
});

const actionRemoveFavoriteError = (error) => ({
  type: REMOVE_FAVORITE_ERROR,
  payload: error,
});

// Fetch all favorites for a user
export const fetchFavorites = (userId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/favorites/user/${userId}`);
    if (!response.ok) {
      const errors = await response.json();
      throw new Error(errors.message || "Could not fetch favorites.");
    }
    const data = await response.json();
    dispatch(actionGetFavorites(data.favorites));
  } catch (error) {
    console.error("Error fetching favorites:", error);
    dispatch(actionSetFavoritesError(error.toString()));
  }
};

// Add a new favorite
export const addFavorite = (userId, spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, spotId }),
    });
    if (!response.ok) {
      const errors = await response.json();
      throw new Error(errors.message || "Could not add favorite.");
    }
    const data = await response.json();
    dispatch(actionAddFavorite(data.favorite));
  } catch (error) {
    console.error("Error adding favorite:", error);
    dispatch(actionAddFavoriteError(error.toString()));
  }
};

// Remove a favorite
export const removeFavorite = (favoriteId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/favorites/${favoriteId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errors = await response.json();
      throw new Error(errors.message || "Could not remove favorite.");
    }
    dispatch(actionRemoveFavorite(favoriteId));
  } catch (error) {
    console.error("Error removing favorite:", error);
    dispatch(actionRemoveFavoriteError(error.toString()));
  }
};

const initialState = {
  items: [],
  error: null,
};

export default function favoritesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_FAVORITES:
      return { ...state, items: action.payload };
    case ADD_FAVORITE:
      return { ...state, items: [...state.items, action.payload] };
    case REMOVE_FAVORITE:
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    default:
      return state;
  }
}
