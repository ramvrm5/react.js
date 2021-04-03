import React from 'react';
// import * as moment from 'moment';
import moment from 'moment';
import $ from 'jquery';
import messages from './constants.jsx';
import ReactDOM from 'react-dom';
import ModalWindow from '../commanPopup/modalWindow.jsx';
import _ from 'lodash/core';
let numberOfSecInOneMinut = 60;
let minutes = 1;
let warningTimeOut = minutes * numberOfSecInOneMinut;

/****** SESSION TIMEOUT FUNCTION : START *******/
export function sessionTimeOut() {
    messages.timeOutSec--;
    if (messages.timeOutSec === warningTimeOut) {
        ReactDOM.render(
            <div>
                <ModalWindow Header={messages.SESSIONTIMEOUT} SuccessMessage={messages.TIMEOUTMESSAGE} />
            </div>,
            messages.MODELVIEWDIV
        );
    }
    if (messages.timeOutSec === 0) {
        // window.location = "/Logout";
        LogoutFunction("sessionout")
    }
    else {
        //setTimeout(sessionTimeOut(), 1000);
    }
}
/****** SESSION TIMEOUT FUNCTION : END *******/

/****** FUNCTION FOR CONVERT LONG TO DATE TIME :START *******/
export function ConvertLongToDate(val, timeFormat, dateFrmt) {
    val = val * 1000;
    var currentdateformat = "";
    var timeFormet = "hh:mm:ss a";
    if (timeFormat === 0) {
        timeFormet = "hh:mm:ss a";
    }
    else if (timeFormat === 1) {
        timeFormet = "HH:mm:ss";
    }
    currentdateformat = CurrentFormate(dateFrmt) + " " + timeFormet;
    return moment(val).format(currentdateformat); //parse integer   
}
export function ConvertLongToDateWithoutMutipal(val, timeFormat, dateFrmt) {
    var currentdateformat = "";
    var timeFormet = "hh:mm:ss a";
    if (timeFormat === 0) {
        timeFormet = "hh:mm:ss a";
    }
    else if (timeFormat === 1) {
        timeFormet = "HH:mm:ss";
    }
    currentdateformat = CurrentFormate(dateFrmt) + " " + timeFormet;
    return moment(val).format(currentdateformat); //parse integer   
}
/****** FUNCTION FOR CONVERT LONG TO DATE :START *******/
export function ConvertLongToDateOnly(val, timeFormat, dateFrmt) {
    val = val * 1000;
    var currentdateformat = "";
    var timeFormet = "hh:mm:ss a";
    if (timeFormat === 0) {
        timeFormet = "hh:mm:ss a";
    }
    else if (timeFormat === 1) {
        timeFormet = "HH:mm:ss";
    }
    currentdateformat = CurrentFormate(dateFrmt);
    return moment(val).format(currentdateformat); //parse integer   
}

/********** FUNCTIONS FOR RETURN DATEFORMATE :START ******/
/****** FUNCTION FOR CONVERT LOG TO DATE WITH TIME ZONE :START *******/
export function ConvertLongToDateWithTimeZone(val, timeFormat, dateFrmt) {
    val = val * 1000;
    var currentdateformat = "";
    var timeFormet = "hh:mm:ss A Z";
    if (timeFormat === 0) {
        timeFormet = "hh:mm:ss A Z";
    }
    else if (timeFormat === 1) {
        timeFormet = "HH:mm:ss Z";
    }

    currentdateformat = CurrentFormate(dateFrmt) + " " + timeFormet;
    return moment(val).format(currentdateformat); //parse integer   
}

/********** FUNCTIONS FOR RETURN DATEFORMATE :START ******/
export function CurrentFormate(dateFrmt) {
    var currentdateformat = "YYYY-MM-DD";
    if (dateFrmt === 0) {
        currentdateformat = "MM-DD-YYYY";
    }
    else if (dateFrmt === 1) {
        currentdateformat = "DD-MM-YYYY";
    }
    return currentdateformat;
}
/********** FUNCTIONS FOR RETURN DATEFORMATE :END *********/

