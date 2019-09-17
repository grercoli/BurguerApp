//uso este archivo en el app.js file por ejemplo
import React, { Component } from 'react';

const asyncComponent = (importComponent) => { //takes a function as an input
    return class extends Component {
        state = {
            component: null
        }

        componentDidMount () {
            importComponent()
                .then(cmp => {
                    this.setState({component: cmp.default}); //we get the component we want to load
                });
        }
        
        render () {
            const C = this.state.component; //render the component we want to load

            return C ? <C {...this.props} /> : null;
        }
    }
}

export default asyncComponent;