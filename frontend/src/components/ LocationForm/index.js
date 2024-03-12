import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Country, State, City } from "country-state-city";

function LocationForm({ setCountry, setState, setCity }) {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    if (selectedCountry) {
      setCountry(selectedCountry.label);
      setState("");
      setCity("");
      setSelectedState(null);
      setSelectedCity(null);
    }
  }, [selectedCountry, setCountry, setState, setCity]);

  useEffect(() => {
    if (selectedState) {
      setState(selectedState.label);
      setCity("");
      setSelectedCity(null);
    }
  }, [selectedState, setState, setCity]);

  useEffect(() => {
    if (selectedCity) {
      setCity(selectedCity.label);
    }
  }, [selectedCity, setCity]);

  const countriesOptions = Country.getAllCountries().map((country) => ({
    label: country.name,
    value: country.isoCode,
  }));

  const stateOptions = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.value).map((state) => ({
        label: state.name,
        value: state.isoCode,
      }))
    : [];

  const cityOptions = selectedState
    ? City.getCitiesOfState(selectedCountry.value, selectedState.value).map(
        (city) => ({
          label: city.name,
          value: city.name,
        })
      )
    : [];

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      display: "block",
      width: "100%",
      height: "0.9rem",
      border: "1px solid #666",
      fontSize: "1rem",
      borderRadius: "5px",
      backgroundColor: "rgb(227, 233, 251)",
      padding: "2px 5px",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#666",
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: "#666",
    }),
  };

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <Select
          styles={customSelectStyles}
          options={countriesOptions}
          value={selectedCountry}
          onChange={(option) => setSelectedCountry(option)}
          placeholder="Select Country"
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <Select
          styles={customSelectStyles}
          options={stateOptions}
          value={selectedState}
          onChange={(option) => setSelectedState(option)}
          placeholder="Select State"
          isDisabled={!selectedCountry}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <Select
          styles={customSelectStyles}
          options={cityOptions}
          value={selectedCity}
          onChange={(option) => setSelectedCity(option)}
          placeholder="Select City"
          isDisabled={!selectedState}
        />
      </div>
    </div>
  );
}

export default LocationForm;

// import React, { useState, useEffect } from 'react';
// import Select from 'react-select';
// import { Country, State, City }  from 'country-state-city';

// function LocationForm({ setCountry, setState, setCity }) {
//   const [selectedCountry, setSelectedCountry] = useState(null);
//   const [selectedState, setSelectedState] = useState(null);
//   const [selectedCity, setSelectedCity] = useState(null);

//   useEffect(() => {
//     if (selectedCountry) {
//       setCountry(selectedCountry.label);

//       setState('');
//       setCity('');
//       setSelectedState(null);
//       setSelectedCity(null);
//     }
//   }, [selectedCountry, setCountry, setState, setCity]);

//   useEffect(() => {
//     if (selectedState) {
//       setState(selectedState.label);

//       setCity('');
//       setSelectedCity(null);
//     }
//   }, [selectedState, setState, setCity]);

//   useEffect(() => {
//     if (selectedCity) {
//       setCity(selectedCity.label);
//     }
//   }, [selectedCity, setCity]);

//   const countriesOptions = Country.getAllCountries().map(country => ({
//     label: country.name,
//     value: country.isoCode,
//   }));

//   const stateOptions = selectedCountry ? State.getStatesOfCountry(selectedCountry.value).map(state => ({
//     label: state.name,
//     value: state.isoCode,
//   })) : [];

//   const cityOptions = selectedState ? City.getCitiesOfState(selectedCountry.value, selectedState.value).map(city => ({
//     label: city.name,
//     value: city.name,
//   })) : [];

//   return (
//     <div>
//       <Select
//         options={countriesOptions}
//         value={selectedCountry}
//         onChange={option => setSelectedCountry(option)}
//         placeholder="Select Country"
//       />
//       <Select
//         options={stateOptions}
//         value={selectedState}
//         onChange={option => setSelectedState(option)}
//         placeholder="Select State"
//         isDisabled={!selectedCountry}
//       />
//       <Select
//         options={cityOptions}
//         value={selectedCity}
//         onChange={option => setSelectedCity(option)}
//         placeholder="Select City"
//         isDisabled={!selectedState}
//       />
//     </div>
//   );
// }

// export default LocationForm;
