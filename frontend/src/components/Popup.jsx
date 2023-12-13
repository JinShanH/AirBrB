import React from 'react';

import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';

const Popup = (props) => {
  const handleClose = () => {
    props.setOpen(false);
  };

  return (
    <>
      <Dialog
        // fullScreen={fullScreen}
        open={props.open}
        onClose={handleClose}
        aria-labelledby="dialog-title">
        <DialogTitle id="dialog-title">
          {props.message}
        </DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Popup;
