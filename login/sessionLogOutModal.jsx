import React, { Component } from 'react';
import $ from 'jquery';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import CustomButton from '../components/customButton/customButton.jsx';
import ReactDOM from 'react-dom';
import '../styles/form-element/form-element.css';
import '../commanPopup/modal.css';
import messages from '../utils/constants.jsx';
import { LogoutFunction } from '../utils/utility.jsx';

const SessionLogoutModal = require('create-react-class')({
    getInitialState() {
        this.state = {
                        headerMessage: "",
                        bodyMessage: ""
        }
        return { showModal: true };
    },
    componentWillMount() {
        this.setState({ headerMessage: messages.LOGINSESSIONEXPIREHEADER,bodyMessage: messages.SESSIONEXPIRE });
        localStorage.removeItem("TimeOut");
    },
    close(e) {
        this.setState({ showModal: false });
        if(e){
            e.stopPropagation();
        }
        ReactDOM.unmountComponentAtNode(document.getElementById('modelview'));
        window.location.href = "/"
        LogoutFunction("expired");
    },

    open() {
        this.setState({ showModal: true });
    },

    render() {
        return (
            <div id="sessionout" className="faicon session-modal">
                <Modal show={this.state.showModal} className="session-modal">
                    <Modal.Header>
                        <h5>{this.state.headerMessage}</h5>
                        <span className="Sessionoutmaodal" onClick={this.close}>&times;</span>
                    </Modal.Header>
                    <Modal.Body>
                        <div>{this.state.bodyMessage}<a className="cursor-pointer" onClick={this.close}> here</a> {messages.RELOGIN}</div>
                        <div className="sessionmodalBody"></div>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
});
                
export default SessionLogoutModal;   