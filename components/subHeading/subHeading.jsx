import React from 'react';
class Subheading extends React.Component {
    render() {
        return (
            <div className={this.props.customHeadingDiv}>
                <div className={this.props.customClass}>
                    <normal >{this.props.headings}</normal>
                </div>
            </div>
        );
    }
}
export default Subheading;