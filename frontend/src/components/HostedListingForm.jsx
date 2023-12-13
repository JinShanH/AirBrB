import { Container, Tab, Tabs, Typography } from '@mui/material';
import React from 'react';
import HostedListingFormP1 from './HostedListingFormP1.jsx';
import CustomTabPanel from './CustomTabPanel.jsx';
import HostedListingFormP2 from './HostedListingFormP2.jsx';
import HostedListingFormP3 from './HostedListingFormP3.jsx';
import SwipeableViews from 'react-swipeable-views';

// Source: https://mui.com/material-ui/react-tabs/#basic-tabs

const HostedListingForm = (props) => {
  const [value, setValue] = React.useState(0);
  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const a11yProps = (index) => {
    return {
      id: `tab-${index}`,
      'aria-controls': `tabpanel-${index}`,
    };
  }

  return (
    <>
      <Container sx={{ display: 'flex', flexDirection: 'column', gap: '2em' }}>
        <Typography variant='h5'>{props.title}</Typography>
        <Container sx={{ display: 'flex', flexWrap: 'wrap', margin: '0px' }}>
          <Tabs value={value} onChange={handleChange} aria-label="Listing form tabs">
            <Tab label="Basic Information" {...a11yProps(0)} />
            <Tab label="Rooms & Amenities" {...a11yProps(1)} />
            <Tab label="Thumbnail & Images" {...a11yProps(2)} />
          </Tabs>
        </Container>
      </Container>
      <SwipeableViews index={value} onChangeIndex={handleChangeIndex}>
        <CustomTabPanel value={value} index={0}>
          <HostedListingFormP1 sx={{ display: 'flex', gap: '1em' }} listing={props.listing} setListing={props.setListing}>
          </HostedListingFormP1>
        </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <HostedListingFormP2 sx={{ display: 'flex', gap: '1em' }} listing={props.listing} setListing={props.setListing}>
            </HostedListingFormP2>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <HostedListingFormP3 sx={{ display: 'flex', gap: '1em' }} listing={props.listing} setListing={props.setListing}>
            </HostedListingFormP3>
          </CustomTabPanel>
      </SwipeableViews>
    </>
  )
};

export default HostedListingForm;
