import React from 'react';
import Modal from 'react-bootstrap/lib/Modal'
import Inputtext from '../components/inputFields/inputtext.jsx';
import CustomButton from '../components/customButton/customButton.jsx';
import messages from '../utils/constants.jsx';
import { store } from '../app.jsx';
import { storeToken} from '../shared/actions/action.jsx';
import {toast } from 'react-toastify';

var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

class FrogotPasswordPopup extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            show: "true",
            forgetEmail: ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.changePassword = this.changePassword.bind(this);
    }
    handleChange(e) {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    changePassword(){
        let token = Math.random();
        //AJAX CALL FOR FORGOT PASSWORD : START
        $("#loading-block").css("display", "block");
        let Email = this.state.forgetEmail;
        var data = "userName=" + Email +"&token=" + token + "&action=forgetPasswordEmailSender";
        $.ajax({
            type: "POST",
            url: "UserActions",
            data: data,
            dataType: "html",
            async: true,
            mimeType: 'text/plain; charset=x-user-defined',
            success: function (data) {
                $("#loading-block").css("display", "none");
                data = JSON.parse(data);
                if (data["randomNew"]) {
                    this.accessTokenInst = data["randomNew"];
                    store.dispatch(storeToken(data["randomNew"]));
                }
                if(data["errorCode"] == null){
                    if (data.response.responseCode == messages.OK) {
                        toast.success("Reset password link has been sent to your registered email id");
                        this.props.close();
                    }else{
                        toast.error("Failed to send email.");
                    }
                }else{
                    if(data["errorCode"] == messages.NotExist){
                        toast.error("User with this email not exist.");
                    }else{
                        toast.error("Failed to send email.");
                    }
                }
            },
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
        //AJAX CALL FOR FORGOT PASSWORD : END
    }
    render() {
        let enable = !this.state.forgetEmail || !this.state.forgetEmail.match(pattern);
        let btnclass = "btn btn-block w-25 mr-3"
        if (enable) {
            btnclass = "btn bgfontColor btn-block w-25 mr-3"
        }
        return (
            <div>
                <Modal.Dialog show={this.state.show}>
                    <Modal.Header >
                        <h4>FORGET PASSWORD</h4>
                        <CustomButton onClickCallback={this.props.close} customclass="close" buttonType="button" text="&times;" />
                    </Modal.Header>
                    <Modal.Body>
                        <Inputtext onChange={this.handleChange} labelclass="form-control-placeholder" id="forgetEmail" validRegrex={pattern} errorMessage="[Email]" customClass="form-control" text="EMAIL ID" />
                    </Modal.Body>
                    <Modal.Footer>
                        <CustomButton onClickCallback={this.changePassword} Isdisable={enable} customclass={btnclass} buttonType="button" text="Submit" />
                        <CustomButton onClickCallback={this.props.close} customclass="btn btn-block w-25 m-0" buttonType="button" text="Close" />
                    </Modal.Footer>
                </Modal.Dialog>
            </div>
        );
    }
}
export default FrogotPasswordPopup;