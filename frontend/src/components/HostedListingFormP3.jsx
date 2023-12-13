import { Button, Card, CardMedia, Container, FormControl, FormGroup, FormLabel, ImageList, ImageListItem } from '@mui/material';
import React from 'react';
import { fileToDataUrl } from '../service/FileToDataURL';

const HostedListingFormP3 = (props) => {
  const [thumbnail, setThumbnail] = React.useState(props.listing.thumbnail);
  const [images, setImages] = React.useState(props.listing.metadata.images);

  const updateListing = () => {
    const metadata = { bathrooms: props.listing.metadata.bathrooms, bedrooms: props.listing.metadata.bedrooms, beds: props.listing.metadata.beds, housingType: props.listing.metadata.housingType, amenities: props.listing.metadata.amenities, description: props.listing.metadata.description, images }
    props.setListing((prevListing) => ({
      ...prevListing,
      metadata,
      thumbnail
    }));
  }

  const handleThumbnail = async (file) => {
    if (file) {
      const newThumbnail = await fileToDataUrl(file);
      setThumbnail(newThumbnail);
    }
  }

  const handleImageGallery = async (file) => {
    if (file) {
      const newImage = await fileToDataUrl(file);
      setImages(prevImages => {
        const newImages = [...prevImages];
        newImages.push({ label: `Image Gallery ${images.length + 1}`, imgPath: newImage });
        return newImages;
      });
    }
  }

  const addImages = () => {
    const imageGallery = [];
    for (let i = 0; i < images.length; i++) {
      console.log(images[i]);
      imageGallery.push(
        <ImageListItem key={i + 1}>
          <img
            src={images[i].imgPath}
            alt={`Image Gallery ${i + 1}`}
            loading="lazy"
          />
        </ImageListItem>
      );
    }
    return (
      <>
        {imageGallery}
      </>
    )
  };

  React.useEffect(() => {
    addImages()
    updateListing()
  }, [thumbnail, images, props.setListing]);

  return (
    <>
      <FormControl sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
        <FormGroup>
          <FormLabel required component="legend">Thumbnail</FormLabel>
            <Container sx={{ '@media (min-width: 600px)': { padding: '0px' } }}>
            {thumbnail && (
            <Card style={{ marginTop: '20px', maxWidth: '300px' }}>
              <CardMedia
                component="img"
                alt="Uploaded Thumbnail"
                height="140"
                image={thumbnail}>
              </CardMedia>
            </Card>
            )}
            <Button component="label">
              <input
              accept="image/*"
              style={{ display: 'none' }}
              id="listing-thumbnail"
              type="file"
              onChange={(e) => {
                handleThumbnail(e.target.files[0]);
              }}
              />
              Upload Thumbnail
            </Button>
          </Container>
        </FormGroup>
        <FormGroup>
          <FormLabel component="legend">Image Gallery</FormLabel>
          <Container sx={{ '@media (min-width: 600px)': { padding: '0px' } }}>
            <ImageList variant='masonry'>
              {addImages()}
            </ImageList>
            <Button component="label">
                <input
                accept="image/*"
                style={{ display: 'none' }}
                id="listing-images"
                type="file"
                onChange={(e) => handleImageGallery(e.target.files[0])}
                />
                Upload to Image Gallery
              </Button>
          </Container>
        </FormGroup>
      </FormControl>
    </>
  )
}

export default HostedListingFormP3;
