import React, { Component } from "react";
import '../../styles/form-element/form-element.css';

export default class TotalCount extends Component{
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <div className="TotalCount HoneywellSansWeb-ExtraBold no-padding pt-2">{this.props.totalCount} <span className="HoneywellSansWeb-ExtraBold">{this.props.userVar}</span> </div>
        );
      }
}