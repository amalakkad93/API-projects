import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { searchSpotsThunk } from "../../store/spots";
import { TextField, Button, Box, Autocomplete } from "@mui/material";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

function SearchBar({ spots }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const uniqueLocations = Array.from(
      new Set(spots.flatMap((spot) => [spot.city, spot.state, spot.country]))
    );
    setOptions(uniqueLocations);
  }, [spots]);

  const handleSearch = (event, value) => {
    event.preventDefault();
    if (value.trim()) {
      dispatch(searchSpotsThunk(value));
      navigate(`/search?location=${encodeURIComponent(value)}`);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={(event) => handleSearch(event, searchTerm)}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
        m: 2,
      }}
    >
      <Autocomplete
        freeSolo
        options={searchTerm ? options : []}
        filterOptions={(options, { inputValue }) =>
          options.filter((option) =>
            option.toLowerCase().includes(inputValue.toLowerCase())
          )
        }
        onInputChange={(event, newInputValue) => {
          setSearchTerm(newInputValue);
        }}
        renderOption={(props, option) => {
          const matches = match(option, searchTerm);
          const parts = parse(option, matches);
          return (
            <li {...props}>
              {parts.map((part, index) => (
                <span
                  key={index}
                  style={{ fontWeight: part.highlight ? 700 : 400 }}
                >
                  {part.text}
                </span>
              ))}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search spots by location..."
            variant="outlined"
            size="small"
            sx={{
              width: 300,
              ".MuiOutlinedInput-root": {
                borderRadius: "20px",
                "& fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.23)",
                },
                "&:hover fieldset": {
                  borderColor: "primary.main",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                },
              },
              ".MuiInputBase-input": {
                padding: "10px",
              },
            }}
          />
        )}
      />

      <Button
        variant="contained"
        type="submit"
        sx={{
          background:
            "linear-gradient(to right, #e61e4d 0%, #e31c5f 50%, #d70466 100%)",
          color: "#fff",
          borderRadius: "20px",
          ":hover": {
            background:
              "linear-gradient(to right, #d70466 0%, #e31c5f 50%, #e61e4d 100%)",
          },
          textTransform: "none",
          fontSize: "1rem",
          padding: "6px 16px",
        }}
      >
        Search
      </Button>
    </Box>
  );
}

export default SearchBar;
