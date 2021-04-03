import React from 'react'
import Logo from '../logo/logo.jsx';
import { Link } from 'react-router-dom';
import messages from '../../utils/constants.jsx';
import CustomButton from '../customButton/customButton.jsx';
import LinkPvcCont from '../../contactUs/LinkPvcCont.jsx'
import './contact.css'
class Contact extends React.Component {
    render() {
        return (
            <div className="container-fluid">
                <div className="row ">
                    <div className="LoginBackground mx-auto loginmargin eulamargin col-lg-4 col-md-8 col-sm-9 col-12 ">
                        <div className="col-xl-8 col-lg-11 col-md-8 col-sm-9 col-12 mx-auto">
                            <div className="mb-5 mt-2 text-center">
                                 <Logo path="/images/logo.png" /> 
                            </div>
                        </div>
                        <div className="contactHeight">
                            <div className="row">
                                <div className="col-lg-12 mt-1 mb-2">
                                    <normal className="signHeading">CONTACT</normal>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-8 mt-2">
                                    <p>
                                        E - 27, Street 1, Professor Colony
                                        Yamuna Nagar, Haryana, India.</p>
                                    <p><i class="fa fa-phone-square"></i> +91 83988-72020</p>
                                    <p> <i class="fa fa-envelope"></i> sales@essitco.com</p>
                                </div>
                            </div>
                            <div className="row mb-1">
                                <div className="col-lg-12 col-md-12 col-sm-12">
                                    <Link to="/"><div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 btn-group no-padding btnclass">
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
export default Contact;