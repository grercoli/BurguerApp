//actions creators for building a burguer

import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const addIngredient = ( name ) => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        ingredientName: name //es el payload
    };
};

export const removeIngredient = ( name ) => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientName: name
    };
};

export const setIngredients = ( ingredients ) => {
    return {
        type: actionTypes.SET_INGREDIENTS,
        ingredients: ingredients
    };
};

export const fetchIngredientsFailed = () => {
    return {
        type: actionTypes.FETCH_INGREDIENTS_FAILED
    };
};

//lo ideal no seria inicializar los ingredientes desde el server sino de la propia aplicacion, solo que esto es un ejemplo
export const initIngredients = () => {
    return dispatch => {
        axios.get( 'https://react-my-burguer-3d025.firebaseio.com/ingredients.json' )
            .then( response => {
               dispatch(setIngredients(response.data));
            } )
            .catch( error => {
                dispatch(fetchIngredientsFailed());
            } );
    };
};