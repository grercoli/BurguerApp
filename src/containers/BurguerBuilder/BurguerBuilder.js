import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliar';
import Burguer from '../../components/Burguer/Burguer';
import BuildControls from '../../components/Burguer/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burguer/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import { connect } from 'react-redux';
import * as burguerBuilderActions from '../../store/actions/index'; //puedo no escribir index porque automaticamente lo toma de la carpeta actions
import * as actions from '../../store/actions/index';

//I name global variables in all capital letters
// const INGREDIENT_PRICES = {
//     salad: 0.5,
//     cheese: 0.4,
//     meat: 1.3,
//     bacon: 0.7
// };

class BurguerBuilder extends Component {
    //This is the old way
    // constructor(props) {
    //     super(props);
    //     this.state = {};
    // }

    //Modern way of declaring state
    //object: "keys" are the values of the ingredients and the "value" is the amount
    state = {
        //purchasable: false,
        purchasing: false
        //loading: false,
        //error: false
    }

    componentDidMount() {
        this.props.onInitIngredients();
        // axios.get('https://react-my-burguer-3d025.firebaseio.com/ingredients.json')
        //     .then(response => {
        //         this.setState({ingredients: response.data}) //en lugar de un setState podria hacer dispatch de una action
        //     })
        //     .catch(error => {
        //         this.setState({error: true});
        //     });
    }

    updatePurchasable (ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            }).reduce((sum, el) => {
                return sum + el;
            }, 0); //tengo un valor inicial de cero. Sum vendria a ser el valor constantemente actualizado y "el" la iteracion actual. Una vez terminada la iteracion sum vendria a ser el resultado final
        return sum > 0;
            // this.setState({
        //     purchasable: sum > 0
        // }); //va a ser true si tenemos al menos un ingrediente seleccionado
    }

    // addIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     const updatedCount = oldCount +1;
    //     //I create like a copy
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     };
    //     //I access to the ingredient type and update the number
    //     updatedIngredients[type] = updatedCount;
    //     const priceAddition = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice + priceAddition;
    //     this.setState({
    //         totalPrice: newPrice,
    //         ingredients: updatedIngredients
    //     });
    //     this.updatePurchasable(updatedIngredients);
    // }

    // removeIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     if(oldCount <= 0) {
    //         return;
    //     }
    //     const updatedCount = oldCount - 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     };
    //     updatedIngredients[type] = updatedCount;
    //     const priceRemove = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice - priceRemove;
    //     this.setState({
    //         totalPrice: newPrice,
    //         ingredients: updatedIngredients
    //     });
    //     this.updatePurchasable(updatedIngredients);
    // }

    purchaseHandler = () => {
        if (this.props.isAuthenticated) {
            this.setState({
                purchasing: true
            });
        } else {
            this.props.onSetAuthRedirectPath('/checkout'); // this is where the user should go thereafter
            this.props.history.push('/auth'); // history props is coming from the react router
        }
    }

    purchaseCancelHandler = () => {
        this.setState({
            purchasing: false
        });
    }

    purchaseContinueHandler = () => {
        //alert("You continue!");
        
        // const queryParams = [];
        // for (let i in this.state.ingredients) {
        //     queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        // }
        // queryParams.push('price=' + this.state.totalPrice);
        // const queryString = queryParams.join('&');
        // this.props.history.push({
        //     pathname: '/checkout',
        //     search: '?' + queryString
        // });
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }

    render() {
        //Before we return JSX i'll create a new constant disabledInfo
        const disabledInfo = {
            ...this.props.ings
        };

        //I create a for/in loop so loop throught all the keys in disabledInfo and it will simple check if this is zero or less and it will update the disabledInfo key so salad, meat, cheese, no va a mostrar por ejemplo salad 0, cheese 0.. va a mostrar true si tiene que estar disabled. En otras palabras por ejemplo tomando el caso de salad, si tiene 0 ingredientes va a hacer la comparacion con <=0 por lo tanto me va a devolver un true y ese valor lo guarda en el ingrediente: "salad"
        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;
        let burguer = this.props.error ? <p>Ingredients can't be loaded</p> : <Spinner />;

        if(this.props.ings) {
            burguer = (
                <Aux>
                    <Burguer ingredients={this.props.ings} />
                    <BuildControls 
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        purchasable={this.updatePurchasable(this.props.ings)}
                        price={this.props.price}
                        ordered={this.purchaseHandler}
                        isAuth={this.props.isAuthenticated}
                    />
                </Aux>
            );
            orderSummary = <OrderSummary 
                ingredients={this.props.ings}
                price={this.props.price}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler} />;
        }

        // if(this.state.loading) {
        //     orderSummary = <Spinner />;
        // }

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

const mapStateToProps = state => {
    return {
        ings: state.burguerBuilder.ingredients,
        price: state.burguerBuilder.totalPrice,
        error: state.burguerBuilder.error,
        isAuthenticated: state.auth.token !== null
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurguerBuilder, axios));