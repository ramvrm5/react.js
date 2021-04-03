import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import $ from 'jquery'
import OuterPages from './OuterPages.jsx'
import Index from './index.jsx'
import { createStore } from 'redux'
import { Provider } from 'react-redux';
import reducer from './shared/reducer/index.jsx'
export const store = createStore(reducer);
import './app.less';
import messages from './utils/constants.jsx'

var createReactClass = require('create-react-class');
var MainApp = createReactClass({
    getInitialState: function () {
        localStorage.setItem("LoginState","Fail");
        this.state = {
            login: false
        }
        return this.state;
    },
    componentWillMount: function () {
        this.setState({ login: false });
        let cur_url = window.location.href;
        let _cur_url = cur_url.split("/");
        var dataString = "";
        if(!messages.is_maintenance) {
            $.ajax({
                type: "POST",
                url: "CheckLogedInSession",
                data: dataString,
                cache: false,
                async:false,
                mimeType: 'text/plain; charset=x-user-defined',
                success: function (data) {
                    if (data) {
                        data = JSON.parse(data);
                        if (data["login"]) {
                            if(_cur_url[4]){
                                if(_cur_url[4] !== messages.OUTERPAGES[2]){
                                    this.setState({ login: true });
                                }
                            }
                            else{
                                this.setState({ login: true });
                            }
                        }
                        else {
                            if (messages.OUTERPAGES.indexOf(_cur_url[4]) === -1) {
                                window.location.href = "/#/";
                            }
                        }
                    }
                }.bind(this)
            });
        }
    },
    render() {
        if (this.state.login) {
            return (
                <HashRouter>
                    <Index />
                </HashRouter>
            );
        }
        else {
            return (
                <HashRouter>
                    <OuterPages />
                </HashRouter>
            )
        }
    }
})

ReactDOM.render(
    <Provider store={store}>
        <MainApp />
    </Provider>,
    document.getElementById('container')
)

