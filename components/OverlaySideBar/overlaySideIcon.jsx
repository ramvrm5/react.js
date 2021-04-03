import React from 'react'
import ReactDOM from 'react-dom';
import ModalWindow from '../../commanPopup/modalWindow.jsx';
import DeleteModalWindow from '../../commanPopup/deleteModalWindow.jsx';
import messages from '../../utils/constants.jsx';
import { Link } from 'react-router-dom';
import Usergroup from '../userGroup/usergroup.jsx';
import $ from 'jquery'
import './OverlaysideBar.css'

class Overlaysideicon extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false,
            UserRole:[]
        }
        this.myFunction = this.myFunction.bind(this);
        this.navigateFunction = this.navigateFunction.bind(this);
        this.LogoutFunction = this.LogoutFunction.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.getLoggedInSessionValues=this.getLoggedInSessionValues.bind(this);
    }
    componentDidMount(){
        this.getLoggedInSessionValues();
    }
    componentWillUpdate(){
        $('#overlaySidenav').find("a").removeClass("active")
        var currentSelect = localStorage.getItem('active')
        if(currentSelect === "#mapview"){
            $('#mapview').addClass("active")
        }
        else if(currentSelect === "#usermanage"){
            $('#usermanage').addClass("active")
        }
        else if(currentSelect === "#organization"){
            $('#organization').addClass("active")
        }
        else if(currentSelect === "#systemset"){
            $('#systemset').addClass("active")
        } else if(currentSelect === "#emailInvite"){
            $('#emailInvite').addClass("active")
        }
    }
    navigateFunction(e) {
        localStorage.setItem('active', "#" + e.currentTarget.id);
        if (e.currentTarget.id === "logout") {
            ReactDOM.render(
                <div>
                    <DeleteModalWindow logoutSuccess="true" proceed={this.LogoutFunction} HeaderMsg="LOGOUT" DeleteBodyMessage="Do You Want To Logout From Your Profile" />
                </div>,
                messages.MODELVIEWDIV
            );
        }
    }
    myFunction() {
        $('#bar').toggleClass("main");
        $('#overlaySidenav').toggle('');
        
    }
    getLoggedInSessionValues() {
        $.ajax({
            type: "POST",
            url: "GetLoggedInUserSessionValue",
            data: "sessionVars=userName,LoginUserOrganization,UserRole",
            mimeType: 'text/plain; charset=x-user-defined',
            cache: false,
            async: true,
            success: function (data) {
                if (data == messages.Session_Timeout) {
                    LogoutFunction("sessionout");
                    return;
                }
                if (data && data != 1) {
                    data = JSON.parse(data);
                    this.setState({ userName: data.userName,LoginUserOrganization: data.LoginUserOrganization,UserRole:data.UserRole});
                }
                
            }.bind(this),
            error: function () {
                setTimeout(() => {
                    this.getLoggedInSessionValues();
                }, messages.TWOKINTERVAl);
            }.bind(this)
        });
    }
    LogoutFunction(action) {
        var getlocaltoken = localStorage.getItem('LoginTokenInfo');
        var datastring = "action=logout&localstoredtoken=" + getlocaltoken;
        $.ajax({
            type: "GET",
            url: "Logout",
            data: datastring,
            cache: false,
            async: true,
            mimeType: 'text/plain; charset=x-user-defined',  
            success: function (data) {
                if (data === "success") {
                    localStorage.setItem("LoginState","Fail");
                    if (action === "logout") {
                        window.location = "/";
                        window.location.reload();
                    }
                    else if(action === "expired") {
                        window.location.reload();
                    }
                    else {
                        window.location.reload();
                        window.location.href = "/";
                    }
                }
            },
            error: function () {
                ReactDOM.render(
                    <div>
                        <ModalWindow Header={messages.RESPONSEMESSAGE} SuccessMessage={messages.DEFAULTERRMSG} />
                    </div>,
                    messages.MODELVIEWDIV
                );
            }
        });
    }
    handleClose() {
		this.setState({ show: false });
	}
	handleShow() {
        localStorage.setItem('active', "#mapview");
		this.setState({ show: true });
	}
    render() {
        return (
            <div>
                <div id="overlaySidenav"  className="sidebar hide">
                    <Link to="/mapview" id="mapview" data-toggle="tooltip" onClick={this.navigateFunction} title={messages.REALTIMEMONITER}><i className="fa fa-map-marker"></i>
                        {/* <div id="mySidenav">
                            <a  id="about" onClick={this.handleShow}>Add User Group</a></div> */}
                    </Link>
                    <Link to="/usermanagement" id="usermanage"  onClick={this.navigateFunction} data-toggle="tooltip" title={messages.USERMANAGENENT}><i className="fa fa-users"></i> </Link>
                    {this.state.UserRole.indexOf(messages.SYSTEMADMINISTRATORROLE) > -1 ?<Link to="/Gridorganization"  id="organization" data-toggle="tooltip" onClick={this.navigateFunction}  title={messages.Organization}><i className="fa fa-sitemap"></i> </Link>:""}
                    <Link to="/systemSetting" id="systemset" onClick={this.navigateFunction} data-toggle="tooltip" title={messages.SYSTEMSETTING}><i className="fa fa-cogs"></i></Link>
                    <Link to="/emailInvite" id="emailInvite" onClick={this.navigateFunction}   data-toggle="tooltip" title={messages.EmailInviteList}><i class="fa fa-envelope"></i></Link>
                    <Link to="#" id="logout" onClick={this.LogoutFunction} data-toggle="tooltip" title="Logout"><i className="fa fa-sign-out"></i></Link>
                </div>
                <div id="bar">
                    <div onClick={this.myFunction}>
                        <div className="bar1"></div>
                        <div className="bar2"></div>
                        <div className="bar3"></div>
                    </div>
                </div>
                {this.state.show ? <Usergroup close={this.handleClose} /> : ""}
            </div>
        );
    }
}
export default Overlaysideicon;