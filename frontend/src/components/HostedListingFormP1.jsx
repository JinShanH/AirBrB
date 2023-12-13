import { FormControl, FormGroup, FormLabel, TextField } from '@mui/material';
import React from 'react';

const HostedListingFormP1 = (props) => {
  const [title, setTitle] = React.useState(props.listing.title);
  const [country, setCountry] = React.useState(props.listing.address.country);
  const [state, setState] = React.useState(props.listing.address.state);
  const [city, setCity] = React.useState(props.listing.address.city);
  const [suburb, setSuburb] = React.useState(props.listing.address.suburb);
  const [street, setStreet] = React.useState(props.listing.address.street);
  const [postcode, setPostcode] = React.useState(props.listing.address.postcode);
  const [price, setPrice] = React.useState(props.listing.price);
  const [description, setDescription] = React.useState(props.listing.metadata.description);

  const updateListing = () => {
    const addr = street.concat(', ', suburb).concat(' ', state).concat(' ', postcode);
    const metadata = { bathrooms: props.listing.metadata.bathrooms, bedrooms: props.listing.metadata.bedrooms, beds: props.listing.metadata.beds, housingType: props.listing.metadata.housingType, amenities: props.listing.metadata.amenities, description, images: props.listing.metadata.images }
    const address = { addr, state, street, suburb, postcode, city, country }
    props.setListing((prevListing) => ({
      ...prevListing,
      metadata,
      title,
      address,
      price,
    }));
  }

  React.useEffect(() => {
    updateListing()
  }, [title, price, description, props.setListing]);

  return (
    <>
      <FormControl sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
        <FormLabel required component="legend" for="listing-title">Listing Title</FormLabel>
        <TextField value={title} id="listing-title" onChange={(e) => setTitle(e.target.value)}></TextField>
        <FormLabel component="legend" for="description">Description</FormLabel>
        <TextField value={description} id="listing-description" onChange={(e) => setDescription(e.target.value)}></TextField>
        <FormLabel required component="legend" for="listing-address">Address</FormLabel>
        <FormGroup sx={{ display: 'flex', flexDirection: 'row', gap: '1em' }} id="listing-address">
          <TextField value={country} aria-label="listing-country" onChange={(e) => setCountry(e.target.value)} label="Country"></TextField>
          <TextField value={state} aria-label="listing-state" onChange={(e) => setState(e.target.value)} label="State"></TextField>
          <TextField value={city} aria-label="listing-city" onChange={(e) => setCity(e.target.value)} label="City"></TextField>
          <TextField value={suburb} aria-label="listing-suburb" onChange={(e) => setSuburb(e.target.value)} label="Suburb"></TextField>
          <TextField value={street} aria-label="listing-street" onChange={(e) => setStreet(e.target.value)} label="Street"></TextField>
          <TextField value={postcode} aria-label="listing-postcode" onChange={(e) => setPostcode(e.target.value)} label="Postcode"></TextField>
        </FormGroup>
        <FormLabel required component="legend" for="listing-price">Price</FormLabel>
        <TextField id="listing-price" InputProps={{ inputProps: { min: 0 } }} value={price} onChange={(e) => setPrice(e.target.value)}></TextField>
      </FormControl>
    </>
  )
}

export default HostedListingFormP1;
