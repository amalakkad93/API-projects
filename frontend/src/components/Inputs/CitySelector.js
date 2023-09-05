import React, { useState, useEffect } from 'react';
import { fetchCities } from '../../store/geonamesAPI';

export default function CitySelector({ selectedState, onCityChange }) {
    const [cities, setCities] = useState([]);

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
        <select onChange={(e) => {
            onCityChange(e.target.value);
        }}>
            <option value="">Select a City</option>
            {cities.map(city => (
                <option key={city.geonameId} value={city.geonameId}>
                    {city.name}
                </option>
            ))}
        </select>
    );
}
