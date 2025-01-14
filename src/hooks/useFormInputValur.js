import { useState } from 'react';

export const useFormInputValue = (initialState) => {
  const [state, setState] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return {
    state,
    setState,
    handleChange,
  };
};