import React from 'react'
import ReactDOM from 'react-dom';
import Customselect from '../components/Select2Dropdown/customSelect.jsx';
import Inputtext from '../components/inputFields/inputtext.jsx';
import Inputpassword from '../components/inputFields/inputpassword.jsx';
import CustomButton from '../components/customButton/customButton.jsx';
import Modalpopupimagecropper from '../commanPopup/modalpopupimagecropper.jsx';
import ErrorPopup from '../commanPopup/errorpopup.jsx';
import messages from '../utils/constants.jsx';
import $ from 'jquery'
import { store } from '../app.jsx';
import { storeToken } from '../shared/actions/action.jsx'
import { encodeString, LogoutFunction, focusInputs } from '../utils/utility.jsx';
import { Link } from 'react-router-dom';
import {toast } from 'react-toastify';
import './addupdate.css';


class Adduser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName:"",
            firstname: "",
            middlename: "",
            lastname: "",
            email: "",
            mobile_no: "",
            //Address1: "",
            //Address2: "",
            State: "",
            City: "",
            Zip_Code: "",
            show: false,
            Organization: "",
            userRole: '',
            userRolesOptions: messages.USERROLE,
            loggedInUserRole: [],
            country: "",
            pswdErrorMessage : "",
            regexp : "",
            Patternstate: messages.stateRegex,
            //PatternAddress: messages.AddressRegex,
            //patteralphaNumeric: messages.alphaNumericRegex,
            patterMobileNumber: messages.MobileNumberRegex,
            patternEmail:messages.EmailRegex,
            src: messages.defaultImg,
            password : messages.newpasswordLabel,
            confirm_password : messages.confirmpasswordLabel,
            patternpassword : messages.passwordRegex,
            imgsrc: "",
            selectedOrgId : "",
            OrganizationOptions : [],
            userid : "",
            organizationName: "",
            selectedOrg : "",
            type:localStorage.getItem('AccountType')
        }
        this.getLoggedInSessionValues=this.getLoggedInSessionValues.bind(this);
        this.onHandleChange = this.onHandleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.previewFile = this.previewFile.bind(this);
        this.saveImage = this.saveImage.bind(this);
        this.fileValidation = this.fileValidation.bind(this);
        this.onSelectOrgChange = this.onSelectOrgChange.bind(this);
        this.onSelectCountryChange = this.onSelectCountryChange.bind(this);
        this.onSelectMultiRoleChange = this.onSelectMultiRoleChange.bind(this);
        this.getUserInfo=this.getUserInfo.bind(this);
        this.handleCancel=this.handleCancel.bind(this);
        this.getLoggedInSessionValues();
    }
    componentDidMount() {
        $('#overlaySidenav').find("a").removeClass("active");
        $('#usermanage').addClass("active")
    }
    onHandleChange(evt) {
        this.setState({
            [evt.target.id]: evt.target.value
        })
        var id = evt.target.id
        var val = evt.target.value
        if (id === "New_Password") {
            if (!val.match(this.state.patternpassword)) {
                $('#cPValidation').addClass('changepsswordvalidate');
            }
            else {
                $('#cPValidation').removeClass('changepsswordvalidate');
                $('#Cmpassword').addClass('changepsswordvalidate');
            }
        }
        if (id === "New_Password") {
            if (val !== this.state.Confrim_password) {
                $('#Cmpassword').addClass('changepsswordvalidate');
            }
            else {
                $('#Cmpassword').removeClass('changepsswordvalidate');
            }
        }
        if (id === "Confrim_password") {
            if (val !== this.state.New_Password) {
                $('#Cmpassword').addClass('changepsswordvalidate');
            }
            else {
                $('#Cmpassword').removeClass('changepsswordvalidate');
            }
        }
    }
    onSelectOrgChange(select) {
        this.setState({
            Organization: select,
        });
        this.getSystemSettings(select.id);
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
                                patternpassword : regexp
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
    onSelectCountryChange(select) {   
        this.setState({
            country: select
        })
    }
    onSelectMultiRoleChange(select) {
        this.setState({
            userRole:select
        })
    }
    handleCancel(){
        this.props.history.push("/usermanagement");
    }
    getUserInfo() {
        $("#loading-block").css("display", "block");
        var UpdateUserId = localStorage.getItem('UpdateUserId');
        var orgName = localStorage.getItem('OrganizationName');
        var dataString = "&Organization=" + encodeString(orgName) + "&token=" + store.getState().sessionToken[0] + "&u=" + this.state.userName + "&updateUserId=" + UpdateUserId + "&action=SingleUserDetailGetter";
        $.ajax({
            type: "POST",
            url: "UserActions",
            mimeType: 'text/plain; charset=x-user-defined',
            data: dataString,
            cache: false,
            async: true,
            success: function (data) {
                $("#loading-block").css("display", "none");
                if (data) {
                    if (data == messages.Session_Timeout) {
                        LogoutFunction("sessionout");
                        return;
                    }
                    var userData = JSON.parse(data);
                    var userInfoResponse = userData.userInfoResponse
                    if (userData.errorCode === 200) {
                        store.dispatch(storeToken(userData["randomNew"]));
                        this.setState({
                            email: !userInfoResponse.email ? "" : userInfoResponse.email,
                            mobile_no: !userInfoResponse.MobilePhone ? "" : userInfoResponse.MobilePhone,
                            City: !userInfoResponse.City ? "" : userInfoResponse.City,
                            Zip_Code: !userInfoResponse.Zipcode ? "" : userInfoResponse.Zipcode,
                            userRole: !userInfoResponse.roles ? "" : userInfoResponse.roles,
                            middlename: !userInfoResponse.MiddleName ? "" : userInfoResponse.MiddleName,
                            firstname: !userInfoResponse.FirstName ? "" : userInfoResponse.FirstName,
                            lastname: !userInfoResponse.LastName ? "" : userInfoResponse.LastName,
                            userid : userInfoResponse.id,
                            State : userInfoResponse.State,
                            src : userInfoResponse.Picture ? userInfoResponse.Picture : messages.defaultImg
                        });
                        let selectOrg = { "id": userInfoResponse.organizationId, "value": userInfoResponse.organzationname, "label": userInfoResponse.organzationname }
                        this.setState({
                            Organization: selectOrg,
                        });
                        this.getSystemSettings(userInfoResponse.organizationId);

                        if(userInfoResponse.Country){
                            let selectCountry = _.find(messages.COUNTRIESLIST, function (data) { return data["value"].toLowerCase() === userInfoResponse.Country.toLowerCase() }.bind(this));
                            selectCountry = selectCountry ? selectCountry : "";
                            this.refs.singleSelectCountry.handleChange(selectCountry);
                        }
                        var role = []
                        var roles = userInfoResponse.roles;
                        for (var i = 0; i < roles.length; i++) {
                            let selectRole = _.find(messages.USERROLE, function (data) { return data["id"] === roles[i] }.bind(this));
                            role.push(selectRole);
                        }
                        this.refs.multiSelectRole.handleChange(role);
                        this.foucsOnInputs();
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
            data: "sessionVars=userName,selectedOrgId,UserRole,organizationName",
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
                    let UserRole = data.UserRole.split(",");
                    this.setState({ userName: data.userName,selectedOrgId: data.selectedOrgId, loggedInUserRole: UserRole, organizationName: data.organizationName });
                    if(UserRole.indexOf(messages.SYSTEMADMINISTRATORROLE) == -1){
                        this.setState({
                            userRolesOptions : messages.USERROLESEXTND
                        });
                    }
                    
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
        this.UserToken = Math.random();
        let dataString = "sessions_name=" + this.UserToken + "&u=" + this.state.userName;
        store.dispatch(storeToken(this.UserToken));
        $.ajax({
            type: "POST",
            url: "TokenSessionGenerator",
            mimeType: 'text/plain; charset=x-user-defined',
            data: dataString,
            cache: false,
            success: function (data) {
                if (data === "success") {
                    if (this.state.type === "add") {
                        if(this.state.loggedInUserRole.indexOf(messages.SYSTEMADMINISTRATORROLE) > -1){
                            this.Organization();
                        }
                        else{
                            let selectOrg = { "id": this.state.selectedOrgId, "value": this.state.organizationName, "label": this.state.organizationName }
                            this.setState({
                                Organization: selectOrg,
                            });
                            this.getSystemSettings(this.state.selectedOrgId);
                        }
                        let selectCountry = _.find(messages.COUNTRIESLIST, function (data) { return data["value"].toLowerCase() === messages.defaultCountry.toLowerCase() }.bind(this));
                        this.refs.singleSelectCountry.handleChange(selectCountry);
                        this.foucsOnInputs();
                    }else{
                        this.getUserInfo();
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

    addAndupdateUser(userType) {
        $("#loading-block").css("display", "block");
        var accessTokenLogin = store.getState().sessionToken[0];
        var userRoles = [];
        if(this.state.userRole.length){
            for(var i=0;i<this.state.userRole.length;i++){
                userRoles.push(this.state.userRole[i].id);
            }
        }else{
            userRoles.push(this.state.userRole.id);
        }
        
        userRoles = userRoles.join(",");
        var userRole = userRoles == null ? "" : userRoles;
        var firstname = this.state.firstname == null ? "" : this.state.firstname.trim();
        var lastname = this.state.lastname == null ? "" : this.state.lastname.trim();
        var email = this.state.email == null ? "" : this.state.email.trim();
        var mobile_no = this.state.mobile_no == null ? "" : this.state.mobile_no.trim();
        //NEW FIELDS 
        var Organization = this.state.Organization == null ? "" : this.state.Organization.value.trim();
        var OrganizationID = this.state.Organization == null ? "" : this.state.Organization.id.trim();
        var middlename = this.state.middlename == null ? "" : this.state.middlename;
        var Address1 = "";//this.state.Address1 == null ? "" : this.state.Address1;
        var Address2 = "";//this.state.Address2 == null ? "" : this.state.Address2;
        var State = this.state.State == null ? "" : this.state.State;
        var country = this.state.country == null ? "" : this.state.country.value;
        var City = this.state.City == null ? "" : this.state.City;
        var Zip_Code = this.state.Zip_Code == null ? "" : this.state.Zip_Code;
        var password = this.state.Confrim_password == null ? "" : this.state.Confrim_password;
        var picture = this.state.src ? this.state.src.replace(/\+/g,'plus') : "";
        var dataString ="&userRole=" + encodeString(userRole) +"&OrganizationID="+OrganizationID+"&organization_name=" + encodeString(Organization) + "&u_namef=" + encodeString(firstname) + "&u_namel=" + encodeString(lastname) + "&u_email=" + encodeString(email) + "&mobile_no=" + encodeString(mobile_no) + "&u_namem=" + encodeString(middlename) + "&address1=" + encodeString(Address1) + "&address2=" + encodeString(Address2) + "&state=" + encodeString(State) + "&country=" + encodeString(country) + "&city=" + encodeString(City) + "&zip_Code=" + encodeString(Zip_Code) + "&token=" + accessTokenLogin + "&type=" + userType +"&base64image="+picture+"&u_password="+password;
        if(userType == "edit"){
            dataString += "&userId=" +this.state.userid;
        }

        $.ajax({
            type: "POST",
            url: "UserListUpdater",
            mimeType: 'text/plain; charset=x-user-defined',
            data: dataString,
            cache: false,
            async: true,
            success: function (data) {
                $("#loading-block").css("display", "none");
                data = JSON.parse(data);
                if (data["randomNew"]) {
                    store.dispatch(storeToken(data["randomNew"]));
                    this.organizationToken = data["randomNew"];
                }
                if (data.errorCode == null) {
                    if(data.responseCode == messages.OK){
                        if(userType == "edit"){
                            toast.success(messages.USERUPDATE);
                        }else{
                            toast.success(messages.ADDUSER);
                        }
                        window.location.href = "/#/usermanagement"
                    }else if(data.responseCode == messages.alreadyExist){
                        toast.error(messages.UserExist)
                    }else{
                        toast.error(messages.INPUTPARAMETER)
                    }
                }
            }.bind(this),
            error: function (data) {
                toast.error(messages.INPUTPARAMETER)
            }.bind(this)
        });
    }


    handleClose() {
        this.setState({ show: false });
    }
    handleShow() {
        this.setState({ show: true });
    }
    fileValidation() {
        var fileInput = document.getElementById('imgInp');
        var filepath = fileInput.value;
        var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
        var FileSize = fileInput.files[0].size / 1024 / 1024;
        var validationStatus = true;
        if (!allowedExtensions.exec(filepath)) {
            ReactDOM.render(
                <div>
                    <ErrorPopup bodyMessage={messages.ImgExtensionValidation} />
                </div>,
                messages.MODELVIEWDIV
            );
            fileInput.value = '';
            return validationStatus = false;
        }
        if (FileSize > .8) {
            ReactDOM.render(
                <div>
                    <ErrorPopup bodyMessage={messages.ImgSizeValidation} />
                </div>,
                messages.MODELVIEWDIV
            );
            $('file').val(' ');
            return validationStatus = false;
        }
        return validationStatus;
    }
    previewFile() {
        var file = document.querySelector('input[type=file]').files[0];
        var reader = new FileReader();
        reader.addEventListener("load", function () {
            this.setState({
                imgsrc: reader.result
            })
        }.bind(this), false);
        if (file) {
            reader.readAsDataURL(file);
        }
        var validationStatus = this.fileValidation()
        if (validationStatus) {
            this.handleShow()
        }
    }
    saveImage(imgsrc) {
        this.setState({
            src: imgsrc
        })
        this.handleClose()
    }
    handleSubmit(e) {
        e.preventDefault();
        const user = {
            firstname: this.state.firstname,
            middlename: this.state.middlename,
            lastname: this.state.lastname,
            email: this.state.email,
            State: this.state.State,
            City: this.state.City,
            mobile_no: this.state.mobile_no,
            src: this.state.src,
            Organization: this.state.Organization,
            userRole: this.state.userRole,
            country: this.state.country,
        };
        if (this.state.type === "edit") {
         this.addAndupdateUser("edit");
        }
        else{
            this.addAndupdateUser("add");
        }
    }
    Organization () {
        this.organizationToken = Math.random();
        var datastring = "&token=" + this.organizationToken + "&type=getAllOrg";
        $.ajax({
            url: "Organization",
            type: "POST",
            data: datastring,
            datatype: 'html',
            async: true,
            mimeType: 'text/plain; charset=x-user-defined',
            success: function (data) {
                data = JSON.parse(data);
                var organizationinfo = [];
                var item = {};
                if (data["randomNew"]) {
                    store.dispatch(storeToken(data["randomNew"]));
                    this.organizationToken = data["randomNew"];
                }
                if (data.response.response) {
                    var orgData = data.response.response;
                    var organisationcount = orgData.length;
                    for (var i = 0; i < organisationcount; i++) {
                        item = {};
                        item["Name"] = orgData[i].name ? orgData[i].name : "---";
                        item["id"] = orgData[i].id ? orgData[i].id : "---";
                        organizationinfo.push({ "id": item["id"], "value": item["Name"], "label": item["Name"] });
                    }
                    this.setState({ OrganizationOptions: organizationinfo });
                    let selectOrg = _.find(organizationinfo, function (data) {
                        return data["id"] === this.state.selectedOrgId
                    }.bind(this));
                    this.refs.singleSelect.handleChange(selectOrg);
                    this.foucsOnInputs();
                }
            }.bind(this),
            error: function () {
                setTimeout(() => {
                    this.Organization();
                }, messages.TWOKINTERVAl);
            }
        });
    }

    foucsOnInputs(){
        $('#addUser input[type="text"]').each(function () {
            this.focus();
            this.blur();
        });
    }
    render() {
        let enable = !this.state.firstname || !this.state.lastname || !this.state.email
            || !this.state.mobile_no || !this.state.New_Password || !this.state.Confrim_password

            || !this.state.email.match(this.state.patternEmail)
            || !this.state.firstname.match(this.state.patteralphaNumeric)
            || !this.state.lastname.match(this.state.patteralphaNumeric)
            || !this.state.mobile_no.match(this.state.patterMobileNumber)
            || !this.state.State.match(this.state.Patternstate)
            || !this.state.City.match(this.state.patteralphaNumeric)
            || !this.state.Zip_Code.match(this.state.patteralphaNumeric)
            || !this.state.middlename.match(this.state.patteralphaNumeric)
            || !this.state.New_Password.match(this.state.patternpassword)
            || !this.state.Confrim_password.match(this.state.patternpassword);
        let btnclass = "btn btn-lg btn-block"
        if (enable) {
            btnclass = "btn btn-lg btn-block bgfontColor"
        }
        return (
            <div>
                <div className="row" id="addUser">
                    <div className="col-lg-11 col-md-10 col-sm-10 col-9 mx-auto">
                        <div className="row">
                            <div className="col-lg-1 col-md-3 col-sm-3 col-3 pt-3 pr-0 pl-0 mx-auto text-center backbtnfont">
                                <Link to="/usermanagement"><span className="text-dark"><i class='fa fa-angle-left'></i></span> BACK</Link>
                            </div>
                            <div className="col-lg-11 col-md-6 col-sm-7 col-7 pt-3 mx-auto pl-0">
                                <h5><strong>{this.state.type === "edit" ? "Update Users" : "Add users"}</strong></h5>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-lg-2 col-md-4 col-sm-12 col-xs-12 pt-5 mx-auto text-center">
                                    <div className="avtarPhoto mx-auto">
                                        <input type='file' id="imgInp" accept="image/*" onChange={this.previewFile} />
                                        <div className=" editavtar">
                                            <i class="fa fa-pencil"></i>
                                        </div>
                                        <img id="blah" src={this.state.src} alt="privew" className="rounded-circle w-100" htmlFor="imgInp"/>
                                    </div>
                                    {this.state.show ? <Modalpopupimagecropper selectImage={this.saveImage} imgsrc={this.state.imgsrc} close={this.handleClose} /> : ""}
                            </div>
                            <div className="col-lg-10 col-md-12 col-sm-12 pt-5">
                                {
                                    this.state.type === "add" ?
                                        this.state.loggedInUserRole.indexOf(messages.SYSTEMADMINISTRATORROLE) > -1 ?
                                            <div className="row">
                                                <div className="col-lg-9">
                                                    <Customselect isMulti={false}
                                                        onChange={this.onSelectOrgChange} ref="singleSelect" value={this.state.selectedOrg} placeholder="Organization" id="Organization" options={this.state.OrganizationOptions} customclass="mb-4" dropDownClass="dropdown1selectDrop2" />
                                                </div>
                                            </div>
                                            :
                                            ""
                                        :
                                        ""
                                }
                                
                                <div className="row">
                                    <div className="col-lg-9 mt-3 mb-2">
                                        <Customselect isMulti={true}
                                            onChange={this.onSelectMultiRoleChange}
                                            value="" placeholder="Roles*" ref="multiSelectRole" id="userRole" options={this.state.userRolesOptions} customclass="mb-4" dropDownClass="dropdown2selectDrop2" mandatory="[Required]" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <Inputtext onChange={this.onHandleChange} validRegrex={this.state.patteralphaNumeric} errorMessage="[Alphanumeric Only]" value={this.state.firstname} id="firstname" text="First Name*" textType="text" customClass="form-control" labelclass="form-control-placeholder" />
                                    </div>
                                    <div className="col-lg-4">
                                        <Inputtext onChange={this.onHandleChange} validRegrex={this.state.patteralphaNumeric} errorMessage="[Alphanumeric Only]" value={this.state.middlename} id="middlename" text="Middle Name" textType="text" customClass="form-control" labelclass="form-control-placeholder" />
                                    </div>
                                    <div className="col-lg-4">
                                        <Inputtext onChange={this.onHandleChange} validRegrex={this.state.patteralphaNumeric} errorMessage="[Alphanumeric Only]" value={this.state.lastname} id="lastname" text="Last Name*" textType="text" customClass="form-control" labelclass="form-control-placeholder" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <Inputtext onChange={this.onHandleChange} validRegrex={this.state.patternEmail} errorMessage="[Email]" id="email" text="Email*" value={this.state.email} textType="text" customClass="form-control" labelclass="form-control-placeholder" />
                                    </div>
                                    <div className="col-lg-4">
                                        <Inputtext onChange={this.onHandleChange} validRegrex={this.state.patterMobileNumber} errorMessage="[Mobile,Length:10-15]" value={this.state.mobile_no} id="mobile_no" text="Mobile number*" textType="text" customClass="form-control" labelclass="form-control-placeholder" />
                                    </div>
                                    {/* <div className="col-lg-4">
                                        <Inputtext onChange={this.onHandleChange} validRegrex={this.state.PatternAddress} errorMessage="[Alphanumeric Only]" id="Address1" text="Address1" textType="text" customClass="form-control" value={this.state.Address1} labelclass="form-control-placeholder" />
                                    </div> */}
                                    <div className="col-lg-4">
                                        <Inputtext onChange={this.onHandleChange} value={this.state.Zip_Code} validRegrex={this.state.patteralphaNumeric} errorMessage="[Alphanumeric Only]" id="Zip_Code" text="Zip Code" textType="text" customClass="form-control" labelclass="form-control-placeholder" />
                                    </div>
                                </div>
                                <div className="row">
                                    {/* <div className="col-lg-4">
                                        <Inputtext onChange={this.onHandleChange} validRegrex={this.state.PatternAddress} errorMessage="[Alphanumeric Only]" id="Address2" text="Address2" value={this.state.Address2} textType="text" customClass="form-control" labelclass="form-control-placeholder" />
                                    </div> */}
                                    <div className="col-lg-4 mt-2">
                                        <Customselect isMulti={false} ref="singleSelectCountry" onChange={this.onSelectCountryChange} placeholder="Country" id="country" options={messages.COUNTRIESLIST} customclass="mb-4" dropDownClass="dropdown3selectDrop2" mandatory="[Required]" />
                                    </div>
                                    <div className="col-lg-4">
                                        <Inputtext onChange={this.onHandleChange} validRegrex={this.state.Patternstate} errorMessage="[Alphanumeric Only]" id="State" text="State" textType="text" customClass="form-control" value={this.state.State} labelclass="form-control-placeholder" />
                                    </div>
                                    <div className="col-lg-4">
                                        <Inputtext onChange={this.onHandleChange} validRegrex={this.state.patteralphaNumeric} errorMessage="[Alphanumeric Only]" id="City" text="City" textType="text" customClass="form-control" value={this.state.City} labelclass="form-control-placeholder" />
                                    </div>
                                </div>
                                <div className="row">
                                    {this.state.type == "edit" ? "" :<div className="col-lg-4">
                                        <Inputpassword onChange={this.onHandleChange}  errorMessage={this.state.pswdErrorMessage} validRegrex={this.state.pattern} id= "New_Password" formcontrolclass="form-control" idspan="cPValidation" customclass="form-control-placeholder" text="New Password*" textType="password"/>
                                    </div>}
                                    {this.state.type == "edit" ? "" :<div className="col-lg-4">
                                        <Inputpassword onChange={this.onHandleChange}  errorMessage={this.state.confirm_password} formcontrolclass="form-control" id= "Confrim_password" idspan="Cmpassword" customclass="form-control-placeholder" text="Confirm Password*" textType="password"/>
                                    </div>}
                                </div>
                            </div>
                        </div>
                        <div className="row ">
                            <div className="col-lg-12 col-md-12 col-sm-12 pt-5">
                                <div className="float-right col-lg-2 col-md-6 col-sm-12 col-xs-12 btn-group">
                                    <CustomButton onClickCallback={this.handleSubmit} buttonType="Submit" Isdisable={enable} customclass={btnclass} text="SAVE" /></div>
                                <div className="float-right col-lg-2 col-md-6 col-sm-12 col-xs-12 btn-group">
                                    <CustomButton buttonType="button" onClickCallback={this.handleCancel}  customclass="btn btn-light btn-lg btn-block" text="CANCEL" /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Adduser;