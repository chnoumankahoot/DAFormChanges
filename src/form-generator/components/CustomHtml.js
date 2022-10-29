import React from 'react';

const CustomHtml = ({ id = '', html, className = '' }) => {
  return <div id={id} className={className} dangerouslySetInnerHTML={{ __html: html }}></div>;
};

export default CustomHtml;
