import React, { Component } from "react";
import messages from '../../utils/constants.jsx';
import { Link } from 'react-router-dom';
import { store } from '../../app.jsx';
import { encodeString } from '../../utils/utility.jsx';
import ReactDOM from 'react-dom';
import DeleteModalWindow from '../../commanPopup/deleteModalWindow.jsx';
import { toast } from 'react-toastify';
import { storeToken } from '../../shared/actions/action.jsx';

export default class GridActions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.data,
            UserRole: "2",
            loginUser: "administrator",
            updatelinkUrl: "",
            changePasswordlinkUrl: "Changeresetpassword",
            isDeleteAllowed: false
        }
        this.UpdateClick = this.UpdateClick.bind(this);
        this.DeleteUser = this.DeleteUser.bind(this);
        this.changePassword = this.changePassword.bind(this);
    }
    componentWillMount() {
        if (this.state.value.Actions == messages.USERLIST) {
            this.setState({ updatelinkUrl: '/addupdateUser' });
            let loggedInSessionValues = store.getState().UserSession[0];
            let userRole = loggedInSessionValues.UserRole.toString();
            let UserRole = userRole.split(",");
            if (UserRole.indexOf(messages.SYSTEMADMINISTRATORROLE) > -1 || UserRole.indexOf(messages.ADMINISTRATORROLE) > -1) {
                this.setState({
                    isDeleteAllowed: true
                });
            }
            else if (this.state.value.UserId != loggedInSessionValues.userId) {
                this.setState({
                    isDeleteAllowed: true
                });
            }
        }
        else if (this.state.value.Actions == messages.ORGANIZATION) {
            this.setState({ updatelinkUrl: '/addupdateorganization' });
        }
        else if (this.state.value.Actions == messages.SYSTEMSETTING) {
            this.setState({ updatelinkUrl: '/systemSetting' });
        }
    }
    componentDidUpdate() {
        $(".action").parents("div").addClass("noOverflow");
        $(".ag-row").css("transform", "translate()");
    }
    UpdateClick() {
        if (this.state.value.Actions == messages.USERLIST) {
            localStorage.setItem('UpdateUserId', this.state.value.UserId);
            localStorage.setItem('OrganizationName', this.state.value.organization_name);
            localStorage.setItem('AccountType', "edit");
        }
        else if (this.state.value.Actions == messages.ORGANIZATION) {
            localStorage.setItem('AccountType', "edit");
            localStorage.setItem('UpdateOrganizationName', this.state.value.id);
        }
        else if (this.state.value.Actions == messages.SYSTEMSETTING) {
            this.props.data.popup.handleShow();
        }
    }
    changePassword() {
        let token = Math.random();
        //AJAX CALL FOR FORGOT PASSWORD : START
        $("#loading-block").css("display", "block");
        let Email = this.props.data.Email;
        var data = "userName=" + Email + "&token=" + token + "&action=forgetPasswordEmailSender";
        $.ajax({
            type: "POST",
            url: "UserActions",
            data: data,
            dataType: "html",
            async: true,
            mimeType: 'text/plain; charset=x-user-defined',
            success: function (data) {
                data = JSON.parse(data);
                $("#loading-block").css("display", "none");
                if (data["randomNew"]) {
                    this.accessTokenInst = data["randomNew"];
                    store.dispatch(storeToken(data["randomNew"]));
                }
                if (data["errorCode"] == null) {
                    if (data.response.responseCode == messages.OK) {
                        toast.success("Reset password link has been sent to your registered email id");
                        this.props.close();
                    } else {
                        toast.error("Failed to send email.");
                    }
                } else {
                    if (data["errorCode"] == messages.NotExist) {
                        toast.error("User with this email not exist.");
                    } else {
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
    DeleteUser(e) {
        if (this.state.value.Actions == messages.USERLIST) {
            let bodyMessage = messages.DELETETORGANIZATIONBODY + " " + this.state.value.UserId + " " + messages.USERDELETE;
            let user_name = this.state.value.UserId;
            let deleteType = "UserActions";
            let deleteUserName = "deleteUser";
            var accessTokenLogin = store.getState().sessionToken[0];
            let dataString = "userId=" + user_name + "&token=" + accessTokenLogin + "&action=deleteUser";
            ReactDOM.render(
                <div>
                    <DeleteModalWindow deleteName={deleteUserName} datastring={dataString} TypeUrl={deleteType} HeaderMsg={this.state.headermsg} DeleteBodyMessage={bodyMessage} successMessage={messages.DELETEUSERSUCCESS} />
                </div>,
                messages.MODELVIEWDIV
            );
        }
        else if (this.state.value.Actions == messages.ORGANIZATION) {
            let bodyMessage = messages.DELETETORGANIZATIONBODY + " " + this.state.value.Name + " " + messages.ORGANIZATIONMSG;
            let organizationId = this.state.value.id;
            let deleteType = "Organization";
            let deleteUserName = "deleteOrg";
            var accessTokenLogin = store.getState().sessionToken[0];
            let dataString = "organization_id=" + encodeString(organizationId) + "&u=" + this.state.loginUser.toLowerCase() + "&token=" + accessTokenLogin + "&type=deleteOrg&organization_name=" + encodeString("Default") + "&action=removeOrg";
            ReactDOM.render(
                <div>
                    <DeleteModalWindow deleteName={deleteUserName} datastring={dataString} TypeUrl={deleteType} HeaderMsg={this.state.headermsg} DeleteBodyMessage={bodyMessage} successMessage={messages.ORGDELETESUCCESS} />
                </div>,
                messages.MODELVIEWDIV
            );
            //toast.success("Organization deleted successfully.")
        }
        else if (this.state.value.Actions == messages.SYSTEMSETTING) {
            let bodyMessage = messages.DELETETORGANIZATIONBODY + " " + this.state.value.Name + " " + messages.USERGROUP;
            let organizationId = this.state.value.id;
            let deleteType = "Organization";
            let deleteUserName = "deleteOrg";
            var accessTokenLogin = store.getState().sessionToken[0];
            let dataString = "organization_id=" + encodeString(organizationId) + "&u=" + this.state.loginUser.toLowerCase() + "&token=" + accessTokenLogin + "&type=deleteOrg&organization_name=" + encodeString("Default") + "&action=removeOrg";
            ReactDOM.render(
                <div>
                    <DeleteModalWindow deleteName={deleteUserName} datastring={dataString} TypeUrl={deleteType} HeaderMsg={this.state.headermsg} DeleteBodyMessage={bodyMessage} successMessage={messages.USERGROUPSUCCESS} />
                </div>,
                messages.MODELVIEWDIV
            );
            //toast.success("Organization deleted successfully.")
        }
    }
    render() {
        this.deleteuser = false;
        // let loggedInSessionValues = store.getState().UserSession[0];
        // let userRole = loggedInSessionValues.UserRole.toString();
        // let loginUser = loggedInSessionValues.LoginUserName;
        // if (userRole.indexOf(messages.SYSTEMADMINISTRATORROLE) === -1 || userRole.indexOf(messages.ADMINISTRATORROLE) === -1) {
        //     if (this.props.data.UserId.toLowerCase() === loginUser.toLowerCase()) {
        //         this.deleteuser = true;
        //     }
        // }
        return (
            <center>
                <div className="action dropdown">
                    <span className="color-action" data-toggle="dropdown">
                        <span className="action-title padding-5px-2 HoneywellSansWeb-ExtraBold">{messages.ACTION}</span><i className="fa fa-angle-right pull-right padding-5px-2 no-margin" aria-hidden="true" /><i className="fa fa-angle-down pull-right padding-5px-2 no-margin" aria-hidden="true" />
                    </span>
                    <span className="indicator" />
                    <ul className="dropdown-menu dropdown-grid">
                        <li>
                            <Link to={this.state.updatelinkUrl} className="dropdown-text">
                                <div className="HoneywellSansWeb-Bold update-link" title={messages.UPDATE}
                                    onClick={this.UpdateClick}
                                >{messages.UPDATE}</div>
                            </Link>
                        </li>
                        {
                            this.state.value.Actions == messages.USERLIST
                                ?
                                this.state.value.UserId === messages.ADMINISTRATOR
                                    ?
                                    ""
                                    :
                                    this.state.isDeleteAllowed
                                        ?
                                        <li>
                                            <a title={messages.DELETE} className="HoneywellSansWeb-Bold" onClick={this.DeleteUser}>{messages.DELETE}</a>
                                        </li>
                                        :
                                        ""
                                :
                                this.state.value.Actions == messages.SYSTEMSETTING || (this.state.value.Actions == messages.ORGANIZATION
                                    &&
                                    this.state.value.Name.toLowerCase() != messages.defaultOrg.toLowerCase())
                                    ?
                                    <li>
                                        <a title={messages.DELETE} className="HoneywellSansWeb-Bold" onClick={this.DeleteUser}>{messages.DELETE}</a>
                                    </li>
                                    :
                                    ""
                        }
                        {
                            this.state.value.Actions == messages.USERLIST
                                ?
                                <li>
                                    <a title={messages.CHANGEPASSWORD} className="HoneywellSansWeb-Bold" onClick={this.changePassword}>{messages.CHANGEPASSWORD}</a>
                                </li>
                                :
                                ""
                        }
                    </ul>
                </div>
            </center>
        );
    }
}