import React from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import '../styles/form-element/form-element.css';
import '../commanPopup/modal.css';
import messages from '../utils/constants.jsx';
var createReactClass = require('create-react-class');
const ErrorPopup = createReactClass({
    getInitialState() {
        this.state = {
            headerMessage: "",
            bodyMessage: "",
            extendedMessage : ""
        }
        return { showModal: true };
    },
    componentWillMount() {
        this.setState({ headerMessage: this.props.Header, bodyMessage: this.props.SuccessMessage, extendedMessage : this.props.extendedMessage });
    },
    close(e) {
        this.setState({ showModal: false });
        if (e) {
            e.stopPropagation();
        }
        if(this.props.container){
            ReactDOM.unmountComponentAtNode(document.getElementById('eulaModalView'));
        }
        else{
            ReactDOM.unmountComponentAtNode(document.getElementById('modelview'));
        }
        
    },

    open() {
        this.setState({ showModal: true });
    },
    render() {
        return (
            <div id="myModal" className="faicon">
                <Modal show={this.state.showModal} >
                    <Modal.Header>
                        <Modal.Title>{this.state.headerMessage}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <center>{this.props.bodyMessage}</center>
                        <center>{this.state.bodyMessage}</center>
                        {this.props.extendedMessage ? <center>{this.props.extendedMessage}</center> : ""}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.close} className="btn btn-block w-25">{messages.CLOSE}</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
});

export default ErrorPopup;    