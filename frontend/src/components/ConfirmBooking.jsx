import React from 'react';
import { Button, Container, Dialog, DialogActions, DialogTitle, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { makeBooking } from '../service/Bookings';
import { TokenContext } from '../contexts/Token';

// Component for booking confirmation dialog
const ConfirmBooking = (props) => {
  const { token } = React.useContext(TokenContext);
  const navigate = useNavigate();
  // States to store date range, the difference in days, and the total price of booking
  const [dateRange, setDateRange] = React.useState({});
  const [difference, setDifference] = React.useState(0);
  const [totalPrice, setTotalPrice] = React.useState(0);

  React.useEffect(() => {
    // Calculate date range and total price
    const calculateDateRange = () => {
      const start = new Date(props.startDate);
      const end = new Date(props.endDate);

      const dateDifference = (end - start) / (1000 * 3600 * 24);
      setDateRange({ start, end });
      setDifference(dateDifference);
      setTotalPrice(dateDifference * props.price);
    };

    calculateDateRange();
  }, []);

  const handleYes = async () => {
    await makeBooking(token, props.id, dateRange, totalPrice);
    alert('Booking confirmed!');
    navigate('/dashboard');
    props.closeConfirm(); // Close the modal after handling "Yes"
  };

  const handleNo = () => {
    props.closeConfirm(); // Close the modal if "No" is clicked
  };

  return (
    <Dialog open={props.open} onClose={props.closeConfirm}>
      <DialogTitle>Confirm Booking</DialogTitle>
      <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
        <Typography>{`You will be staying for ${difference} days.`}</Typography>
        <Typography>{`The total price will be $${totalPrice}`}</Typography>
        <Typography>Would you like to confirm this booking?</Typography>
      </Container>
      <DialogActions>
        <Button onClick={handleYes} variant="contained" color="primary">
          Yes
        </Button>
        <Button onClick={handleNo} variant="contained" color="secondary">
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmBooking;
