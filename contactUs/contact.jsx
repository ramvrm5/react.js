import React from 'react';
import '../login/login.css';
import '../styles/form-element/form-element.css';
import './contact.less';
import LinkPvcCont from './LinkPvcCont.jsx';
import { Link } from 'react-router-dom';
import messages from '../utils/constants.jsx';
var createReactClass = require('create-react-class');
var Contact = createReactClass({
	getInitialState: function () {
		this.state = {
			loginbutton: true,
			loading: false
		}
		return this.state;
	},
	componentWillMount() {
		localStorage.setItem('classPrivacy', true);
	},
	componentDidMount() {
	},
	componentWillUnmount() {
		localStorage.setItem('classPrivacy', false);
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
									<div className="popup-height col-md-4 col-lg-4 col-sm-6 col-xs-12 col-sm-offset-3 col-md-offset-4 col-lg-offset-4 form-container-bg container-height">
										<div className="div-padding">
											<span className="HoneywellSansWeb-ExtraBold Actiontitle label-size align-btn">{messages.CONTACT}</span>
										</div>
										<span className="contactAddresslist">
											<div className="HoneywellSansWeb-Medium contactAddress row">{messages.ADDRESSBAR1} </div>
											<div className="HoneywellSansWeb-Medium contactAddress row">{messages.ADDRESSBAR2} </div>
											<div className="HoneywellSansWeb-Medium contactAddress row">{messages.ADDRESSBAR3} </div>
											<div className="HoneywellSansWeb-Medium contactAddress row">{messages.ADDRESSBAR4} </div>
										</span>
										<span className="contactmainlist div-padding btn-back-margin">
											<div className="HoneywellSansWeb-Medium mainAddress row">{messages.MAINPHONELABLE}{messages.MAINPHONE} </div>
											<div className="HoneywellSansWeb-Medium mainAddress row">{messages.MAINMAILLABLE} <a href="mailto:detectgas@Honeywell.com"> {messages.MAINEMAIL} </a></div>
											<div className="HoneywellSansWeb-Medium mainAddress row">{messages.MAINFAXLABLE}{messages.MAINFAX} </div>
										</span>
										<Link to="/login" className="HoneywellSansWeb-ExtraBold go-back align-btn">{messages.GoBack}</Link>
									</div>
								</div>
								<div className="row">
									<div className="col-md-4 col-lg-4 col-sm-6 col-xs-12 col-sm-offset-3 col-md-offset-4 col-lg-offset-4 form-container-bg footer-padding">
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
export default Contact;