import React from 'react'
import Logo from '../logo/logo.jsx';
import CustomButton from '../customButton/customButton.jsx';
import messages from '../../utils/constants.jsx';
import LinkPvcCont from '../../contactUs/LinkPvcCont.jsx'
import Inputpassword from '../inputFields/inputpassword.jsx'
import { encodeString } from '../../utils/utility.jsx';
import { store } from '../../app.jsx';
import { storeToken} from '../../shared/actions/action.jsx';
import $ from 'jquery';
import './Changeresetpassword.css';
import {toast } from 'react-toastify';

class Changeresetpassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            New_Password: "",
            Confrim_password: "",
            disablebtn: false,
            btnclass: "w-100 btn btn-light btn-lg",
            loading: false,
            password : messages.newpasswordLabel,
            confirm_password : messages.confirmpasswordLabel,
            patternpassword : messages.passwordRegex,
            username : "",
            passwordPolicy:"2"
        }
        this.onHandleChange=this.onHandleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleCancel=this.handleCancel.bind(this);
        if(this.props.match.params.randomNumber){
            
        }else{
            this.getLoggedInSessionValues();
        }
        
    }

    componentDidMount(){

    }

    getLoggedInSessionValues() {
        $.ajax({
            type: "POST",
            url: "GetLoggedInUserSessionValue",
            data: "sessionVars=ChangePassword,tempUserName",
            mimeType: 'text/plain; charset=x-user-defined',
            cache: false,
            async: true,
            success: function (data) {
                if (data && data != 1) {
                    data = JSON.parse(data);
                    if(!data.ChangePassword){
                        window.location = "/#/";
                    }else{
                        this.setState({username:data.tempUserName});
                        this.getSystemSettings("");
                    }
                }
            }.bind(this),
            error: function () {
                setTimeout(() => {
                    this.getLoggedInSessionValues();
                }, messages.TWOKINTERVAl);
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
                            let passwordPolicy = systemSettings.PasswordPolicy;

                            /** Password Policy */
                            this.setState({
                                passwordPolicy : passwordPolicy
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

    handleCancel(){
        window.location.href = "/";
    }
    
    handleSubmit(e) {
        e.preventDefault();
        this.setState({ loading: true });
        var NPassword = this.state.New_Password == null ? "" : this.state.New_Password.trim();
        var dataString = "";
        if(!this.props.match.params.randomNumber){
            dataString = "NPassword=" + encodeString(NPassword)+"&action=ChangePassword&token="+store.getState().sessionToken[0]+"&u="+this.state.username;
        }else{
            dataString = "NPassword=" + encodeString(NPassword)+"&action=resetPassword&token="+store.getState().sessionToken[0]+"&resetToken="+this.props.match.params.randomNumber+"&token="+store.getState().sessionToken[0]+"&u="+this.state.username;
        }
        $.ajax({
            type: "POST",
            url: "UserActions",
            mimeType: 'text/plain; charset=x-user-defined',
            data: dataString,
            cache: false,
            async: true,
            success: function (data) {
                data = JSON.parse(data);
                if (data) {
                    store.dispatch(storeToken(data["randomNew"]));
                    if(data["errorCode"] == null){
                        if (data.response.responseCode == messages.NoContent) {
                            window.location = "/#/mapview";
                            window.location.reload();
                        } else {
                            if(this.props.match.params.randomNumber){
                                window.location = "/#/";
                                window.location.reload();
                            }
                        }
                    }else{
                        if (data["errorCode"] == "1009") {
                            toast.error("Reset password link has been sent to your registered email id");
                        }else if(data["errorCode"] == messages.LinkExpired){
                            toast.error(messages.LINKEXPIRTITLE);
                            window.location = "/#/";
                        }
                    }
                }
            }.bind(this),
            error: function (data) {

            }.bind(this)
        });
    }
    onHandleChange(evt) {
        this.setState({
            [evt.target.id]: evt.target.value
        });
        var id = evt.target.id
        var val = evt.target.value
        if (id === "New_Password") {
            if (!val.match(this.state.pattern)) {
                $('#Password4Attributes').addClass('changepsswordvalidate');
            }
            else {
                $('#Password4Attributes').removeClass('changepsswordvalidate');
                $('#Cmpassword').addClass('changepsswordvalidate');
            }
        }

        $('#Cmpassword').removeClass('changepsswordvalidate');
        this.setState({
            disablebtn: true,
            btnclass: "w-100 btn btn-lg"
        })

        var validate = false;
        if (id === "New_Password") {
            if (val !== this.state.Confrim_password) {
                validate = true;
            }
        }

        if (id === "Confrim_password") {
            if (val !== this.state.New_Password) {
                validate = true;
            }
        }

        if(validate){
            $('#Cmpassword').addClass('changepsswordvalidate');
            this.setState({
                disablebtn: false,
                btnclass: "w-100 btn btn-light btn-lg"
            })
        }
    }
    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="LoginBackground mx-auto resetpasswordmargin col-lg-4 col-md-8 col-sm-9 col-12">
                        <div className="col-12 mx-auto">
                            <div className="mb-3 mt-4 text-center">
                                 <Logo path="/images/logo.png" /> 
                            </div>
                            <div className="resetHeight">
                                <div className="row">
                                    <div className="col-lg-12 mb-2 pl-3">
                                       <normal className="signHeading">{this.props.match.params.randomNumber ? messages.RESETPASSWORD : messages.CHANGEPASSWORD}</normal>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-12 mb-3">
                                        <Inputpassword onChange={this.onHandleChange} errorMessage={this.state.password} validRegrex={this.state.pattern} id= "New_Password" formcontrolclass="form-control" idspan="cPValidation" customclass="form-control-placeholder" text="New Password" textType="password"/>
                                    </div>
                                     <div className="col-lg-12 mb-3">
                                        <Inputpassword onChange={this.onHandleChange} errorMessage={this.state.confirm_password} formcontrolclass="form-control" id= "Confrim_password" idspan="Cmpassword" customclass="form-control-placeholder" text="Confirm Password" textType="password"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-12" id="Password4Attributes">
                                        <ul className="mb-0 pl-3">
                                            <li type="square" className="fontsizeheading">Password must have a combination of all 4 attributes</li>
                                        </ul>
                                        <ul class="col-lg-11 mx-auto">
                                            <span className="fontsizecontent">
                                               <normal><li>Upper Case</li></normal>
                                                <normal><li>Lower Case</li></normal>
                                                <normal> <li>Number : 0123456789</li></normal>
                                                <normal><li>Special Character : !@#$%^&*()</li></normal>
                                            </span>
                                        </ul>
                                    </div>
                                </div>
                                <div className="row mb-1 mt-2">
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="changepsswordbtn col-lg-6 col-md-6 col-sm-12 col-xs-12 btn-group">
                                            {this.state.loading ? <CustomButton buttonType="button" customclass="btn btn-lg  btn-light btn-block" Isdisable={false} text="CANCEL" onClickCallback={this.handleCancel} />  : <CustomButton buttonType="button" customclass="btn btn-lg  btn-light btn-block" text="CANCEL" onClickCallback={this.handleCancel} /> }</div>
                                        <div className="enabelbtn col-lg-6 col-md-6 col-sm-12 col-xs-12 btn-group">
                                            {this.state.loading ? <div className="form-group login_loading mx-auto"><center className="mt-1"><img src="/images/loading.gif" alt="" className="img-responsive loading_image" /></center></div> :
                                                <CustomButton onClickCallback={this.handleSubmit} buttonType="Submit"
                                                    Isdisable={!(this.state.disablebtn)} customclass={this.state.btnclass} text="SUBMIT" />}</div>
                                    </div>
                                </div>
                            </div>
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
export default Changeresetpassword;