import React from 'react';
import ReactDOM from 'react-dom';
import { store } from '../app.jsx';
import CustomButton from '../components/customButton/customButton.jsx';
import Datepicker from '../components/date picker/datePicker.jsx';
import Subheading from '../components/subHeading/subHeading.jsx';
import Inputtext from '../components/inputFields/inputtext.jsx';
import Customselect from '../components/Select2Dropdown/customSelect.jsx';
import messages from '../utils/constants.jsx';
import ModalWindow from '../commanPopup/modalWindow.jsx'
import { storeToken } from '../shared/actions/action.jsx'
import { encodeString, LogoutFunction, ConvertLongToDate, ConvertDateToLong} from '../utils/utility.jsx';
import Inputtextarea from '../components/inputFields/inputTextarea.jsx';
import {toast } from 'react-toastify';
import moment from 'moment';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import './organization.css';

class Addupdateorganization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            TimeFormat: "",
            DateFormat: "",
            dateExpire: "",
            userName: "",
            Organization_Name: "",
            Website: "",
            Address: "",
            State: "",
            City: "",
            Zip_Code: "",
            firstname: "",
            lastname: "",
            email: "",
            mobile_no: "",
            License_Count: "",
            Description: "",
            country: "",
            UserRole:[],
            show: false,
            validDate:true,
            Patternstate: messages.stateRegex,
            Patternorganization: messages.organizationRegex,
            PatternAddress: messages.AddressRegex,
            patteralphaNumeric: messages.alphaNumericRegex,
            patterMobileNumber: messages.MobileNumberRegex,
            patterWebsite: messages.WebsiteRegex,
            patterLicenseCount: messages.LicenseCountRegex,
            patternEmail:messages.EmailRegex,
            createdDate: moment().unix(),
            type:localStorage.getItem('AccountType')
        }
        this.getLoggedInSessionValues = this.getLoggedInSessionValues.bind(this);
        this.onHandleChange = this.onHandleChange.bind(this);
        this.onSelectCountryChange = this.onSelectCountryChange.bind(this);
        this.getOrganizationInfo = this.getOrganizationInfo.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.getLoggedInSessionValues();
    }
    componentDidMount() {
        $('#overlaySidenav').find("a").removeClass("active");
        $('#organization').addClass("active")
    }
    handleCancel() {
        this.props.history.push("/gridorganization");
    }
    onSelectCountryChange(select) {
        this.setState({
            country: select.value
        })
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
                    this.setState({ TimeFormat: data.TimeFormat, DateFormat: data.DateFormat, userName: data.userName,LoginUserOrganization: data.LoginUserOrganization,UserRole:data.UserRole });
                    if(this.state.UserRole.indexOf(messages.SYSTEMADMINISTRATORROLE) == -1){
                        window.location.href = "/#/mapview";
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
        this.organizationToken = Math.random();
        let dataString = "sessions_name=" + this.organizationToken + "&u=" + this.state.userName;
        store.dispatch(storeToken(this.organizationToken));
        $.ajax({
            type: "POST",
            url: "TokenSessionGenerator",
            mimeType: 'text/plain; charset=x-user-defined',
            data: dataString,
            cache: false,
            success: function (data) {
                if (data === "success") {
                    if (this.state.type === "edit") {
                        this.getOrganizationInfo();
                    }else{
                        let selectCountry = _.find(messages.COUNTRIESLIST, function (data) { return data["value"].toLowerCase() === messages.defaultCountry.toLowerCase() }.bind(this));
                        this.refs.singleSelectCountry.handleChange(selectCountry);
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
    getOrganizationInfo() {
        $("#loading-block").css("display", "block");
        var organization_id = localStorage.getItem('UpdateOrganizationName');
        var dataString = "&organization_id=" + encodeString(organization_id) + "&token=" + store.getState().sessionToken[0] + "&u=" + this.state.userName + "&type=getOrganizationInfo";
        $.ajax({
            type: "POST",
            url: "Organization",
            mimeType: 'text/plain; charset=x-user-defined',
            data: dataString,
            cache: false,
            async: true,
            success: function (data) {
                if (data) {
                    if (data == messages.Session_Timeout) {
                        LogoutFunction("sessionout");
                        return;
                    }
                    var orgInfo = JSON.parse(data);
                    if (orgInfo.errorCode == "200") {
                        store.dispatch(storeToken(orgInfo["randomNew"]));
                        this.setState({
                            Organization_Name: !orgInfo.name ? "" : orgInfo.name,
                            Address: !orgInfo.address ? "" : orgInfo.address,
                            Description: !orgInfo.description ? "" : orgInfo.description,
                            email: !orgInfo.email ? "" : orgInfo.email,
                            mobile_no: !orgInfo.phone ? "" : orgInfo.phone,
                            City: !orgInfo.city ? "" : orgInfo.city,
                            Zip_Code: !orgInfo.zip_code ? "" : orgInfo.zip_code,
                            Website: !orgInfo.website ? "" : orgInfo.website,
                            License_Count: !orgInfo.licenseCount ? "" : orgInfo.licenseCount + "",
                            firstname: !orgInfo.contact_first_name ? "" : orgInfo.contact_first_name,
                            lastname: !orgInfo.contact_last_name ? "" : orgInfo.contact_last_name,
                            OrgType: localStorage.getItem('OrgType'),
                            createdDate: !orgInfo.getCreatedDate ? "" : orgInfo.getCreatedDate,
                        });
                        var State = orgInfo.state;
                        var getCountry = orgInfo.country;

                        /* COUNTRY AND STATE SELECTION */
                        if (getCountry) {
                            let selectCountry = _.find(messages.COUNTRIESLIST, function (data) { return data["value"].toLowerCase() === getCountry.toLowerCase() }.bind(this));
                            this.refs.singleSelectCountry.handleChange(selectCountry);
                            this.foucsOnInputs();
                        }
                        if (State) {
                            this.setState({
                                State: State,
                            })
                        }
                        /* COUNTRY AND STATE SELECTION */
                        /* EXP DATE  */
                        if (orgInfo.gmt_expired_time) {
                            var exdate = ConvertLongToDate(orgInfo.gmt_expired_time, this.state.TimeFormat, this.state.DateFormat);
                            this.refs.expdate.handleDate(exdate);
                            this.setState({
                                dateExpire: orgInfo.gmt_expired_time,
                            });
                        }
                        $("#Organization_Name").attr("disabled","disabled");
                    }
                    if (orgInfo.name.toLowerCase() === "default") {
                        this.setState({ inputClass: "input-height form-control active HoneywellSansWeb-Bold width-100-percent" });
                    }
                }
                setTimeout(() => {
                    $("#loading-block").css("display", "none");
                }, 500);
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
    }
    dateHandleChange(date) {
        var convertedlong = ConvertDateToLong(date);
        var selectedDate = convertedlong.utc().unix()
        var currentdate = moment.utc().unix();
        if(parseInt(currentdate) > parseInt(selectedDate)){
            this.refs.expdate.showError();
            this.setState({validDate : false});
        }else{
            this.refs.expdate.hideError();
            this.setState({validDate : true});
        }
        this.setState({
            dateExpire: selectedDate,
        });
        return selectedDate;
    }
    SaveOrg(e) {
        var isValid = true;
        e.preventDefault();
        $(".addUpdateOrg").find("span.errorSpan").each(function () {
            if ($(this).css("color") === messages.INVALIDCOLOR) {
                isValid = false;
                return false;
            }
        });
        if (!isValid) {
            toast.error("Please check all input parameters.");
            return false;
        }
        else {
            this.addAndupdate("add");
        }
    }
    UpdateOrg(e) {
        var isValid = true;
        e.preventDefault();
        $(".addUpdateOrg").find("span.errorSpan").each(function () {
            if ($(this).css("color") === messages.INVALIDCOLOR) {
                isValid = false;
                return false;
            }
        });
        if (!isValid) {
            toast.error("Please check all input parameters.");
            return false;
        }
        else {
            this.addAndupdate("edit");
        }
    }
    addAndupdate(orgType) {
        $("#loading-block").css("display", "block");
        /* Created Date */
        var d = new Date();
        var createdDate = this.state.createdDate;
        /* Created Date */
        var accessTokenLogin = store.getState().sessionToken[0];
        var Organization = this.state.Organization_Name.trim();
        var Email = this.state.email == null ? "" : this.state.email.trim();
        var Address = this.state.Address == null ? "" : this.state.Address.trim();
        var Description = this.state.Description == null ? "" : this.state.Description.trim();
        //NEW FIELDS 
        var country = this.state.country == null ? "" : this.state.country;
        var City = this.state.City == null ? "" : this.state.City;
        var ZipCode = this.state.Zip_Code == null ? "" : this.state.Zip_Code;
        var WebSite = this.state.Website == null ? "" : this.state.Website;
        var License = this.state.License_Count == null ? "" : this.state.License_Count;
        var FName = this.state.firstname == null ? "" : this.state.firstname;
        var LName = this.state.lastname == null ? "" : this.state.lastname;
        var ExpDate = this.state.dateExpire ? this.state.dateExpire : this.refs.expdate.state.expieryDate ? this.dateHandleChange(this.refs.expdate.state.expieryDate) : "";
        var finalState = this.state.State == null ? "" : this.state.State;
        var Contact = this.state.mobile_no;
        var dataString = "&organization_name=" + encodeString(Organization) + "&ExpDate=" + ExpDate + "&CreateDate=" + createdDate + "&LName=" + encodeString(LName) + "&FName=" + encodeString(FName) + "&License=" + encodeString(License) + "&state=" + encodeString(finalState)  + "&ZipCode=" + encodeString(ZipCode) + "&WebSite=" + encodeString(WebSite) + "&country=" + encodeString(country) + "&City=" + encodeString(City) + "&orgEmail=" + encodeString(Email) + "&address=" + encodeString(Address) + "&description=" + encodeString(Description) + "&contacts=" + encodeString(Contact) + "&token=" + accessTokenLogin + "&type=" + orgType + "&u=" + this.state.userName;

        var organization_id = localStorage.getItem('UpdateOrganizationName');
        if (orgType === "edit") {
            dataString += "&organization_id=" + organization_id;
        }
        $.ajax({
            type: "POST",
            url: "Organization",
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
                if (data["randomNew"]) {
                    store.dispatch(storeToken(data["randomNew"]));
                }
                if (!data["error"]) {
                    if (data.response.responseCode == messages.OK) {
                        if(orgType == "edit"){
                           
                            toast.success(messages.ORGUPDATE,{autoClose:1500,hideProgressBar: true});
                            window.location.href = "/#/Gridorganization";
                        }
                        else {
                            toast.success(messages.ORGANIZATIONADD,{autoClose:1500,hideProgressBar: true});
                            window.location.href = "/#/Gridorganization";
                        }
                    }
                    else {
                        if(data.response.responseCode == messages.alreadyExist){
                            toast.error(messages.ExistOrganization);
                        }else{
                            toast.error(messages.MOdelSinupError);
                        }
                    }
                }
            }.bind(this),
            error: function (data) {
                toast.error(messages.INPUTPARAMETER);
                setTimeout(() => {
                    this.addAndupdate("");
                }, messages.TWOKINTERVAl);
            }.bind(this)
        });
    }
    foucsOnInputs(){
        $('#organizationInfo input[type="text"]').each(function () {
            this.focus();
            this.blur();
        });
    }
    render() {
        let enable = !this.state.Organization_Name || !this.state.firstname || !this.state.License_Count || !this.state.lastname || !this.state.email

            || !this.state.License_Count.match(this.state.patterLicenseCount)
            || !this.state.email.match(this.state.patternEmail)
            || !this.state.firstname.match(this.state.patteralphaNumeric)
            || !this.state.lastname.match(this.state.patteralphaNumeric)
            || !this.state.Organization_Name.match(this.state.Patternorganization)
            || !this.state.mobile_no.match(this.state.patterMobileNumber)
            || !this.state.Description.match(this.state.patteralphaNumeric)
            || !this.state.Address.match(this.state.PatternAddress)
            || !this.state.State.match(this.state.Patternstate)
            || !this.state.City.match(this.state.patteralphaNumeric)
            || !this.state.Zip_Code.match(this.state.patteralphaNumeric)
            || !this.state.Website.match(this.state.patterWebsite)
            || !this.state.validDate;

        let btnclass = "btn btn-lg btn-block"
        if (enable) {
            btnclass = "btn btn-lg btn-block bgfontColor"
        }
        return (
            <div>
                <div className="row">
                    <div className="col-lg-11 col-md-10 col-sm-10 col-9 mx-auto">
                        <div className="row">
                            <div className="col-lg-1 col-md-1 col-sm-1 col-3 pt-3 pr-0 pl-0 mx-auto text-center backbtnfont">
                                <Link to="/gridorganization"><span className="text-dark"><i class='fa fa-angle-left'></i></span> BACK</Link>
                            </div>
                            <div className="col-lg-11 col-md-4 col-sm-5 col-9 pt-3 mx-auto pl-0">
                                <h5><strong>{this.state.type === "edit" ? "Update Organization" : "Add Organization"}</strong></h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12 ">
                                <Subheading headings="Company Details" customClass="font-weight-bold  text-uppercase border border-right-0 border-top-0 border-left-0 border-bottom" customHeadingDiv="pt-3 pb-3" />
                            </div>
                        </div>
                        <div className="row" id="organizationInfo">
                            <div className="col-lg-4">
                                <Inputtext onChange={this.onHandleChange} validRegrex={this.state.Patternorganization} errorMessage="[Alphanumeric Only]" value={this.state.Organization_Name} id="Organization_Name" text="Organization Name*" textType="text" customClass="form-control" labelclass="form-control-placeholder" />
                            </div>
                            <div className="col-lg-4">
                                <Inputtext onChange={this.onHandleChange} validRegrex={this.state.patterWebsite} errorMessage="[Website Only]" value={this.state.Website} id="Website" text="Website" textType="text" customClass="form-control" labelclass="form-control-placeholder" />
                            </div>
                            <div className="col-lg-4">
                                <Inputtext onChange={this.onHandleChange} validRegrex={this.state.PatternAddress} errorMessage="[Alphanumeric Only]" value={this.state.Address} id="Address" text="Address" textType="text" customClass="form-control" labelclass="form-control-placeholder" />
                            </div>
                            <div className="col-lg-4 mt-2 mb-2">
                                <Customselect ref="singleSelectCountry" isMulti={false} placeholder="Country" onChange={this.onSelectCountryChange} id="country" options={messages.COUNTRIESLIST} customclass="mb-4" dropDownClass="dropdown3selectDrop2" />
                            </div>
                            <div className="col-lg-4">
                                <Inputtext onChange={this.onHandleChange} validRegrex={this.state.patteralphaNumeric} errorMessage="[Alphanumeric Only]" value={this.state.City} id="City" text="City" textType="text" customClass="form-control" labelclass="form-control-placeholder" />
                            </div>
                            <div className="col-lg-4">
                                <Inputtext onChange={this.onHandleChange} validRegrex={this.state.Patternstate} errorMessage="[Alphanumeric Only]" value={this.state.State} id="State" text="State" textType="text" customClass="form-control" labelclass="form-control-placeholder" />
                            </div>
                            <div className="col-lg-4">
                                <Inputtext onChange={this.onHandleChange} validRegrex={this.state.patteralphaNumeric} errorMessage="[Alphanumeric Only]" value={this.state.Zip_Code} id="Zip_Code" text="Zip Code" textType="text" customClass="form-control" labelclass="form-control-placeholder" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <Subheading headings="Contact Person" customClass="font-weight-bold  text-uppercase border border-right-0 border-top-0 border-left-0 border-bottom" customHeadingDiv="pt-3 pb-3" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4">
                                <Inputtext onChange={this.onHandleChange} validRegrex={this.state.patteralphaNumeric} errorMessage="[Alphanumeric Only]" value={this.state.firstname} id="firstname" text="First Name*" textType="text" customClass="form-control" labelclass="form-control-placeholder" />
                            </div>
                            <div className="col-lg-4">
                                <Inputtext onChange={this.onHandleChange} validRegrex={this.state.patteralphaNumeric} errorMessage="[Alphanumeric Only]" value={this.state.lastname} id="lastname" text="Last Name*" textType="text" customClass="form-control" labelclass="form-control-placeholder" />
                            </div>
                            <div className="col-lg-4">
                                <Inputtext onChange={this.onHandleChange} validRegrex={this.state.patternEmail} errorMessage="[Email]" value={this.state.email} id="email" text="Email*" textType="text" customClass="form-control" labelclass="form-control-placeholder" />
                            </div>
                            <div className="col-lg-4">
                                <Inputtext onChange={this.onHandleChange} validRegrex={this.state.patterMobileNumber} errorMessage="[Mobile,Length:10-15]" value={this.state.mobile_no} id="mobile_no" text="Mobile number" textType="text" customClass="form-control" labelclass="form-control-placeholder" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12 ">
                                <Subheading headings="Organization Internal Information" customClass="font-weight-bold  text-uppercase border border-right-0 border-top-0 border-left-0 border-bottom" customHeadingDiv="pt-3 pb-3" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4 col-md-8 col-sm-8">
                                <Inputtext onChange={this.onHandleChange} validRegrex={this.state.patterLicenseCount} errorMessage="[numeric Only-1-3000]" value={this.state.License_Count} id="License_Count" text="License Count*" textType="text" customClass="form-control" labelclass="form-control-placeholder" />
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-4">
                                <Datepicker extendDate={30} labelmsg={messages.expirydate} ref="expdate" onClickCallback={this.dateHandleChange.bind(this)} errorMessage={messages.dateErrorMessage} />
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <Inputtextarea onChange={this.onHandleChange} validRegrex={this.state.patteralphaNumeric} value={this.state.Description} errorMessage="[Alphanumeric Only]" id="Description" text="Description" textType="text" customClass="form-control" labelclass="form-control-placeholder" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12 mb-5 mt-5">
                                <div className="float-right col-lg-2 col-md-6 col-sm-12 col-xs-12 btn-group">
                                    {
                                        localStorage.getItem('UpdateOrganizationName')
                                            ?
                                            <CustomButton onClickCallback={this.UpdateOrg.bind(this)} buttonType="Submit" Isdisable={enable} customclass={btnclass} text={messages.UPDATE} />
                                            :
                                            <CustomButton onClickCallback={this.SaveOrg.bind(this)} buttonType="Submit" Isdisable={enable} customclass={btnclass} text={messages.SAVE} />
                                    }

                                </div>
                                <div className="float-right col-lg-2 col-md-6 col-sm-12 col-xs-12 btn-group">
                                    <CustomButton buttonType="button" onClickCallback={this.handleCancel} customclass="btn btn-light btn-lg btn-block" text="CANCEL" /></div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}
export default Addupdateorganization;