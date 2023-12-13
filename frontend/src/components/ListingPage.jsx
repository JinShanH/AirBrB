import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import LandingHeader from './LandingHeader';
import { Box, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import DEFAULT_IMG from './assets/h1.jpg';
import { BsPinMapFill, BsFillStarFill } from 'react-icons/bs';
import Divider from '@mui/material/Divider';
import { ModalAmenities, ModalReviews } from './Modals';
import { TokenContext } from '../contexts/Token';
import { sumBeds } from '../service/Listings';
import { autoPlay } from 'react-swipeable-views-utils';

const ListingPage = (props) => {
  const [listing, setListing] = useState(null);
  const [activeStep, setActiveStep] = React.useState(0);
  const { id } = useParams();
  const { token } = React.useContext(TokenContext);
  // Carousel. Autoplay enabled.
  const View = autoPlay(SwipeableViews);
  // const View = SwipeableViews;

  useEffect(() => {
    getListing()
  }, [])

  const getListing = async () => {
    console.log(`getting listings ${id}`)
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
      setListing(data.listing)
    }
  }

  const displayListing = () => {
    const metadata = listing?.metadata
    console.log('metadata')
    console.log(metadata)
    const amenities = metadata?.amenities
    console.log('amenities')
    console.log(amenities)
    let avgRating = 0;

    if (listing?.reviews?.length !== 0) {
      // Extract numbers and calculate the average
      const ratings = listing?.reviews?.map(list => list[0]); // Assuming the number is always at index 0
      const sum = ratings?.reduce((acc, num) => acc + num, 0);
      avgRating = sum / ratings?.length;
    }

    return (
      <Box sx={{ paddingX: 2 }}>
        <Typography variant='h6'>
          {listing.title}
        </Typography>
        <Typography variant='subtitle' fontStyle='oblique' color='text.secondary'>
          <BsPinMapFill /> {listing?.address?.addr}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'row', py: 0.5 }}>
          {
            listing?.reviews?.length !== 0
              ? (<Typography variant='body2' >
                  <BsFillStarFill size={'0.8em'} />{avgRating.toFixed(1)} ({listing?.reviews?.length} ratings)
                </Typography>)
              : (<Typography variant='body2' >
                  <BsFillStarFill size={'0.8em'} />0 (No ratings yet)
                </Typography>)
          }
          <Typography variant='body2' fontWeight={'bold'} pl='10vw'>
            Pricing: {listing.price} AUD
          </Typography>
        </Box>

        <Divider sx={{ borderBottomWidth: 2 }}/>

        <Typography variant='body2' py={0.5} >
          {metadata?.description}
        </Typography>

        <Divider sx={{ borderBottomWidth: 2 }}/>
        <Typography variant='body2'>Type: {listing?.metadata?.housingType}</Typography>

        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Typography variant='body2' pr={4}>Bedrooms: { listing?.metadata?.bedrooms }</Typography>
          <Typography variant='body2' pr={4}>Beds: {sumBeds(listing?.metadata?.beds)}</Typography>
          <Typography variant='body2'>Bathrooms: {listing?.metadata?.bathrooms}</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', py: 1 }}>
          <ModalAmenities data={listing?.metadata?.amenities}/>
          <ModalReviews data={listing?.reviews}/>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', py: 1, gap: 1 }}>
          <Link to={`../book/${id}`}>
            <Button sx={{ border: 1, padding: '0.5em' }} disabled={ !(token && listing.published) }>Request to Book</Button>
          </Link>
          {/* <Button sx={{ border: 1, padding: '0.5em' }} disabled={ true }>Review Listing</Button> */}
        </Box>

      </Box>
    );
  }

  const Carousel = () => {
    let images = listing.metadata.images;
    if (images.length === 0) images = [{ label: 'Default image', imgPath: DEFAULT_IMG }]
    const theme = useTheme();
    const maxSteps = images.length;

    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step) => {
      setActiveStep(step);
    };

    return (
      <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
        <View
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
        >
          {images.map((step, index) => (
            <div key={step.label}>
              {Math.abs(activeStep - index) <= 2
                ? (<Box
                    component="img"
                    sx={{ height: 255, display: 'block', maxWidth: 400, overflow: 'hidden', width: '100%', }}
                    src={step.imgPath}
                    alt={step.label}
                  />)
                : null}
            </div>
          ))}
        </View>
        <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
            >
              Next
              {theme.direction === 'rtl'
                ? (<KeyboardArrowLeft />)
                : (<KeyboardArrowRight />)
              }
            </Button>
          }
          backButton={
            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
              {theme.direction === 'rtl'
                ? (<KeyboardArrowRight />)
                : (<KeyboardArrowLeft />)
              }
              Back
            </Button>
          }
        />
      </Box>
    );
  }

  return (
    <>
      <Box>
        <LandingHeader token = {props.token}></LandingHeader>
      </Box>

      <Box>
        <Link to={'/'}>
          <Button size="small" sx={{ border: 1, m: 1 }}>Back</Button>
        </Link>
      </Box>

      {listing
        ? (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {Carousel()}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mx: '2vw' }}>
            {displayListing(listing)}
          </Box>
        </>
          )
        : (
          <>
          </>
          )
      };
    </>
  );
}

export default ListingPage;
