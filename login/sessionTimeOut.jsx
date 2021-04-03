import React from 'react';
import './login.css';
import '../styles/form-element/form-element.css';
import messages from '../utils/constants.jsx';
import LinkPvcCont from '../contactUs/LinkPvcCont.jsx';

var SessionTimeOut = require('create-react-class')({
	getInitialState: function () {
		//	this.generate_sessions();
		this.state = {
			loginbutton: true,
			loading: false
		}
		return this.state;
	},
	componentWillMount() {
	},
	componentDidMount() {
	},
	render: function () {
		return (
			<div>
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-12 col-lg-12 col-sm-12 col-xs-12">
							<div className="form-container">
								<div className="row margin-8vh">
									<div className="col-md-4 col-lg-4 col-sm-6 col-xs-12 col-sm-offset-3 col-md-offset-4 col-lg-offset-4 form-container-bg logo_padding">
										<div className="site-brand-logo align-center">
											<img src="images/logo.png" alt="" className="img-responsive" />
										</div>
									</div>
								</div>
								<div className="row">
									<div className="popup-height col-md-4 col-lg-4 col-sm-6 col-xs-12 col-sm-offset-3 col-md-offset-4 col-lg-offset-4 form-container-bg">
										<div className="col-xs-12 col-sm-12 col-md-12 bold forgotlink">
											<div className="form-group">
												<span>{messages.SESSIONEXPIRE} <a href="/#/">{messages.HERE}</a> {messages.RELOGIN}</span>
											</div>
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-md-4 col-lg-4 col-sm-6 col-xs-12 col-sm-offset-3 col-md-offset-4 col-lg-offset-4 form-container-bg">
										<div className="row">
											<LinkPvcCont />
											<div className="col-md-12 left-align-text text-size-12 copyright-info-container">
												<div className="copyright-label text-size-12 center-align-text">
													&copy;{messages.COPYRIGHTMSG}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
);
export default SessionTimeOut;