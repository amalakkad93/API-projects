<Container component="main" maxWidth="md">
  <Box
    sx={{
      marginTop: 8,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <Typography component="h1" variant="h5">
      {formType === "Create" ? "Create a new Spot" : "Update your Spot"}
    </Typography>

    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit}
      sx={{ mt: 3 }}
    >
      {/* Location Section */}
      <Typography variant="h6" gutterBottom>
        Where's your place located?
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Guests will only get your exact address once they booked a reservation.
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        id="address"
        label="Street Address"
        name="address"
        autoComplete="address"
        autoFocus
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <LocationForm
        setCountry={setCountry}
        setState={setState}
        setCity={setCity}
      />
      <Divider sx={{ my: 2 }} />

      {/* Name Section */}
      <Typography variant="h6" gutterBottom>
        Create a title for your spot
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Catch guests' attention with a spot title that highlights what makes
        your place special.
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        label="Name of your spot"
        name="name"
        autoComplete="name"
        value={name}
        onChange={handleChange}
      />

      {/* Description Section */}
      <Typography variant="h6" gutterBottom>
        Describe your place to guests
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Mention the best features of your space, any special amenities like fast
        wifi or parking, and what you love about the neighborhood.
      </Typography>

      <TextField
        margin="normal"
        required
        fullWidth
        id="description"
        label="Description"
        name="description"
        autoComplete="description"
        multiline
        rows={4}
        value={description}
        onChange={handleChange}
      />
      <Divider sx={{ my: 2 }} />


      {/* Price Section */}
      <Typography variant="h6" gutterBottom>
        Set a base price for your spot
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Competitive pricing can help your listing stand out and rank higher in
        search results.
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        id="price"
        label="Price per night (USD)"
        name="price"
        type="number"
        autoComplete="price"
        value={price}
        onChange={handleChange}
      />
      <Divider sx={{ my: 2 }} />

{/* Photos Section */}
{formType === "Create" && (
            <>
              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>Liven up your spot with photos</Typography>
              <Typography variant="subtitle1" gutterBottom>
                Upload at least one photo to publish your spot.
              </Typography>

              <FormControl fullWidth margin="normal">
                <FormLabel>Preview Image</FormLabel>
                <Input
                  id="previewImage"
                  type="file"
                  onChange={(e) => handleImageChange(e, "previewImage")}
                  inputProps={{ accept: "image/png, image/jpeg" }}
                  disableUnderline
                />
                {validationObj.previewImage && (
                  <FormHelperText error>{validationObj.previewImage}</FormHelperText>
                )}
              </FormControl>

              {Array.from({ length: 4 }).map((_, index) => (
                <FormControl key={index} fullWidth margin="normal">
                  <FormLabel>{`Image ${index + 2}`}</FormLabel>
                  <Input
                    type="file"
                    onChange={(e) => handleImageChange(e, `imageUrl${index + 2}`)}
                    inputProps={{ accept: "image/png, image/jpeg" }}
                    disableUnderline
                  />
                </FormControl>
              ))}

              {Object.keys(validationObj)
                .filter(key => key.startsWith("imageUrl"))
                .map((key) => (
                  <FormHelperText key={key} error>{validationObj[key]}</FormHelperText>
                ))}
            </>
          )}

<Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            {formType === "Create" ? "Create Spot" : "Update Spot"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
