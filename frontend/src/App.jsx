import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import PageList from './PageList';
import { TokenProvider } from './contexts/Token';

const App = () => {
  return (
    <>
      <TokenProvider>
        <Router>
          <PageList />
        </Router>
      </TokenProvider>
    </>
  );
}

export default App;
