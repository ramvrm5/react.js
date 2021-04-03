import React from 'react';
import $ from 'jquery';
import messages from '../utils/constants.jsx';
import '../styles/form-element/form-element.css';
import ReactGrid from '../components/grid/reactGrid.jsx';
import { gridHeight,ConvertLongToDate } from '../utils/utility.jsx';
import Headings from '../components/listHeadings/Headings.jsx';
import TotalCount from '../components/totalCountOfGrid/TotalCount.jsx';


var createReactClass = require('create-react-class');

var EmailInviteList = createReactClass({
    getInitialState() {
        this.rows = [];
        this.state = {
            rowData: "",
            loading: true,
            loginUser: "admiistrator",
            UserRole: "1",
            TimeFormat: 0,
            DateFormat: 0,
            isBasicInfo: false,
            columnDefs: [{ field: 'SendTo', tooltipField: 'SendTo', headerName: messages.SENDTO, cellClass: 'ag-text-center-row', headerClass: 'ag-custom-header', headerTooltip: messages.SENDTO, suppressMovable: true },
            { field: 'Content', tooltipField: 'Content', headerName: messages.SS_CONTENT, cellClass: 'ag-text-center-row', headerClass: 'ag-custom-header', headerTooltip: messages.SS_CONTENT, suppressMovable: true },
            { field: 'Title', tooltipField: 'Title', headerName: messages.TITLE, cellClass: 'ag-text-center-row', headerClass: 'ag-custom-header', headerTooltip: messages.TITLE, suppressMovable: true },
            { field: 'StartDate', tooltipField: 'StartDate', headerName: messages.STARTDATE, cellClass: 'ag-text-center-row', headerClass: 'ag-custom-header', headerTooltip: messages.STARTDATE, suppressMovable: true },
            { field: 'EndDate', tooltipField: 'EndDate', headerName: messages.ENDDATE, cellClass: 'ag-text-center-row', headerClass: 'ag-custom-header', headerTooltip: messages.ENDDATE, suppressMovable: true }],
            GridHeight: 0
        }
        this.noneditable = false;
        this.TotalCount = 0;
        this.Rcount = 1000;
        this.startIndex = 0;
        return this.state;
    },

    componentDidMount() {
        $('#overlaySidenav').find("a").removeClass("active")
        $('#emailInvite').addClass("active");
        this.getLoggedInSessionValues();
        this.GetEmailInviteList();
    },

    getLoggedInSessionValues() {
        $.ajax({
            type: "POST",
            url: "GetLoggedInUserSessionValue",
            data: "sessionVars=TimeFormat,DateFormat",
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
                    this.setState({ TimeFormat: data.TimeFormat, DateFormat: data.DateFormat });
                }
            }.bind(this),
            error: function () {
                setTimeout(() => {
                    this.getLoggedInSessionValues();
                }, messages.TWOKINTERVAl);
            }.bind(this)
        });
    },

    componentWillMount() {
        this.state.GridHeight = gridHeight();
    },
    GetEmailInviteList(){
        let accessTokenInst = Math.random();
        $("#loading-block").css("display", "block");
        var dataString = "action=GetInviteEmailList&token=" + accessTokenInst;
        $.ajax({
            type: "POST",
            url: "EmailInviteProvider",
            data: dataString,
            dataType: "html",
            async: true,
            mimeType: 'text/plain; charset=x-user-defined',
            success: function (data) {
                $("#loading-block").css("display", "none");
                data = JSON.parse(data);
                var response = data.response; 
                var responseData = JSON.parse(response.response);
                var objFormattedData = [];
                var item = {};
                var count = 0;
                if (response["responseCode"] == 200) {
                    var emailsDataList = responseData;
                    count = emailsDataList.length;
                    this.TotalCount = count;
                    for (var i = 0; i < count; i++) {
                        item = {};
                        item["SendTo"] = emailsDataList[i].to;
                        item["Content"] = emailsDataList[i].content;
                        item["Title"] = emailsDataList[i].title;
                        item["Organization_Name"] = "";
                        item["StartDate"] = emailsDataList[i].start;
                        item["EndDate"] = emailsDataList[i].end;
                        objFormattedData.push(item);
                    }
                    this.createRows(objFormattedData);
                }
                if (count == 0) {
                    $("#loading-block").css("display", "none");
                    $('.ag-body-viewport').unbind('scroll');
                    this.setState({ rowData: this.createRows("") });
                }
                $("#loading-block").css("display", "none");
            }.bind(this),
            error: function () {
                setTimeout(() => {
                    this.GetEmailInviteList();
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
                    SendTo: data[i].SendTo,
                    Content: data[i].Content,
                    Organization_Name: data[i].Organization_Name,
                    Title: data[i].Title,
                    StartDate: ConvertLongToDate(data[i].StartDate, this.state.TimeFormat, this.state.DateFormat),
                    EndDate: ConvertLongToDate(data[i].EndDate, this.state.TimeFormat, this.state.DateFormat)
                   
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
        var emailVar = this.TotalCount === 1 ? messages.UserEmail : messages.Emails;
        return (
            <div className="row ">
                <div className="col-lg-11 col-md-10 col-sm-10 col-9 mx-auto">
                    <div className="row">
                        <div  className="col-lg-12 col-md-10 col-sm-12 pt-3">
                            <Headings heading={messages.EMAILINVITE} backbtn={false} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-11 col-lg-11 col-sm-11 col-10 user-count">
                            <TotalCount totalCount={this.TotalCount} userVar={emailVar} />
                        </div>
                        {/* <div className="col-md-1 col-lg-1 col-sm-1 col-2 addphone  mb-2">
                            <AddButton title={messages.AddUserLabel} addClick={this.addUserBtnClick.bind(this)} />
                        </div> */}
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
export default EmailInviteList;