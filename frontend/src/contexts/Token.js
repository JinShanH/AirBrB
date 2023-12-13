import React, { useState } from 'react';

export const TokenContext = React.createContext(null);

export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  return (
        <TokenContext.Provider value={{ token, setToken }}>
            {children}
        </TokenContext.Provider>
  );
}
