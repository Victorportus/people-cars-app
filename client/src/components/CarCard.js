import React from 'react';
import { Card } from 'antd';

const CarCard = ({ car }) => (
  <Card type="inner" title={`${car.year} ${car.make} ${car.model}`}>
    <p>Price: ${car.price}</p>
  </Card>
);

export default CarCard;