/********** FUNCTIONS FOR Hide Columns :END *********/
export function setOrgColumn(org, role) {
    if (role.indexOf(1) > -1 && org.toLowerCase() === "default") {
        return "";
    }
    else {
        return 0.1;
    }
}
export function setCommunicationDateColumn(org, role) {
    if (role.indexOf(1) > -1 && org.toLowerCase() === "default") {
        return 190;
    }
    else {
        return "";
    }
}
/********** FUNCTIONS FOR Hide Columns :END *********/

/******* FUNCTIONS FOR CONVERT DATE TO LONGNUMBER :START ********/
export function ConvertDateToLong(val, dateFrmt) {
    var date = moment(moment(val, CurrentFormate(dateFrmt)).unix() * 1000);
    return date;
}
/********* FUNCTIONS FOR CONVERT DATE TO LONGNUMBER :END ********/

/******* FUNCTIONS FOR CONVERT LONGNUMBER DATE TO CURRENT TIME LONGNUMBER :START  *******/
export function ConvertLongToCurrentTime(val) {
    var localTime = moment.utc(val).toDate();
    localTime = moment(localTime).format('YYYY-MM-DD HH:mm:ss');
    var selectdate = localTime.split(" ");
    var time = moment().format("HH:mm:ss");
    var timeAndDate = moment(selectdate[0] + ' ' + time);
    return timeAndDate;
}

/********* FUNCTIONS FOR LONGNUMBER DATE TO CURRENT TIME LONGNUMBER :END ********/

//FUNCTIONS TO SORT JSON ARRAY :START
export function sortjsonarray(arr, prop, order) {
    if (!arr) {
        return [];
    }

    if (!Array.isArray(arr)) {
        throw new TypeError('sort-json-array expects an array.');
    }

    if (arguments.length === 1) {
        return arr.sort();
    }
    if (!arguments[2] || arguments[2] === "asc") {
        return arr.sort(compare(prop, 1));
    }
    else if (arguments[2] === "des") {
        return arr.sort(compare(prop, 0));
    }
    else {
        throw new TypeError('Wrong argument.');
    }

}
function compare(attr, value) {
    if (value) {
        return function (a, b) {
            var x = (a[attr]) ? "" + a[attr] : "",
                y = (b[attr]) ? "" + b[attr] : "";
            return x < y ? -1 : (x > y ? 1 : 0)
        }
    }
    else {
        return function (a, b) {
            var x = (a[attr]) ? "" + a[attr] : "",
                y = (b[attr]) ? "" + b[attr] : "";
            return x < y ? 1 : (x > y ? -1 : 0)
        }
    }
}
//FUNCTION TO SORT JSON ARRAYs :END

//FUNCTION FOR STRING ENCODE :START
export function encodeString(data) {
    data = escape(encodeURIComponent(data));
    return data;
}
//FUNCTION FOR STRING ENCODE : END

/*FUNCTION FOR STRING DECODE :START */
export function decodeString(data) {
    data = decodeURIComponent(data);
    return data;
}

//FUNCTION TO GET SERIL NUMBER MATCHED DATA  OF INSTRUMENT INFO :START
export function GetAssociatedSensorInfo(data, val) {

    var matchedData = "---";
    if (val) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].SensorName === val) {
                matchedData = data[i].SensorReading + " : " + data[i].SensorAlarmStatus;
                return matchedData;
            }
        }
    }
    return matchedData;
}
//FUNCTION TO GET SERIL NUMBER MATCHED DATA  OF INSTRUMENT INFO :END

// FUNCTION FOR IMAGE EXISTS OR NOT : START
export function ImageExists(image_url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', image_url, false);
    http.send();
    return http.status !== 404;
}
// FUNCTION FOR IMAGE EXISTS OR NOT : END

