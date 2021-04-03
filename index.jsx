import {Switch, Route}  from 'react-router-dom'
import React                    from 'react'
import { Redirect }             from 'react-router'
import $                        from 'jquery';
import Header               from './shared/header.jsx';
import GoogleApiWrapper     from './googleMap/googleMap.jsx'
import UserList             from './userManagement/UserList.jsx';
import AddUpdateUser        from './UserManagement/addUpdateUser.jsx'
import Systemsetting        from './components/systemSetting/systemSetting.jsx';
import Addupdateorganization        from './Organization/addupdateorganization.jsx';
import Overlaysideicon from './components/OverlaySideBar/overlaySideIcon.jsx';
import Changeresetpassword from './components/changeresetpassword/changeresetpassword.jsx';
import Gridorganization from './Organization/gridorganization.jsx'; 
import EMAILINVITE from './EmailInvite/emailInviteGrid.jsx'; 
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './index.less';
var createReactClass = require('create-react-class');
var Index =createReactClass({
    getInitialState: function(){
        this.state = {
            UserRole : "",
            LoginUserOrganization : "",
            loginUser : ""
        }
        return null;
    },
	componentWillMount() {
        $("body").removeClass("have-bg-image");
    },
    componentWillUpdate(){
    },
    render() {
        return (
            <div>
            <ToastContainer autoClose={false} />
            <div className="col-lg-1 col-md-2 col-sm-2 col-xs-2">
                        <Overlaysideicon />
            </div>
            <div className="container-fluid" id="bodyContainer">
                <div className="row">
                    <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12">
                        <div id="wrapper">
                            <Header/>
                            <div id="page-content-wrapper">
                                <div className="row">
                                    <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12">
                                        <Switch>
                                            <Route exact path="/mapview" component={GoogleApiWrapper}/>
                                            <Route path="/changeResetPassword" component={Changeresetpassword}/>
                                            <Route path="/usermanagement" component={UserList} />
                                            <Route path="/addupdateUser" component={AddUpdateUser}/>
                                            <Route path="/systemSetting" component={Systemsetting}/>
                                            <Route path="/addupdateorganization" component={Addupdateorganization}/>
                                            <Route path="/gridorganization" component={Gridorganization}/>
                                            <Route path="/emailInvite" component={EMAILINVITE}/>
                                            <Redirect from="*" to="/mapview" />
                                        </Switch>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        );
    }
});

export default Index;
