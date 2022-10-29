import React from 'react';
import './progress.scss';

const CircularProgressBar = ({ size = 1.5 }) => {
  return <progress style={{ width: `${size}em`, height: `${size}em` }} class="pure-material-progress-circular" />;
};

export default CircularProgressBar;
