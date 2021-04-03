import React from 'react';
import ReactDOM from 'react-dom';
import LinkPvcCont from '../contactUs/LinkPvcCont.jsx';
import $ from 'jquery';
import messages from '../utils/constants.jsx';
import { encodeString, getCookie, decodeString } from '../utils/utility.jsx';
import './login.css'
import '../styles/form-element/form-element.css';
import { store } from '../app.jsx';
import { storeToken} from '../shared/actions/action.jsx';
import SessionLogoutModal from './SessionLogoutModal.jsx';
import Logo from '../components/logo/logo.jsx';
import Inputtext from '../components/inputFields/inputtext.jsx';
import Inputpassword from '../components/inputFields/inputpassword.jsx';
import Inputcheckbox from '../components/inputFields/inputcheckbox.jsx';
import CustomButton from '../components/customButton/customButton.jsx';
import CustomLink from '../components/customLinks/customlink.jsx';
import FrogotPasswordPopup from '../forgotPassword/forgotPassword.jsx';
import {toast } from 'react-toastify';


const Login = require('create-react-class')({
	getInitialState: function () {
		this.isCookie = getCookie(messages.KeepSignIn);
		if (this.isCookie) {
			this.autoLogin();
		}
		this.state = {
			username: "",
			password: "",
			show: false,
			loginbutton: true,
			loading: false,
		}
		this.timeout = messages.Timeout;
		return this.state;
	},
	changeUsername(e) {
		this.setState({
			username: e.target.value
		});
	},
	changePassword(e) {
		this.setState({
			password: e.target.value
		});
	},
	handleClose() {
		this.setState({ show: false });
	},
	handleShow(e) {
		this.setState({ show: true });
	},
	handleKeepSignInValue: function (e) {
		this.setState({ keepMeSigned: e.target.checked });
	},

	componentDidMount() {
		$(".have-bg-image").css("background-image","url('../images/Locationbg.jpg')");	
		this.sessionOut = setInterval(
			() => this.timeout > 0 ? this.loginSessionTimeout() : "",
			1000
		);
	},
	generate_sessions: function (action) {
		this.accessTokenLogin = Math.random();
		if (action == "generateSessionTocken") {
			this.setState({ loading: true, loginbutton: true });
		}
		var datastring = "action=" + action + "&sessions_name=" + this.accessTokenLogin;
		store.dispatch(storeToken(this.accessTokenLogin));
		$.ajax({
			type: "POST",
			url: "LoginTokensSessionGenerator",
			mimeType: 'text/plain; charset=x-user-defined',
			data: datastring,
			cache: false,
			success: function () {
				if (action == "generateSessionTocken") {
					this.Login();
				}
			}.bind(this)
		});
	},
	loginSessionTimeout() {
		this.timeout--;
		if (this.timeout === messages.ZERO) {
			ReactDOM.render(
				<div>
					<SessionLogoutModal />
				</div>,
				messages.MODELVIEWDIV
			);
		}
	},
	componentWillUnmount() {
		clearTimeout(this.timeout);
		clearInterval(this.sessionOut);
	},
	Submit: function (e) {
		this.generate_sessions("generateSessionTocken");
	},

	Login: function (e) {
		if (e) {
			e.preventDefault();
		}
		let token = this.accessTokenLogin;
		var login_username = this.state.username.trim();
		var login_password = this.state.password.trim();
		var keepSignIn = this.state.keepMeSigned
		var dataString = "&username=" + encodeString(login_username) + "&password=" + encodeString(login_password) + "&keepSignIn=" + keepSignIn + "&token=" + token;
		$.ajax({
			type: "POST",
			url: "LoginAction",
			mimeType: 'text/plain; charset=x-user-defined',
			data: dataString,
			cache: false,
			async: true,
			success: function (data) {
				data = JSON.parse(data);
				if(data){
					store.dispatch(storeToken(data["randomNew"]));
					this.accessTokenLogin = data["randomNew"];
					if (data["errorCode"] == messages.SessionExired) {
						// ReactDOM.render(
						// 	<div>
						// 		<SessionLogoutModal />
						// 	</div>,
						// 	messages.MODELVIEWDIV
						// );
						toast.error("Invalid email and password");
					}
					else if(data.response.responseCode == messages.OK){
						var firstTimelogin = data.response.firstTimeLogin;
                        if(firstTimelogin){
							window.location.href = "/#/Eula";
						}
						else{
							localStorage.setItem('ActionID', "MapView");
							window.location = "/#/mapview";
							window.location.reload();
							localStorage.setItem("LoginState", "Success");
						}
					}else if(data.response.responseCode == messages.Pending){
						toast.error("Your organization request is pending");
					}
					else if(data.response.responseCode == messages.Deleted){
						toast.error("Your organization is deleted");
					}
					else if(data.response.responseCode == messages.Rejected){
						toast.error("Your organization request is rejected");
					}
					else{
						toast.error("Invalid email and password");
					}
					
				}
				this.setState({ loading: false, loginbutton: false })
			}.bind(this)
		});
		return false;
	},

	autoLogin: function () {
		$.ajax({
			type: "POST",
			url: "GetCookieValues",
			mimeType: 'text/plain; charset=x-user-defined',
			data: "",
			cache: false,
			success: function (data) {
				if (data) {
					data = JSON.parse(data);
					if (data["loginCred"]) {
						this.setState({ loading: true, loginbutton: true });
						let credData = decodeString(data["loginCred"]);
						let _savedCred = credData.split("--");
						let savedU = "";
						let savedP = "";
						let keepMeSigned = false;
						if (_savedCred.length == messages.TWO) {
							savedU = _savedCred[0];
							savedP = decodeString(_savedCred[1]);
							keepMeSigned = true;
							this.setState({ username: savedU, password: savedP, keepMeSigned: keepMeSigned });
							this.generate_sessions("generateSessionTocken");
						}
					}
				}
			}.bind(this),
			error: function () {

			}
		})
	},

	Signup() {
		window.location.href = "/#/SignUp";
	},

	// Show hide the password field text//
	changeState: function () {
		var oldState = this.state.type;
		var isTextOrHide = (oldState === 'password');
		var newState = (isTextOrHide) ? 'text' : 'password';
		var newWord = (isTextOrHide) ? 'fa fa-eye-slash eye-icon' : 'fa fa-fw fa-eye eye-icon';
		this.setState({
			type: newState,
			wording: newWord
		})
	},

	render: function () {
		let btnClass = "w-100  btn btn-light btn-lg";
		if (this.state.username && this.state.password) {
			btnClass = "w-100  btn btn-lg"
		}
		return (
			<div className="container-fluid">
				<div className="row">
					<div className="LoginBackground mx-auto loginmargin col-lg-4 col-md-8 col-sm-9 col-12">
						<div className="col-12 mx-auto">
							<div className="mb-3 mt-4 text-center">
								   <Logo path="/images/logo.png" />  
							</div>
							<form autoComplete="off" className="loginContentHeight">
								<Inputtext text={messages.EMAILID} textType="text" id="username" customClass="form-control" labelclass="form-control-placeholder" onChange={this.changeUsername.bind(this)} />
								<div className="form-group hide">
									<input type="password" id="ps_name" className="form-control" autoComplete="off" />
									<label className="form-control-placeholder" htmlFor="ps_name">{messages.PASSWORD}</label>
									<span className="fa fa-fw fa-eye field-icon"></span>
								</div>
								<Inputpassword formcontrolclass="form-control" id="password" customclass="form-control-placeholder" text="Password" onChange={this.changePassword.bind(this)} />
								<div >
									<span className="forget" onClick={this.handleShow} >{messages.IFORGOTMYPASSWORD}</span>
									{this.state.show ? <FrogotPasswordPopup close={this.handleClose} /> : ""}
								</div>
								<Inputcheckbox isDiasabled={false} onClickCallback={this.handleKeepSignInValue.bind(this)} labelcustomclass="checkmark mt-3" labeltext="Keep me singed in" customclass="checkbox mt-1" />
								<div className="singin col-lg-12 col-md-10 col-sm-12 col-xs-12 ml-4">
									<label>
										{messages.WARNKEEPMESIGNIN}
									</label>
								</div>
								<div className="text-center mt-4">
									{this.state.loading ? <div className="form-group login_loading"><center><img src="/images/loading.gif" alt="" className="img-responsive loading_image" /></center></div> :
										<CustomButton onClickCallback={this.Submit} buttonType="button" customclass={btnClass} Isdisable={!(this.state.username && this.state.password)} text="LOGIN" />
									}
								</div>
								<div className=" sinup text-center mt-3">
									<span>{messages.DONTHAVEACCOUNT} <CustomLink text="Sign Up" linkto="/#/signup" /></span>
								</div>
							</form>
							<div>
								<LinkPvcCont />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
);
export default Login;