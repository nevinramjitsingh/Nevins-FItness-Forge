import React from 'react';

const ProgressBar = ({ value, max }) => {
  const percentage = (value / max) * 100;

  return (
    <div className="progress-bar">
      <div
        className="progress-bar-fill"
        style={{
          width: `${Math.min(percentage, 100)}%`, // Cap the width at 100%
        }}
      ></div>
    </div>
  );
};

export default ProgressBar;
