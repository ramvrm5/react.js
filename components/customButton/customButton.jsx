import React from 'react';
class CustomButton extends React.Component {
    render() {
        return (
                <button type={this.props.buttonType} disabled={this.props.Isdisable} className={this.props.customclass} onClick={this.props.onClickCallback}>{this.props.text}</button>
            
        );
    }
}
export default CustomButton;