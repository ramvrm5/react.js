import React from 'react';
import $ from 'jquery';
import messages from '../utils/constants.jsx';
import '../styles/form-element/form-element.css';
import ReactGrid from '../components/grid/reactGrid.jsx';
import { gridHeight, ConvertLongToDateOnly} from '../utils/utility.jsx';
import UserStatus from "../userManagement/UserStatus.jsx";
import Headings from '../components/listHeadings/Headings.jsx';
import TotalCount from '../components/totalCountOfGrid/TotalCount.jsx';
import AddButton from '../components/addButton/addButton.jsx';
import GridActions from '../components/gridActions/GridAction.jsx';


var createReactClass = require('create-react-class');
var Gridorganization = createReactClass({
    getInitialState() {
        localStorage.removeItem("AccountType");
        localStorage.setItem('ActionID', "UserManagement");

        this.rows = [];
        this.state = {
            UserRole:[],
            rowData: "",
            loading: true,
            loginUser: "administrator",
            isBasicInfo: false,
            TimeFormat: 0,
            DateFormat: 0,
            columnDefs: [{ field: 'Name', tooltipField: 'name', headerName: messages.name, cellClass: 'ag-text-center-row', headerClass: 'ag-custom-header', headerTooltip: messages.name, suppressMovable: true },
            { field: 'address', tooltipField: 'address', headerName: messages.address, cellClass: 'ag-text-center-row', headerClass: 'ag-custom-header', headerTooltip: messages.address, suppressMovable: true },
            { field: 'expirydate', tooltipField: 'expirydate', headerName: messages.expirydate, cellClass: 'ag-text-center-row', headerClass: 'ag-custom-header', headerTooltip: messages.expirydate, suppressMovable: true },
            { field: 'contactperson', tooltipField: 'contactperson', headerName: messages.contactperson, cellClass: 'ag-text-center-row', headerClass: 'ag-custom-header', headerTooltip: messages.contactperson, suppressMovable: true },
            { field: 'Email', tooltipField: 'Email', headerName: messages.EMAIL, cellClass: 'ag-text-center-row', headerClass: 'ag-custom-header', headerTooltip: messages.EMAIL, suppressMovable: true },
            { field: 'Username', hide: true },
             { field: 'Mobile', tooltipField: 'Mobile', headerName: messages.MobileNumber, cellClass: 'ag-text-center-row', headerClass: 'ag-custom-header', headerTooltip: messages.MobileNumber, suppressMovable: true },
             { field: 'createddate', tooltipField: 'createddate', headerName: messages.createddate, cellClass: 'ag-text-center-row', headerClass: 'ag-custom-header', headerTooltip: messages.createddate, suppressMovable: true },
            { field: 'Actions', headerName: messages.ACTIONS, cellRendererFramework: GridActions, cellClass: 'ag-text-center-row action-Overflow', headerClass: 'ag-custom-header', headerTooltip: messages.ACTIONS, suppressMovable: true },
            {field:"id",hide:true}],
            GridHeight: 0
        }
        this.noneditable = false;
        this.TotalCount = 0;
        this.Rcount = 1000;
        this.startIndex = 0;
        this.sortColumn = "";
        this.sortOrder = "";
        this.FilterByAccount = "";
        this.FilterByGroup = "";
        this.is_require_total_worker_count = false;
        this.getLoggedInSessionValues=this.getLoggedInSessionValues.bind(this);
        this.getLoggedInSessionValues();
        return this.state;
    },

    getLoggedInSessionValues() {
        $.ajax({
            type: "POST",
            url: "GetLoggedInUserSessionValue",
            data: "sessionVars=userName,LoginUserOrganization,UserRole,TimeFormat,DateFormat",
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
                    this.setState({ userName: data.userName,LoginUserOrganization: data.LoginUserOrganization, TimeFormat: data.TimeFormat, DateFormat: data.DateFormat, UserRole: data.UserRole });
                }
                if(this.state.UserRole.indexOf(messages.SYSTEMADMINISTRATORROLE) == -1){
                    window.location.href = "/#/mapview";
                }
            }.bind(this),
            error: function () {
                setTimeout(() => {
                    this.getLoggedInSessionValues();
                }, messages.TWOKINTERVAl);
            }.bind(this)
        });
    },

    componentDidMount() {
        $('#overlaySidenav').find("a").removeClass("active")
        $('#organization').addClass("active")
        this.GetOrganizationList();
    },

    componentWillMount() {
        this.state.GridHeight = gridHeight();
    },
    componentWillUnmount() {
    },
    addUserBtnClick() {
        localStorage.removeItem('UpdateOrganizationName');
        window.location.href = '/#/addupdateorganization';
    },
    GetOrganizationList: function () {
        let accessTokenInst = Math.random();
        $("#loading-block").css("display", "block");
        var dataString = "perPage=" + this.Rcount + "&start=" + this.startIndex + "&u=" + this.state.loginUser + "&token=" + accessTokenInst+"&type=getAllOrg";
        $.ajax({
            type: "POST",
            url: "Organization",
            data: dataString,
            dataType: "html",
            async: true,
            mimeType: 'text/plain; charset=x-user-defined',
            success: function (data) {
                data = JSON.parse(data);
                var objFormattedData = [];
                var item = {};
                if (data["randomNew"]) {
                    this.accessTokenInst = data["randomNew"];
                }
                var orgcount = 0;
                if (data.response.responseCode == messages.OK) {
                    var organizationInfo = data.response.response;//JSON.parse(data.response.response);
                    var UserListData = organizationInfo;
                    var getTotalCount = organizationInfo.length;
                    orgcount = organizationInfo.length;
                    this.TotalCount = getTotalCount;
                    for (var i = 0; i < orgcount; i++) {
                        item = {};
                        var contactperson = UserListData[i].firstName + " " + UserListData[i].lastName;
                        let email = UserListData[i].email === "" ? "---" : UserListData[i].email;
                        item["Name"] = UserListData[i].name,
                        item["id"] =  UserListData[i].id;
                        item["Email"] = email;
                        item["address"] = UserListData[i].address === "" ? "---" : UserListData[i].address;
                        item["Mobile"] = UserListData[i].mobilePhone === "" ? "---" : UserListData[i].mobilePhone;
                        item["contactperson"] = contactperson;
                        var exdate = ConvertLongToDateOnly(UserListData[i].expireDate, this.state.TimeFormat, this.state.DateFormat);
                        item["expirydate"] = exdate;
                        var createddate = "";
                        if(UserListData[i].createAt){
                            createddate = ConvertLongToDateOnly(UserListData[i].createAt, this.state.TimeFormat, this.state.DateFormat);
                        }
                        else{
                            createddate = "---";
                        }
                        
                        item["createddate"] = createddate;
                        item["Action"] = messages.ORGANIZATION;
                        objFormattedData.push(item);
                    }
                    this.createRows(objFormattedData);
                }
                if (orgcount == 0) {
                    $("#loading-block").css("display", "none");
                    $('.ag-body-viewport').unbind('scroll');
                    this.setState({ rowData: this.createRows("") });
                }
            }.bind(this),
            error: function () {
                $("#loading-block").css("display", "none");
            }
        });
    },
    createRows(data) {
        if (!this.loadMore) {
            this.rows = [];
        }
        this.rows = [];
        if (data) {
            for (let i = 0; i < data.length; i++) {
                this.rows.push({
                    Name:data[i].Name,
                    id:data[i].id,
                    address: data[i].address,
                    Mobile: data[i].Mobile,
                    Email: data[i].Email,
                    expirydate: data[i].expirydate,
                    createddate: data[i].createddate,
                    contactperson: data[i].contactperson,
                    Actions: data[i].Action,
                });
            }
            this.loadMore = false;
            $("#loading-block").css("display", "none");
        }
        this.setState({ rowData: this.rows });

    },
    render() {
        let containerStyle = {
            boxSizing: "border-box",
            height: this.state.GridHeight,
            width: "100%"
        };
        var userVar = this.TotalCount === 1 ? messages.USERVARIABLE : messages.USERVARIABLES
        return (
            <div className="row">
                <div className="col-lg-11 col-md-10 col-sm-10 col-9 mx-auto">
                    <div className="row">
                        <div  className="col-lg-12 col-md-10 col-sm-12 pt-3">
                            <Headings heading={messages.Organization} backbtn={false} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-11 col-lg-11 col-sm-11 col-10 user-count">
                            <TotalCount totalCount={this.TotalCount} userVar={userVar} />
                        </div>
                        <div className="col-md-1 col-lg-1 col-sm-1 col-2 addphone mb-2">
                            <AddButton title={messages.AddUserLabel} addClick={this.addUserBtnClick.bind(this)} />
                        </div>
                    </div>
                    <div className="row ">
                        <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12 ">
                            <ReactGrid id="UserListGrid" containerStyle={containerStyle} columnDefs={this.state.columnDefs} rowData={this.state.rowData} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
export default Gridorganization;