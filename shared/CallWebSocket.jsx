import React from 'react';

var CallWebSocket =require('create-react-class')({
    constructor() {
        this.state = {
            clickCount: 0,
        };
    },
    componentDidMount(){
        // this is an "echo" websocket service
        var sock = new WebSocket('https://localhost:8443');


        sock.onopen = function() {
            console.log('open socket ');
            sock.send('test');
        };

        sock.onmessage = function(e) {
            console.log('message');
            console.log('message', e.data);
            sock.close();
        };

        sock.onclose = function() {
            console.log('close');
        };
    },
    render() {
        return (
            <div></div>
        )
    }
});
export default CallWebSocket;