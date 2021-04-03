import React from 'react'
import { Link } from 'react-router-dom';
import Logo from '../logo/logo.jsx';
import CustomButton from '../customButton/customButton.jsx';
import messages from '../../utils/constants.jsx';
import LinkPvcCont from '../../contactUs/LinkPvcCont.jsx'
import Eulascrollcontent from '../EulaContent/eulascrollContent.jsx';
import './privacy.css'
class Privacy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: "",
        }
    }
    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="LoginBackground mx-auto loginmargin eulamargin col-lg-4 col-md-8 col-sm-9 col-12">
                        <div className="col-xl-8 col-lg-11 col-md-8 col-sm-9 col-12 mx-auto">
                            <div className="mb-5 mt-2 text-center">
                                 <Logo path="/images/logo.png" /> 
                            </div>
                        </div>
                        <div className="privacyheight">
                            <div className="row">
                                <div className="col-lg-12 mb-2">
                                    <normal className="signHeading">PRIVACY</normal>
                                </div>
                            </div>
                            <div className="row  p-2">
                                <div className="col-lg-12 float-right scrollHeight border">
                                   <Eulascrollcontent/>
                                </div>
                            </div>
                            <div className="row mb-1 mt-4">
                                <div className="col-lg-12 col-md-12 col-sm-12 ">
                                    <Link to="/"><div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 btn-group no-padding">
                                        <CustomButton buttonType="button" customclass="btn btnclass no-padding" text="GO BACK" /></div></Link>
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
export default Privacy;