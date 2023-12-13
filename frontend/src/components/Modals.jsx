import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { List, ListItem } from '@mui/material';
import { BsFillStarFill } from 'react-icons/bs';

// Load Modal for amenities. Takes dict of amenities from listing page.
export function ModalAmenities ({ data }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  console.log('Modal: data..')
  console.log(data)

  const isEmpty = !data || Object.keys(data).length === 0;

  let trueKeys
  data && (
    trueKeys = isEmpty ? [] : Object.keys(data || {}).filter(key => data[key])
  )

  console.log('amenities:')
  console.log(trueKeys)

  return (
    <div>
      <Button aria-expanded={open} sx={{ border: 1, padding: '0.5em' }} onClick={handleOpen}>Available Amenities</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-amenities-title"
        aria-describedby="modal-amenities-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '50%',
          bgcolor: 'background.paper',
          border: '1px solid #000',
          boxShadow: 24,
          p: 2,
        }}>
          <Typography id="modal-amenities-title" variant="h5" sx={{ textDecoration: 'underline' }}>
            Amenities
          </Typography>
          <Box id="modal-amenities-content" sx={{ mt: 0 }}>
            {data &&
              <List dense={true}>
                {
                  trueKeys.length === 0
                    ? (
                      <ListItem sx={{ color: 'text.disabled' }}> Owner has not listed any amenities. </ListItem>
                      )
                    : (
                        trueKeys.map((key) => (
                          <ListItem key={key} >{key}</ListItem>
                        ))
                      )
                }
              </List>
            }
          </Box>
          <Typography variant='subtitle2' color='warning.main'>
            *List may not be exhaustive
          </Typography>
        </Box>
      </Modal>
    </div>
  )
}

// Load Modal for reviews.
export function ModalReviews ({ data }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  console.log('Modal: data..')
  console.log(data)

  if (data?.length === 0) {
    return (
      <div>
        <Button sx={{ border: 1, padding: '0.5em' }} disabled>Reviews</Button>
      </div>
    )
  }

  return (
    <div>
      <Button aria-expanded={open} sx={{ border: 1, padding: '0.5em' }} onClick={handleOpen}>Reviews</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-reviews-title"
        aria-describedby="modal-reviews-description"
        aria-modal={open}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          bgcolor: 'background.paper',
          border: '1px solid #000',
          boxShadow: 24,
          p: 2,
        }}>
          <Typography id="modal-reviews-title" variant="h5" sx={{ textDecoration: 'underline' }}>
            Reviews
          </Typography>
          <Box id="modal-reviews-content" sx={{ mt: 0 }}>
            {data &&
              <List dense={true}>
                {data.map((review, index) => (
                  <Box key={index} sx={{ borderRadius: '10px', p: 1, my: 0.5, background: '#e9f5f9' }}>
                    {review[0]} <BsFillStarFill size={'0.7em'}/>
                    <ListItem sx={{ p: 0 }}>
                      {review[1]}
                    </ListItem>
                  </Box>
                ))}
              </List>
            }
          </Box>
        </Box>
      </Modal>
    </div>
  )
}
