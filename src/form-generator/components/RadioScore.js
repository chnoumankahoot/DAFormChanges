import React, { useContext, useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { normalizeId } from '../helpers/utility';
import ComponentContext from '../context/ComponentContext';
import RadioInput from './RadioInput';

const RadioScore = ({
  id,
  title,
  minScore,
  maxScore,
  step,
  scoreFields,
  groupName = '',
  className = '',
  preValue,
  onFormChange
}) => {
  const { context, updateRadioScore } = useContext(ComponentContext);

  const [total, setTotal] = useState(minScore * scoreFields.length);

  useEffect(() => {
    calculateTotal();
  }, []);

  const isChecked = (scoreField, i) => {
    return preValue && preValue[scoreField] ? i === preValue[scoreField] : i === minScore;
  };

  const calculateTotal = () => {
    let tempTotal = 0;
    scoreFields.forEach(scoreField => {
      var radios = document.getElementsByName(scoreField);
      for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
          tempTotal += parseInt(radios[i].value);
          break;
        }
      }
    });
    const oldScore = context.radioScore[groupName] || 0;
    updateRadioScore(groupName, oldScore - total + tempTotal);
    setTotal(tempTotal);
  };

  const headerScores = () => {
    let scores = [];
    for (let i = minScore; i <= maxScore; i = i + step) {
      const elem = <th key={i} className={`${i === maxScore ? 'rounded-right' : ''} text-center`}>{i}</th>;
      scores.push(elem);
    }
    return scores;
  };

  const bodyScores = (scoreField, index) => {
    let scores = [];
    for (let i = minScore; i <= maxScore; i = i + step) {
      const elem = (
        <td key={i}>
          <RadioInput
            id={normalizeId(scoreField) + '-' + i}
            value={i}
            groupName={scoreField}
            defaultChecked={isChecked(scoreField, i)}
            onChange={() => {
              if (calculateTotal) calculateTotal();
              onFormChange();
            }}
            className="w-100 justify-content-center"
          />
        </td>
      );
      scores.push(elem);
    }
    return scores;
  };

  const header = () => {
    return (
      <thead>
        <tr className="bg-primary text-white">
          <th className="rounded-left"></th>
          {headerScores()}
        </tr>
      </thead>
    );
  };

  const body = () => {
    return (
      <tbody>
        {scoreFields.map((scoreField, index) => {
          return (
            <tr key={index}>
              <td>{scoreField}</td>
              {bodyScores(scoreField, index)}
            </tr>
          );
        })}
      </tbody>
    );
  };

  const footer = () => {
    return (
      <tfoot>
        <tr>
          <td className="text-right text-secondary">
            {' '}
            <b>Total</b>
          </td>
          <td colSpan={maxScore - minScore + 1} className="text-center">
            <b name={'radio-total'}>{total}</b>
          </td>
        </tr>
      </tfoot>
    );
  };

  return (
    <Table id={id || normalizeId('RadioScore-' + title)} bordered className={'rounded mb-3 ' + className} responsive>
      {header()}
      {body()}
      {footer()}
    </Table>
  );
};

export default RadioScore;
