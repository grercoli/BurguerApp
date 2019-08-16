import React, { Component } from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import { Route } from 'react-router-dom'; //con esto hago lo que se llama nested routes
import ContactData from './ContactData/ContactData';

class Checkout extends Component {
    state = {
        ingredients: null,
        totalPrice: 0
    }

    //para solucionar que mas abajo le pase ingredients como null, cambio a un WillMount osea que se ejecute antes de cargar el componente hijo
    componentWillMount() {
        const query = new URLSearchParams(this.props.location.search); //incluye el ? y lo que le sigue
        const ingredients = {};
        let price = 0;

        for (let param of query.entries()) { //query.entries() para iterar en cada queryParam
            //param tiene este formato: ['salad', 1] -> la llave y el valor, param[0] es el nombre del ingrediente y param[1] es el valor
            if (param[0] === 'price') {
                price = param[1];
            } else {
                ingredients[param[0]] = +param[1]; //convierto a numero agregando un "+"
            }
        }
        this.setState({ingredients: ingredients, totalPrice: price});
    }

    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    }

    checkoutContinuedHandler = () => {
        this.props.history.replace("/checkout/contact-data");
    }

    render() {
        return (
            <div>
                <CheckoutSummary
                    ingredients={this.state.ingredients}
                    checkoutCancelled={this.checkoutCancelledHandler}
                    checkoutContinued={this.checkoutContinuedHandler}
                />
                <Route path={this.props.match.path + '/contact-data'} render={(props) => (<ContactData ingredients={this.state.ingredients} price={this.state.totalPrice} {...props} />)} />
            </div>
        )
    }
}

export default Checkout;