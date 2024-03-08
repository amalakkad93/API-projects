import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFavorites } from '../../../store/favorites';

const GetFavorites = ({ userId }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.items);

  useEffect(() => {
    dispatch(fetchFavorites(userId));
  }, [dispatch, userId]);

  if (!favorites.length) return <p>No favorites added yet.</p>;

  return (
    <div>
      <h2>My Favorites</h2>
      <ul>
        {favorites.map((favorite) => (
          <li key={favorite.id}>{favorite.Spot.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default GetFavorites;
