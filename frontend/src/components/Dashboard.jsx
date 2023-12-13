import { Box, IconButton, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import LandingHeader from './LandingHeader';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Link, useNavigate } from 'react-router-dom';
import DEFAULT_IMG from './assets/h1.jpg';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteListing, getListing, getListings, sumBeds } from '../service/Listings';
import { Bed, Shower } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import { BsFillStarFill } from 'react-icons/bs';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import { TokenContext } from '../contexts/Token';

const Dashboard = (props) => {
  const [cards, setCards] = React.useState([]);
  const { token } = React.useContext(TokenContext);
  const navigate = useNavigate();
  const email = localStorage.getItem('email');

  React.useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token]);

  useEffect(() => {
    returnCards();
  }, []);

  const filterListings = async () => {
    const listings = await getListings();
    const filteredListings = listings.filter(listing => listing.owner === email)
    return filteredListings;
  };

  const handleClick = (link) => {
    navigate(link);
  }

  const handleDelete = async (listingid) => {
    try {
      await deleteListing(token, listingid);
      window.location.reload(false);
    } catch (error) {
      console.error('Error fetching and setting listings:', error.message);
    }
    navigate('/dashboard');
  };

  const loadListingCard = async (id) => {
    const data = await getListing(String(id));
    let avgRating = 0;
    if (data.thumbnail === null) {
      data.thumbnail = DEFAULT_IMG;
    }
    if (data?.reviews?.length !== 0) {
      // Extract numbers and calculate the average
      const ratings = data?.reviews?.map(list => list[0]); // Assuming the number is always at index 0
      const sum = ratings?.reduce((acc, num) => acc + num, 0);
      avgRating = sum / ratings?.length;
    }
    return (
        <Card sx={{
          display: 'flex',
          flexDirection: 'column',
          margin: '0.5em',
          width: '11rem',
          size: '5em',
          justifyContent: 'flex-start',
          transition: 'box-shadow 0.3s',
          '&:hover': {
            boxShadow: '0 4px 20px',
          }
        }}
        key={data.id}>
          <Link to={`/summary/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <CardMedia
              component="img"
              sx={{ height: '11rem', objectFit: 'scaledown', opacity: '0.8', background: '#b7d7f7' }}
              image={data.thumbnail}
              title="thumbnail"
              alt="Listing thumbnail"
            />
            <CardContent sx={{ padding: '0.5em', wordWrap: 'break-word' }}>
              <Typography gutterBottom variant="h7" component="div" fontWeight="bold">
                {data.title}
              </Typography>
              <Typography gutterBottom variant="body2" component="div">
                {data.metadata.housingType}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                <BsFillStarFill /> {avgRating.toFixed(1)} ({data?.reviews?.length} reviews)
              </Typography>
            </CardContent>
            <CardContent sx={{ padding: '0.5em', wordWrap: 'break-word', display: 'flex', flexDirection: 'row', gap: '0.5em' }}>
                <Shower /> <Typography>{data.metadata.bathrooms}</Typography>
                <Bed /> <Typography>{sumBeds(data.metadata.beds)}</Typography>
            </CardContent>
          </Link>
          <CardActions sx={{ justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '0' }}>
            <IconButton aria-label={`Publish listing ${data.title}`} onClick={() => handleClick(`/publish/${id}`)}>
                <EditCalendarIcon fontSize='small' />
            </IconButton>
            <IconButton aria-label={`Edit listing ${data.title}`} onClick={() => handleClick(`/edit/${id}`)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => { handleDelete(id) }} aria-label={`Delete listing ${data.title}`}>
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </Card>
    );
  }

  const returnCards = async () => {
    const filteredListings = await filterListings();
    console.log(filteredListings);

    const newCards = await Promise.all(
      filteredListings.map(async (listing) => {
        const card = await loadListingCard(listing.id);
        return card;
      })
    );
    setCards((prevCards) => [...prevCards, ...newCards]);
  };

  if (!token) {
    return (
      <>
        <Box>
          <LandingHeader token = {props.token}></LandingHeader>
        </Box>
        <Typography sx={{ textAlign: 'center', my: 5, fontSize: '6vw' }}>
          Invalid Access. Please Log In.
        </Typography>
      </>
    )
  }

  return (
    <>
      <Box>
        <LandingHeader token = {props.token}></LandingHeader>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          flexGrow: '1'
        }}>
          {cards}
      </Box>
    </>
  )
}

export default Dashboard;
