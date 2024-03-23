import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import {
  createSpotThunk,
  getSpotDetailThunk,
  updateSpotThunk,
} from "../../../store/spots";

import { GetCountries, GetState, GetCity } from "react-country-state-city";

import TextInput from "../../Inputs/TextInput";
import { LabeledInput } from "../../Inputs/LabeledInput";
import { LabeledTextarea } from "../../Inputs/LabeledTextarea";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

import SelectInput from "../../Inputs/SelectInput";

import LocationForm from "../../ LocationForm";

import "./SpotForm1.css";

export default function SpotForm({ formType, spotId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");

  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [lat, setLat] = useState(1);
  const [lng, setLng] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  const [validationObj, setValidationObj] = useState({});

  const [initialSpot, setInitialSpot] = useState({});

  const [selectActive, setSelectActive] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState([]);

  const sessionUser = useSelector((stateid) => stateid.session.user);

  // ***************useEffects***************
  useEffect(() => {
    if (formType === "Edit" && spotId) {
      dispatch(getSpotDetailThunk(spotId)).then((data) => {
        setAddress(data.address);
        setLat(data.lat);
        setLng(data.lng);
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
        setCountry(data.country);
        setState(data.state);
        setCity(data.city);
        setInitialSpot(data);
      });
    }
  }, [dispatch, formType, spotId]);

  const clearValidationError = (validationField) => {
    setValidationObj((prev) => {
      const newObj = { ...prev };
      delete newObj[validationField];
      return newObj;
    });
  };

  // ****************************************

  // ******************validateCommonFields**********************
  const validateCommonFields = () => {
    const errors = {};

    if (!address) errors.address = "Address is required";
    if (!country) errors.country = "Country is required";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    // if (!lat) errors.lat = "Latitude is required";
    // if (!lng) errors.lng = "Longitude is required";
    if (!name) errors.name = "Name is required";
    if (description.length < 30)
      errors.description = "Description needs a minimum of 30 characters";
    if (!price) errors.price = "Price is required";

    return errors;
  };
  // ****************************************

  // **********handleImages******************

  const handleImageChange = (e, fieldName) => {
    const files = Array.from(e.target.files);
    if (fieldName === "previewImage") {
      setSelectedFiles((prevFiles) => ({
        ...prevFiles,
        [fieldName]: e.target.files[0],
      }));
    } else if (fieldName === "additionalImages") {
      setSelectedFiles((prevFiles) => ({
        ...prevFiles,
        [fieldName]: [...(prevFiles.additionalImages || []), ...files],
      }));
    }
  };

  // ****************************************

  // **********handleInputChange******************
  const handleInputChange = (setterFunction, validationField) => (e) => {
    setterFunction(e.target.value);
    clearValidationError(validationField);
  };

  // Function to update address details from LocationAutocomplete
  const handleAddressDetailsUpdate = ({ address, city, state, country }) => {
    setAddress(address);
    setCity(city);
    setState(state);
    setCountry(country);
    // setLat(...);
    // setLng(...);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    let errorsObj = validateCommonFields();
    if (formType === "Create" && !Object.keys(selectedFiles).length) {
      errorsObj.previewImage = "At least one image is required";
    }

    if (Object.keys(errorsObj).length) {
      setValidationObj(errorsObj);
      return;
    }

    // Prepare spot details
    const spotDetails = {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    };

    const imageFiles = [selectedFiles.previewImage].concat(
      selectedFiles.additionalImages || []
    );

    try {
      let spotResult;

      if (formType === "Create") {
        // Dispatch the thunk for creating a spot and uploading images
        const actionResult = await dispatch(
          createSpotThunk(spotDetails, imageFiles, sessionUser)
        );
        if (actionResult.error) {
          throw new Error(
            actionResult.error.message || "Failed to create spot."
          );
        }
        spotResult = actionResult;
      } else if (formType === "Edit" && spotId) {
        const actionResult = await dispatch(
          updateSpotThunk({ ...spotDetails, id: spotId })
        );
        if (actionResult.error) {
          throw new Error(
            actionResult.error.message || "Failed to update spot."
          );
        }
        spotResult = actionResult;
      }

      navigate(`/spots/${spotResult.id}`);
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  // ****************************************
  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          {formType === "Create" ? "Create a new Spot" : "Update your Spot"}
        </Typography>

        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {/* Location Section */}
          <Typography variant="h6" gutterBottom>
            Where's your place located?
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Guests will only get your exact address once they booked a
            reservation.
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="address"
            label="Street Address"
            name="address"
            autoComplete="address"
            autoFocus
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <LocationForm
            setCountry={setCountry}
            setState={setState}
            setCity={setCity}
          />
          <Divider sx={{ my: 2 }} />

          {/* Name Section */}
          <Typography variant="h6" gutterBottom>
            Create a title for your spot
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Catch guests' attention with a spot title that highlights what makes
            your place special.
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name of your spot"
            name="name"
            autoComplete="name"
            value={name}
            onChange={handleInputChange(setName, "name")}
          />

          {/* Description Section */}
          <Typography variant="h6" gutterBottom>
            Describe your place to guests
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Mention the best features of your space, any special amenities like
            fast wifi or parking, and what you love about the neighborhood.
          </Typography>

          <TextField
            margin="normal"
            required
            fullWidth
            id="description"
            label="Description"
            name="description"
            autoComplete="description"
            multiline
            rows={4}
            value={description}
            onChange={handleInputChange(setDescription, "description")}
          />
          <Divider sx={{ my: 2 }} />

          {/* Price Section */}
          <Typography variant="h6" gutterBottom>
            Set a base price for your spot
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="price"
            label="Price per night (USD)"
            name="price"
            type="number"
            autoComplete="price"
            value={price}
            onChange={handleInputChange(setPrice, "price")}
          />
          <Divider sx={{ my: 2 }} />

          {/* Photos Section */}
          {formType === "Create" && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Liven up your spot with photos
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Upload at least one photo to publish your spot.
              </Typography>

              {/* Preview Image */}
              <FormControl fullWidth margin="normal">
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="preview-image-upload"
                  type="file"
                  onChange={(e) => handleImageChange(e, "previewImage")}
                />
                <label htmlFor="preview-image-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<PhotoCamera />}
                    sx={{
                      mt: 3,
                      mb: 2,
                      background:
                        "linear-gradient(to right, #00a699, #00a699 50%, #008489 100%)",
                      color: "#fff",
                    }}
                  >
                    Upload Preview Image
                  </Button>
                </label>
                {validationObj.previewImage && (
                  <FormHelperText error>
                    {validationObj.previewImage}
                  </FormHelperText>
                )}
              </FormControl>

              {/* Additional Images - Modified for multiple file upload */}
              <FormControl fullWidth margin="normal">
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="additional-images-upload"
                  type="file"
                  multiple
                  onChange={(e) => handleImageChange(e, "additionalImages")}
                />
                <label htmlFor="additional-images-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<PhotoCamera />}
                    sx={{
                      mt: 3,
                      mb: 2,
                      background:
                        "linear-gradient(to right, #00a699, #00a699 50%, #008489 100%)",
                      color: "#fff",
                    }}
                  >
                    Upload Additional Images
                  </Button>
                </label>
              </FormControl>
              {Object.keys(validationObj)
                .filter((key) => key.startsWith("imageUrl"))
                .map((key) => (
                  <FormHelperText key={key} error>
                    {validationObj[key]}
                  </FormHelperText>
                ))}
            </>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              background:
                "linear-gradient(to right, #e61e4d 0%, #e31c5f 50%, #d70466 100%)",
              color: "#fff",
              mt: 3,
              mb: 2,
            }}
          >
            {formType === "Create" ? "Create Spot" : "Update Spot"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
