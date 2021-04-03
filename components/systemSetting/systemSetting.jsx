import React from 'react'
import Customform from '../inputFields/customForm.jsx';
import CustomButton from '../customButton/customButton.jsx';
import Subheading from '../subHeading/subHeading.jsx';
import Customradio from '../inputFields/customradio.jsx';
import messages from '../../utils/constants.jsx';
import Customselect from '../Select2Dropdown/customSelect.jsx';
import { store } from '../../app.jsx';
import { storeToken } from '../../shared/actions/action.jsx'
import { encodeString, LogoutFunction, focusInputs } from '../../utils/utility.jsx';
import ReactGrid from '../grid/reactGrid.jsx';
import GridActions from '../gridActions/GridAction.jsx';
import TotalCount from '../totalCountOfGrid/TotalCount.jsx';
import AddButton from '../addButton/addButton.jsx';
import Usergroup from '../userGroup/usergroup.jsx';
import './systemsetting.css'
import {toast } from 'react-toastify';

class Systemsetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Session_Timeout: " ",
            Date_Format: " ",
            Time_Format: " ",
            passwordPolicy: "2",
            radio1Weak: "",
            radio2medium: "",
            radio3Strong: "",
            show: false,
            strong : false,
            weak : false,
            medium : false,
            columnDefs: [
                { field: 'groupname', tooltipField: 'group name', headerName: "GROUP NAME", cellClass: 'ag-custom-center-row', headerClass: 'ag-custom-header', suppressMovable: true },
                { field: 'organizationname', tooltipField: 'organization name', headerName: "ORGANIZATION NAME", cellClass: 'ag-custom-center-row', headerClass: 'ag-custom-header', suppressMovable: true },
                { field: 'users', tooltipField: 'users', headerName: "USERS", cellClass: 'ag-custom-center-row', headerClass: 'ag-custom-header', suppressMovable: true },
                { field: 'Actions', headerName: messages.ACTIONS, cellRendererFramework: GridActions, cellClass: 'ag-text-center-row action-Overflow', headerClass: 'ag-custom-header', headerTooltip: messages.ACTIONS, suppressMovable: true },
                { headerName: "popup", field: "popup", hide: true }
            ],
            rowData: [
                { groupname: "group1", organizationname: "Default", users: "vivek@vastedge.com" ,Actions:messages.SYSTEMSETTING,popup: this },
                { groupname: "group2", organizationname: "Default", users: "essitco.js@gmail.com",Actions:messages.SYSTEMSETTING,popup: this},
                { groupname: "group3", organizationname: "Default", users: "essitco.net@gmail.com",Actions:messages.SYSTEMSETTING,popup: this },
                { groupname: "group4", organizationname: "Default", users: "essitco.net1@gmail.com",Actions:messages.SYSTEMSETTING ,popup: this},
            ]
        }
        this.getLoggedInSessionValues = this.getLoggedInSessionValues.bind(this);
        this.radioBtnChange = this.radioBtnChange.bind(this);
        this.onSelectSessionTimeout = this.onSelectSessionTimeout.bind(this);
        this.onSelectDateFormat = this.onSelectDateFormat.bind(this);
        this.onSelectTimeFormat = this.onSelectTimeFormat.bind(this);
        this.saveSystemSetting = this.saveSystemSetting.bind(this);
        this.getsystemsettingInfo = this.getsystemsettingInfo.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.changePasswordPolicySelection = this.changePasswordPolicySelection.bind(this);
        this.getLoggedInSessionValues();
    }
    componentDidMount() {
        $('#overlaySidenav').find("a").removeClass("active");
        $('#systemset').addClass("active")
    }
    handleCancel() {
        this.props.history.push("/");
    }
    radioBtnChange(value) {
        this.setState({
            passwordPolicy: value
        });
        this.changePasswordPolicySelection(value, false);
    }
    changePasswordPolicySelection(value, onInfoload){
        if(value == 0){
            this.setState({
                strong : false,
                weak : true,
                medium : false
            });
            if(onInfoload){
                this.refs.weakPassword.customRadioButtonChange(value);
            }
        }
        else if(value == 1){
            this.setState({
                strong : false,
                weak : false,
                medium : true
            });
            if(onInfoload){
                this.refs.mediumPassword.customRadioButtonChange(value);
            }
        }
        else{
            this.setState({
                strong : true,
                weak : false,
                medium : false
            });
            if(onInfoload){
                this.refs.strongPassword.customRadioButtonChange(value);
            }
        }
    }
    onSelectSessionTimeout(select) {
        this.setState({
            Session_Timeout: select
        })
    }
    onSelectDateFormat(select) {
        this.setState({
            Date_Format: select
        })
    }
    onSelectTimeFormat(select) {
        this.setState({
            Time_Format: select
        })
    }
    getsystemsettingInfo() {
        $("#loading-block").css("display", "block");
        var org = localStorage.getItem('UpdateUserName');
        var dataString = "&action=" + encodeString("getSystemSettings");// + "&token=" + store.getState().sessionToken[0] + "&u=" + this.state.userName + "&type=getUserInfo";
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

                            /** Date Format */
                            let _DateFormat = _.find(messages.DATEFORMATOPTIONS, function (_data) { return _data["id"] === dateFormat }.bind(this));
                            this.refs.singleSelectDateFormat.handleChange(_DateFormat);
                            /** Date Format */

                            /** Time Format */
                            let _TimeFormat = _.find(messages.TIMEFORMATOPTIONS, function (_data) { return _data["id"] === timeFormat }.bind(this));
                            this.refs.singleSelectTimeFormat.handleChange(_TimeFormat);
                            /** Time Format */

                            /** Session Timeout */
                            let _sessionTimeout = _.find(messages.SESSIONTIMEOUTOPTIONS, function (_data) { return _data["id"] === sessionTimeout }.bind(this));
                            this.refs.singleSelectSessionTimeout.handleChange(_sessionTimeout);
                            /** Session Timeout */

                            /** Password Policy */
                            this.changePasswordPolicySelection(passwordPolicy, true);
                            this.setState({passwordPolicy: passwordPolicy +""});
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
    getLoggedInSessionValues() {
        $.ajax({
            type: "POST",
            url: "GetLoggedInUserSessionValue",
            data: "sessionVars=userName,UserRole",
            mimeType: 'text/plain; charset=x-user-defined',
            cache: false,
            async: true,
            success: function (data) {
                if (data == messages.Session_Timeout) {
                    LogoutFunction("sessionout");
                    return;
                }
                if (data && data != 1) {
                    // ONLY SUPERADMIN CAN ADD ORGANIZATION
                    //checkRoleBaseAccess(data, messages.ORGANIZATIONVARIABLE);
                    data = JSON.parse(data);
                    this.setState({ TimeFormat: data.TimeFormat, DateFormat: data.DateFormat, userName: data.userName });
                    this.generateSessionToken();

                }
            }.bind(this),
            error: function () {
                setTimeout(() => {
                    this.getLoggedInSessionValues();
                }, messages.TWOKINTERVAl);
            }.bind(this)
        });
    }
    generateSessionToken() {
        this.SystemsettingToken = Math.random();
        let dataString = "sessions_name=" + this.SystemsettingToken + "&u=" + this.state.userName;
        store.dispatch(storeToken(this.SystemsettingToken));
        $.ajax({
            type: "POST",
            url: "TokenSessionGenerator",
            mimeType: 'text/plain; charset=x-user-defined',
            data: dataString,
            cache: false,
            success: function (data) {
                if (data === "success") {
                    this.getsystemsettingInfo();
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
    saveSystemSetting(orgType) {
        $("#loading-block").css("display", "block");
        var accessTokenLogin = store.getState().sessionToken[0];
        var Session_Timeout = this.state.Session_Timeout == null ? "" : this.state.Session_Timeout.id;
        var Date_Format = this.state.Date_Format == null ? "" : this.state.Date_Format.id;
        var Time_Format = this.state.Time_Format == null ? "" : this.state.Time_Format.id;
        var passwordPolicy = this.state.passwordPolicy == null ? "" : this.state.passwordPolicy.trim();
        var dataString = "&sessionTimeout=" + encodeString(Session_Timeout) + "&dateFormat=" + encodeString(Date_Format) + "&timeFormat=" + encodeString(Time_Format) + "&passwordPolicy=" + encodeString(passwordPolicy) + "&token=" + accessTokenLogin + "&action=" + encodeString("setSystemSettings");
        $.ajax({
            type: "POST",
            url: "SystemSettings",
            mimeType: 'text/plain; charset=x-user-defined',
            data: dataString,
            cache: false,
            async: true,
            success: function (data) {
                $("#loading-block").css("display", "none");
                if (data == messages.Session_Timeout) {
                    LogoutFunction("sessionout");
                    return;
                }
                data = JSON.parse(data);
                if (data["responseCode"] == messages.OK) {
                    toast.success(messages.SSUPDATE,{autoClose:1500,hideProgressBar: true});
                    setTimeout(function(){
                        window.location.reload();
                    }, 2000);
                }
            }.bind(this),
            error: function (data) {

            }.bind(this)
        });
    }
    addUserBtnClick() {
        localStorage.setItem('AccountType', "add");
        this.handleShow();
    }
    handleClose() {
		this.setState({ show: false });
	}
	handleShow() {
		this.setState({ show: true });
	}
    render() {
        let enable = !this.state.Session_Timeout || !this.state.Date_Format || !this.state.Time_Format || !this.state.passwordPolicy;
        let btnclass = "btn btn-lg btn-block"
        if (enable) {
            btnclass = "btn btn-light btn-lg btn-block"
        }
        let containerStyle = {
            boxSizing: "border-box",
            height: 227,
            width: "100%"
        };
        var userVar = this.TotalCount === 1 ? messages.USERVARIABLE : messages.USERGROUPVARIABLES
        return (
            <div>
                <div className="row" id="systemSettings">
                    <div className="col-lg-11 col-md-10 col-sm-10 col-9 mx-auto">
                        <div className="row">
                            <div className="col-lg-12 col-md-10 col-sm-8 pt-3">
                                <h5><strong>System Setting</strong></h5>
                            </div>
                        </div>
                        {/* <div className="row mt-3">
                            <div className="col-lg-3 col-md-4 col-sm-4">
                                <Subheading headings="System Name" customClass="font-weight-bold  text-uppercase border border-right-0 border-top-0 border-left-0 border-bottom" customHeadingDiv="pt-3 pb-3" />
                                <span className="font">Administrator</span>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-4">
                                <Subheading headings="IP address" customClass="font-weight-bold  text-uppercase border border-right-0 border-top-0 border-left-0 border-bottom" customHeadingDiv="pt-3 pb-3" />
                                <span className="font">192.168.0.0</span>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-4">
                                <Subheading headings="Mac Address" customClass="font-weight-bold  text-uppercase border border-right-0 border-top-0 border-left-0 border-bottom" customHeadingDiv="pt-3 pb-3" />
                                <span className="font">00-15-E9-2B-99-3C</span>
                            </div>
                        </div> */}
                        <div className="row mt-3">
                            <div className="col-lg-12 col-md-10 col-sm-8">
                                <Subheading headings="Session timeout" customClass="font-weight-bold  text-uppercase border border-right-0 border-top-0 border-left-0 border-bottom" customHeadingDiv="pt-3 pb-4" />
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-lg-4">
                                <Customselect onChange={this.onSelectSessionTimeout} isMulti={false} placeholder="Session Timeout" ref="singleSelectSessionTimeout" id="Session_Timeout" options={messages.SESSIONTIMEOUTOPTIONS} customclass="mb-4" dropDownClass="dropdown1selectDrop2" />
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-lg-12 col-md-10 col-sm-8 mb-2">
                                <Subheading headings="Time Setting" customClass="font-weight-bold  text-uppercase border border-right-0 border-top-0 border-left-0 border-bottom" customHeadingDiv="pt-3 pb-4" />
                            </div>
                        </div>
                        <div className="row ">
                            <div className="col-lg-4">
                                <Customselect onChange={this.onSelectDateFormat} isMulti={false} placeholder="Date Format" ref="singleSelectDateFormat" id="Date_Format" options={messages.DATEFORMATOPTIONS} customclass="mb-4" dropDownClass="dropdown2selectDrop2" />
                            </div>
                            <div className="col-lg-4">
                                <Customselect onChange={this.onSelectTimeFormat} isMulti={false} placeholder="Time Format" ref="singleSelectTimeFormat" id="Time_Format" options={messages.TIMEFORMATOPTIONS} customclass="mb-4" dropDownClass="dropdown3selectDrop2" />
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-lg-12 col-md-10 col-sm-8 mb-2">
                                <Subheading headings="Password Policy" customClass="font-weight-bold  text-uppercase border border-right-0 border-top-0 border-left-0 border-bottom" customHeadingDiv="pt-3 pb-1" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-5 col-md-10 col-sm-12 ml-3 mb-5">
                                <div className="row">
                                    <div className="col-lg-4 col-md-2 col-sm-12">
                                        <Customradio textType="radio" customClass="custom-control-input" id="radio1Weak" ref="weakPassword" onChangeCallback={this.radioBtnChange} check={this.state.weak} name="radio" value="0" labelText="Weak" customlabelClass="custom-control-label" />
                                    </div>
                                    <div className="col-lg-4 col-md-2 col-sm-12">
                                        <Customradio textType="radio" customClass="custom-control-input" id="radio2medium" ref="mediumPassword" onChangeCallback={this.radioBtnChange} check={this.state.medium} name="radio" value="1" labelText="medium" customlabelClass="custom-control-label" />
                                    </div>
                                    <div className="col-lg-4 col-md-2 col-sm-12">
                                        <Customradio textType="radio" customClass="custom-control-input" id="radio3Strong" ref="strongPassword" onChangeCallback={this.radioBtnChange} name="radio" value="2" check={this.state.strong} labelText="Strong" customlabelClass="custom-control-label" />
                                    </div>
                                </div>
                            </div>
                            {
                                this.state.passwordPolicy === "2" ?
                                    <div className="col-lg-4 col-md-10 col-sm-12" id="strong">
                                        <ul className="mb-0 pl-3">
                                            <li type="square" className="fontsizeheading">Password must have a minimum of 8 characters.</li>
                                        </ul>
                                        <ul>
                                            <span className="fontsizecontent">
                                                <normal>At least one character from all of the following:</normal>
                                                <normal><li>Upper Case</li></normal>
                                                <normal><li>Lower Case</li></normal>
                                                <normal> <li>Number : 0123456789</li></normal>
                                                <normal><li>Special Character : !@#$%^&*()</li></normal>
                                            </span>
                                        </ul>
                                    </div>
                                    :
                                    ""
                            }

                            {
                                this.state.passwordPolicy === "1" ?
                                    <div className="col-lg-4 col-md-10 col-sm-12" id="medium">
                                        <ul className="mb-0 pl-3">
                                            <li type="square" className="fontsizeheading">Password must have a minimum of 8 characters.</li>
                                        </ul>
                                        <ul>
                                            <span className="fontsizecontent">
                                                <normal>At least one character from all of the following:</normal>
                                                <normal><li>Upper Case</li></normal>
                                                <normal><li>Lower Case</li></normal>
                                                <normal> <li>Number : 0123456789</li></normal>
                                                <normal><li>Optional Special Character : !@#$%^&*()</li></normal>
                                            </span>
                                        </ul>
                                    </div>
                                    :
                                    ""
                            }

                            {
                                this.state.passwordPolicy === "0" ?
                                    <div className="col-lg-4 col-md-10 col-sm-12" id="medium">
                                        <ul className="mb-0 pl-3">
                                            <li type="square" className="fontsizeheading">Password must have a minimum of 8 characters.</li>
                                        </ul>
                                    </div>
                                    :
                                    ""
                            }

                        </div>
                        <div className="row mt-4">
                            <div className="col-lg-12 col-md-10 col-sm-8 mb-2">
                                <Subheading headings="User group" customClass="font-weight-bold  text-uppercase border border-right-0 border-top-0 border-left-0 border-bottom" customHeadingDiv="pt-3 pb-1" />
                            </div>
                        </div>
                        <div className="row mb-2 mt-2">
                            <div className="col-lg-9 col-md-9 col-sm-11 col-11 user-count">
                                <TotalCount totalCount={this.TotalCount} userVar={userVar} />
                            </div>
                            <div className="col-lg-1 col-md-1 col-sm-1 col-1 addphone  mb-2">
                                <AddButton title={messages.AddUserLabel} addClick={this.addUserBtnClick.bind(this)} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-10 col-md-10 col-sm-12 ml-3">
                                <ReactGrid id="UserListGrid" containerStyle={containerStyle}
                                    columnDefs={this.state.columnDefs}
                                    rowData={this.state.rowData}
                                //defaultColDef={this.state.defaultColDef}
                                />
                            </div>
                        </div>

                        <div className="row mb-2 mt-2">
                            <div className="col-lg-12 col-md-12 col-sm-12 mb-3 mt-3">
                                <div className="float-right col-lg-2 col-md-6 col-sm-12 col-xs-12 btn-group no-padding">
                                    <CustomButton onClickCallback={this.saveSystemSetting} buttonType="Submit" Isdisable={enable} customclass={btnclass} text="SAVE" /></div>
                                <div className="float-right col-lg-2 col-md-6 col-sm-12 col-xs-12 btn-group">
                                    <CustomButton onClickCallback={this.handleCancel} buttonType="button" customclass="btn btn-light btn-lg btn-block" text="CANCEL" /></div>
                            </div>
                        </div>
                        {this.state.show ? <Usergroup close={this.handleClose} /> : ""}
                    </div>
                </div>
            </div>
        );
    }
}
export default Systemsetting;