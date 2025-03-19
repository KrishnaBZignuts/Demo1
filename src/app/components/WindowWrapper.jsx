"use client"
import { useState, useEffect } from 'react';

const WindowWrapper = ({ children }) => {
  const [windowReady, setWindowReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowReady(true);
    }
  }, []);

  if (!windowReady) {
    return null;
  }

  return <>{children}</>;
};

export default WindowWrapper;