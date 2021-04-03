import React from 'react';
import $ from 'jquery';
import messages from '../utils/constants.jsx';
import '../styles/form-element/form-element.css';
import ReactGrid from '../components/grid/reactGrid.jsx';
import { gridHeight, } from '../utils/utility.jsx';
import UserStatus from "./UserStatus.jsx";
import Headings from '../components/listHeadings/Headings.jsx';
import TotalCount from '../components/totalCountOfGrid/TotalCount.jsx';
import AddButton from '../components/addButton/addButton.jsx';
import GridActions from '../components/gridActions/GridAction.jsx';
import { store } from '../app.jsx';
import { storeToken, loggedInSessionValues} from '../shared/actions/action.jsx';

var createReactClass = require('create-react-class');

var UserList = createReactClass({
    getInitialState() {
        localStorage.removeItem("AccountType");
        localStorage.setItem('ActionID', "UserManagement");
        this.rows = [];
        this.state = {
            rowData: "",
            loading: true,
            loginUser: "administrator",
            UserRole: "1",
            isBasicInfo: false,
            columnDefs: [{ field: 'UserId', tooltipField: 'UserId', headerName: messages.USERVARIABLE, cellRendererFramework: UserStatus, cellClass: 'ag-custom-center-row', headerClass: 'ag-custom-header', headerTooltip: messages.USERVARIABLE, suppressMovable: true },
            { field: 'UserRole', tooltipField: 'UserRole', headerName: messages.ROLEOFUSER, cellClass: 'ag-text-center-row', headerClass: 'ag-custom-header', headerTooltip: messages.ROLEOFUSER, suppressMovable: true },
            { field: 'Mobile', tooltipField: 'Mobile', headerName: messages.MobileNumber, cellClass: 'ag-text-center-row', headerClass: 'ag-custom-header', headerTooltip: messages.MobileNumber, suppressMovable: true },
            { field: 'Email', tooltipField: 'Email', headerName: messages.EMAIL, cellClass: 'ag-text-center-row', headerClass: 'ag-custom-header', headerTooltip: messages.EMAIL, suppressMovable: true },
            { field: 'Username', hide: true },
            { field: 'Actions', headerName: messages.ACTIONS, cellRendererFramework: GridActions, cellClass: 'ag-text-center-row action-Overflow', headerClass: 'ag-custom-header', headerTooltip: messages.ACTIONS, suppressMovable: true }],
            GridHeight: 0,
            userName: "",
            selectedOrgId: "", 
            loggedInUserRole: "", 
            organizationName: "",
            isAddAllowed : false
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
        return this.state;
    },

    componentDidMount() {
        $('#overlaySidenav').find("a").removeClass("active")
        $('#usermanage').addClass("active")
        this.getLoggedInSessionValues();
    },

    componentWillMount() {
        this.state.GridHeight = gridHeight();
    },
    componentWillUnmount() {
    },
    addUserBtnClick() {
        localStorage.setItem('AccountType', "add");
        window.location.href = '/#/addupdateUser';
    },
    getLoggedInSessionValues() {
        $.ajax({
            type: "POST",
            url: "GetLoggedInUserSessionValue",
            data: "sessionVars=userName,selectedOrgId,UserRole,organizationName,userId",
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
                    this.setState(
                        {
                            userName: data.userName,
                            selectedOrgId: data.selectedOrgId, 
                            loggedInUserRole: UserRole, 
                            organizationName: data.organizationName 
                        });
                    if(UserRole.indexOf(messages.SYSTEMADMINISTRATORROLE) > -1 || UserRole.indexOf(messages.ADMINISTRATORROLE) > -1){
                        this.setState({
                            isAddAllowed : true
                        });
                    }

                    let sessionObject = {
                        UserRole: data.UserRole,
                        selectedOrgId: data.selectedOrgId,
                        LoginUserName: data.userName,
                        userId : data.userId
                    }
                    store.dispatch(loggedInSessionValues(sessionObject));
                    
                    this.GetUsersList();
                }
            }.bind(this),
            error: function () {
                setTimeout(() => {
                    this.getLoggedInSessionValues();
                }, messages.TWOKINTERVAl);
            }.bind(this)
        });
    },
    GetUsersList: function (type) {
        let accessTokenInst = Math.random();
        $("#loading-block").css("display", "block");
       var dataString ="&token=" + accessTokenInst;
        $.ajax({
            type: "POST",
            url: "UserListProvider",
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
                    store.dispatch(storeToken(data["randomNew"]));
                }
                var userscount = 0;
                if (data["errorCode"] == messages.OK) {
                    var UserListData = data.userListResponse;
                    var getTotalUsersCount = data.getTotalCount;
                    userscount = getTotalUsersCount;
                    this.TotalCount = getTotalUsersCount;
                    for (var i = 0; i < userscount; i++) {
                        item = {};
                        let UserId = UserListData[i].id;
                        var userName = "";
                        let email = UserListData[i].email === "" ? "---" : UserListData[i].email;
                        if(UserListData[i].FirstName && UserListData[i].LastName){
                            userName = UserListData[i].FirstName + " " + UserListData[i].LastName;
                        }
                        else{
                            userName = email;
                        }
                        
                        userName = userName.trim();
                        item["UserId"] = UserId;
                        item["getPicture"] =  UserListData[i].Picture;
                        item["Email"] = email;
                        item["Organization_Name"] = UserListData[i].organzationname === "" ? "---" : UserListData[i].organzationname;
                        item["Mobile"] = UserListData[i].MobilePhone === "" ? "---" : UserListData[i].MobilePhone;
                        item["Username"] = userName;
                        var userRoleLength = UserListData[i].roles ? UserListData[i].roles.length : 0 ;
                        var rolesInfo = "";
                        for(var u=0; u<userRoleLength; u++){
                            var roleValObj = _.find(messages.USERROLE, function (o) {
                                return o.id == UserListData[i].roles[u];
                            }.bind(this));
                            if(roleValObj){
                                if(u === (userRoleLength-1))
                                {
                                    rolesInfo += roleValObj.value;
                                }else
                                {
                                    rolesInfo += roleValObj.value+", ";
                                }
                            }else{
                                rolesInfo = messages.DEFAULTNAMESTRING;
                            }
                        }
                        item["UserRole"] = rolesInfo;
                        item["Action"] = messages.USERLIST;
                        objFormattedData.push(item);
                    }
                    this.createRows(objFormattedData);
                }
                if (userscount == 0) {
                    $("#loading-block").css("display", "none");
                    $('.ag-body-viewport').unbind('scroll');
                    this.setState({ rowData: this.createRows("") });
                }
            }.bind(this),
            error: function () {
                setTimeout(() => {
                    this.GetUsersList();
                }, messages.TWOKINTERVAl);
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
                    UserId: data[i].UserId,
                    getPicture:data[i].getPicture,
                    Organization_Name: data[i].Organization_Name,
                    Mobile: data[i].Mobile,
                    Email: data[i].Email,
                    Phone: data[i].Phone,
                    Username: data[i].Username,
                    UserRole: data[i].UserRole,
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
            <div className="row ">
                <div className="col-lg-11 col-md-10 col-sm-10 col-9 mx-auto">
                    <div className="row">
                        <div  className="col-lg-12 col-md-10 col-sm-12 pt-3">
                            <Headings heading={messages.USERMANAGENENT} backbtn={false} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-11 col-lg-11 col-sm-11 col-10 user-count">
                            <TotalCount totalCount={this.TotalCount} userVar={userVar} />
                        </div>
                        {
                            this.state.isAddAllowed ? 
                                <div className="col-md-1 col-lg-1 col-sm-1 col-2 addphone  mb-2">
                                    <AddButton title={messages.AddUserLabel} addClick={this.addUserBtnClick.bind(this)} />
                                </div>
                                :
                                ""
                        }
                        
                    </div>
                    <div className="row ">
                        <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12 ">
                            <ReactGrid id="UserListGrid" containerStyle={containerStyle} columnDefs={this.state.columnDefs} rowData={this.state.rowData} />
                        </div>
                    </div>
                    {/* </main> */}
                </div>
            </div>
        );
    }
});
export default UserList;