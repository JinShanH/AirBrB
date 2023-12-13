import { Box } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';

// Source: https://mui.com/material-ui/react-tabs/#basic-tabs

const CustomTabPanel = (item) => {
  const { children, value, index, ...other } = item;

  return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default CustomTabPanel;
