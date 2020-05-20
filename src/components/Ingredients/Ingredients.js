import React, { useState, useReducer, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const ingredientReducer = (currentIngredients, action) => {
  switch(action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [ ...currentIngredients, action.ingredient ];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
      default:
        throw new Error('Should not get there');
  }
};

const Ingredients = () => {
  const [ userIngredients, dispatch ] = useReducer(ingredientReducer, []);
  //const [ userIngredients, setUserIngredients ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState();
  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients);
  }, [userIngredients]);
  
  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    //setUserIngredients(filteredIngredients);
    dispatch({ type: 'SET', ingredients: filteredIngredients});
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
      // setUserIngredients(prevIngredients => [
      //   ...prevIngredients,
      //   {id: responseData.name, ...ingredient}
    // ]);
      dispatch({type: 'ADD', ingredient: {id: responseData.name, ...ingredient}});
    });
  };

   const removeIngredientHandler = ingredientId => {
     setIsLoading(true);
    fetch(`https://react-hooks-starting-pro-e28a1.firebaseio.com/ingredients/${ingredientId}.json`,
    {
      method: 'DELETE'
    }).then (response => {
      // setIsLoading(false);
      // setUserIngredients(userIngredients.filter (userIngredients => userIngredients.id !== ingredientId));
      dispatch({type: 'DELETE', id: ingredientId});
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
