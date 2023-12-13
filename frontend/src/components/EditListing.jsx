import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { editListing, getListing } from '../service/Listings';
import HostedListingForm from './HostedListingForm';
import { Button, Container } from '@mui/material';
import { TokenContext } from '../contexts/Token';
import { Link } from 'react-router-dom';

// Component page for editing hosted listings
const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = React.useState(null);
  const { token } = React.useContext(TokenContext);

  // Effect to redirect to the login page if there is no authentication token
  React.useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token]);

  useEffect(() => {
    getPlaceholders(id)
  }, [id])

  // Get original hosted listing data
  const getPlaceholders = async (id) => {
    const newListing = await getListing(id);
    setListing(newListing);
  }

  const handleSubmit = async () => {
    if (listing.title === '') {
      console.log('Empty');
    } else {
      await editListing(token, listing, id);
    }
    navigate('/dashboard');
  }

  return (
    <>
      <Container>
        <Link to={'/dashboard'}>
          <Button>Back</Button>
        </Link>
        {listing && (
        <HostedListingForm listing={listing} setListing={setListing} title={'Edit Listing'}>
        </HostedListingForm>
        )
        }
        <Button type="submit" onClick={handleSubmit}>Submit</Button>
      </Container>
    </>
  )
}

export default EditListing;
