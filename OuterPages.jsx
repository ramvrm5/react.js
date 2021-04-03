import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Redirect } from 'react-router';
import Eula from '../jsx/components/Eula/Eula.jsx'
import Changeresetpassword from './components/changeresetpassword/changeresetpassword.jsx';
import Signup from './components/signup/signup.jsx';
import Login from './login/login.jsx'
import Privacy from './components/privacy/privacy.jsx';
import Contact from './components/contact/contact.jsx';
import './index.less';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

var OuterPages =require('create-react-class')({
  getInitialState: function () {
    return null;
  },
  render() {
    let LoginState = localStorage.getItem('LoginState');
    return (
      <div>
      <ToastContainer autoClose={false}/>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/Login" component={Login} />
        <Route path="/Eula" component={Eula} />
        <Route path="/changeResetPassword" component={Changeresetpassword}/>
        <Route path="/ResetPassword/:randomNumber" component={Changeresetpassword} />
        <Route path="/signup" component={Signup}/>
        <Route path="/privacy" component={Privacy}/>
        <Route path="/contact" component={Contact}/>
        {LoginState === "Success"?"":<Redirect from="*" to="/Login" />}
      </Switch>
      </div>
    );
  }
})
export default OuterPages;