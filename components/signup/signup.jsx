import React from 'react'
import { Link } from 'react-router-dom';
import Logo from '../logo/logo.jsx';
import CustomButton from '../customButton/customButton.jsx';
import ReCAPTCHA from "react-google-recaptcha";
import messages from '../../utils/constants.jsx';
import Inputtext from '../inputFields/inputtext.jsx';
import Inputpassword from '../inputFields/inputpassword.jsx'
import { encodeString, focusInputs } from '../../utils/utility.jsx';
import SessionLogoutModal from '../../login/SessionLogoutModal.jsx'
import ErrorPopup from '../../commanPopup/errorpopup.jsx'
import './signup.css'
import ReactDOM from 'react-dom';

var password = "[New Password]";
var confirm_password = "[Confirm Password]";
const TEST_SITE_KEY = "6Lck2IQUAAAAAGuoeFMralmrZOHtNL74Bfbu04Yr"
var patternpasword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/);
var patteralphaNumeric = new RegExp(/^[a-zA-Z0-9]*$/);
var patterContactNUmber = new RegExp(/^(\+\d{1,3}[- ]?)?\d{10,15}$|^$/);
var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

class Signup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            Organization_Name: "",
            email: "",
            firstname: "",
            lastname: "",
            Contact_Number: "",
            password:"",
            Confrim_password:"",
            value: "",
            loading: false,
            show:false,
            showerror:false,
            passwordValidation:false,
            pswdErrorMessage:"",
            regexp : ""
        }
        this.onChangeReCaptcha = this.onChangeReCaptcha.bind(this);
        this.onHandleChange=this.onHandleChange.bind(this);
        this.handleSubmit =this.handleSubmit.bind(this);
        this.getSystemSettings("");
    }

    handleSubmit(e){
        e.preventDefault();
        this.setState({ loading: true});
        var fname = this.state.firstname == null ? "" : this.state.firstname.trim();
        var lname = this.state.lastname == null ? "" : this.state.lastname.trim();
        var email = this.state.email == null ? "" : this.state.email.trim();
        var phone = this.state.Contact_Number == null ? "" : this.state.Contact_Number.trim();
        var orgName = this.state.Organization_Name == null ? "" : this.state.Organization_Name.trim();
        var password = this.state.password == null ? "" : this.state.password.trim();
        var cpassword = this.state.Confrim_password == null ? "" : this.state.Confrim_password.trim();
        var dataString = "&fname=" + encodeString(fname) + "&lname=" + encodeString(lname) + "&email=" + encodeString(email) + "&phone=" + encodeString(phone) + "&orgName=" + encodeString(orgName) + "&password=" + encodeString(password) + "&cpassword=" + encodeString(cpassword)
        $.ajax({
            type: "POST",
            url: "Register",
            mimeType: 'text/plain; charset=x-user-defined',
            data: dataString,
            cache: false,
            async: true,
            success: function (data) {
                this.setState({ loading: false});
                data = JSON.parse(data);
                if(data){
					if (data["errorCode"] == "1009") {
						ReactDOM.render(
							<div>
								<SessionLogoutModal />
							</div>,
							messages.MODELVIEWDIV
						);
					}
					else if(data.response.responseCode == messages.OK){
                        this.setState({ show:true    })
                        setTimeout(() => {
                            window.location.href = "/";
                        }, 2000);
						
					}else{
                        this.setState({ showerror:true    })
						
					}
				}
            }.bind(this),
            error: function (data) {

            }.bind(this)
        });
     }
     getSystemSettings(id) {
        var dataString = "&action=" + encodeString("getOrgSystemSettings") + "&orgId=" + id;
        $.ajax({
            type: "POST",
            url: "SystemSettings",
            mimeType: 'text/plain; charset=x-user-defined',
            data: dataString,
            cache: false,
            async: true,
            success: function (data) {
                $("#loading-block").css("display", "none");
                if (data) {
                    data = JSON.parse(data);
                    if (data == messages.Session_Timeout) {
                        LogoutFunction("sessionout");
                        return;
                    }
                    if(data.errorCode == messages.OK){
                        var systemSettings = data.systemSettings;
                        if(systemSettings){
                            let timeFormat = systemSettings.TimeFormat;
                            let sessionTimeout = systemSettings.SessionTimeout;
                            let dateFormat = systemSettings.DateFormat;
                            let passwordPolicy = systemSettings.PasswordPolicy;

                            /** Password Policy */
                            let pswdMsg = "";
                            var regexp = "";
                            if (passwordPolicy == 0) {
                                pswdMsg = messages.SS_WEAK_MESSAGE;
                                regexp = messages.PWDWEAKREGEX;
                            }
                            else if (passwordPolicy == 1) {
                                pswdMsg = messages.SS_MEDIUM_MESSAGE;
                                regexp = messages.PWDMEDIUMREGEX;
                            }
                            else {
                                pswdMsg = messages.SS_STRONG_MESSAGE;
                                regexp = messages.PWDSTRONGREGEX;
                            }
                            
                            this.setState({
                                pswdErrorMessage : pswdMsg,
                                regexp : regexp
                            })
                            /** Password Policy */

                            focusInputs("systemSettings");
                        }
                    }
                }
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
    }
    
    onHandleChange(evt) {
        this.setState({
            [evt.target.id]: evt.target.value
        })
        var id = evt.target.id
        var val = evt.target.value
        if (id === "password") {
            if (!val.match(patternpasword)) {
               $('#Cmpassword').addClass('changepsswordvalidate');
               this.setState({passwordValidation:true});
            }
            else if(val !== this.state.Confrim_password){
                $('#Cmpassword').addClass('changepsswordvalidate');
                this.setState({passwordValidation:true});
            }
            else{
                $('#Cmpassword').removeClass('changepsswordvalidate');
                this.setState({passwordValidation:false});
            }
        }
        if (id === "Confrim_password") {
            if (!val.match(patternpasword)) {
               $('#Cmpassword').addClass('changepsswordvalidate');
               this.setState({passwordValidation:true});
            }else if (val !== this.state.password) {
                $('#Cmpassword').addClass('changepsswordvalidate');
                this.setState({passwordValidation:true});
            }
            else {
                $('#Cmpassword').removeClass('changepsswordvalidate');
                this.setState({passwordValidation:false});
            }
        }
    }
    onChangeReCaptcha(value) {
        this.setState({ value });
    }
    render() {
        let enable = !this.state.Organization_Name || !this.state.firstname || !this.state.Contact_Number || !this.state.lastname || !this.state.email || !this.state.value || !this.state.password || !this.state.Confrim_password
        
            || !this.state.Organization_Name.match(patteralphaNumeric)
            || !this.state.email.match(pattern)
            || !this.state.firstname.match(patteralphaNumeric)
            || !this.state.lastname.match(patteralphaNumeric)
            || !this.state.Contact_Number.match(patterContactNUmber)
            || this.state.passwordValidation
        let btnClass = "w-100  btn  btn-lg";
        if (enable) {
            btnClass = "w-100  btn btn-block bgfontColor"
        }
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="LoginBackground mx-auto signupmargin col-lg-4 col-md-8 col-sm-9 col-12">
                        <div className="col-12 mx-auto">
                            <div className=" mt-2 text-center">
                                 <Logo path="/images/logo.png" /> 
                            </div>
                            <form autoComplete="off">
                                <div className="row">
                                    <div className="col-lg-12 pt-2 pl-3">
                                        <normal className="signHeading">SIGN UP</normal>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <Inputtext onChange={this.onHandleChange} validRegrex={patteralphaNumeric} errorMessage="[Alphanumeric Only]" id="Organization_Name" text="Organization Name*" textType="text" customClass="form-control" labelclass="form-control-placeholder" />
                                    </div>
                                    <div className="col-lg-12">
                                        <Inputtext onChange={this.onHandleChange} validRegrex={pattern} errorMessage="[Email]" id="email" text="Email*" textType="text" customClass="form-control" labelclass="form-control-placeholder" />
                                    </div>
                                    <div className="col-lg-12">
                                        <Inputpassword onChange={this.onHandleChange} errorMessage={this.state.pswdErrorMessage} validRegrex={this.state.regexp} id= "password" formcontrolclass="form-control" idspan="cPValidation" customclass="form-control-placeholder" text="Password" textType="password"/>
                                    </div>
                                     <div className="col-lg-12">
                                        <Inputpassword onChange={this.onHandleChange} errorMessage={confirm_password} validRegrex={patternpasword} formcontrolclass="form-control" id= "Confrim_password" idspan="Cmpassword" customclass="form-control-placeholder" text="Confirm Password" textType="password"/>
                                    </div>
                                    <div className="col-lg-12">
                                        <Inputtext onChange={this.onHandleChange} validRegrex={patteralphaNumeric} errorMessage="[Alphanumeric Only]" id="firstname" text="First Name*" textType="text" customClass="form-control" labelclass="form-control-placeholder" />
                                    </div>
                                    <div className="col-lg-12">
                                        <Inputtext onChange={this.onHandleChange} validRegrex={patteralphaNumeric} errorMessage="[Alphanumeric Only]" id="lastname" text="Last Name*" textType="text" customClass="form-control" labelclass="form-control-placeholder" />
                                    </div>
                                    <div className="col-lg-12">
                                        <Inputtext onChange={this.onHandleChange} validRegrex={patterContactNUmber} errorMessage="[Mobile,Length:10-15]" id="Contact_Number" text="Contact Number*" textType="text" customClass="form-control" labelclass="form-control-placeholder" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div class="g-recaptcha" className="col-lg-12"
                                        style={{ transform: "scale(0.82)", "transform-origin": "20px", position: "relative" }}>
                                        <ReCAPTCHA
                                            sitekey={TEST_SITE_KEY}
                                            onChange={this.onChangeReCaptcha}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-1 mt-2">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-12 signup">
                                        <div className=" col-lg-4 col-md-4 col-sm-4 col-4 btn-group no-padding">
                                        {this.state.loading ? <div className="col-lg-12 form-group login_loading"><center><img src="/images/loading.gif" alt="" className="mt-2 img-responsive loading_image" /></center></div> :
                                            <CustomButton onClickCallback={this.handleSubmit} buttonType="Submit"
                                                Isdisable={(enable)} customclass={btnClass} text="Sign UP" />}
                                        </div>
                                        <label className=" ml-1">{messages.HAVEANACCOUNT}
                                        <Link to="/" className="priv fontLogin">{messages.LOGIN}</Link>
                                        </label>
                                    </div>
                                </div>

                            </form>
                            <div className="priv text-center mt-2">
                                <div>
                                    <Link to="/privacy">{messages.Privacy}</Link>
                                    <span className="link-separator"></span>
                                    <Link to="/contact">{messages.CONTACTLINK}</Link>
                                </div>
                            </div>
                            <div className="copyright-label  text-center mt-2">
                                <label>
                                    &copy;{messages.COPYRIGHTMSG}
                                </label>
                            </div>
                            {this.state.show ? <ErrorPopup SuccessMessage={messages.MOdelSinupSuccess} extendedMessage={messages.EmailSent} Header="Response"/>:""},
                            {this.state.showerror ?<ErrorPopup SuccessMessage={messages.MOdelSinupError} Header="Response"/>:""}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Signup;