// FUNCTION FOR LOGOUT :START
export function LogoutFunction(action) {
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
                    window.location.href = "/#/Logout";
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
// FUNCTION FOR LOGOUT :END
//Check Value exist in array

//remove sidebar selection//
export function removeSideBarSelection() {
    $(".sidebar-nav").find("li").removeClass("active");
}
/*dynamically set sidebar selection*/
export function SideBarSelection(id) {
    $("#" + id).addClass("active");
}
//Get Current URL info
export function currentUrlInfo() {
    var url = window.location.href
    var arr = url.split("/");
    var CurrentUrl = arr[0] + "//" + arr[2]
    return CurrentUrl;
}

/*** Remove Duplicate value from array: End ***/
export function unique(list) {
    var result = [];
    $.each(list, function (i, e) {
        if ($.inArray(e, result) === -1) result.push(e);
    });
    return result;
}
/*** Remove Duplicate value from array: End ***/
/*** To get userrole using ROLEID: Start ***/
export function findRole(roleID) {
    let match = _.find(messages.USERROLE, function (o) {
        return o.id === roleID;
    });
    return match;
}
/*** To get userrole using ID: END ***/

/*** To get matched WorkerStatus: START ***/
export function findWorkerStatus(wokerStatus) {
    wokerStatus = wokerStatus.toString();
    let match = _.find(messages.WORKERFILTERJSON, function (data) { return data["filterBy"] === wokerStatus });
    return match;
}
/*** To get matched WorkerStatus: END ***/

/*** To get matched WorkerStatus: START ***/
export function findTimeDifference(value) {
    let match = _.find(messages.WORKERTIMEFILTERJSON, function (data) { return data["value"] === value });
    return match;
}
/*** To get matched WorkerStatus: END ***/
/** Change sensor subscript : Start */
export function convertToChemicalFormula(sensorName) {
    let sensorlength = sensorName.length;
    let str = '';
    let reg = /^\d+$/;
    for (let i = 0; i < sensorlength; i++) {
        let SplittedString = sensorName[i];
        if (sensorName[i].match(reg)) {
            SplittedString = sensorName[i].sub();
        }
        str = str + SplittedString;
    }
    return React.createElement("span", { dangerouslySetInnerHTML: { __html: str } });
}
/** Change sensor subscript : Start */
/** Convert number to HH:MM:SS : Start */
export function getHourMinSec(number) {
    var d = parseInt(number, 10);
    var hours = Math.floor(d / 3600);
    var minutes = Math.floor(d % 3600 / 60);
    var seconds = Math.floor(d % 3600 % 60);
    var HourMinSec = (hours < 10 ? "0" + hours : hours);
    HourMinSec += ":" + (minutes < 10 ? "0" + minutes : minutes);
    HourMinSec += ":" + (seconds < 10 ? "0" + seconds : seconds);
    return HourMinSec;
}
/** Function To truncate name : Start */
export function truncateName(val, num) {
    if (val) {
        let valLength = val.length;
        if (valLength > num) {
            val = val.substring(0, num) + "...";
        }
    }
    return val;
}
export function displayCell(value, num) {
    var DataString =
        <span>
            <div title={value}>{truncateName(value, num)}</div>
        </span>
    return DataString;
}


export function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0)
            return c.substring(name.length, c.length);
    }
    return "";
}

export function checkLinkExpiry(requestTime) {
    let currTime = moment().unix();
    var delta = currTime - requestTime;
    var d = parseInt(delta, 10);
    var hours = Math.floor(d / 3600);
    return (hours >= messages.PSWDLINKEXPIRYHOURS) ? true : false;
}


export function Round(val, roundTo) {
    return +(Math.round(val + "e+" + roundTo) + "e-" + roundTo);
}

