// geonamesAPI.js
// import axios from 'axios';

const BASE_URL = "http://api.geonames.org/";
const USERNAME = "amalakkad";

export const fetchCountries = async () => {
  const response = await fetch(`${BASE_URL}countryInfoJSON?username=${USERNAME}`);
  const data = await response.json();

  console.log('Country data from API:', data);
  return data.geonames;
};

export const fetchStates = async (countryId) => {
  const response = await fetch(`${BASE_URL}childrenJSON?geonameId=${countryId}&username=${USERNAME}`);
  const data = await response.json();
  console.log('state data from API:', data);
  return data.geonames;
};

export const fetchCities = async (stateId) => {
  const response = await fetch(`${BASE_URL}childrenJSON?geonameId=${stateId}&username=${USERNAME}`);
  const data = await response.json();
  console.log('city data from API:', data);
  return data.geonames;
};

// export const fetchCountries = async () => {
//   const response = await fetch('http://api.geonames.org/countryInfoJSON?username=amalakkad');
//   const data = await response.json();
//   return data.geonames.map(country => ({ id: country.countryCode, name: country.countryName }));
// };

// export const fetchStates = async (countryCode) => {
//   const response = await fetch(`http://api.geonames.org/childrenJSON?geonameId=${countryCode}&username=amalakkad`);
//   const data = await response.json();
//   return data.geonames.map(state => ({ id: state.geonameId, name: state.name }));
// };

// export const fetchCities = async (stateId) => {
//   const response = await fetch(`http://api.geonames.org/childrenJSON?geonameId=${stateId}&username=amalakkad`);
//   const data = await response.json();
//   return data.geonames.map(city => ({ id: city.geonameId, name: city.name }));
// };



// const baseUrl = "http://api.geonames.org/"; // replace with actual endpoint
// const username = "amalakkad"; // replace with your GeoNames username



// export const fetchCountries = async () => {
//     const response = await axios.get(`${baseUrl}countries?username=${username}`);
//     return response.data; // you might need to adjust this depending on the API's response structure
// };

// export const fetchStates = async (countryCode) => {
//     const response = await axios.get(`${baseUrl}admin1CodesJSON?country=${countryCode}&username=${username}`);
//     return response.data;
// };

// export const fetchCities = async (stateCode) => {
//     const response = await axios.get(`${baseUrl}citiesJSON?adminCode1=${stateCode}&username=${username}`);
//     return response.data;
// };
// geonamesAPI.js
