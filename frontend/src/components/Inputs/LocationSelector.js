import React, { useState, useEffect } from 'react';
import { fetchCountries, fetchStates, fetchCities } from '../../store/geonamesAPI';

export default function LocationSelector({ onCountryChange, onStateChange, onCityChange }) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  useEffect(() => {
    const loadCountries = async () => {
      const data = await fetchCountries();
      setCountries(data);
    };
    loadCountries();
  }, []);

  useEffect(() => {
    const loadStates = async () => {
      if (selectedCountry) {
        const data = await fetchStates(selectedCountry);
        setStates(data);
      }
    };
    loadStates();
  }, [selectedCountry]);

  useEffect(() => {
    const loadCities = async () => {
      if (selectedState) {
        const data = await fetchCities(selectedState);
        setCities(data);
      }
    };
    loadCities();
  }, [selectedState]);

  return (
    <>
      <select value={selectedCountry} onChange={(e) => {
        setSelectedCountry(e.target.value);
        const countryName = countries.find(country => country.geonameId === e.target.value).name;
        onCountryChange(e.target.value, countryName);
      }}>
        {/* Render countries options */}
      </select>
      <select value={selectedState} onChange={(e) => {
        setSelectedState(e.target.value);
        const stateName = states.find(state => state.geonameId === e.target.value).name;
        onStateChange(e.target.value, stateName);
      }}>
        {/* Render states options */}
      </select>
      <select onChange={(e) => {
        const cityName = cities.find(city => city.geonameId === e.target.value).name;
        onCityChange(e.target.value, cityName);
      }}>
        {/* Render cities options */}
      </select>
    </>
  );
}
