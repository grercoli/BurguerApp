import React, { Component } from 'react';
import { connect } from 'react-redux';
import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';

class Orders extends Component {
    state= {
        orders: [],
        loading: true
    }

    componentDidMount() {
        // axios.get('/orders.json')
        //     .then(res => {
        //         //console.log(res.data); puedo ver que me devuelve un objeto, y las llaves son keys unicas que otorga firebase, pero lo que quiero hacer es transformar el objeto orders en un array
        //         const fetchedOrders = [];
        //         for (let key in res.data) {
        //             fetchedOrders.push({
        //                ...res.data[key],
        //                id: key
        //             }); //res.data[key] para acceder al valor (la orden). Como tambien quiero la key creo un objeto que se lo termino pasando al array mediante push
        //         }
        //         this.setState({loading: false, orders: fetchedOrders});
        //     })
        //     .catch(error => {
        //         this.setState({loading: false});
        //     });
        this.props.onFetchOrders(this.props.token, this.props.userId);
    }

    //this.state.orders.map() para convertir en un array de elementos JSX
    render () {
        let orders = <Spinner />;
        if ( !this.props.loading ) {
            orders = this.props.orders.map( order => (
                <Order
                    key={order.id}
                    ingredients={order.ingredients}
                    price={order.price} />
            ) )
        }
        return (
            <div>
                {orders}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        orders: state.order.orders,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchOrders: (token, userId) => dispatch( actions.fetchOrders(token, userId) )
    };
};

export default connect( mapStateToProps, mapDispatchToProps )( withErrorHandler( Orders, axios ) );