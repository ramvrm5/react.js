import React from 'react'
import Logo from '../logo/logo.jsx';
import Inputcheckbox from '../inputFields/inputcheckbox.jsx';
import CustomButton from '../customButton/customButton.jsx';
import messages from '../../utils/constants.jsx';
import LinkPvcCont from '../../contactUs/LinkPvcCont.jsx'
import Eulascrollcontent from '../EulaContent/eulascrollContent.jsx';
import $ from 'jquery'
import './eula.css';
import { store } from '../../app.jsx';
import { storeToken} from '../../shared/actions/action.jsx';

class Eula extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: "",
	        loading: false
        }
        this.handleCancel=this.handleCancel.bind(this);
        this.getLoggedInSessionValues();
    }
    componentDidMount() {
        document.getElementById('terms').addEventListener("scroll", this.handleScroll);
        $("#labelChecbox").addClass("checkmarkCustom");
        $("#spanCheckbox").addClass("checkboxcustom");
    }
    componentWillUnmount() {
        document.getElementById('terms').removeEventListener("scroll", this.handleScroll);
    }
    checkboxChange(e) {
        this.setState({
            checked: e.target.checked
        });
    }
    handleCancel(){
        window.location.href = "/";
    }
    getLoggedInSessionValues() {
        $.ajax({
            type: "POST",
            url: "GetLoggedInUserSessionValue",
            data: "sessionVars=Eula",
            mimeType: 'text/plain; charset=x-user-defined',
            cache: false,
            async: true,
            success: function (data) {
                if (data && data != 1) {
                    data = JSON.parse(data);
                    if(!data.Eula){
                        window.location = "/#/";
                    }
                }
            }.bind(this),
            error: function () {
                setTimeout(() => {
                    this.getLoggedInSessionValues();
                }, messages.TWOKINTERVAl);
            }.bind(this)
        });
    }
    SubmitEula(){
        var dataString = "actionType=EulaAccepted&token="+store.getState().sessionToken[0];
        $.ajax({
            type: "POST",
            url: "CommonUtils",
            mimeType: 'text/plain; charset=x-user-defined',
            data: dataString,
            cache: false,
            async: true,
            success: function (data) {
                data = JSON.parse(data);
				if(data){
                    store.dispatch(storeToken(data["randomNew"]));
                    if(data["Eula"] == "Accept"){
                        window.location.href = "/#/changeResetPassword";
                    }
                }
            }.bind(this),
            error: function () {
            }
        });
     }
    handleScroll() {
        var element = document.getElementById("terms");
        var y = element.scrollTop;
        var height = "innerHeight" in document.getElementById('terms') ? document.getElementById('terms').innerHeight : document.getElementById('terms').offsetHeight;
        if (y + height >= document.getElementById('terms').scrollHeight) {
            $('#checkbox').removeAttr("disabled")
            $("#labelChecbox").removeClass("checkmarkCustom");
            $("#spanCheckbox").removeClass("checkboxcustom");
        }
    }
    render() {
        let disable = false
        let btnClass = "w-100  btn btn-light btn-lg btn-block text-secondary";
        if (this.state.checked) {
            btnClass = "w-100  btn btn-lg btn-block "
        }
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="LoginBackground mx-auto eulamargin col-lg-4 col-md-8 col-sm-9 col-12">
                        <div className="col-12 mx-auto">
                            <div className="mb-3 mt-4 text-center">
                                 <Logo path="/images/logo.png" /> 
                            </div>
                        </div>
                        <div className="eulaContentHeight">
                            <div className="row">
                                <div className="col-lg-12 mb-2 pl-4">
                                    <normal className="signHeading">{messages.EULALEGALAGREEMENT}</normal>
                                </div>
                            </div>
                            <div className="row p-2">
                                <div className="col-lg-12 float-right EulaLatest border" id="terms">
                                    <Eulascrollcontent />
                                </div>
                            </div>
                            <Inputcheckbox isDiasabled={true} idlabel="labelChecbox" idSpan="spanCheckbox" id="checkbox" labelcustomclass="checkmark mt-3 " labeltext={messages.ACCEPTTERMCONDITIONS} onClickCallback={this.checkboxChange.bind(this)} customclass="checkbox" />
                            <div className="row mb-1 mt-4">
                                <div className="col-lg-12 col-md-12 col-sm-12">
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 btn-group">
                                    {this.state.loading ?<CustomButton buttonType="button" onClickCallback={this.handleCancel} Isdisable={!disable} customclass="btn btn-lg btn-block" text="CANCEL" />:<CustomButton buttonType="button" onClickCallback={this.handleCancel} customclass="btn btn-lg btn-block" text="CANCEL" />}</div>
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 btn-group">
                                    {this.state.loading ? <div className="form-group login_loading mx-auto"><center className="mt-3"><img src="/images/loading.gif" alt="" className="img-responsive loading_image" /></center></div> :
                                    <CustomButton onClickCallback={this.SubmitEula} buttonType="Submit"
                                            Isdisable={!(this.state.checked)} customclass={btnClass} text="NEXT"/>} </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-8 col-lg-11 col-md-8 col-sm-9 col-12 mx-auto">
                            <div>
                                <LinkPvcCont />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Eula;