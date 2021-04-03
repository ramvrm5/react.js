import React from 'react';
class Inputtextarea extends React.Component {
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
        return (
            <div className="form-group">
                <textarea type={this.props.textType} name={this.props.nameText} onChange={this.onChange} id={this.props.id} value={this.props.value} className={this.props.customClass} autoComplete="off" required />
                <label className={this.props.labelclass} htmlFor={this.props.id}>{this.props.text}</label>
                <span  className={this.state.validationClass}><small>{this.props.errorMessage}</small></span>
            </div>
        );
    }
}
export default Inputtextarea;