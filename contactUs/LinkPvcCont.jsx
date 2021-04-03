import React from 'react';
import '../styles/form-element/form-element.css';
import { Link } from 'react-router-dom';
import messages from '../utils/constants.jsx';

var createReactClass = require('create-react-class');
var LinkPvcCont = createReactClass({
        getInitialState() {
           var linkStauts = localStorage.getItem('classPrivacy')
           if(linkStauts === "true")
           {
            this.state = {
                classname: this.props.disableclass?"privacy-disable go-back":"go-back",
                classnamecont: this.props.disableclass?"go-back":"privacy-disable go-back"
                
             }
            }
            else{
                this.state = {
                    classname: "go-back",
                    classnamecont: this.props.disableclass?"":"go-back"
                    
                 }
            }
            return this.state;	    	    
        },
        render: function() {
            return (			
            <div>
                <div className="priv text-center">
                <div className="center-align-text text-size">
                    <Link to='/privacy' className={this.state.classname}>
                        {messages.Privacy}
                    </Link>
                    <span className="link-separator"></span>
                    <Link to='/contact' className={this.state.classnamecont}>
                    	{messages.CONTACTLINK} 
                    </Link>
				</div>					
                </div>
                <div className="copyright-label  text-center mt-2">
                    <label>
                        &copy;{messages.COPYRIGHTMSG}
                    </label>
                </div>
            </div>
              );
            }
        });

export default LinkPvcCont;