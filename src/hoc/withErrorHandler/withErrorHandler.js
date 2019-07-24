//creo este archivo para poder usarlo en cualquier parte de la aplicacion que pueda tirar un error.
//Es otra manera de crear un high order component
import React, { Component } from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxiliar';

const withErrorHandler = (WrappedComponent, axios) => { //va axios como segundo parametro porque es el que use para capturar el error
    return class extends Component { //es una clase anonima, nunca la uso, es una class factory. withErrorHandler crea esta clase
        state = {
            error: null
        }

        constructor(props) {
            super(props);
            //con la instancia de axios puedo configurar un interceptor global, que me permita manejar errores
            this.reqInterceptor = axios.interceptors.request.use(req => {
                this.setState({error: null});
                return req;
            });
            this.resInterceptor =axios.interceptors.response.use(res => res, error => {
                this.setState({error: error});
            });
        }

        componentWillUnmount() {
            //para limpiar los interceptors una vez que el componente termina de usarlos, asi evito que haya muchos interceptors cada vez que se usa el withErrorHandler en un componente
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.response.eject(this.resInterceptor);
        }

        errorConfirmedHandler = () => {
            this.setState({error: null});
        }

        render() {
            return(
                <Aux>
                    <Modal 
                        show={this.state.error}
                        modalClosed={this.errorConfirmedHandler}
                    >
                        {this.state.error ? this.state.error.message : null}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Aux>
            );
        }
    }
}

export default withErrorHandler;

//<WrappedComponent {...props} /> no conozco las props que recive pero tampoco quiero perderlas