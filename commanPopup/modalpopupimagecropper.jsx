import React from 'react';
import Modal from 'react-bootstrap/lib/Modal'
import CustomButton from '../components/customButton/customButton.jsx';
import AvatarEditor from 'react-avatar-editor'
class Modalpopupimagecropper extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            show: "true",
            scale: 1,
            allowZoomOut:true,
            img:""
        }
        this.handleScale=this.handleScale.bind(this);        
        this.setEditorRef=this.setEditorRef.bind(this);  
        this.onClick=this.onClick.bind(this);
    }
    onClick(){   
      const imgupdate =  this.editor.getImageScaledToCanvas().toDataURL(); 
      this.props.selectImage(imgupdate)
    }    
    setEditorRef(editor){  
        if (editor) {
           this.editor = editor; 
       }
   }
    handleScale(e){
        const scale = parseFloat(e.target.value)
        this.setState({ scale })
        }
    render() {
        return (
            <div>  
                <Modal.Dialog className="m-0"  show={this.state.show}>
                    <Modal.Header >
                        <CustomButton onClickCallback={this.props.close} customclass="close" buttonType="button" text="&times;" />
                    </Modal.Header>
                    <Modal.Body className="w-100">
                        <AvatarEditor
                            ref={(ref) => this.setEditorRef(ref)}
                            image={this.props.imgsrc} className="w-100" alt="preview"
                            width={350}
                            height={350}
                            color={[255, 255, 255, 1]}
                            border={50}
                            borderRadius={300}
                            scale={this.state.scale}
                        />
                        <center>
                            <input name="scale" type="range" className="custom-range pt-2"  onChange={this.handleScale} min={'1'} max="7" step="0.01" defaultValue="1" />
                        </center>
                    </Modal.Body>
                    <Modal.Footer>
                        <CustomButton onClickCallback={this.onClick}  customclass="btn btn-small" buttonType="button" text="Save" />
                        <CustomButton onClickCallback={this.props.close} customclass="btn btn-small"  buttonType="button" text="Close" />
                    </Modal.Footer>
                </Modal.Dialog>
            </div>
        );
    }
}
export default Modalpopupimagecropper;