import React from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import '../../styles/form-element/form-element.css';
import '../../commanPopup/modal.css';
import messages from '../../utils/constants.jsx';
import ReactDOM from 'react-dom';
import AvatarEditor from 'react-avatar-editor';
var createReactClass = require('create-react-class');
const ShowSelectedImage = createReactClass({
    getInitialState() {
            this.state = {
                scale: 1,
                allowZoomOut:true
            }
            return { showModal: true };
    },
    componentWillMount() {
        this.setState({ headerMessage: this.props.Header,bodyMessage: this.props.SuccessMessage });
    },

    setEditorRef(editor){
        this.editor = editor
    },

    SaveCropImage(){
        const canvas = this.editor.getImage().toDataURL();
        this.setState({ showModal: false });
        this.props.SetCroppedImage(canvas)
        ReactDOM.unmountComponentAtNode(document.getElementById('modelview'));
    },
    close(e) {
        this.setState({ showModal: false });
        if(e){
            e.stopPropagation();
        }
        ReactDOM.unmountComponentAtNode(document.getElementById('modelview'));
    },

    handleScale(e){
        const scale = parseFloat(e.target.value)
        this.setState({ scale })
      },

    open() {
        this.setState({ showModal: true });
    },

    render() {
    
    return (
        <div id="myModal" className="faicon">
        <Modal bsSize="medium" show={this.state.showModal}>
            <Modal.Header>
            <Modal.Title>{messages.UploadImage}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="textalignment AvatarEditor">
                <AvatarEditor
                    ref={this.setEditorRef}
                    scale={parseFloat(this.state.scale)}
                    borderRadius= {100}
                    image={this.props.src}
                    width={200}
                    height={200}
                    border={0}
                    scale={this.state.scale}
                />
                <center>
                <input name="scale" type="range" title="Crop It" class="cropslider" onChange={this.handleScale} min={'0.5'} max="2" step="0.01" defaultValue="1"/>
                </center>
            </Modal.Body>
            <Modal.Footer>									
                    <Button onClick={this.close} className="btn btn-tertiary active HoneywellSansWeb-ExtraBold width-140-px form-control">{messages.CLOSE}</Button>    
                    <Button onClick={this.SaveCropImage} className="btn btn-primary active HoneywellSansWeb-ExtraBold form-control width-140-px">{messages.CONFIRM}</Button>       
            </Modal.Footer>
        </Modal>
        </div>
    );
    }
});

export default ShowSelectedImage;    