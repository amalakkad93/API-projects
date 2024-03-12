import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createSpotThunk,
  getSpotDetailThunk,
  updateSpotThunk,
} from "../../../store/spots";

import { GetCountries, GetState, GetCity } from "react-country-state-city";

import TextInput from "../../Inputs/TextInput";
import { LabeledInput } from "../../Inputs/LabeledInput";
import { LabeledTextarea } from "../../Inputs/LabeledTextarea";
import SelectInput from "../../Inputs/SelectInput";

import LocationForm from "../../ LocationForm";

import "./SpotForm.css";

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
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // reader.result, contains the base64 encoded string
        setSelectedFiles({
          ...selectedFiles,
          [fieldName]: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }

    clearValidationError(fieldName);
  };
  const handleImages = () => {
    let newSpotImages = [];
    Object.keys(selectedFiles).forEach((key) => {
      if (selectedFiles[key]) {
        newSpotImages.push({
          base64: selectedFiles[key],
          fileName: key,
          preview: key === "previewImage",
        });
      }
    });

    return newSpotImages.length > 0 ? newSpotImages : null;
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

    let errorsObj = validateCommonFields();
    if (formType === "Create" && Object.keys(selectedFiles).length === 0)
      errorsObj.previewImage = "At least one image is required";

    if (Object.keys(errorsObj).length) {
      setValidationObj(errorsObj);
      return;
    }

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

    try {
      let spotId;

      if (formType === "Create") {
        try {
          const createdSpot = await dispatch(createSpotThunk(spotDetails, sessionUser));
         
          spotId = createdSpot.id;
        } catch (error) {
          console.error("Error in form submission:", error);
        }
      } else if (formType === "Edit") {
        const updatedSpot = await dispatch(
          updateSpotThunk({ ...spotDetails, id: spotId }, sessionUser)
        ).then((res) => res.json());
        spotId = updatedSpot.id;
      }

      if (!spotId) {
        throw new Error("Failed to get spot ID after creation or update.");
      }

      const uploadImages = async (spotId, selectedFiles) => {
        const urls = await Promise.all(
          Object.entries(selectedFiles).map(async ([key, file]) => {
            const formData = new FormData();
            formData.append("image", file);

            const response = await fetch(`/api/spots/${spotId}/images`, {
              method: "POST",
              body: formData,
            });

            if (!response.ok)
              throw new Error(`Failed to upload image for key: ${key}`);
            return await response.json();
          })
        );
        return urls;
      };

      await uploadImages(spotId, selectedFiles);

      navigate(`/spots/${spotId}`);
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  // ****************************************
  return (
    <div className="form-container">
      <form
        className={
          formType === "Create" ? "create-container" : "edit-container"
        }
        onSubmit={handleSubmit}
      >
        <h1 className="form-header-h1">
          {formType === "Create" ? "Create a new Spot" : "Update your Spot"}
        </h1>
        <div className="form-div-container">
          {/* ***************************Country*************************************** */}
          <div className="box-style location-main-container">
            <div className="form-h2-h3-div">
              <h2 className="form-h2">Where's your place located?</h2>
              <h3 className="form-h3">
                Guests will only get your exact address once they booked a
                reservation.
              </h3>
            </div>

            {/* <div className="error-container"> <p>State</p>{validationObj.stateid && (<p className="errors">{validationObj.stateid}</p>)}</div> */}

            {/* ****************************Address************************************ */}

            {/* <div className="error-container"><p>Street Address</p>{validationObj.address && (<p className="errors">{validationObj.address}</p>)}</div> */}
            <LabeledInput title="Street Address" error={validationObj.address}>
              <TextInput
                id="address"
                type="text"
                label="Street Address"
                value={address}
                error={validationObj.address}
                placeholder="Address"
                onChange={handleInputChange(setAddress, "address")}
                className="input-form"
              />
            </LabeledInput>

            <div style={{ marginTop: "10px" }}>
              <LocationForm
                setCountry={setCountry}
                setState={setState}
                setCity={setCity}
              />
            </div>

            <hr></hr>
            {/* ****************************description************************************ */}
            <div
              className={
                formType === "Create"
                  ? "create-description-textarea"
                  : "edit-description-textarea"
              }
            >
              <div className="form-h2-h3-div">
                <h2 className="form-h2">Describe your place to guests</h2>
                <h3 className="form-h3">
                  Mention the best features of your space, any special
                  amentities like fast wifi or parking, and what you love about
                  the neighborhood.
                </h3>
              </div>
              <LabeledTextarea>
                <textarea
                  id="description"
                  placeholder="Please write at least 30 characters."
                  value={description}
                  onChange={handleInputChange(setDescription, "description")}
                  className={formType === "Edit" ? "edit-form-textarea" : ""}
                />
              </LabeledTextarea>
              <div className="error-container">
                {validationObj.description && (
                  <p className="errors">{validationObj.description}</p>
                )}
              </div>
            </div>
            <hr></hr>
            {/* ****************************Name************************************ */}
            <div className="form-h2-h3-div">
              <h2 className="form-h2">Create a title for your spot</h2>
              <h3 className="form-h3">
                Catch guests' attention with a spot title that highlights what
                makes your place special.
              </h3>
            </div>
            <LabeledInput>
              <TextInput
                id="name"
                type="text"
                value={name}
                placeholder="Name of your spot"
                onChange={handleInputChange(setName, "name")}
                className="input-form"
              />
            </LabeledInput>
            {validationObj.name && (
              <p className="errors">{validationObj.name}</p>
            )}
            <hr></hr>
            {/* ****************************Price************************************ */}
            <div className="form-h2-h3-div">
              <h2 className="form-h2">Set a base price for your spot</h2>
              <h3 className="form-h3">
                Competitive pricing can help your listing stand out and rank
                higher in search results.
              </h3>
            </div>
            <LabeledInput>
              <div className="price-div-form">
                <span className="dollar-sign">$</span>
                <TextInput
                  id="price"
                  type="number"
                  value={price}
                  placeholder="Price per night (USD)"
                  onChange={handleInputChange(setPrice, "price")}
                  className="input-form"
                />
              </div>
            </LabeledInput>
            {validationObj.price && (
              <p className="errors">{validationObj.price}</p>
            )}
            <hr></hr>
            {/* ****************************Images************************************ */}
            {formType === "Create" && (
              <>
                <div className="form-h2-h3-div">
                  <h2 className="form-h2">Liven up your spot with photos</h2>
                  <h3 className="form-h3">
                    Upload at least one photo to publish your spot.
                  </h3>
                </div>

                {/* ****************************previewImage************************************ */}
                <LabeledInput
                  title="Preview Image"
                  error={validationObj.previewImage}
                >
                  <input
                    id="previewImage"
                    type="file"
                    onChange={(e) => handleImageChange(e, "previewImage")}
                    className="input-form"
                    accept="image/png, image/jpeg"
                  />
                </LabeledInput>
                {validationObj.previewImage && (
                  <p className="errors">{validationObj.previewImage}</p>
                )}

                {/* Additional Images */}
                {Array.from({ length: 4 }).map((_, index) => (
                  <LabeledInput key={index} title={`Image ${index + 2}`}>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleImageChange(e, `imageUrl${index + 2}`)
                      }
                      className="input-form"
                      accept="image/png, image/jpeg"
                    />
                  </LabeledInput>
                ))}

                {/* Display validation errors for additional images if any */}
                {Object.keys(validationObj)
                  .filter((key) => key.startsWith("imageUrl"))
                  .map((key) => (
                    <p key={key} className="errors">
                      {validationObj[key]}
                    </p>
                  ))}
                <hr></hr>
              </>
            )}
          </div>

          {/* <div className='button-form-div'> */}
          <button
            className="spot-form-btn"
            type="submit"
            disabled={Object.keys(validationObj).length > 0}
          >
            {formType === "Create" ? "Create Spot" : "Update Spot"}
          </button>
          {/* </div> */}
        </div>
      </form>
    </div>
  );
}
