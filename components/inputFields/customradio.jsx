import React from 'react'
import './custom.css'
class Customradio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value:""
        }
        this.radioButtonChange=this.radioButtonChange.bind(this);
    }
    radioButtonChange(e){
        this.setState({
          value:e.target.value
        })
        this.props.onChangeCallback(e.target.value);
    }
    customRadioButtonChange(value){
        this.setState({
          value:value
        })
        this.props.onChangeCallback(value);
    }
    componentDidMount(){
        if(this.props.check){
            $("#"+this.props.id).prop("checked", "checked");
        }
    }
    render() {
        if(this.props.check){
            $("#"+this.props.id).prop("checked", "checked");
        }
        return (
            <div className="custom-control custom-radio custom-control-inline">
                <input type={this.props.textType} className={this.props.customClass} id={this.props.id} name={this.props.name} onChange={this.radioButtonChange} value={this.props.value}/>
                <label className={this.props.customlabelClass} htmlFor={this.props.id}>{this.props.labelText}</label>
            </div>
        );
    }
}
export default Customradio;