import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { Box, Grid, Card, CardMedia, CardContent, Typography } from '@mui/material';
import { fetchFavorites } from '../../../store/favorites';
import ToggleFavorite from '../ToggleFavorite';
import DotIndicator from '../../Spots/GetSpots/DotIndicator';

export default function FavoriteSpotsList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector(state => state.session.user);
  const favorites = useSelector(state => state.favorites.items);

  useEffect(() => {
    if (sessionUser) {
      dispatch(fetchFavorites(sessionUser.id));
    }
  }, [dispatch, sessionUser]);

  return (
    <Box className="main-container" sx={{ padding: 2 }}>
      <Grid container spacing={4}>
        {favorites.map((favorite) => (
          <Grid item xs={12} sm={6} md={4} key={favorite.Spot.id}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                cursor: 'pointer',
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: 'none',
              }}
              onClick={() => navigate(`/spots/${favorite.Spot.id}`)}
            >
              <Box sx={{ position: 'relative', height: 300, overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  image={favorite.Spot.previewImage}
                  alt={favorite.Spot.name}
                  sx={{
                    height: 300,
                    width: '100%',
                    objectFit: 'cover',
                  }}
                />
                <ToggleFavorite
                  spotId={favorite.Spot.id}
                  isFavorited={true}
                />
                {favorite.Spot.otherImages && favorite.Spot.otherImages.length > 1 && (
                  <DotIndicator total={favorite.Spot.otherImages.length + 1} current={0} />
                )}
              </Box>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {favorite.Spot.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {favorite.Spot.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
