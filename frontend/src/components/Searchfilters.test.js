import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import userEvent from '@testing-library/user-event'
import { TokenProvider } from '../contexts/Token'
import { BrowserRouter } from 'react-router-dom'
import SearchFilters from './SearchFilters'

const noop = () => {}

describe('SearchFilter', () => {
  it('Opens when filter set to true, renders items', () => {
    render(<TokenProvider><BrowserRouter><SearchFilters openFilter={true}/></BrowserRouter></TokenProvider>);
    // screen.debug()
    const header = screen.getByText('Search Listings')
    expect(header).toBeInTheDocument()
    const bedrooms = screen.getByText('Bedrooms')
    expect(bedrooms).toBeInTheDocument()
    const price = screen.getByText('Price per night')
    expect(price).toBeInTheDocument()
  });

  it('Bedroom slider is rendered with initial values, and values respond to slider movement', () => {
    render(<TokenProvider><BrowserRouter><SearchFilters openFilter={true}/></BrowserRouter></TokenProvider>);
    screen.debug(undefined, Infinity)
    // Check if the slider is present
    const sliderHandles = screen.getAllByRole('slider', { name: 'Bedroom slider' });

    // Find the slider handle with min value
    const sliderHandleWithValueMin = sliderHandles.find((handle) => handle.getAttribute('aria-valuenow') === '0');
    expect(sliderHandleWithValueMin).toBeInTheDocument();

    // Find the slider handle with max value
    const sliderHandleWithValueMax = sliderHandles.find((handle) => handle.getAttribute('aria-valuenow') === '20');
    expect(sliderHandleWithValueMax).toBeInTheDocument();

    fireEvent.change(sliderHandleWithValueMin, { target: { value: 10 } });
    expect(sliderHandleWithValueMin).toHaveAttribute('aria-valuenow', '10');

    fireEvent.change(sliderHandleWithValueMax, { target: { value: 15 } });
    expect(sliderHandleWithValueMax).toHaveAttribute('aria-valuenow', '15');
  });

  it('Price slider is rendered with initial values, and values respond to slider movement', () => {
    render(<TokenProvider><BrowserRouter><SearchFilters openFilter={true}/></BrowserRouter></TokenProvider>);
    screen.debug(undefined, Infinity)
    // Check if the slider is present
    const sliderHandles = screen.getAllByRole('slider', { name: 'Price slider' });

    // Find the slider handle with min value
    const sliderHandleWithValueMin = sliderHandles.find((handle) => handle.getAttribute('aria-valuenow') === '0');
    expect(sliderHandleWithValueMin).toBeInTheDocument();

    // Find the slider handle with max value
    const sliderHandleWithValueMax = sliderHandles.find((handle) => handle.getAttribute('aria-valuenow') === '5000');
    expect(sliderHandleWithValueMax).toBeInTheDocument();

    fireEvent.change(sliderHandleWithValueMin, { target: { value: 1000 } });
    expect(sliderHandleWithValueMin).toHaveAttribute('aria-valuenow', '1000');

    fireEvent.change(sliderHandleWithValueMax, { target: { value: 2000 } });
    expect(sliderHandleWithValueMax).toHaveAttribute('aria-valuenow', '2000');
  });
})