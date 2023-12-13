const getBookings = async (token) => {
  const respose = await fetch('http://localhost:5005/bookings', {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: token
    }
  });
  const data = await respose.json();
  if (!data.bookings) {
    alert(data.error)
  } else if (data.bookings) {
    return data.bookings;
  }
}

const makeBooking = async (token, id, dateRange, totalPrice) => {
  const respose = await fetch(`http://localhost:5005/bookings/new/${id}`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({
      dateRange,
      totalPrice
    }),
  });
  const data = await respose.json();
  if (data.error) {
    alert(data.error);
  }
}

const acceptBooking = async (token, id) => {
  const respose = await fetch(`http://localhost:5005/bookings/accept/${id}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      Authorization: token,
    }
  });
  const data = await respose.json();
  if (data.error) {
    alert(data.error);
  }
}

const declineBooking = async (token, id) => {
  const respose = await fetch(`http://localhost:5005/bookings/decline/${id}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      Authorization: token,
    }
  });
  const data = await respose.json();
  if (data.error) {
    alert(data.error);
  }
}

export { getBookings, makeBooking, acceptBooking, declineBooking };
