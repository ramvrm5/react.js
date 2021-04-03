import React, { Component } from "react";
import $ from 'jquery';
import { AgGridReact} from "ag-grid-react";
import messages from '../../utils/constants.jsx';
import '../../styles/form-element/form-element.css';

export default class ReactGrid extends Component{
    constructor(props) {
        super(props);
        this.state = {
             getRowHeight: function (params) {
            return 50;
            },
            headerHeight: 35,
            rowSelection: this.props.rowSelection,
        }
        this.gridApi = "";
        this.onGridReady = this.onGridReady.bind(this);
    }
    onGridReady(params) {
		this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();
		this.gridApi.rowHeight = "50";  
    }
    render() {
        return (
            <div id={this.props.id} style={this.props.containerStyle} className="ag-theme-fresh">
            <AgGridReact
                // properties
                rowData={this.props.rowData}
                // events
                onGridReady={this.onGridReady}
                // column definitions
                columnDefs={this.props.columnDefs}
                //row height
                getRowHeight={this.state.getRowHeight}
                //header height
                headerHeight={this.state.headerHeight}
                //remove cell selection
                suppressCellSelection={false}
                //single row selection
                rowSelection={this.state.rowSelection}
                //hide the loadin image
                overlayLoadingTemplate = {messages.overlayLoadingTemplate}
                //stop scroll after change new data
                suppressScrollOnNewData	=  {true}
                suppressRowTransform = {true}
                overlayNoRowsTemplate = {messages.showMessage}
                onRowSelected = {this.props.RowSelected}
            >
            </AgGridReact>
        </div>
        );
      }
}