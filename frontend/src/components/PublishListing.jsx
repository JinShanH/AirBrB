import { Box, Button, Container, FormControl, FormLabel, Typography } from '@mui/material';
import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { getListing, publishListing, unpublishListing } from '../service/Listings';
import { TokenContext } from '../contexts/Token';
import { Link } from 'react-router-dom';

// Component for listing publishing form
const PublishListing = () => {
  const { token } = React.useContext(TokenContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + 1);
  const [dates, setDates] = React.useState([]);
  const [published, setPublished] = React.useState(false);

  React.useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token]);

  const getInitialDates = async () => {
    const listing = await getListing(id);
    listing.published ? setPublished(true) : setPublished(false);
    setDates(listing.availability);
  }

  React.useEffect(() => {
    getInitialDates();
  }, []);

  const checkDates = (start, end) => {
    start = new Date(start);
    end = new Date(end);

    const difference = (end - start) / (1000 * 3600 * 24)
    return (difference > 0)
  };

  const handleDatesChange = (date, idx, time) => {
    const newDate = dates[idx];
    time === 'start' ? newDate.start = date : newDate.end = date;
    if (checkDates(newDate.start, newDate.end)) {
      setDates(prevDates => {
        const newDates = [...prevDates];
        newDates[idx] = newDate;
        return newDates;
      });
    } else {
      alert('Difference should be at least one day!')
    }
  };

  const handleSubmit = async () => {
    await publishListing(token, dates, id);
    navigate('/dashboard');
  }

  const handleUnpublish = async () => {
    await unpublishListing(token, parseInt(id));
    navigate('/dashboard');
  }

  const addDate = () => {
    setDates(prevDates => [
      ...prevDates,
      { start: startDate.toISOString().slice(0, 10), end: endDate.toISOString().slice(0, 10) },
    ]);
  };

  const removeDate = (index) => {
    setDates(prevDates => prevDates.filter((_, i) => i !== index));
  };

  return (
    <>
      <Container>
        <Link to={'/dashboard'}>
          <Button>Back</Button>
        </Link>
        <Container sx={{ display: 'flex', flexDirection: 'column', padding: '1em', gap: '1em' }}>
        <Typography variant='h5'>Publish Listing Settings</Typography>
        <FormControl sx={{ display: 'flex', gap: '1em' }}>
          <FormLabel>Set Available Dates</FormLabel>
          {dates.map((date, index) => (
            <div key={`date-form-${index}`}>
              <Box sx={{ display: 'flex', gap: '1em' }}>
                <input
                  type="date"
                  value={date.start}
                  onChange={(e) => handleDatesChange(e.target.value, index, 'start')}
                  min={new Date().toISOString().slice(0, 10)}
                  aria-label={`Start date ${index}`}
                />
                <input
                  type="date"
                  value={date.end}
                  onChange={(e) => handleDatesChange(e.target.value, index, 'end')}
                  min={new Date().toISOString().slice(0, 10)}
                  aria-label={`End date ${index}`}
                />
              </Box>
              <Button onClick={() => removeDate(index)}>Remove Date</Button>
            </div>
          ))}
        </FormControl>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1em' }}>
          <Button onClick={addDate}>Add Date</Button>
          <Button sx={{ display: published ? 'none' : 'block' }} onClick={handleSubmit}>Publish</Button>
          <Button sx={{ display: published ? 'block' : 'none' }} onClick={handleUnpublish}>Unpublish</Button>
        </Box>
      </Container>
      </Container>
     </>
  )
};

export default PublishListing;
