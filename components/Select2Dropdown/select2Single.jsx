import React from 'react';
import $ from 'jquery';
import Select from 'react-select';
import messages from '../../utils/constants.jsx';
import '../../styles/form-element/form-element.css';

export default class Select2Single extends Component{
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <div className="form-group2 Select " id={this.props.id}>
                  <Select placeholder=""
                    options={this.state.OrganizationOptions}
                    clearable={this.noneditable}
                    searchable={this.editable}
                    onChange={this.selectedOrg}
                    value={this.selectedorgValue().value ? this.selectedorgValue() : messages.ALLORGANISATION}
                    isDisabled={this.state.disabled}
                    onFocus={() => SingleSelectlabelFloat("orglistlbl","selectDrop1","selectcustom")}
                    onBlur={() => SingleSelectlabelBlur("orglistlbl","selectDrop1","selectcustom")}
                />
                <label id="orglistlbl" className="floating-label HoneywellSansWeb-Book wordWrap">{messages.ORGANIZATIONVARIABLE}</label>
        </div>
        );
      }
}