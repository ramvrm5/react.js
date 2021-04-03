import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import CustomButton from '../customButton/customButton.jsx';
import Inputtext from '../inputFields/inputtext.jsx';
import ReactGrid from '../grid/reactGrid.jsx';
import messages from '../../utils/constants.jsx';
import Inputcheckbox from '../inputFields/inputcheckbox.jsx';
import { toast } from 'react-toastify';
import './userGroup.css'
var datalist = [
    { username: "vivek@vastedge.com", mobilenumber: "9845671513" },
    { username: "essitco.js@gmail.com", mobilenumber: "9845671513" },
    { username: "essitco.net1@gmail.com", mobilenumber: "9845671513" },
    { username: "essitco.net3@gmail.com", mobilenumber: "9845671513" },
]
var result = []
class CustomHeader extends React.Component {
    handleValue(e) {
        let id = e.target.checked;
        if (id) {
            for (let i = 0; i < datalist.length; i++) {
                var res = datalist[i].username
                result.push(res);
                //console.log(result);
                $("#rowCheck" + i).prop("checked", true)
            }
        }
        else {
            for (let i = 0; i < datalist.length; i++) {
                result = [];
                //console.log(result);
                $("#rowCheck" + i).prop("checked", false)
            }
        }
    }
    render() {
        return (
            <Inputcheckbox isDiasabled={false}
                onClickCallback={this.handleValue.bind(this)}
                id="headerCheck"
                labelcustomclass="checkmark mt-1 mr-2" customclass="checkbox mt-1 checkboxgrid" />
        )
    }
}
class Customrow extends React.Component {
    handleRowValue(e) {
        let id = e.target.checked;

        if (id) {
            result.push(this.props.data.username);
            //console.log(result);
        }
        else {
            var index = result.indexOf(this.props.data.username); // <-- Not supported in <IE9 
            if (index !== -1) {
                result.splice(this.props.data.username, 1);
            }
            //console.log(result);
        }
    }
    render() {
        return (
            <Inputcheckbox isDiasabled={false}
                onClickCallback={this.handleRowValue.bind(this)}
                id={"rowCheck" + this.props.rowIndex}
                labelcustomclass="checkmark mt-1 mr-2" customclass="checkbox mt-1 checkboxgrid" />
        )
    }
}
class Usergroup extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            show: "true",
            forgetEmail: "",
            patteralphaNumeric: messages.alphaNumericRegex,
            columnDefs: [
                { field: 'check', cellClass: 'ag-custom-center-row', headerClass: 'ag-custom-header', cellRendererFramework: Customrow, headerComponentFramework: CustomHeader, maxWidth: 50 },
                { field: 'check', field: 'username', tooltipField: 'username', headerName: "USERNAME", cellClass: 'ag-custom-center-row', headerClass: 'ag-custom-header', suppressMovable: true },

            ],
            rowData: datalist,
            userGroupName: ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e) {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    handleSubmit() {
        var grpUserValue = result;
        console.log(grpUserValue);
        var groupName = this.state.userGroupName;
        console.log(groupName);
        var dataString = "action=GroupUser&grpuser=" + grpUserValue + "&grpName=" + groupName;
        if (this.state.userGroupName) {
            $.ajax({
                type: "POST",
                url: "Utility",
                mimeType: 'text/plain; charset=x-user-defined',
                data: dataString,
                cache: false,
                async: true,
                success: function (data) {
                    toast.success(messages.USERGROUPUPDATE, { autoClose: 1500, hideProgressBar: true });
                    this.props.close();
                }.bind(this),
                error: function () {
                }
            });
        }
        result = []
    }
    render() {
        let containerStyle = {
            boxSizing: "border-box",
            height: 227,
            width: "100%"
        };
        let enable = !this.state.userGroupName || !this.state.userGroupName.match(this.state.patteralphaNumeric);
        let btnclass = "btn btn-lg btn-block w-50 ml-3 mt-0"
        if (enable) {
            btnclass = "btn btn-lg btn-block bgfontColor w-50 ml-3 mt-0"
        }
        return (

            <div>
                <Modal.Dialog show={this.state.show}>
                    <Modal.Header >
                        <h5>Add User Group</h5>
                        <CustomButton onClickCallback={this.props.close} customclass="close" buttonType="button" text="&times;" />
                    </Modal.Header>
                    <Modal.Body>
                        <Inputtext onChange={this.handleChange} labelclass="form-control-placeholder" id="userGroupName" validRegrex={this.state.patteralphaNumeric} errorMessage="[Group Name]" customClass="form-control" text="Group name*" />
                        <div className="mt-5 ml-0 mb-1"><b>Total Users : 6</b></div>
                        <div className="mx-auto">
                            <ReactGrid id="UserListGrid" containerStyle={containerStyle}
                                columnDefs={this.state.columnDefs}
                                rowData={this.state.rowData}
                                suppressRowClickSelection={true}
                                rowSelection="single"
                            />
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <CustomButton onClickCallback={this.props.close} customclass="btn btn-block w-25 m-0" buttonType="button" text="CANCEL" />
                        <CustomButton onClickCallback={this.handleSubmit} Isdisable={enable} customclass={btnclass} buttonType="button" text="ADD USERS GROUP" />
                    </Modal.Footer>
                </Modal.Dialog>
            </div>
        );
    }
}
export default Usergroup;