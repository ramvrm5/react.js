import React, { Component } from "react";

export default class UserStatus extends Component {
    constructor(props) {
        super(props);
       this.state = {
                    value: props.data,
        }             
    }
    addDefaultSrc(ev) {
        ev.target.src = "/images/avatar.jpg";
    }
    render() {
        let UserImage = "";
        if(this.state.value.getPicture){
            UserImage = this.state.value.getPicture;
        }else{
            UserImage = "/images/avatar.jpg";
        }
        let UserId = this.state.value.UserId;
        let userFullName = this.state.value.Username;
        return (
            <div className="">
                <span className="workerInfo" title={UserId}>
                    <span className="userimg">
                        <img className="img-circle" src={UserImage} onError={this.addDefaultSrc} alt="" />
                    </span>
                    <span className="workerNameStyl" title={UserId}>
                        {userFullName ? userFullName: UserId ? UserId : "---"}
                    </span>
                </span>
            </div>
        );
    }
};