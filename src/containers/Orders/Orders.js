import React, { Component } from 'react';
import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

class Orders extends Component {
    state= {
        orders: [],
        loading: true
    }

    componentDidMount() {
        axios.get('/orders.json')
            .then(res => {
                //console.log(res.data); puedo ver que me devuelve un objeto, y las llaves son keys unicas que otorga firebase, pero lo que quiero hacer es transformar el objeto orders en un array
                const fetchedOrders = [];
                for (let key in res.data) {
                    fetchedOrders.push({
                       ...res.data[key],
                       id: key
                    }); //res.data[key] para acceder al valor (la orden). Como tambien quiero la key creo un objeto que se lo termino pasando al array mediante push
                }
                this.setState({loading: false, orders: fetchedOrders});
            })
            .catch(error => {
                this.setState({loading: false});
            });
    }
    //this.state.orders.map() para convertir en un array de elementos JSX
    render () {
        return (
            <div>
                {this.state.orders.map(order => (
                    <Order 
                        key={order.id}
                        ingredients={order.ingredients}
                        price={order.price} 
                    />
                ))}
            </div>
        );
    }
}

export default withErrorHandler(Orders, axios);