import React from 'react'
import Inputtext from '../inputFields/inputtext.jsx';
import Inputpassword from '../inputFields/inputpassword.jsx';
import Inputcheckbox from '../inputFields/inputcheckbox.jsx';
import Customselect from '../Select2Dropdown/customSelect.jsx';
import Customradio from '../inputFields/customradio.jsx';
import Inputtextarea from '../inputFields/inputTextarea.jsx';
import Datepicker from '../date picker/datePicker.jsx';
class Customform extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputFields: this.props.data,
        }
    }
    setFieldsWithData(inputFields) {
        this.setState({
            inputFields: inputFields
        });
    }
    render() {
        return (
            <form autoComplete="form">
                <div className="row">
                    {this.state.inputFields.map((item) =>
                        item.textType === "text" ? <div key={item.fieldId} className={item.classperpage}><Inputtext id={item.id} textType={item.textType} validRegrex={item.validRegrex} onChangeCallback={item.onChange} text={item.text} customClass="form-control" labelclass="form-control-placeholder" value={item.value} errorMessage={item.errorMessage} />
                        </div> :
                            item.textType === "password" ? <div key={item.fieldId} className={item.classperpage}>
                                <Inputpassword formcontrolclass="form-control" validRegrex={item.validRegrex} textType={item.textType} id={item.id} idspan={item.idspan} value={item.value} errorMessage={item.errorMessage} onChangeCallback={item.onChange} text={item.text} customclass={item.customclass} />
                            </div> :

                                item.inputtype === "inputtextarea" ? <div key={item.fieldId} className={item.classperpage}><Inputtextarea id={item.id} validRegrex={item.validRegrex} onChangeCallback={item.onChange} value={item.value} text={item.text} customClass="form-control" labelclass="form-control-placeholder" errorMessage={item.errorMessage} /></div> :

                                    item.type === "Dropdown" ? <div key={item.fieldId} className={item.classperpage}><Customselect dropDownClass={item.dropDownClass} isMulti={item.isMulti} placeholder={item.placeholder} id={item.id} value={item.value} madatory={item.mandatory} options={item.options} customClass={item.customclass} />
                                    </div> :

                                        item.textType === "checkbox" ? <Inputcheckbox key={item.fieldId} labeltext={item.labeltext} customclass={item.customclass} /> :

                                            item.inputtype === "datepicker" ? <Datepicker key={item.fieldId} onChangeCallback={item.onChange} /> :

                                                item.textType === "radio" ?
                                                    <div key={item.fieldId} className={item.classperpage}>
                                                        <Customradio textType={item.textType} customClass={item.customClass} id={item.id} onChangeCallback={item.onChange} name={item.name} value={item.value} check={item.check} labelText={item.labelText} customlabelClass={item.customlabelClass} />
                                                    </div> : "")}
                </div>
            </form>
        );
    }
}
export default Customform;