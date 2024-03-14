import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function LocationForm({ setCountry, setState, setCity }) {

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");


  useEffect(() => {
    if (selectedCountry) {
      const country = Country.getCountryByCode(selectedCountry);
      setCountry(country ? country.name : "");
      setState("");
      setCity("");
      setSelectedState("");
      setSelectedCity("");
    }
  }, [selectedCountry, setCountry, setState, setCity]);

  useEffect(() => {
    if (selectedState) {
      const state = State.getStateByCodeAndCountry(
        selectedState,
        selectedCountry
      );
      setState(state ? state.name : "");
      setCity("");
      setSelectedCity("");
    }
  }, [selectedState, setState, setCity, selectedCountry]);

  useEffect(() => {
    if (selectedCity) {
      setCity(selectedCity);
    }
  }, [selectedCity, setCity]);

  const countriesOptions = Country.getAllCountries().map((country) => ({
    label: country.name,
    value: country.isoCode,
  }));

  const stateOptions = selectedCountry
    ? State.getStatesOfCountry(selectedCountry).map((state) => ({
        label: state.name,
        value: state.isoCode,
      }))
    : [];

  const cityOptions = selectedState
    ? City.getCitiesOfState(selectedCountry, selectedState).map((city) => ({
        label: city.name,
        value: city.name, 
      }))
    : [];

  return (
    <div>
      <FormControl fullWidth margin="normal">
        <InputLabel id="country-select-label">Country</InputLabel>
        <Select
          labelId="country-select-label"
          id="country-select"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          {countriesOptions.map((country) => (
            <MenuItem key={country.value} value={country.value}>
              {country.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal" disabled={!selectedCountry}>
        <InputLabel id="state-select-label">State</InputLabel>
        <Select
          labelId="state-select-label"
          id="state-select"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
        >
          {stateOptions.map((state) => (
            <MenuItem key={state.value} value={state.value}>
              {state.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal" disabled={!selectedState}>
        <InputLabel id="city-select-label">City</InputLabel>
        <Select
          labelId="city-select-label"
          id="city-select"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          {cityOptions.map((city) => (
            <MenuItem key={city.value} value={city.value}>
              {city.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default LocationForm;

// import React, { useState, useEffect } from "react";
// import Select from "react-select";
// import { Country, State, City } from "country-state-city";

// function LocationForm({ setCountry, setState, setCity }) {
//   const [selectedCountry, setSelectedCountry] = useState(null);
//   const [selectedState, setSelectedState] = useState(null);
//   const [selectedCity, setSelectedCity] = useState(null);

//   useEffect(() => {
//     if (selectedCountry) {
//       setCountry(selectedCountry.label);
//       setState("");
//       setCity("");
//       setSelectedState(null);
//       setSelectedCity(null);
//     }
//   }, [selectedCountry, setCountry, setState, setCity]);

//   useEffect(() => {
//     if (selectedState) {
//       setState(selectedState.label);
//       setCity("");
//       setSelectedCity(null);
//     }
//   }, [selectedState, setState, setCity]);

//   useEffect(() => {
//     if (selectedCity) {
//       setCity(selectedCity.label);
//     }
//   }, [selectedCity, setCity]);

//   const countriesOptions = Country.getAllCountries().map((country) => ({
//     label: country.name,
//     value: country.isoCode,
//   }));

//   const stateOptions = selectedCountry
//     ? State.getStatesOfCountry(selectedCountry.value).map((state) => ({
//         label: state.name,
//         value: state.isoCode,
//       }))
//     : [];

//   const cityOptions = selectedState
//     ? City.getCitiesOfState(selectedCountry.value, selectedState.value).map(
//         (city) => ({
//           label: city.name,
//           value: city.name,
//         })
//       )
//     : [];

//   const customSelectStyles = {
//     control: (provided) => ({
//       ...provided,

//       backgroundColor: "rgb(227, 233, 251)",
//     }),
//     indicatorsContainer: (provided) => ({
//       ...provided,
//       height: "30px",
//     }),
//     indicatorSeparator: (provided) => ({
//       ...provided,
//       width: "0px",
//     }),
//   };

//   return (
//     <div>
//       <div style={{ marginBottom: "10px" }}>
//         <Select
//           styles={customSelectStyles}
//           options={countriesOptions}
//           value={selectedCountry}
//           onChange={(option) => setSelectedCountry(option)}
//           placeholder="Select Country"
//         />
//       </div>

//       <div style={{ marginBottom: "10px" }}>
//         <Select
//           styles={customSelectStyles}
//           options={stateOptions}
//           value={selectedState}
//           onChange={(option) => setSelectedState(option)}
//           placeholder="Select State"
//           isDisabled={!selectedCountry}
//         />
//       </div>
//       <div style={{ marginBottom: "10px" }}>
//         <Select
//           styles={customSelectStyles}
//           options={cityOptions}
//           value={selectedCity}
//           onChange={(option) => setSelectedCity(option)}
//           placeholder="Select City"
//           isDisabled={!selectedState}
//         />
//       </div>
//     </div>
//   );
// }

// export default LocationForm;
