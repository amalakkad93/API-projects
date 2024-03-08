import React from 'react';
import { useDispatch } from 'react-redux';
import { removeFavorite } from '../../../store/favorites';

const RemoveFavorite = ({ favoriteId }) => {
  const dispatch = useDispatch();

  const handleRemoveFavorite = () => {
    dispatch(removeFavorite(favoriteId));
  };

  return (
    <button onClick={handleRemoveFavorite}>Remove from Favorites</button>
  );
};

export default RemoveFavorite;
