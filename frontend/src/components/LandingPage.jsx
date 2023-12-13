import { Box, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import LandingHeader from './LandingHeader';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Link, useSearchParams } from 'react-router-dom';
import { TokenContext } from '../contexts/Token';
import { BsFillStarFill } from 'react-icons/bs';
import DEFAULT_IMG from './assets/h1.jpg';

const LandingPage = (props) => {
  const [listings, setListings] = useState([]);
  const { token } = React.useContext(TokenContext);
  const user = localStorage.getItem('user');
  console.log(`Landing user: ${user}`);

  let search = false;
  const [searchParams] = useSearchParams();
  const hasParams = searchParams.keys().next().done === false;
  console.log(`search: ${hasParams}`);
  if (hasParams) search = true;
  let sortListings = false;
  let sortedListings = []

  useEffect(() => {
    getListings();
    if (search) {
      loadSearch();
    }
  }, [searchParams]);

  const loadSearch = async () => {
    const params = Object.fromEntries([...searchParams]);
    const filters = [params.bedroomFilter, params.dateFilter];
    console.log(filters)
    console.log('aaaa')
    const tmp = []
    if (params.bedroomFilter || params.dateFilter) {
      listings.forEach(listing => {
        getListingApplyFilter(listing.id, search).then((res) => {
          if (res) tmp.push(listing)
        })
      });
    }
    setListings(tmp);
  }

  const getListingApplyFilter = async (id, search) => {
    console.log(`getting listing ${id}`)
    const respose = await fetch(`http://localhost:5005/listings/${id}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      }
    });
    const data = await respose.json();
    if (data.error) {
      alert(data.error)
    } else if (data.listing) {
      const metadata = data.listing.metadata;

      if (search.bedroomFilter) {
        if (!(metadata.bedrooms >= search.bedroomsRange[0] && metadata.bedrooms <= search.bedroomsRange[1])) {
          return false;
        }
      }
      if (search.dateFilter) {
        data.listing.availability.forEach(dates => {
          if (!(dates[0] <= search.dateRange[0] && dates[1] >= search.dateRange[1])) {
            return false
          }
        })
      }
      return true;
    }
  }

  const getListings = async () => {
    const respose = await fetch('http://localhost:5005/listings', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      }
    });
    const data = await respose.json();
    if (data.error) {
      alert(data.error)
    } else if (data.listings) {
      let filteredListings = data.listings;
      if (search) {
        const params = Object.fromEntries([...searchParams]);
        filteredListings = data.listings.filter(listing => params.filtered.includes(listing.id));
      }
      // Sort listings in alphabetical order
      filteredListings.sort((a, b) => {
        const nameA = a.title.toUpperCase(); // Ignore case
        const nameB = b.title.toUpperCase();
        if (nameA > nameB) {
          return 1;
        } else if (nameA < nameB) {
          return -1;
        } else {
          return 0;
        }
      });
      setListings(filteredListings);
    }
  }

  const loadListingCard = (data) => {
    if (data.thumbnail === null) {
      data.thumbnail = DEFAULT_IMG;
    }
    let avgRating = 0;
    if (data?.reviews?.length !== 0) {
      // Extract numbers and calculate the average
      const ratings = data?.reviews.map(list => list[0]); // Assuming the number is always at index 0
      const sum = ratings.reduce((acc, num) => acc + num, 0);
      avgRating = sum / ratings.length;
    }

    return (
      <Card sx={{
        display: 'flex',
        flexDirection: 'column',
        margin: '0.5em',
        width: '11rem',
        size: '5em',
        justifyContent: 'flex-start'
      }}
      key = {data.id}>
        <CardMedia
          component="img"
          sx={{ height: '11rem', objectFit: 'scaledown', opacity: '0.8', background: '#b7d7f7' }}
          image={data.thumbnail}
          title="thumbnail"
        />
        <CardContent sx={{ padding: '0.5em', wordWrap: 'break-word' }}>
          <Typography gutterBottom variant="h7" component="div" fontWeight="bold">
            {data.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <BsFillStarFill /> {avgRating.toFixed(1)} ({data?.reviews?.length} reviews)
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '0' }}>
          <Link to={`/listing/${data.id}`}>
            <Button size="small" sx={{ border: 1 }} aria-label={`${data.title} details`}>Details</Button>
          </Link>
        </CardActions>
      </Card>
    );
  }

  const isSearching = () => {
    if (search) {
      let resString = '';
      const params = Object.fromEntries([...searchParams]);
      if (params.textFilter === 'true') resString += 'Terms, '
      if (params.priceFilter === 'true') resString += 'Price, '
      if (params.bedroomFilter === 'true') resString += 'Bedrooms, '
      if (params.dateFilter === 'true') resString += 'Date, '
      if (params.rateFilter === 'true') resString += 'with ratings order.'
      resString = resString.replace(/, $/, '');
      return (
        <Typography variant='body2' color={'text.secondary'}>
          Search filters applied: {resString}
        </Typography>
      )
    }
  }

  const listOrdered = () => {
    if (search) {
      const params = Object.fromEntries([...searchParams]);
      console.log(typeof (params.rateFilter))
      if (params.rateFilter === 'true') {
        console.log(params.sortRatings)
        const sorting = []
        // Calculate the average rating for each item
        listings.forEach(listing => {
          const total = listing?.reviews.reduce((sum, [rating, _]) => sum + rating, 0);
          const avg = (total / listing?.reviews.length || 0).toFixed(1); // Avoid division by zero
          sorting.push([listing, avg])
        })
        console.log(sorting)
        let sorted;
        if (params.sortRatings === 'Ascending') {
          sorted = sorting
            .sort((a, b) => a[1] - b[1]) // Sort based on the val
        } else {
          sorted = sorting
            .sort((a, b) => b[1] - a[1]) // Sort based on the val
        }
        console.log('aaaaaaaaaaaaaaa')
        console.log(sorted)
        const x = sorted.map(tuple => tuple[0]);
        sortedListings = x;
        sortListings = true;
      }
    } else {
      sortedListings = [];
      sortListings = false;
    }
  }

  listOrdered()

  return (
    <>
      <Box>
        <LandingHeader token = {token}></LandingHeader>
      </Box>

      <Box>
        {isSearching()}
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          flexGrow: '1'
        }}>
        {sortListings && sortedListings.map((listing) => {
          return loadListingCard(listing)
        })}
        {!sortListings && listings.map((listing) => {
          return loadListingCard(listing)
        })}
      </Box>
    </>
  );
};

export default LandingPage;
