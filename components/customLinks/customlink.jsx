import React from 'react';
class CustomLink extends React.Component {
    render() {
        return (
                <a href={this.props.linkto}>{this.props.text}</a>
        );
    }
}
export default CustomLink;