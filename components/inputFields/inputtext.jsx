import React from 'react';
class Inputtext extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            validationClass:"wordWrap errorSpan",
            fieldValue :"",
        }
        this.onChange=this.onChange.bind(this);
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
               validationClass:(isValid ? "wordWrap errorSpan":"validationFail wordWrap errorSpan")
        });
        this.setState({ fieldValue : e.target.value});
         this.props.onChange(e);
      }
    render() {
        let val = this.props.value ? this.props.value : this.state.fieldValue;
        return (
            <div className="form-group">
                <input type={this.props.textType} name={this.props.nameText} onChange={this.onChange} id={this.props.id} value={val} className={this.props.customClass} autoComplete="off" required  />
                <label className={this.props.labelclass} htmlFor={this.props.id}>{this.props.text}</label>
                <span  className={this.state.validationClass}><small>{this.props.errorMessage}</small></span>
            </div>
        );
    }
}
export default Inputtext;