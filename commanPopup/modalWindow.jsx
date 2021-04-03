import React from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import '../styles/form-element/form-element.css';
import '../commanPopup/modal.css';
import messages from '../utils/constants.jsx';
var createReactClass = require('create-react-class');
		const ModalView = createReactClass({
					getInitialState() {
							this.state = {
											headerMessage: "",
											bodyMessage: ""
							}
							return { showModal: true };
					},
					componentWillMount() {
													this.setState({ headerMessage: this.props.Header,bodyMessage: this.props.SuccessMessage });
					},
				  close(e) {
						this.setState({ showModal: false });
						if(e){
								e.stopPropagation();
						}
						if(this.props.firstReload)
						{
							window.location.reload();
						}
						ReactDOM.unmountComponentAtNode(document.getElementById('modelview'));
						if(this.props.action)
						{
								window.location = "/#/"+this.props.action;
						}
						if(this.props.reload)
						{
							window.location.reload();
						}
				  },

				  open() {
				    this.setState({ showModal: true });
					},
					reload(e){
							this.setState({ showModal: false });
							if(e){
									e.stopPropagation();
							}
							ReactDOM.unmountComponentAtNode(document.getElementById('modelview'));
							window.location.reload();
					},

				  render() {
				    
				    return (
				      <div id="myModal" className="faicon">
				        <Modal show={this.state.showModal} bsSize="medium">
				          <Modal.Header>
				            <Modal.Title>{this.state.headerMessage}</Modal.Title>
				          </Modal.Header>
				          <Modal.Body>
				              <center>{this.state.bodyMessage}</center>
				          </Modal.Body>
				          <Modal.Footer>
									{this.props.Tryreload?<Button onClick={this.reload} className="btn btn-block w-25">{messages.TRYRELOAD}</Button>	:""}										
									<Button onClick={this.close} className="btn btn-block w-25">{messages.CLOSE}</Button>                      
				          </Modal.Footer>
				        </Modal>
				      </div>
				    );
				  }
			});
			
			export default ModalView;    