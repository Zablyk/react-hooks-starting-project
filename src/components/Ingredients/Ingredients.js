import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const Ingredients = () => {
  const [ userIngredients, setUserIngredients ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState();
  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients);
  }, [userIngredients]);
  
  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
  }, []); 

  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    fetch('https://react-hooks-starting-pro-e28a1.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json'}
    }).then ( response => {
        setIsLoading(false);
        return response.json();
    }).then (responseData => {
      setUserIngredients(prevIngredients => [
        ...prevIngredients,
        {id: responseData.name, ...ingredient}
      ]);
    });
  };

   const removeIngredientHandler = ingredientId => {
     setIsLoading(true);
    fetch(`https://react-hooks-starting-pro-e28a1.firebaseio.com/ingredients/${ingredientId}.jon`,
    {
      method: 'DELETE'
    }).then (response => {
      setIsLoading(false);
      setUserIngredients(userIngredients.filter (userIngredients => userIngredients.id !== ingredientId));
    }).catch(error => {
        setError(error.message);
        setIsLoading(false);
      });
  };

  const clearError = () => {
    setError(null);
  }

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList ingredients={userIngredients} onRemoveItem={(id) => {removeIngredientHandler(id)}}/>
      </section>
    </div>
  );
}

export default Ingredients;
