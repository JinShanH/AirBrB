// Source: https://mui.com/material-ui/react-dialog/

import * as React from 'react';
import moment from 'moment';
import Dialog from '@mui/material/Dialog';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Slider } from '@mui/material';
import FilledInput from '@mui/material/FilledInput';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

const SearchFilters = (props) => {
  const navigate = useNavigate();

  const handleClose = () => {
    props.setOpenFilter(false);
  };

  function valuetext (value) {
    return `${value}`;
  }

  const [priceRange, setPriceRange] = React.useState([0, 5000]);// set extreme range to detect if changes made
  const handlePriceChange = (e, newValue) => {
    setPriceRange(newValue);
  };

  const [sortRatings, setSortRatings] = React.useState('');
  const handleSortRatingsChange = (e) => {
    setSortRatings(e.target.value);
  };

  const [bedroomsRange, setBedroomsRange] = React.useState([0, 20]);
  const handleBedroomsChange = (e, newValue) => {
    setBedroomsRange(newValue);
  };

  const [startDate, setStartDate] = React.useState(null);
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const [endDate, setEndDate] = React.useState(null);
  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const [listings, setListings] = React.useState([]);

  React.useEffect(() => {
    getListings();
  }, [])

  const getListings = async () => {
    const respose = await fetch('http://localhost:5005/listings', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      }
    });
    const data = await respose.json();
    if (data.error) {
      alert(data.error);
    } else if (data.listings) {
      const listings = data.listings;
      setListings(listings);
    }
  }

  const handleSubmit = (e) => {
    localStorage.setItem('searchParams', null);

    if ((e.keyCode && e.keyCode !== 13)) {
      // pass on keyboard enter
    } else {
      const text = props.searchText.toLowerCase();

      const textFilter = text.length !== 0;

      let priceFilter;
      (priceRange[0] !== 0 || priceRange[1] !== 5000) ? priceFilter = true : priceFilter = false;

      // Check if date filter has been applied
      let dateFilter;
      let start = startDate;
      let end = endDate;
      (start === null && end === null) ? dateFilter = false : dateFilter = true;
      if (dateFilter) {
        if (start === null) {
          // set start to current date
          start = new Date();
          start = moment(start).format('yyyy-MM-DD');
        } else if (end === null) {
          // set end to 100 years so we can find all listings
          end = moment(startDate).add(1000, 'y').format('yyyy-MM-DD');
        }
      }
      console.log(`datefilter: ${dateFilter}`);
      console.log(`start: ${start}`);
      console.log(`end: ${end}`);

      let bedroomFilter;
      (bedroomsRange[0] !== 0 || bedroomsRange[1] !== 20) ? bedroomFilter = true : bedroomFilter = false;
      console.log(`bedroomFilter: ${bedroomFilter} ${bedroomsRange}`);

      let rateFilter;
      (sortRatings === 'Ascending' || sortRatings === 'Descending') ? rateFilter = true : rateFilter = false;
      console.log(`rateFilter: ${rateFilter}`);

      console.log(` price range: ${priceRange}`);

      const filteredListings = [];
      listings.forEach((listing) => {
        console.log(listing)
        let address = '';

        // filter by query and price
        address = address.toLowerCase();
        if ((listing?.title.toLowerCase().includes(text) || address.includes(text)) &&
            (listing?.price >= priceRange[0] && listing?.price <= priceRange[1])) {
          filteredListings.push(listing?.id);
        }
      });
      const filters = [textFilter, priceFilter, bedroomFilter, rateFilter, dateFilter];
      const noFilters = filters.every(filter => !filter)
      if (noFilters) {
        handleClose();
        navigate('/');
      } else {
        const searchParams = {
          textFilter: textFilter,
          priceFilter: priceFilter,
          bedroomFilter: bedroomFilter,
          bedroomsRange: bedroomsRange,
          rateFilter: rateFilter,
          sortRatings: sortRatings,
          dateFilter: dateFilter,
          dateRange: [start, end],
          filtered: filteredListings
        }
        const searchString = new URLSearchParams(searchParams).toString();
        // console.log(filteredListings);
        // console.log(searchParams)
        handleClose();
        navigate(`/?${searchString}`);
      }
    }
  };

  return (
    <React.Fragment>
      <Dialog
        fullScreen
        open={props.openFilter}
        onClose={handleClose}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Typography variant='h4'>
            Search Listings
          </Typography>
          <Typography fontSize={10} fontStyle={'italic'}>
            Perform your search using one or more of the following fields:
          </Typography><br />
          <FilledInput
              autoFocus
              margin="dense"
              id="name"
              label="SearchBox"
              type="text"
              fullWidth
              onKeyUp={handleSubmit}
              value={props.searchText}
              onChange={e => props.setSearchText(e.target.value)}
              style={{ height: '2.5em' }}
              placeholder='Enter Search Terms...'
          />
          <List>
          <ListItem sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <h4 style={{ marginRight: 1 }}>Bedrooms</h4>
            <Slider
              getAriaLabel={() => 'Bedroom slider'}
              value={bedroomsRange}
              onChange={handleBedroomsChange}
              valueLabelDisplay="auto"
              getAriaValueText={valuetext}
              min={0}
              step={1}
              max={20}
              sx={{
                width: '70%'
              }}
            />
          </ListItem>
          <Divider />
          <ListItem sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <h4>From</h4>
            <input type="date" id="start" name="trip-start" onChange={handleStartDateChange} min={startDate}/>
            <h4> To </h4>
            <input type="date" id="finish" name="trip-finish" onChange={handleEndDateChange} min={endDate}/>
          </ListItem>
          <Divider />
          <ListItem sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <h4 style={{ marginRight: 1 }}>Price per night</h4>
            <Slider
              getAriaLabel={() => 'Price slider'}
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              getAriaValueText={valuetext}
              min={0}
              step={50}
              max={5000}
              sx={{
                width: '70%'
              }}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <h4>Sort Ratings</h4>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Sort Ratings</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={sortRatings}
                label="Sort Ratings"
                onChange={handleSortRatingsChange}
              >
                <MenuItem value={'Ascending'}>Ascending</MenuItem>
                <MenuItem value={'Descending'}>Descending</MenuItem>
                <MenuItem value={'None'}>None</MenuItem>
              </Select>
            </FormControl>
          </ListItem>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              onClick={handleSubmit}
              sx={{ border: 1, m: 1 }}>
              Show me the goods!
            </Button>
          </Box>
          </List>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default SearchFilters;
