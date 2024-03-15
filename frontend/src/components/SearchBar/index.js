import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { searchSpotsThunk } from '../../store/spots';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      dispatch(searchSpotsThunk(searchTerm));
      
      // navigate(`/search?location=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px' }}>
      <input
        type="text"
        placeholder="Search spots by location..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: '10px', marginRight: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
      />
      <button type="submit" style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#007BFF', color: 'white', cursor: 'pointer' }}>
        Search
      </button>
    </form>
  );
}

export default SearchBar;
