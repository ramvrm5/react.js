
import React from 'react';
import { NavLink } from 'react-router-dom';
import messages from '../utils/constants.jsx';

var SubHeader =require('create-react-class')({
    render() {
        return (
            <main id="subheader">
                <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12 no-padding">
                    <div className="col-md-3 col-lg-3 col-sm-12 col-xs-12 no-padding rtm-width">
                        <div className="row no-margin breadcrumbinfo">
                            <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12 no-padding">
                                <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12">
                                    <div className="mapview-header HoneywellSansWeb-Bold font-size-20px rtm-header">
                                        {messages.REALTIMEMONITER}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12 rtm-header">
                            <div className="labelContainer">
                                <div className="row tabViews">
                                    <div className="tabs">
                                        <div className="labelTXT HoneywellSansWeb-ExtraBold">
                                            <NavLink to="/mapview" activeClassName="tabs active" className="text-decoration-none">{messages.MAPVIEW}</NavLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-9 col-lg-9 col-sm-12 col-xs-12 no-padding rtm-width">
                        <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12 no-padding">
                        </div>
                    </div>
                </div>
                <div className="row white-bg no-margin">

                </div>
            </main>
        );
    }
});

export default SubHeader;