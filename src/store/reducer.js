import * as actionTypes from './actions';

const initialState = {
    ingredients: {
        salad: 0,
        bacon: 0,
        cheese: 0,
        meat: 0
    },
    totalPrice: 4
};

const INGREDIENT_PRICES = { //incluso podemos obtenerlo de una base de datos o de un server
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: { //estoy creando un nuevo objeto, porque el state de arriba no crea deep objects
                    ...state.ingredients, //va a copiar los ingredients del state viejo
                    [action.ingredientName]: state.ingredients[action.ingredientName] + 1 //es para overridear el ingrediente que me traiga el payload es sintax ES6, con los [] no creo un array, al contrario establezo una propiedad/key y le seteo el valor. state.ingredients[ingredientName] obtiene el valor viejo
                },
                totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName]
            };
        case actionTypes.REMOVE_INGREDIENT:
            return {
                ...state,
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientName]: state.ingredients[action.ingredientName] - 1
                },
                totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName]
            };
        default:
            return state;
    }
}

export default reducer;