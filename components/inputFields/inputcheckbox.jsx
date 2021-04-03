import React from 'react';
class Inputcheckbox extends React.Component {
    render() {
        return (
                <label id={this.props.idlabel} className={this.props.labelcustomclass}>
                    <input  type="checkbox" disabled={this.props.isDiasabled} id={this.props.id} onChange={this.props.onClickCallback}/>
                    <span id={this.props.idSpan} className={this.props.customclass}></span>{this.props.labeltext}
                </label> 
        );
    }
}
export default Inputcheckbox;