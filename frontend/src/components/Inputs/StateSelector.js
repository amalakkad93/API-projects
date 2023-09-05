import React, { useState, useEffect } from 'react';
import { fetchStates } from '../../store/geonamesAPI';

export default function StateSelector({ country, onStateChange }) {
    const [states, setStates] = useState([]);
    const [selectedState, setSelectedState] = useState("");

    useEffect(() => {
        const loadStates = async () => {
            if (country) {
                const data = await fetchStates(country);
                setStates(data);
            }
        };
        loadStates();
    }, [country]);

    return (
        <select onChange={(e) => {
            setSelectedState(e.target.value);
            onStateChange(e.target.value);
        }}>
            <option value="">Select a State</option>
            {states.map(state => (
                <option key={state.geonameId} value={state.geonameId}>
                    {state.name}
                </option>
            ))}
        </select>
    );
}
