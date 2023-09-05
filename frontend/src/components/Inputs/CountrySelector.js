import React, { useState, useEffect } from 'react';
import { fetchCountries } from '../../store/geonamesAPI';
import "./Inputs.css";

export default function CountrySelector({ onCountryChange }) {
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        const loadCountries = async () => {
            const data = await fetchCountries();
            setCountries(data);
        };
        loadCountries();
    }, []);

    return (
        // <select className="country-selector" onChange={(e) => {
        //     onCountryChange(e.target.value);
        // }}>

        //     {countries.map(country => (
        //         <option className="country-selector" key={country.geonameId} value={country.geonameId}>
        //             {country.name}
        //         </option>
        //     ))}
        // </select>
        <select className="country-selector" onChange={(e) => onCountryChange(e.target.value)} style={{color: "black"}}>
    <option value="" disabled selected>Select a country</option>
    {countries.map(country => (
        <option className="country-selector" key={country.geonameId} value={country.geonameId}>
            {country.name}
        </option>
    ))}
</select>

    );
}
