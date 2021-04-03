import React from 'react';
import messages from '../utils/constants.jsx';
import $ from 'jquery';
import ReactDOM from 'react-dom';
import Customselect from '../components/Select2Dropdown/customSelect.jsx';
import { LogoutFunction, sessionTimeOut } from '../utils/utility.jsx';
import moment from 'moment';
import CustomRange from './customRange.jsx';

var Header = require('create-react-class')({
	getInitialState: function () {
		this.state = {
			userName: "",
			UserRole: [],
			UserImage: "",
			OtherOrganisation: false,
			showOrganisation: true,
			LoginUserOrganization: "",
			SessionTimeOutValue: "",
			selectedOrgId: "",
			selected_org: {},
			selectedGrpId: "",
			selected_group: {},
			timeRange: {},
			rangeId: "",
			historyStart: "",
			historyEnd: "",
			TimeFormat: "",
			DateFormat: "",
			show: false,
			load: true
		}
		var dataString = "sessionVars=SessionTimeOutValue,selectedOrgId,UserRole,selectedGroupId,rangeId,historyStart,historyEnd,TimeFormat,DateFormat";
		$.ajax({
			type: "POST",
			url: "GetLoggedInUserSessionValue",
			data: dataString,
			cache: false,
			mimeType: 'text/plain; charset=x-user-defined',
			async: true,
			success: function (data) {
				if (data == messages.Session_Timeout) {
					LogoutFunction("sessionout");
					return;
				}
				if (data && data != 1) {
					data = JSON.parse(data);
					let User_Role = data.UserRole.split(",");
					this.setState(
						{
							SessionTimeOutValue: data.SessionTimeOutValue,
							UserRole: User_Role,
							selectedOrgId: data.selectedOrgId,
							selectedGrpId: data.selectedGroupId,
							TimeFormat: data.TimeFormat,
							DateFormat: data.DateFormat,
						}
					);
					if (User_Role.indexOf(messages.SYSTEMADMINISTRATORROLE) > -1) {
						this.GetOrganizationList();
					}
					/* let sessionValues = {
						UserRole: data.UserRole,
						LoginUserOrganization: data.LoginUserOrganization,
						LoginUserName: data.userName,
						isInternalOrg: data.isInternal
					}
					store.dispatch(loggedInSessionValues(sessionValues)); */
					if (data.rangeId) {
						var selectedtimeRange = _.find(messages.HISTORICALRECORD, function (_data) { return _data["id"] == data.rangeId }.bind(this));
						this.refs.historyRecords.handleChange(selectedtimeRange, false);
					}
					else {
						this.refs.historyRecords.handleChange(messages.constHistoricalRecord, false);
					}
					messages.timeOutSec = this.state.SessionTimeOutValue;
					if (this.state.SessionTimeOutValue) {
						this.sessionOut = setInterval(
							() => sessionTimeOut(),
							1000
						);
					}
				}
			}.bind(this)
		})
		this.onOrganizationChange = this.onOrganizationChange.bind(this);
		this.onUserGroupChange = this.onUserGroupChange.bind(this);
		this.onSelectRangeChange = this.onSelectRangeChange.bind(this);
		this.GetOrganizationList = this.GetOrganizationList.bind(this);
		this.changeTimeRange = this.changeTimeRange.bind(this);
		this.reload = false;
		return this.state;
	},
	handleClose() {
		this.setState({ show: false });
	},
	handleShow() {
		this.setState({ show: true });
	},
	onSelectRangeChange(select, reload) {
		var timeChangeValue = select.value;
		var timeChangeId = select.id;
		var start = "";
		var end = "";
		if (timeChangeId != "5") {
			var duration = moment.duration({ 'minutes': -parseInt(timeChangeValue) });
			var start = moment().add(duration).utc().unix();
			this.changeTimeRange(timeChangeId, start, end, reload);
		}
		else {
			this.handleShow();
		}
		this.setState({
			timeRange: select
		})
	},
	changeTimeRange(timeChangeId, start, end, reload) {

		var dataString = "action=ChangeDateRange&rangeId=" + timeChangeId + "&start=" + start + "&end=" + end;
		if (this.state.timeRange) {
			if (this.state.timeRange.id != timeChangeId) {
				$.ajax({
					type: "POST",
					url: "Utility",
					mimeType: 'text/plain; charset=x-user-defined',
					data: dataString,
					cache: false,
					async: true,
					success: function (data) {
						if (reload) {
							window.location.reload();
						}
					}.bind(this),
					error: function () {
					}
				});
			}
		}
	},
	onUserGroupChange(select, reload) {
		var grpChangeValue = select.value;
		var grpChangeId = select.id;

		var dataString = "action=ChangeGroup&grpId=" + grpChangeId + "&grpName=" + grpChangeValue;
		if (this.state.selected_group) {
			if (this.state.selected_group.id != grpChangeId) {
				$.ajax({
					type: "POST",
					url: "Utility",
					mimeType: 'text/plain; charset=x-user-defined',
					data: dataString,
					cache: false,
					async: true,
					success: function (data) {

						if (reload) {
							window.location.reload();
						}
					}.bind(this),
					error: function () {
					}
				});
			}
		}
		this.setState({
			selected_group: select
		});
	},
	onOrganizationChange(select, reload) {
		var orgChangeValue = select.value;
		var orgChangeId = select.id;
		var dataString = "action=ChangeOrg&orgId=" + orgChangeId + "&orgName=" + orgChangeValue;
		if (this.state.selected_org) {
			if (this.state.selected_org.id != orgChangeId) {
				$.ajax({
					type: "POST",
					url: "Utility",
					mimeType: 'text/plain; charset=x-user-defined',
					data: dataString,
					cache: false,
					async: true,
					success: function (data) {
						if (reload) {
							window.location.reload();
						}
						//data = JSON.parse(data);
						/* data = JSON.parse(data);
						if(data){
							store.dispatch(storeToken(data["randomNew"]));
							if(data["Eula"] == "Accept"){
								window.location.href = "/#/changeResetPassword";
							}
						} */
					}.bind(this),
					error: function () {
					}
				});
			}
		}
		this.setState({
			selected_org: select
		});
	},
	toggleburger: function () {
		// $("#wrapper").toggleClass("active");
		$('#bar').toggleClass("main");
		//  $('#overlaySidenav').toggle('');
	},
	componentDidMount() {
		$("body").attr("data-spy", "scroll");
		$("body").attr("data-target", "#myScrollspy");
		$("body").attr("data-offset", "80");

		document.addEventListener('mousemove', this.mouseEventHandler);
		document.addEventListener('click', this.clickEventHandler);
		this.setState({ load: false });
	},
	componentWillUnmount() {
		this.sessionOut && clearInterval(this.sessionOut);
		this.sessionOut = false;
	},
	componentWillUpdate() {
	},
	clickEventHandler() {
		messages.timeOutSec = this.state.SessionTimeOutValue;
	},
	mouseEventHandler() {
		messages.timeOutSec = this.state.SessionTimeOutValue;
	},
	componentWillUnmount() {
		this.sessionOut && clearInterval(this.sessionOut);
		this.sessionOut = false;
	},
	LogOut: function () {
		LogoutFunction("logout");
	},
	addDefaultSrc(ev) {
		ev.target.src = "/images/upload.jpg";
	},
	GetOrganizationList() {
		let accessTokenInst = Math.random();
		$("#loading-block").css("display", "block");
		var dataString = "token=" + accessTokenInst + "&type=getAllOrg";
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
				var OrganizationList = [];
				if (data.response.responseCode == messages.OK) {
					var organizationInfo = data.response.response;//JSON.parse(data.response.response);
					var UserListData = organizationInfo;
					var getTotalCount = organizationInfo.length;
					orgcount = organizationInfo.length;
					this.TotalCount = getTotalCount;
					var selectedOrg = {};
					for (var i = 0; i < orgcount; i++) {
						item = {};
						item["value"] = UserListData[i].name,
							item["id"] = UserListData[i].id;
						item["label"] = UserListData[i].name;
						if (UserListData[i].id == this.state.selectedOrgId) {
							selectedOrg = item;
						}
						OrganizationList.push(item);
					}
					this.setState({ organizationList: OrganizationList, loadOrg: true });
					this.reload = false;
					this.refs.orgDropDown.handleChange(selectedOrg, this.reload);


					if (this.state.selectedGrpId) {
						var selectedGrp = _.find(messages.UserGroup, function (data) { return data["id"].toLowerCase() === this.state.selectedGrpId }.bind(this));
						this.refs.grpDropDown.handleChange(selectedGrp, this.reload);
					}
				}
			}.bind(this),
			error: function () {
				$("#loading-block").css("display", "none");
			}
		});
	},

	getRangevalue(startDate, EndDate) {
		console.log(startDate, EndDate);
		this.handleClose();
	},
	render() {
		var url = window.location.href;
		var showhistoricalRecord = window.location.href.indexOf("mapview") > -1;
		var showUserGroup = window.location.href.indexOf("mapview") > -1;
		//var showOrganization = window.location.href.indexOf("mapview") > -1;
		//var showorganization = window.location.href.indexOf("usermanagement") > -1;
		//var Showorganization = window.location.href.indexOf("systemSetting") > -1;
		return (
			<div id="headerInfo" className="row googleuser">
				{
					showhistoricalRecord ?
						<div className="col-lg-4 mt-2">
							<Customselect customClass="transParent" isMulti={false} ref="historyRecords" onChange={this.onSelectRangeChange} placeholder="Historical Record" id="timeRange" options={messages.HISTORICALRECORD} customclass="mb-4" dropDownClass="dropdown3selectDrop2" />
						</div>
						:
						""
				}
				{this.state.show && !this.state.load ? <CustomRange dateFormat={this.state.DateFormat} getRangevalue={this.getRangevalue.bind(this)} close={this.handleClose} /> : ""}
				{
					showUserGroup ?
						<div className="col-lg-4 mt-2">
							<Customselect customClass="transParent" isMulti={false} onChange={this.onUserGroupChange} ref="grpDropDown" placeholder="User Groups" value={this.state.selected_group} id="UserGroup" options={messages.UserGroup} customclass="mb-4" dropDownClass="dropdown3selectDrop2" />
						</div>
						:
						""
				}
				{
					this.state.UserRole.indexOf(messages.SYSTEMADMINISTRATORROLE) > -1 && this.state.loadOrg ?
						<div className="col-lg-4 mt-2">
							<Customselect customClass="transParent" isMulti={false} onChange={this.onOrganizationChange} ref="orgDropDown" placeholder=" Organization Name" value={this.state.selected_org} id="organization" options={this.state.organizationList} customclass="mb-4" dropDownClass="dropdown3selectDrop2" />
						</div>
						:
						""
				}
			</div>
		);
	}
});

export default Header;