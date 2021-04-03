import React from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import messages from '../utils/constants.jsx';
import {SideBarSelection,RemoveUserMangLocalStorage} from '../utils/utility.jsx';
var Sidebar =require('create-react-class')({
	getInitialState: function() {
		this.state = {
			LoginUserOrganization : "",
			UserRole : ""
		}
		return this.state;
	},
	activelink : function(e){
		$(".sidebar-nav").find("li").removeClass("active");
		$("#"+e.currentTarget.dataset.id).addClass("active");
		localStorage.setItem('ActionID', e.currentTarget.dataset.id);
		RemoveUserMangLocalStorage();
	},
	componentWillMount(){
	},
	componentDidMount() {
		
	},
	componentDidUpdate: function(){
		$('.sidebar-nav').find("li").each(function () {
            $(this).removeClass("active");
        }); 
		let ActionID = localStorage.getItem('ActionID');
		SideBarSelection(ActionID);
	},
  	render() {
		return (
			<div id="sidebar-wrapper">
				<nav id="spy">
					<ul className="sidebar-nav nav">
						<li data-id="MapView" id="MapView" className="sidebar-brand" onClick={this.activelink}>
							<Link to='/mapview' className="sidebar-link">
								<i className="fa fa-map-marker sidebar-icon" title = "MapView" aria-hidden="true" />
							</Link>
						</li>
						<li data-id="UserManagement" id="UserManagement" className="sidebar-brand" onClick={this.activelink}>
							<Link to='/usermanagement' className="sidebar-link">
								<i className="fa fa-users sidebar-icon" title = "UserManagement" aria-hidden="true" />
							</Link>
						</li>
					</ul>
				</nav>
			</div>
		);
	}
});
export default Sidebar;