/* AG-Grid Dynamic Height */
export function gridHeight() {
    var clientHeight = window.innerHeight;
    var GridHeight = clientHeight - 100;
    return GridHeight;
}  

/* Set Cookies Function */
export function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue ;
}
export function eraseCookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
export function deletefilterCookies()
{
    eraseCookie(messages.EVENTFILTER);
    eraseCookie(messages.WORKERACCOUNTCOOKIES);
    eraseCookie(messages.WORKERFILTERCOOKIES);
    eraseCookie(messages.WORKERFULLNAMECOOKIES);
    eraseCookie(messages.USERLISTCOOKIES);
    eraseCookie(messages.USERACCOUNTCOOKIES);
    eraseCookie(messages.SMARTPHONELISTCOOKIES);
    eraseCookie(messages.HISTORICALEVENTFILTER);
    eraseCookie(messages.HISTORICALWORKERACCOUNTCOOKIES);
}
export function nextWizard(first,second)
{
    var firstItem = $('#'+first);
    var secondItem = $('#'+second);
    //firstItem.next("div").removeClass('HoneywellSansWeb-Bold'); 
    firstItem.removeClass('btn-primary').addClass('btn-default');
    firstItem.addClass('btn_styl');
    firstItem.next("div").addClass('signup-steps-color');
    //secondItem.next("div").addClass('HoneywellSansWeb-Bold');
    secondItem.removeClass('btn-default').addClass('btn-primary');
    secondItem.removeClass('btn_styl');
    secondItem.next("div").removeClass('signup-steps-color');
    secondItem.removeAttr('disabled');
}

export function addDays(theDate, days) {
    return new Date(theDate.getTime() + days*24*60*60*1000);
}
export function labelFloat(labelid,selectid,selectcustom){
    var lblclass = "."+selectid+" .css-10nd86i ~ label#"+labelid;
    $(lblclass).each(function () {
        if(selectcustom){
            $(this).css("top","-8px");
        }else{
            $(this).css("top","3px");
        }
    });
}
export function labelBlur(labelid,selectid,selectcustom){
    var lblclass = "."+selectid+" .css-10nd86i ~ label#"+labelid;
    var select = "."+selectid+" .css-10nd86i"
    if($(select).find(".css-xwjg1b").length == 0){
        $(lblclass).each(function () {
            if(selectcustom){
                $(this).css("top","10px");
            }else{
                $(this).css("top","20px");
            }
        });
    }
}
export function SingleSelectlabelFloat(labelid,selectid,selectcustom){
    var lblclass = "."+selectid+" .css-10nd86i ~ label#"+labelid;
    if(selectcustom){
        $(lblclass).css("top","-8px");
    }else{
        $(lblclass).css("top","3px");
    }
}
export function SingleSelectlabelBlur(labelid,selectid,selectcustom){
    var lblclass = "."+selectid+" .css-10nd86i ~ label#"+labelid;
    var select = "."+selectid+" .css-10nd86i";
    if($(select).find(".css-va7pk8").length == 0){
        if(selectcustom){
            $(lblclass).css("top","10px");
        }else{
            $(lblclass).css("top","20px");
        }
    }
}

export function removeDocSpecialCharacters(content) {
    if(content) {
        content = content.replace(/“/g,'"');
        content = content.replace(/”/g,'"');
        content = content.replace(/’/g,'\'');
        content = content.replace(/–/g,'-');
        content = content.replace(/·/g,'*');
    }

    return content;
}

/*** Remove UserManagement LocalStorage Values : Start ***/
export function RemoveUserMangLocalStorage() {
    localStorage.removeItem("OrganizationName");
    localStorage.removeItem("AccountType");
}
/*** Remove UserManagement LocalStorage Values : End ***/

/*** Focus on input ***/
export function focusInputs(id){
    $('#' + id + ' input[type="text"]').each(function () {
        this.focus();
        this.blur();
    });
}
/*** Focus on input ***/