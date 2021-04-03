import React, { Component } from "react";
import '../../styles/form-element/form-element.css';

export default class TotalCount extends Component{
    constructor(props) {
        super(props);
        this.state = {
        }
        this.addBtnClick = this.addBtnClick.bind(this);
    }
    addBtnClick(){
        this.props.addClick();
    }
    render() {
        return (
            <span className="add_button" title={this.props.title}><a onClick={this.addBtnClick}><img src="images/add.png" role="button" tabIndex="0" className="addOrg" alt="" /></a></span>
        );
      }
}