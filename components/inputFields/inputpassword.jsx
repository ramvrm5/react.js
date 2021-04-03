import React from 'react';
class Inputpassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputtype : "password",
            eyeicon :"fa fa-fw fa-eye field-icon",
            validationClass:"wordWrap"
        }
        this.ToogleFieldType = this.ToogleFieldType.bind(this);
        this.onChange=this.onChange.bind(this);
    }
    ToogleFieldType(e){
        if (this.state.inputtype ==="password") {
            this.setState({
                inputtype: "text",
                eyeicon :"fa fa-fw fa-eye-slash field-icon"
             });
        }
        else {
             this.setState({
                inputtype: "password",
                eyeicon :"fa fa-fw fa-eye field-icon"
             });
         }   
    } 
    onChange(e) {
        let isValid = true;
        if (e.target.value === "") {
          isValid = false 
        }
        if (typeof e.target.value !== "undefined") {
          if (!e.target.value.match(this.props.validRegrex)) {
            isValid = false  
          }
        }
        this.setState({   
               validationClass:(isValid ? "wordWrap":"wordWrap text-danger")
        });
         this.props.onChange(e);
      }
    render() {
        return (
            <div className="form-group">
                <input type={this.state.inputtype} onChange={this.onChange} 
                className={this.props.formcontrolclass} autoComplete="off" id={this.props.id} required/>
                <label className={this.props.customclass} htmlFor={this.props.id}>{this.props.text}</label>
                <span onClick={this.ToogleFieldType} className={this.state.eyeicon}></span>
                <span id={this.props.idspan} className={this.state.validationClass} title={this.props.errorMessage}><small>{this.props.errorMessage}</small></span>
            </div>
        );
    }
}
export default Inputpassword;
