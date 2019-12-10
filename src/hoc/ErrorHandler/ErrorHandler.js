import React, { Component, Fragment } from 'react';

import Modal from '../../components/UI/Modal/Modal';

const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component {
        state = {
            error: null,
            message: ''
        }

        componentWillMount() {
            this.reqInterceptor = axios.interceptors.request.use(req => {
                this.setState({ error: null });
                return req;
            });

            // const token = store.getState().session.token;
            // config.headers.Authorization =  token;
        
            // return config;

            this.resInterceptor = axios.interceptors.response.use(res => res
            , error => {
            console.log(error.response);
            this.setState({ error: error});
        } );
}

componentWillUnmount() {
    axios.interceptors.request.eject(this.reqInterceptor);
    axios.interceptors.response.eject(this.resInterceptor);
}

errorConfirmedHandler = () => {
    this.setState({ error: null });
}

render() {
    return (
        <Fragment>
            <Modal
                show={this.state.error}
                modalClosed={this.errorConfirmedHandler}>
                {this.state.error ? this.state.error.response.data.message : null}
            </Modal>
            <WrappedComponent {...this.props} />
        </Fragment>
    );
}
    }
}

export default withErrorHandler;