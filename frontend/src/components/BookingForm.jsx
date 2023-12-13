import { Box, Button, Container, FormControl, FormLabel } from '@mui/material';
import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { getListing } from '../service/Listings';
import { Link } from 'react-router-dom';
import ConfirmBooking from './ConfirmBooking';
import { TokenContext } from '../contexts/Token';

// Functional component for booking form
const BookingForm = () => {
  const { token } = React.useContext(TokenContext); // Get authentication token from context

  // States for start and end dates of booking
  const [startDate, setStartDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [finalStartDate, setFinalStartDate] = React.useState(null);
  const [finalEndDate, setFinalEndDate] = React.useState(null);
  const navigate = useNavigate();

  const [confirmBookingIsOpen, setConfirmBookingIsOpen] = React.useState(false);

  // Redirect to login page if the user is not authenticated
  React.useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token]);

  const openConfirm = () => {
    setConfirmBookingIsOpen(true);
  };

  const closeConfirm = () => {
    setConfirmBookingIsOpen(false);
  };

  // Handler function for start date change
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  // Handler function for end date change
  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  // State variables for listing details
  const [listing, setListing] = React.useState(null);

  // Extract listing ID
  const { id } = useParams();

  // Listing API call to get listing information
  const fetchListing = async () => {
    const fetchedListing = await getListing(id);
    setListing(fetchedListing);
  };

  // Get listing details when component renders
  React.useEffect(() => {
    fetchListing();
  }, []);

  // Generate date input fields based on availability
  const generateDate = () => {
    return (
      <Box sx={{ display: 'flex', gap: '1em', flexDirection: 'column' }}>
        <FormLabel htmlFor="booking-start-date">Start Date</FormLabel>
        <input
          id="booking-start-date"
          type="date"
          value={startDate}
          onChange={(e) => handleStartDateChange(e.target.value)}
          min={new Date().toISOString().slice(0, 10)}
        />
        <FormLabel htmlFor="booking-end-date">End Date</FormLabel>
        <input
          id="booking-end-date"
          type="date"
          value={endDate}
          onChange={(e) => handleEndDateChange(e.target.value)}
          min={new Date().toISOString().slice(0, 10)}
        />
     </Box>
    )
  }

  // Handler function for form submission
  const handleSubmit = () => {
    setFinalStartDate(startDate)
    setFinalEndDate(endDate);

    openConfirm();
  };

  return (
    <>
      {finalStartDate && finalEndDate && confirmBookingIsOpen && listing && (
        <ConfirmBooking
          open={confirmBookingIsOpen}
          id={id}
          startDate={startDate}
          endDate={endDate}
          price={listing.price}
          closeConfirm={closeConfirm}
        />
      )}
      <Container sx={{ margin: '0px' }}>
        <Link to={'/'} role="link">
          <Button>Back</Button>
        </Link>
      </Container>
      <Container sx={{ display: 'flex', flexDirection: 'column', padding: '1em', gap: '1em' }}>
        <FormControl sx={{ display: 'flex', gap: '1em' }}>
          {listing && generateDate()}
        </FormControl>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1em' }}>
          <Button aria-label="Submit booking request" onClick={handleSubmit}>Request to Book</Button>
        </Box>
      </Container>
    </>
  )
};

export default BookingForm;
