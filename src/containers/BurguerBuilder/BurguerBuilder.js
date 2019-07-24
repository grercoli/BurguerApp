import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliar';
import Burguer from '../../components/Burguer/Burguer';
import BuildControls from '../../components/Burguer/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burguer/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

//I name global variables in all capital letters
const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurguerBuilder extends Component {
    //This is the old way
    // constructor(props) {
    //     super(props);
    //     this.state = {};
    // }

    //Modern way of declaring state
    //object: "keys" are the values of the ingredients and the "value" is the amount
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        axios.get('https://react-my-burguer-3d025.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ingredients: response.data})
            })
            .catch(error => {
                this.setState({error: true});
            });
    }

    updatePurchasable (ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            }).reduce((sum, el) => {
                return sum + el;
            }, 0); //tengo un valor inicial de cero. Sum vendria a ser el valor constantemente actualizado y "el" la iteracion actual. Una vez terminada la iteracion sum vendria a ser el resultado final
        this.setState({
            purchasable: sum > 0
        }); //va a ser true si tenemos al menos un ingrediente seleccionado
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount +1;
        //I create like a copy
        const updatedIngredients = {
            ...this.state.ingredients
        };
        //I access to the ingredient type and update the number
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        });
        this.updatePurchasable(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount <= 0) {
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceRemove = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceRemove;
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        });
        this.updatePurchasable(updatedIngredients);
    }

    purchaseHandler = () => {
        this.setState({
            purchasing: true
        });
    }

    purchaseCancelHandler = () => {
        this.setState({
            purchasing: false
        });
    }

    purchaseContinueHandler = () => {
        //alert("You continue!");
        this.setState({ loading: true });
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Gustavo',
                address: {
                    street: 'Mengano 1674',
                    zipCode: '7661',
                    country: 'Argentina'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest'
        }; //el price es una muy buena idea calcularlo desde el servidor para evitar que un usuario pueda manipular el precio, pero en este caso se lo paso por aca
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({ loading: false, purchasing: false });
            })
            .catch(error => {
                this.setState({ loading: false, purchasing: false });
            }); //el .json solo para firebase funciona
    }

    render() {
        //Before we return JSX i'll create a new constant disabledInfo
        const disabledInfo = {
            ...this.state.ingredients
        };

        //I create a for/in loop so loop throught all the keys in disabledInfo and it will simple check if this is zero or less and it will update the disabledInfo key so salad, meat, cheese, no va a mostrar por ejemplo salad 0, cheese 0.. va a mostrar true si tiene que estar disabled. En otras palabras por ejemplo tomando el caso de salad, si tiene 0 ingredientes va a hacer la comparacion con <=0 por lo tanto me va a devolver un true y ese valor lo guarda en el ingrediente: "salad"
        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;
        let burguer = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />;

        if(this.state.ingredients) {
            burguer = (
                <Aux>
                    <Burguer ingredients={this.state.ingredients} />
                    <BuildControls 
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        purchasable={this.state.purchasable}
                        price={this.state.totalPrice}
                        ordered={this.purchaseHandler}
                    />;
                </Aux>
            );
            orderSummary = <OrderSummary 
                ingredients={this.state.ingredients}
                price={this.state.totalPrice}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler} />;
        }

        if(this.state.loading) {
            orderSummary = <Spinner />;
        }

        return(
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burguer}
            </Aux>
        );
    }
}

export default withErrorHandler(BurguerBuilder, axios);