import React from 'react';
import Modal from 'react-bootstrap/lib/Modal'
import Inputtext from '../components/inputFields/inputtext.jsx';
import CustomButton from '../components/customButton/customButton.jsx';
import messages from '../utils/constants.jsx';
import { store } from '../app.jsx';
import { storeToken} from '../shared/actions/action.jsx';
import {toast } from 'react-toastify';
import Datepicker from '../components/date picker/datePicker.jsx';
import {ConvertDateToLong} from '../utils/utility.jsx';
import moment from 'moment';

var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

class CustomRange extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            show: "true",
            startDate : "",
            endDate : "",
        }
        this.handleChange = this.handleChange.bind(this);
        this.dateHandleChange = this.dateHandleChange.bind(this);
        this.Submit = this.Submit.bind(this);
    }
    handleChange(e) {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    
    dateHandleChange(date) {
        var convertedlong = ConvertDateToLong(date,this.props.dateFormat);
        var selectedDate = convertedlong.utc().unix();
        this.setState({
            dateExpire: selectedDate,
            startDate : convertedlong.utc().startOf('day').unix(),
            endDate : convertedlong.utc().endOf('day').unix(),
        });
        return selectedDate;
    }

    Submit(){
        var StartDate = "";
        var Enddate = "";
        if(this.state.startDate && this.state.endDate){
            StartDate = this.state.startDate,
            Enddate =this.state.endDate
        }else{
            StartDate   =   moment.utc().startOf('day').unix(),
            Enddate     =   moment.utc().endOf('day').unix()
        }
        this.props.getRangevalue(StartDate,Enddate);
    }

    render() {
        return (
            <div>
                <Modal.Dialog show={this.state.show}>
                    <Modal.Header >
                        <h4>{messages.CustomRange}</h4>
                        <CustomButton onClickCallback={this.props.close} customclass="close" buttonType="button" text="&times;" />
                    </Modal.Header>
                    <Modal.Body>
                    <Datepicker extendDate={0} labelmsg="Select Date" ref="expdate" onClickCallback={this.dateHandleChange.bind(this)}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <CustomButton onClickCallback={this.Submit} customclass="btn btn-block w-25 mr-3" buttonType="button" text="Submit" />
                        <CustomButton onClickCallback={this.props.close} customclass="btn btn-block w-25 m-0" buttonType="button" text="Close" />
                    </Modal.Footer>
                </Modal.Dialog>
            </div>
        );
    }
}
export default CustomRange;