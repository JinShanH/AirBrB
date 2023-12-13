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
    // Sort listings in alphabetical order
    data.listings.sort((a, b) => {
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
    return data.listings;
  }
}

const getListing = async (id) => {
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
    return (data.listing)
  }
}

const postListing = async (token, listing) => {
  const response = await fetch('http://localhost:5005/listings/new', {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      title: listing.title,
      address: listing.address,
      price: listing.price,
      thumbnail: listing.thumbnail,
      metadata: listing.metadata,
    }),
  });
  const data = await response.json();
  if (data.error) {
    alert(data.error);
  } else {
    return data.listingId;
  }
}

const editListing = async (token, listing, id) => {
  const response = await fetch(`http://localhost:5005/listings/${id}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      Authorization: token
    },
    body: JSON.stringify({
      title: listing.title,
      address: listing.address,
      price: listing.price,
      thumbnail: listing.thumbnail,
      metadata: listing.metadata,
    }),
  });
  const data = await response.json();
  if (data.error) {
    alert(data.error);
  } else {
    return data.listingId;
  }
};

const deleteListing = async (token, id) => {
  const response = await fetch(`http://localhost:5005/listings/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
      Authorization: token
    }
  });
  const data = await response.json();
  if (data.error) {
    alert(data.error);
  }
}

const publishListing = async (token, availability, id) => {
  const response = await fetch(`http://localhost:5005/listings/publish/${id}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      Authorization: token
    },
    body: JSON.stringify({
      availability
    }),
  });
  const data = await response.json();
  if (data.error) {
    alert(data.error);
  } else {
    return data.listingId;
  }
}

const unpublishListing = async (token, id) => {
  const response = await fetch(`http://localhost:5005/listings/unpublish/${id}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      Authorization: token
    }
  });
  const data = await response.json();
  if (data.error) {
    alert(data.error);
  } else {
    return data.listingId;
  }
}

const sumBeds = (beds) => {
  const sum = beds?.reduce((a, b) => a + b, 0)
  return sum;
}

export { getListing, postListing, editListing, getListings, deleteListing, publishListing, unpublishListing, sumBeds };
