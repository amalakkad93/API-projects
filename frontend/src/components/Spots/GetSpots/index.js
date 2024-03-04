import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { getAllSpotsThunk, getOwnerAllSpotsThunk } from "../../../store/spots";
import OpenModalButton from "../../OpenModalButton";
import DeleteSpot from "../DeleteSpot/DeleteSpot";
import SleepInnStyleCard from "./SleepInnStyleCard";

import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
  Rating,
} from "@mui/material";

import "./GetSpots.css";

export default function GetSpots({ ownerMode = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spots = Object.values(
    useSelector((state) => (state.spots.allSpots ? state.spots.allSpots : []))
  );
  const sessionUser = useSelector((state) => state.session.user);
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  // Function to handle next image navigation
  const handleNextImage = (spotId, spotImagesLength) => {
    setCurrentImageIndex((prevState) => ({
      ...prevState,
      [spotId]: (prevState[spotId] + 1) % spotImagesLength,
    }));
  };

  // Function to handle previous image navigation
  const handlePrevImage = (spotId, spotImagesLength) => {
    setCurrentImageIndex((prevState) => ({
      ...prevState,
      [spotId]:
        ((prevState[spotId] || 0) - 1 + spotImagesLength) % spotImagesLength,
    }));
  };

  useEffect(() => {
    if (ownerMode) dispatch(getOwnerAllSpotsThunk());
    else dispatch(getAllSpotsThunk());
  }, [dispatch, ownerMode]);

  const spotsToDisplay =
    ownerMode && sessionUser
      ? spots.filter((spot) => spot.ownerId === sessionUser.id)
      : spots;
  const ownerSpots =
    ownerMode && sessionUser
      ? spots.filter((spot) => spot.ownerId === sessionUser.id)
      : 1;
  console.log("spotsToDisplay = ", spotsToDisplay)

  if (!spots || !spotsToDisplay) return null;

  return (
    <Box className="main-container" sx={{ padding: 2 }}>
      <Grid container spacing={4}>
        {spotsToDisplay.map((spot) => (
          <Grid item xs={12} sm={6} md={4} key={spot.id}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Box sx={{ position: "relative", height: 200, width: "100%" }}>
                <CardMedia
                  component="img"
                  image={
                    (spot.SpotImages && spot.SpotImages.length > 0
                      ? spot.SpotImages[currentImageIndex[spot.id] || 0]?.url
                      : "/defaultImage.jpg") || "/defaultImage.jpg"
                  }
                  alt={spot.name}
                  sx={{ height: 200, width: "100%" }}
                />
                {spot.SpotImages.length > 1 && (
                  <>
                    <Button
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: 0,
                        transform: "translateY(-50%)",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "rgba(0,0,0,0.7)",
                        },
                      }}
                      onClick={() =>
                        handlePrevImage(spot.id, spot.SpotImages.length)
                      }
                    >
                      &#10094;
                    </Button>
                    <Button
                      sx={{
                        position: "absolute",
                        top: "50%",
                        right: 0,
                        transform: "translateY(-50%)",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "rgba(0,0,0,0.7)",
                        },
                      }}
                      onClick={() =>
                        handleNextImage(spot.id, spot.SpotImages.length)
                      }
                    >
                      &#10095;
                    </Button>
                  </>
                )}
              </Box>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 1,
                  }}
                >
                  <Typography
                    variant="body1"
                    color="text.primary"
                    noWrap
                    sx={{ fontWeight: "bold", wordBreak: "break-word" }}
                  >
                    {spot.city}, {spot.state}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="body1"
                      color="text.primary"
                      sx={{ fontWeight: "bold", marginRight: "4px" }}
                    >
                      ★
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.primary"
                      sx={{ fontWeight: "normal" }}
                    >
                      {spot.avgRating ? spot.avgRating.toFixed(1) : "New"}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="body1"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Box component="span" sx={{ fontWeight: "bold" }}>
                    ${spot.price}
                  </Box>
                  <Box
                    component="span"
                    sx={{ fontWeight: "normal", marginLeft: "4px" }}
                  >
                    night
                  </Box>
                </Typography>
              </CardContent>
              {ownerMode && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/spots/edit/${spot.id}`)}
                    sx={{
                      minWidth: "90px",
                      height: "36px",
                      padding: "6px 16px",
                      color: "white",
                      backgroundImage:
                        "linear-gradient(to left, #e61e4d 0%, #e31c5f 50%, #d70466 100%)",
                      border: "none",
                      ":hover": {
                        opacity: 0.9,
                        backgroundImage:
                          "linear-gradient(to right, #e61e4d 0%, #e31c5f 50%, #d70466 100%)",
                      },
                    }}
                  >
                    Update
                  </Button>

                  <OpenModalButton
                    buttonText="Delete"
                    modalComponent={<DeleteSpot spotId={spot.id} />}
                    className="custom-delete-button"
                    style={{
                      minWidth: "90px",
                      height: "36px",
                      padding: "6px 16px",
                      color: "white",
                      backgroundColor: "grey",
                      border: "1px solid black",
                      marginTop: "18px",
                    }}
                  />
                </Box>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

//   return (
//     <>
//       <Box className="main-container" sx={{ padding: 2 }}>
//         {ownerMode && (
//           <Box
//             className="owner-div manage-create-a-new-spot"
//             sx={{ marginBottom: 2 }}
//           >
//             <Typography variant="h4" gutterBottom>
//               Manage Your Spots
//             </Typography>
//             {ownerSpots.length <= 0 && (
//               <Button
//                 variant="contained"
//                 color="primary"
//                 component={NavLink}
//                 to="/spots/new"
//                 sx={{ textDecoration: "none", color: "inherit" }}
//               >
//                 Create a New Spot
//               </Button>
//             )}
//           </Box>
//         )}
//         <Grid container spacing={4}>
//           {spotsToDisplay.map((spot) => (
//             <Grid item xs={12} sm={6} md={4} key={spot.id}>
//               <Card
//                 sx={{
//                   display: "flex",
//                   flexDirection: "column",
//                   height: "100%",
//                   cursor: 'pointer',
//                 }}
//               >
//                 <CardMedia
//                   component="img"
//                   image={spot.previewImage}
//                   alt={spot.name}
//                   sx={{ height: 200 }}
//                 />
//                 <CardContent>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       marginBottom: 1,
//                     }}
//                   >
//                     <Typography
//                       variant="body1"
//                       color="text.primary"
//                       noWrap
//                       sx={{ fontWeight: "bold", wordBreak: "break-word" }}
//                     >
//                       {spot.city}, {spot.state}
//                     </Typography>
//                     <Box sx={{ display: "flex", alignItems: "center" }}>
//                       <Typography
//                         variant="body1"
//                         color="text.primary"
//                         sx={{ fontWeight: "bold", marginRight: "4px" }}
//                       >
//                         ★
//                       </Typography>
//                       <Typography
//                         variant="body1"
//                         color="text.primary"
//                         sx={{ fontWeight: "normal" }}
//                       >
//                         {spot.avgRating ? spot.avgRating.toFixed(1) : "New"}
//                       </Typography>
//                     </Box>
//                   </Box>
//                   <Typography
//                     variant="body1"
//                     sx={{ display: "flex", alignItems: "center" }}
//                   >
//                     <Box component="span" sx={{ fontWeight: "bold" }}>
//                       ${spot.price}
//                     </Box>
//                     <Box
//                       component="span"
//                       sx={{ fontWeight: "normal", marginLeft: "4px" }}
//                     >
//                       night
//                     </Box>
//                   </Typography>
//                 </CardContent>

//                 {ownerMode && (
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       p: 2,
//                     }}
//                   >
//                     <Button
//                       variant="outlined"
//                       onClick={() => navigate(`/spots/edit/${spot.id}`)}
//                       sx={{
//                         minWidth: "90px",
//                         height: "36px",
//                         padding: "6px 16px",
//                         color: "white",
//                         backgroundImage:
//                           "linear-gradient(to left, #e61e4d 0%, #e31c5f 50%, #d70466 100%)",
//                         border: "none",
//                         ":hover": {
//                           opacity: 0.9,
//                           backgroundImage:
//                             "linear-gradient(to right, #e61e4d 0%, #e31c5f 50%, #d70466 100%)",
//                         },
//                       }}
//                     >
//                       Update
//                     </Button>

//                     <OpenModalButton
//                       buttonText="Delete"
//                       modalComponent={<DeleteSpot spotId={spot.id} />}
//                       className="custom-delete-button"
//                       style={{
//                         minWidth: "90px",
//                         height: "36px",
//                         padding: "6px 16px",
//                         color: "white",
//                         backgroundColor: "grey",
//                         border: "1px solid black",
//                         marginTop: "18px",
//                       }}
//                     />
//                   </Box>
//                 )}
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>
//     </>
//   );
// };

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate, NavLink } from "react-router-dom";
// import { getAllSpotsThunk, getOwnerAllSpotsThunk } from "../../../store/spots";
// import OpenModalButton from "../../OpenModalButton";
// import DeleteSpot from "../DeleteSpot/DeleteSpot";
// import SleepInnStyleCard from "./SleepInnStyleCard";

// import {
//   Card,
//   CardMedia,
//   CardContent,
//   Typography,
//   Button,
//   Grid,
//   Box,
//   Rating,
// } from "@mui/material";

// import "./GetSpots.css";

// export default function GetSpots({ ownerMode = false }) {
//   const spots = Object.values(
//     useSelector((state) => (state.spots.allSpots ? state.spots.allSpots : []))
//   );
//   const sessionUser = useSelector((state) => state.session.user);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (ownerMode) dispatch(getOwnerAllSpotsThunk());
//     else dispatch(getAllSpotsThunk());
//   }, [dispatch, ownerMode]);

//   const spotsToDisplay =
//     ownerMode && sessionUser
//       ? spots.filter((spot) => spot.ownerId === sessionUser.id)
//       : spots;
//   const ownerSpots =
//     ownerMode && sessionUser
//       ? spots.filter((spot) => spot.ownerId === sessionUser.id)
//       : 1;
//   // console.log("ownerSpots = ", ownerSpots.length)

//   if (!spots || !spotsToDisplay) return null;

//   return (
//     <>
//       <Box className="main-container" sx={{ padding: 2 }}>
//         {ownerMode && (
//           <Box
//             className="owner-div manage-create-a-new-spot"
//             sx={{ marginBottom: 2 }}
//           >
//             <Typography variant="h4" gutterBottom>
//               Manage Your Spots
//             </Typography>
//             {ownerSpots.length <= 0 && (
//               <Button
//                 variant="contained"
//                 color="primary"
//                 component={NavLink}
//                 to="/spots/new"
//                 sx={{ textDecoration: "none", color: "inherit" }}
//               >
//                 Create a New Spot
//               </Button>
//             )}
//           </Box>
//         )}
//         <Grid container spacing={4}>
//           {spotsToDisplay.map((spot) => (
//             <Grid item xs={12} sm={6} md={4} key={spot.id}>
//               <Card
//                 sx={{
//                   display: "flex",
//                   flexDirection: "column",
//                   height: "100%",
//                   cursor: 'pointer',
//                 }}
//               >
//                 <CardMedia
//                   component="img"
//                   image={spot.previewImage}
//                   alt={spot.name}
//                   sx={{ height: 200 }}
//                 />
//                 <CardContent>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       marginBottom: 1,
//                     }}
//                   >
//                     <Typography
//                       variant="body1"
//                       color="text.primary"
//                       noWrap
//                       sx={{ fontWeight: "bold", wordBreak: "break-word" }}
//                     >
//                       {spot.city}, {spot.state}
//                     </Typography>
//                     <Box sx={{ display: "flex", alignItems: "center" }}>
//                       <Typography
//                         variant="body1"
//                         color="text.primary"
//                         sx={{ fontWeight: "bold", marginRight: "4px" }}
//                       >
//                         ★
//                       </Typography>
//                       <Typography
//                         variant="body1"
//                         color="text.primary"
//                         sx={{ fontWeight: "normal" }}
//                       >
//                         {spot.avgRating ? spot.avgRating.toFixed(1) : "New"}
//                       </Typography>
//                     </Box>
//                   </Box>
//                   <Typography
//                     variant="body1"
//                     sx={{ display: "flex", alignItems: "center" }}
//                   >
//                     <Box component="span" sx={{ fontWeight: "bold" }}>
//                       ${spot.price}
//                     </Box>
//                     <Box
//                       component="span"
//                       sx={{ fontWeight: "normal", marginLeft: "4px" }}
//                     >
//                       night
//                     </Box>
//                   </Typography>
//                 </CardContent>

//                 {ownerMode && (
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       p: 2,
//                     }}
//                   >
//                     <Button
//                       variant="outlined"
//                       onClick={() => navigate(`/spots/edit/${spot.id}`)}
//                       sx={{
//                         minWidth: "90px",
//                         height: "36px",
//                         padding: "6px 16px",
//                         color: "white",
//                         backgroundImage:
//                           "linear-gradient(to left, #e61e4d 0%, #e31c5f 50%, #d70466 100%)",
//                         border: "none",
//                         ":hover": {
//                           opacity: 0.9,
//                           backgroundImage:
//                             "linear-gradient(to right, #e61e4d 0%, #e31c5f 50%, #d70466 100%)",
//                         },
//                       }}
//                     >
//                       Update
//                     </Button>

//                     <OpenModalButton
//                       buttonText="Delete"
//                       modalComponent={<DeleteSpot spotId={spot.id} />}
//                       className="custom-delete-button"
//                       style={{
//                         minWidth: "90px",
//                         height: "36px",
//                         padding: "6px 16px",
//                         color: "white",
//                         backgroundColor: "grey",
//                         border: "1px solid black",
//                         marginTop: "18px",
//                       }}
//                     />
//                   </Box>
//                 )}
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>
//     </>
//   );
// };
