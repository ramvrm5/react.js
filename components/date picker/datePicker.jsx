import React from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './datePicker.css';

class Datepicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expieryDate: '',
            validationClass: "wordWrap errorSpan",
        }
        this.handleDate = this.handleDate.bind(this);
    }
    componentDidMount() {
        var date = new Date();
        date.setDate(date.getDate() + this.props.extendDate);
        this.setState({
            expieryDate: date,
        })
        $('#datepick').addClass("labelClass");
    }
    handleDate(date) {
        if (new Date() >= date) {
            $('#DatePicker').addClass('changepsswordvalidate')
        }
        else {
            $('#DatePicker').removeClass('changepsswordvalidate')
        }
        this.setState({
            expieryDate: date,
        })
        this.props.onClickCallback(date);
    }
    
    showError(){
        this.setState({validationClass:"validationFail wordWrap errorSpan"});
        return true;
    }

    hideError(){
        this.setState({validationClass:"wordWrap errorSpan"});
        return false;
    }

    render() {
        return (
            <div className="form-group">
                <DatePicker
                    className="img"
                    dateFormat="YYYY - MM - dd"
                    onChange={this.handleDate}
                    selected={this.state.expieryDate}
                />
                <label id="datepick" className="form-control-placeholder">{this.props.labelmsg}*</label>
                <span id="DatePicker" class={this.state.validationClass}><small>{this.props.errorMessage ? "" : [this.props.errorMessage]}</small></span>
            </div>
        );
    }
}
export default Datepicker;