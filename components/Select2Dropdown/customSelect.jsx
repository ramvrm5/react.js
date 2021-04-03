import React from 'react'
import Select from 'react-select';
import $ from 'jquery'
import './customselect.css'
class Customselect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption:null,
            isSearchable: true,
        }
        this.handleChange = this.handleChange.bind(this);
        this.labelFloat = this.labelFloat.bind(this);
        this.labelBlur = this.labelBlur.bind(this);
        this.SingleSelectlabelFloat = this.SingleSelectlabelFloat.bind(this);
        this.SingleSelectlabelBlur = this.SingleSelectlabelBlur.bind(this);
    }
    componentDidMount(){
        if(this.props.value){
            this.handleChange(this.props.value)
            this.selectBlur();
            this.selectFocus();
        }
    }
    handleChange(selectedOption, reload) {
        this.setState({
            selectedOption: selectedOption
        }); 
        this.props.onChange(selectedOption, reload)
    }
    SingleSelectlabelFloat(labelid, selectid, selectcustom) {
        var lblclass = "." + selectid + " .css-10nd86i ~ label#" + labelid;
        if (selectcustom) {
            $(lblclass).css({ "top": "-13px", "opacity": "1", "background-color": "white","font-size": "88%"});
        } else {
            $(lblclass).css("top", "3px");
        }
    }
    SingleSelectlabelBlur(labelid, selectid, selectcustom) {
        var lblclass = "." + selectid + " .css-10nd86i ~ label#" + labelid;
        var select = "." + selectid + " .css-10nd86i";
        if ($(select).find(".css-1hwfws3").length === 0) {
            if (selectcustom) {
                $(lblclass).css({ "top": "4px", "background-color": "white" });
            } else {
                $(lblclass).css("top", "20px");
            }
        }
    }
    labelFloat(labelid, selectid, selectcustom) {
        var lblclass = "." + selectid + " .css-10nd86i ~ label#" + labelid;
        $(lblclass).each(function () {
            if (selectcustom) {
                $(this).css({ "top": "-13px", "opacity": "1", "background-color": "white","font-size": "88%"});
            } else {
                $(this).css("top", "3px");
            }
        });
    }
    labelBlur(labelid, selectid, selectcustom) {
        var lblclass = "." + selectid + " .css-10nd86i ~ label#" + labelid;
        var select = "." + selectid + " .css-10nd86i";
        if ($(select).find(".css-xwjg1b").length === 0) {
            $(lblclass).each(function () {
                if (selectcustom) {
                    $(this).css({ "top": "4px","background-color": "white" });
                } else {
                    $(this).css("top", "20px");
                }
            });
        }
    }
    selectFocus() {
        if (this.props.isMulti) {
            this.labelFloat(this.props.id, this.props.dropDownClass, "selectcustom")
        }
        else {
            this.SingleSelectlabelFloat(this.props.id, this.props.dropDownClass, "selectcustom")
        }
    }
    selectBlur() {
        if (this.props.isMulti) {
            this.labelBlur(this.props.id, this.props.dropDownClass, "selectcustom")
        }
        else {
            this.SingleSelectlabelBlur(this.props.id, this.props.dropDownClass, "selectcustom")
        }
    }
    render() {
        return (
            <div className={this.props.dropDownClass}>
                <Select
                    id={this.props.id}
                    placeholder=""
                    value={this.state.selectedOption}
                    onChange={this.handleChange}
                    options={this.props.options}
                    isMulti={this.props.isMulti}
                    isSearchable={this.state.isSearchable}
                    className={this.props.customClass}
                    onFocus={() => this.selectFocus()}
                    onBlur={() => this.selectBlur()}
                />
                <label id={this.props.id} className={this.props.customClass+" labelselect"}>{this.props.placeholder}</label>
                <span className="wordWrap errorSpan"><small>{this.props.mandatory}</small></span>
            </div>
        );
    }
}
export default Customselect;