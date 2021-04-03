import React from 'react';
import $ from 'jquery';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import messages from '../utils/constants.jsx';
import '../styles/form-element/form-element.css';
import '../commanPopup/modal.css';
import ModalWindow from '../commanPopup/modalWindow.jsx';
import { LogoutFunction } from '../utils/utility.jsx';
var createReactClass = require('create-react-class');
const DeleteModalView = createReactClass({
  getInitialState() {
    this.state = {
      headerMessage: "",
      bodyMessage: "",
      loading: false,
      content: true,
      cancleBtn: false,
      successBtn: true
    }
    return { showModal: true };
  },
  componentWillMount() {
    this.setState({
      headerMessage: this.props.HeaderMsg,
      bodyMessage: this.props.DeleteBodyMessage
    });
  },
  proceed: function () {
    var datastring = this.props.datastring;
    this.setState({ loading: true, content: true, cancleBtn: false, successBtn: false, isDisabled: true });
    $.ajax({
      type: "POST",
      url: this.props.TypeUrl,
      data: datastring,
      mimeType: 'text/plain; charset=x-user-defined',
      cache: false,
      async: true,
      success: function (data) {
        if (data == messages.Session_Timeout) {
          LogoutFunction("sessionout");
          return;
        }
        data = JSON.parse(data);
        this.setState({
          loading: false,
          content: false,
          cancleBtn: true,
          successBtn: true,
          headerMessage: messages.RESPONSEMESSAGE,
          bodyMessage: this.props.successMessage
        })
      }.bind(this),
      error: function () {
        $("#loading-block").css("display", "none");
        ReactDOM.render(
          <div>
            <ModalWindow Header={messages.RESPONSEMESSAGE} SuccessMessage={messages.DEFAULTERRMSG} />
          </div>,
          messages.MODELVIEWDIV
        );
      }
    });
  },
  componentDidMount() {
    if (this.props.onLoadSuccess === "true") {
      this.proceed();
    }
  },
  close(e) {
    this.setState({ showModal: false });
    if (e) {
      e.stopPropagation();
    }
    ReactDOM.unmountComponentAtNode(document.getElementById('modelview'));
  },
  notProceed(e) {
    this.close(e);
  },
  open() {
    this.setState({ showModal: true });
  },
  closePopup(e) {
    window.location.reload();
    this.close(e);
  },
  render() {
    let bodycontent = this.state.content ? "" : <center>{this.state.bodyMessage}</center>;
    let loadingImg = this.state.loading ? <div className="form-group login_loading"><center><img src="/images/loading.gif" alt="" className="img-responsive loading_image" /></center></div> : "";
    let logoutFunctionShow = this.props.logoutSuccess == "true"? this.props.proceed:this.proceed;
    return (
      <div id="myModal" className="faicon">
        <Modal show={this.state.showModal} >
          <Modal.Header>
            <Modal.Title>{this.state.headerMessage}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {bodycontent}
            {loadingImg}
          </Modal.Body>
          <Modal.Footer>
            {this.props.onLoadSuccess === "true" ? "" : this.state.successBtn ? "" : <Button disabled={this.state.isDisabled} onClick={logoutFunctionShow} className="btn btn-block w-25 mr-3">{messages.YES}</Button>}

            {this.props.onLoadSuccess === "true" ? "" : this.state.successBtn ? "" : <Button disabled={this.state.isDisabled} onClick={this.notProceed} className="btn btn-block w-25 m-0">{messages.NO}</Button>}

            {this.props.onLoadSuccess === "true" ? <Button disabled={!this.state.cancleBtn} onClick={this.closePopup} className="btn btn-block w-25">{messages.CLOSE}</Button> : this.state.cancleBtn ? <Button onClick={this.closePopup} className="btn btn-lg">{messages.CLOSE}</Button> : ""}
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
});
export default DeleteModalView;    