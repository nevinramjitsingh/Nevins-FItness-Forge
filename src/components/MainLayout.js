import React from 'react';
import Navigation from './Navigation';

const MainLayout = ({ children }) => {
  return (
    <div>
      <Navigation />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
