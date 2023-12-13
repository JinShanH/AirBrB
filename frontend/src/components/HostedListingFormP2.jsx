import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, MenuItem, Select, TextField } from '@mui/material';
import React from 'react';

const HostedListingFormP2 = (props) => {
  React.useEffect(() => {
    console.log(props.listing.metadata)
  }, [props.setListing]);

  const [bathrooms, setBathrooms] = React.useState(props.listing.metadata.bathrooms);
  const [bedrooms, setBedrooms] = React.useState(props.listing.metadata.bedrooms);
  const [beds, setBeds] = React.useState(props.listing.metadata.beds);
  const [housingType, setHousingType] = React.useState(props.listing.metadata.housingType);
  const [amenities, setAmenities] = React.useState(props.listing.metadata.amenities);
  // const amenitiesList = ['Kitchen', 'TV', 'Refrigerator', 'Stove', 'Oven/Microwave', 'Cutlery/Crockery'];

  const updateListing = () => {
    const metadata = { bathrooms, bedrooms, housingType, amenities, beds, description: props.listing.metadata.description, images: props.listing.metadata.images }
    props.setListing((prevListing) => ({
      ...prevListing,
      metadata
    }));
    console.log(metadata);
  }

  React.useEffect(() => {
    updateListing()
  }, [bathrooms, beds, bedrooms, housingType, amenities]);

  const handleAmenities = (amenity) => {
    const newAmenities = { ...amenities };
    newAmenities[amenity] = !newAmenities[amenity];
    setAmenities(newAmenities);
  };

  const handleBeds = (count, i) => {
    setBeds(prevBeds => {
      let newBeds = [...prevBeds];
      newBeds = newBeds.slice(0, bedrooms);
      newBeds[i] = parseInt(count);
      return newBeds;
    });
  };

  React.useEffect(() => {
    addBeds();
    handleBeds();
  }, [bedrooms]);

  const addBeds = () => {
    const bedForms = [];
    for (let i = 1; i <= bedrooms; i++) {
      bedForms.push(
        <div key={i}>
          <FormLabel component="legend"># Beds in Bedroom {i}</FormLabel>
          <TextField aria-label={`Bed ${i}`} value={beds[i - 1] ? beds[i - 1] : 0} onChange={(e) => handleBeds(e.target.value, i - 1)} type="number" InputProps={{ inputProps: { min: 0, max: 10 } }} />
        </div>
      );
    }
    return (
      <>
        {bedForms}
      </>
    )
  };

  return (
    <>
      <FormControl sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
        <FormLabel for="listing-no-bathrooms" required component="legend">Number of Bathrooms</FormLabel>
        <TextField
          id="listing-no-bathrooms"
          type="number"
          InputProps={{ inputProps: { min: 0, max: 20 } }}
          value={bathrooms}
          onChange={(e) => setBathrooms(parseInt(e.target.value))}>
        </TextField>
        <FormLabel for="listing-no-bedrooms" required component="legend">Number of Bedrooms</FormLabel>
        <TextField
          id="listing-no-bedrooms"
          type="number"
          InputProps={{ inputProps: { min: 0, max: 10 } }}
          value={bedrooms}
          onChange={(e) => setBedrooms(parseInt(e.target.value))}>
        </TextField>
        {addBeds()}
        <FormLabel required component="legend" for="listing-type">Listing Type</FormLabel>
          <Select id="listing-type" value={housingType} onChange={(e) => setHousingType(e.target.value)}>
            <MenuItem value={'Apartment'}>Apartment</MenuItem>
            <MenuItem value={'House'}>House</MenuItem>
            <MenuItem value={'Self-Contained Unit'}>Self-Contained Unit</MenuItem>
            <MenuItem value={'Unique Space'}>Unique Space</MenuItem>
            <MenuItem value={'Bed and Breakfast'}>Bed and Breakfast</MenuItem>
          </Select>
        <FormGroup aria-labelledby='amenities-label'>
          <FormLabel required component="legend" id='amenities-label'>Amenities</FormLabel>
          <FormControlLabel role='checkbox' aria-checked={amenities.WiFi} checked={amenities.WiFi} onChange={() => handleAmenities('WiFi')} control={<Checkbox />} label="Wi-Fi" />
          <FormControlLabel role='checkbox' aria-checked={amenities.Kitchen} checked={amenities.Kitchen} onChange={() => handleAmenities('Kitchen')} control={<Checkbox />} label="Kitchen" />
          <FormControlLabel role='checkbox' aria-checked={amenities.TV} checked={amenities.TV} onChange={() => handleAmenities('TV')} control={<Checkbox />} label="TV" />
          <FormControlLabel role='checkbox' aria-checked={amenities.Refrigerator} checked={amenities.Refrigerator} onChange={() => handleAmenities('Refrigerator')} control={<Checkbox />} label="Refrigerator" />
          <FormControlLabel role='checkbox' aria-checked={amenities.Stove} checked={amenities.Stove} onChange={() => handleAmenities('Stove')} control={<Checkbox />} label="Stove" />
          <FormControlLabel role='checkbox' aria-checked={amenities['Oven/Microwave']} checked={amenities['Oven/Microwave']} onChange={() => handleAmenities('Oven/Microwave')} control={<Checkbox />} label="Oven/Microwave" />
          <FormControlLabel role='checkbox' aria-checked={amenities['Cultery/Crockery']} checked={amenities['Cultery/Crockery']} onChange={() => handleAmenities('Cutlery/Crokery')} control={<Checkbox />} label="Cutlery/Crockery" />
          {/* <FormControlLabel role='checkbox' control={<Checkbox />} label="Parking" /> */}
        </FormGroup>
      </FormControl>
    </>
  )
}

export default HostedListingFormP2;
