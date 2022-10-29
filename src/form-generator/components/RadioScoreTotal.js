import React, { useContext } from 'react';
import ComponentContext from '../context/ComponentContext';

const RadioGroupTotalScore = ({ radioGroupName = '', className = '' }) => {
  const { context } = useContext(ComponentContext);

  return (
    <div className={'float-right ' + className}>
      <h5>
        <i>Grand Total: </i>
        {context.radioScore[radioGroupName] || 0}
      </h5>
    </div>
  );
};

export default RadioGroupTotalScore;
