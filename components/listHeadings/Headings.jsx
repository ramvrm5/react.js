
import React from 'react';
import { Link } from 'react-router-dom';
import messages from '../../utils/constants.jsx';

var Headings = require('create-react-class')({
    getInitialState: function () {
        this.state = {

        }
        return this.state;
    },
    backBtn() {
        this.props.backClick();
    },
    render() {
        return (
            <div>
                {this.props.backbtn ? <div className="back-button">
                    <i className="fa fa-angle-left" aria-hidden="true" />
                    <Link to='/usermanagement' className="blue-color" onClick={this.backBtn}>
                        {messages.Back}
                    </Link>
                </div> : ""}
                <div>
                    <h5><strong>{this.props.heading}</strong></h5>
                </div>
            </div>
        );
    }
});
export default Headings;