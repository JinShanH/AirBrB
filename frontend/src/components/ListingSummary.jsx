import { Box, Button, Container, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react';
import { useNavigate, useParams } from 'react-router';
import LandingHeader from './LandingHeader';
import { getListing } from '../service/Listings';
import { acceptBooking, declineBooking, getBookings } from '../service/Bookings';
import { TokenContext } from '../contexts/Token';

const ListingSummary = () => {
  const { id } = useParams();
  const [listing, setListing] = React.useState(null);
  const [bookings, setBookings] = React.useState(null);
  const { token } = React.useContext(TokenContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token]);

  const getListingInfo = async () => {
    const fetchedListing = await getListing(id);
    setListing(fetchedListing);
  }

  const filterBookings = async () => {
    let filteredBookings = await getBookings(token);

    filteredBookings = filteredBookings
      .filter(booking => String(booking.listingId) === String(id))

    setBookings(filteredBookings);
  }

  const addPrevBookings = () => {
    const tables = [];
    const prevBookings = bookings.filter(booking => (booking.status === 'accepted' || booking.status === 'denied'));
    for (let i = 0; i < prevBookings.length; i++) {
      tables.push(
        <TableRow key={`past-booking-${i + 1}`}>
          <TableCell>{prevBookings[i].owner}</TableCell>
          <TableCell>{prevBookings[i].status}</TableCell>
        </TableRow>
      );
    }
    return (
      <>
        {tables}
      </>
    )
  };

  const addPendingBookings = () => {
    const tables = [];
    const pendingBookings = bookings.filter(booking => (booking.status === 'pending'));
    for (let i = 0; i < pendingBookings.length; i++) {
      tables.push(
        <TableRow key={`pending-booking-${i + 1}`}>
          <TableCell>{pendingBookings[i].owner}</TableCell>
          <TableCell><Button onClick={() => handleAccept(pendingBookings[i].id)}>Accept Request</Button></TableCell>
          <TableCell><Button onClick={() => handleDecline(pendingBookings[i].id)}>Delete Request</Button></TableCell>
        </TableRow>
      );
    }
    return (
      <>
        {tables}
      </>
    )
  };

  const handleAccept = async (id) => {
    await acceptBooking(token, id);
    window.location.reload();
  }

  const handleDecline = async (id) => {
    await declineBooking(token, id);
    window.location.reload();
  }

  const generateListingInfo = () => {
    let difference = 'Not published yet!'
    let totalPrice = 0

    if (listing.postedOn !== null) {
      const publishDate = new Date(listing.postedOn)
      const curDate = new Date();
      difference = `The listing has been live for ${Math.floor((curDate - publishDate) / (1000 * 3600 * 24))} days.`;
    }

    const currentYear = new Date().getFullYear();

    const filteredBookings = bookings
      .filter(booking => (booking.status === 'accepted'))
      .filter(booking => (booking.dateRange.start.split('-')[0] === String(currentYear)))

    if (bookings.length > 0) {
      totalPrice = filteredBookings.reduce((a, booking) => {
        return a + booking.totalPrice;
      }, 0);
    }

    return (
    <>
      <Typography variant='h5'>{listing.title}</Typography>
      <Typography>{difference}</Typography>
      <Box sx={{ display: 'flex', gap: '2em' }}>
        <Box>
          <Typography variant='h6'>{`${filteredBookings.length}`}</Typography><Typography> bookings this year!</Typography>
        </Box>
        <Box>
          <Typography variant='h6'>{`$${totalPrice}`}</Typography><Typography> earned this year!</Typography>
        </Box>
      </Box>
    </>
    )
  }

  React.useEffect(() => {
    getListingInfo();
    filterBookings();
  }, []);

  return (
    <>
      <LandingHeader></LandingHeader>
      <Container sx={{ display: 'flex', flexDirection: 'column', gap: '1em', marginTop: '1em' }}>
        {listing && bookings && generateListingInfo()}
        <Typography>Pending Requests</Typography>
        <Table sx={{ whiteSpace: 'no-wrap', tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listing && bookings && addPendingBookings()}
          </TableBody>
        </Table>
        <Typography>Past Requests</Typography>
        <Table sx={{ whiteSpace: 'no-wrap', tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listing && bookings && addPrevBookings()}
          </TableBody>
        </Table>
      </Container>
    </>
  )
};

export default ListingSummary;
