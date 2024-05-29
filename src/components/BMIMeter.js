import React from 'react';

const BMIMeter = ({ bmi }) => {
  const category = getBMICategory(bmi);

  const getMeterColor = () => {
    switch (category) {
      case 'Underweight':
        return 'blue';
      case 'Normal weight':
        return 'green';
      case 'Overweight':
        return 'yellow';
      case 'Obesity':
        return 'red';
      default:
        return 'grey';
    }
  };

  return (
    <div className="bmi-meter">
      <div
        className="bmi-meter-fill"
        style={{
          width: `${Math.min((bmi / 40) * 100, 100)}%`, // Cap the width at 100%
          backgroundColor: getMeterColor(),
        }}
      >
        {category}
      </div>
    </div>
  );
};

const getBMICategory = (bmi) => {
  if (bmi < 18.5) {
    return 'Underweight';
  } else if (bmi >= 18.5 && bmi < 24.9) {
    return 'Normal weight';
  } else if (bmi >= 25 && bmi < 29.9) {
    return 'Overweight';
  } else {
    return 'Obesity';
  }
};

export default BMIMeter;
