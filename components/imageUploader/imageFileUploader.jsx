import React from 'react';
import ReactDOM from 'react-dom';
import ModalWindow from '../../commanPopup/modalWindow.jsx';
import messages from '../../utils/constants.jsx';

//FILE UPLOADER :START
var FileUpload =require('create-react-class')({
      handleFile: function(e) {
        var reader = new FileReader();
        var file = e.target.files[0];
        if (!file) return;
        var size = file.size;
        var fileName = file.name;
        var sizeKb = size / 1024;
        var Arexe = fileName.split(".").pop().toUpperCase();
        if(Arexe === "JPG" || Arexe === "PNG" ||  Arexe === "JPEG")
        {
         reader.onload = function(img) {
          ReactDOM.findDOMNode(this.refs.in).value = '';
            this.props.handleFileChange(img.target.result);
          }.bind(this);
        }
        else{
          ReactDOM.render(
            <div>
                <ModalWindow Header={messages.RESPONSEMESSAGE} SuccessMessage={messages.INVALIDFILE} />
            </div>, 
           messages.MODELVIEWDIV
         );
         return false;
      }
      if(sizeKb < 1024){
        reader.onload = function(img) {
          ReactDOM.findDOMNode(this.refs.in).value = '';
            this.props.handleFileChange(img.target.result);
          }.bind(this);
      }
      else{
        ReactDOM.render(
          <div>
              <ModalWindow Header={messages.RESPONSEMESSAGE} SuccessMessage={messages.SIZEFILE} />
          </div>, 
         messages.MODELVIEWDIV
       );
       return false;
      }
        reader.readAsDataURL(file);
      },
      render: function() {
        return (
          <input ref="in" type="file" accept="image/*" onChange={this.handleFile} />
        );
      }
});
//FILE UPLOADER : END

export default FileUpload;