import React from 'react';
import { useNavigate } from 'react-router';
import { TokenContext } from '../contexts/Token';
import Popup from './Popup';
import { Link } from 'react-router-dom';
import HostedListingForm from './HostedListingForm';
import { Button, Container } from '@mui/material';
import { postListing } from '../service/Listings';

// Functional component definition for creating a new hosted listing
const CreateListing = () => {
  const { token } = React.useContext(TokenContext);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('Please fill in all fields!');

  // Redirect to login page if the user is not authenticated
  React.useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token]);

  // State variable for the listing data - initially set to empty
  const [listing, setListing] = React.useState({
    title: '',
    address: { addr: '', state: '', street: '', suburb: '', postcode: '', city: '', country: '' },
    price: 0,
    thumbnail: null,
    metadata: {
      amenities: {
        WiFi: false,
        Kitchen: false,
        TV: false,
        Refrigerator: false,
        Stove: false,
        'Oven/Microwave': false,
        'Cutlery/Crockery': false
      },
      beds: [],
      bathrooms: 0,
      bedrooms: 0,
      housingType: '',
      description: '',
      images: []
    }
  })

  // Handler function for form submission
  const handleSubmit = async () => {
    // Check if required fields are empty
    if (listing?.title === '' || listing?.address.addr === '' || listing?.metadata.housingType === '' || listing?.price <= 0) {
      setOpen(true);
    } else {
      // API call to create listing
      await postListing(token, listing);
      navigate('/dashboard');
    }
  }

  // JSON file is located in frontend/src/components/assets/2.6.json
  // Handles JSON file on upload
  const handleJSON = (file) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        const keys = Object.keys(data);
        const allowedKeys = ['title', 'owner', 'address', 'price', 'thumbnail', 'metadata'];
        if (keys.every((key) => allowedKeys.includes(key))) {
          setListing(data);
        } else {
          setMessage('Please input a valid JSON file!');
          setOpen(true);
        }
      } catch (error) {
        alert('Error parsing JSON file:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <Popup message={message} open={open} setOpen={setOpen}/>
      <Container>
        <Link to={'/dashboard'}>
          <Button>Back</Button>
        </Link>
        {listing && (
          <HostedListingForm listing={listing} setListing={setListing} title={'Create New Listing'}>
          </HostedListingForm>
        )}
        <Button component="label">
          <input style={{ display: 'None' }} id="listing-json" type="file" accept="application/json" onChange={(e) => handleJSON(e.target.files[0])}/>
          Upload JSON File
        </Button>
        <Button type="submit" onClick={handleSubmit}>Submit</Button>
      </Container>
    </>
  )
};

export default CreateListing;
