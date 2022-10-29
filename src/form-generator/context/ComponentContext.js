import { createContext } from 'react';

const ComponentContext = createContext({
  context: {
    radioScore: {}
  },
  updateRadioScore: () => {}
});
export default ComponentContext;
