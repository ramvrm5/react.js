import React from 'react';
import $ from 'jquery';
import Select from 'react-select';
import messages from '../../utils/constants.jsx';
import '../../styles/form-element/form-element.css';

export default class Select2Multi extends Component{
    constructor(props) {
        super(props);
        this.state = {
             getRowHeight: function (params) {
            return 50;
            },
            headerHeight: 35,
            rowSelection: "single",
        }
        this.gridApi = "";
        this.onGridReady = this.onGridReady.bind(this);
    }
    filterUserGrid(getUserFilterValue) {
        $("#loading-block").css("display", "block");
        this.setState({ getUserFilterValue: getUserFilterValue });
        this.FilterByAccount = [];
        let userFullName = [];
        for (var i = 0; i < getUserFilterValue.length; i++) {
            userFullName.push(getUserFilterValue[i].label);
            this.FilterByAccount.push(getUserFilterValue[i].value);
        }
        if(getUserFilterValue.length > 0){
			$("#useraccountlbl").css("top","-8px");
		}
    }
    render() {
        return (
            <div id={this.props.id}>
                <Select placeholder=""
                    options={this.props.optionsList}
                    onChange={this.filterUserGrid}
                    value={this.getUserFilteredValue()}
                    clearable={this.noneditable}
                    searchable={this.editable}
                    isMulti ={true}
                    isClearable={false}
                    onFocus={() => labelFloat("useraccountlbl","selectDrop2","selectcustom")}
                    onBlur={() => labelBlur("useraccountlbl","selectDrop2","selectcustom")}
                />
                <label id="useraccountlbl" className="floating-label HoneywellSansWeb-Book wordWrap">{messages.FILTERBYUSER}</label>
        </div>
        );
      }
}
export default Select2Multi;