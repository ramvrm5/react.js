import React from 'react';
class Logo extends React.Component {
    render() {
        return (
            <div className="text-center w-100">
                <img src={this.props.path} alt="logo" className="img-responsive w-100 mt-3 mb-3" />
            </div>

        );
    }
}
export default Logo;