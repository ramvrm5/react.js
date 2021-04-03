import React from 'react';
import ReactDOM from 'react-dom';
import { Map, GoogleApiWrapper } from 'google-maps-react';
import $ from 'jquery';
import messages from '../utils/constants.jsx';
import PropTypes from 'prop-types'
import socketIOClient from 'socket.io-client';
import moment from 'moment';
import _ from 'lodash';
import geodist from 'geodist';

export class MapContainer extends React.Component {
    constructor(props) {
        super(props);
        this.bounds;
        this.marker;
        this.markerarray  = []; //for multiple user array
        this.markers = [];
        this.socket = socketIOClient(messages.API_ROOT);;
        this.userData = {};
        const { lat, lng } = this.props.initialCenter;
        this.state = {
            currentLocation: {
                lat: lat,
                lng: lng
            },
            clickedLat: 0,
            clickedLng: 0,
            showclikedmarker: false,
            showActiveWorkerINfo: true,
            loginUser: "",
            next: false,
            previous: false
        };
        this.data = {};
        this.google = "";
        this.flightPath = "";
        this.path       = [];
        this.poly       = [];
        this.service    = "";
        this.socketValues = this.socketValues.bind(this);
        this.createMarker = this.createMarker.bind(this);
        this.getHistory = true;
    }
    componentDidMount() {
        $('#overlaySidenav').find("a").removeClass("active")
        $('#mapview').addClass("active");
        $("#loading-block").css("display", "block");
        if ((screen.width === 1024 && screen.height === 768) || (screen.width === 768 && screen.height === 1024)) {
            this.mapHeight = "calc(100vh - 211px)";
        }
        else {
            this.mapHeight = messages.MAPHEIGHT;
        }
        this.loadMap();
    }
    componentWillUnmount() {
        this.timerID && clearInterval(this.timerID);
        this.timerID = false;

        if(!localStorage.getItem("selectDateTime")){
            localStorage.setItem("selectDateTime", moment());
            localStorage.setItem("startDate", moment.utc().startOf('day').unix());
            localStorage.setItem("endDate", moment.utc().endOf('day').unix());
            this.StartDate = moment.utc().startOf('day').unix();
            this.EndDate = moment.utc().endOf('day').unix();
        }else{
            this.StartDate = localStorage.getItem("startDate");
            this.EndDate = localStorage.getItem("endDate");
        }
    }
    loadMap() {
        if (this.props && this.props.google) {
            $("#map").css("height", this.mapHeight); //messages.MAPHEIGHT);
            $("#map").css("display", "block");
            $("#noMap").css("display", "none");
            // var minZoomLevel = 2; // MIN ZOOM LEVEL FOR MAP
            /*Maintain Google Map */
            this.google = this.props.google;
            /*Maintain Google Map */
            /* google is available*/
            const { google } = this.props;
            const maps = google.maps;
            const mapRef = this.refs.map;
            const node = ReactDOM.findDOMNode(mapRef);
            /*Set control option position */
            let _mapTypeControlOptions = {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.TOP_RIGHT
            };
            /*Set control option position */
            /*  Set location and zoom level same as last session of the user */
            let zoom = 10;
            var latlng = new google.maps.LatLng(30.142149925231934, 77.29326546192169);
            const mapConfig = Object.assign({}, {
                center: latlng,
                zoom: zoom,
                streetViewControl: false,
                mapTypeControlOptions: _mapTypeControlOptions,
                // mapTypeId: firstMapView
            })
            this.map = new maps.Map(node, mapConfig);

            /* initialize map bounds */
            // this.bounds = new google.maps.LatLngBounds();
            this.markerBounds = new google.maps.LatLngBounds();

            this.google.maps.event.addListener(this.map, 'bounds_changed', function() {
                    this.bounds =  this.map.getBounds();
                    //do whatever you want with those bounds
            }.bind(this));
            
            /* initialize map bounds */
            
            /* Poly lines code */
            this.service = new google.maps.DirectionsService()
            /* Poly lines code */

            /* Direction display */
            /* var directionsDisplay = new google.maps.DirectionsRenderer;
            directionsDisplay.setMap(this.map); */
            /* Direction display */
            setTimeout(() => {
                // this.getHistoricalLocations()
                this.socketValues();
            }, 1000);
        }
        else {
            this.socketValues();
            $("#map").css("height", "0");
            $("#map").css("display", "none");
            var Internetstatus = navigator.onLine;
            if (!Internetstatus) {
                $("#noMap").css("display", "block");
            }
        }
    }
    socketValues = () => {
        $("#loading-block").css("display", "none");
        this.socket.on('chat message', function (msg) {
            this.data = JSON.parse(msg);
            var _lat = this.data["lat"];
            var _long = this.data["long"];
            this.userData = { "lat": _lat, "long": _long, "userId": this.data["userId"] };
            this.createMarker();
            //this.transition();
        }.bind(this));
        // this.socket.on('chat history', function(msg){
		// 	if(this.getHistory){
		// 		this.displayPreviousMarkers(msg);
		// 		this.getHistory = false;
		// 	}
		// }.bind(this));
    }
    displayPreviousMarkers(msg){
        var strokeColor = '#1919FF'
        msg = JSON.parse(msg);
        var l = msg.length;
        for(var j=0;j<l;j++) {
            try
            {
                this.userData = { "lat":msg[j]["lat"], "long":msg[j]["long"], "userId" : msg[j]["uid"], "datetime" : msg[j]["datetime"], "start_lat" : msg[j]["start-lat"]};
                this.data = this.userData;
                this.createMarker();
                this.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
            }
            catch(Exception){
                console.error("exception occured");
            }
            finally{
            }
        }
    }

    createMarker() {
        var UserID = this.userData["userId"];
        var markertime  = this.data["datetime"];
        markertime = parseInt(markertime) * 1000;
        var date = new Date(markertime);
        var latlng = new google.maps.LatLng(this.userData["lat"], this.userData["long"]);
        var Userindex = _.findIndex(this.markerarray, ['UserID', UserID]);
        if(Userindex > -1){
            this.markers[Userindex].setPosition(latlng);
            var originInfo  = this.path[Userindex].getAt(this.path[Userindex].getLength() - 1)
            this.service.route({ origin: originInfo, destination: latlng, travelMode: this.google.maps.DirectionsTravelMode.DRIVING }, function(result, status) {
                if (status == this.google.maps.DirectionsStatus.OK) {
                    for(var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                        this.path[Userindex].push(result.routes[0].overview_path[i]);
                    }
                }
            }.bind(this));

            var newposition = {lat: latlng.lat(), lon: latlng.lng()};
            var difference = parseInt(geodist(this.markerarray[Userindex].Start, newposition,{exact: true, unit: 'meters'}));
            if(difference > 60){
                this.marker1 = new this.google.maps.Marker({
                    position: latlng,
                    map: this.map,
                    markertime:markertime,
                    title: ""+UserID+"-"+date+""
                });
                this.marker1.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
                //this.marker1.setMap(this.map);
                this.markerarray[Userindex].Start = {"lat":latlng.lat(),"lon":latlng.lng()}
            }
            this.markerarray[Userindex].UserPosition.push(latlng);
        }else{
            this.marker = new this.google.maps.Marker({
                id:UserID,
                position: latlng,
                map: this.map,
                markertime:markertime,
                title: ""+UserID+"-"+date+""
            });
            this.markers.push(this.marker);
            this.marker1 = new this.google.maps.Marker({
                position: latlng,
                map: this.map,
                markertime:markertime,
                title: ""+UserID+"-"+date+""
            });
            this.marker1.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
            //this.marker1.setMap(map);
            this.setmarkerOnMap(UserID,this.map,markertime,latlng);
        }
    }

    setmarkerOnMap(userid,map,markertime,latlng){
        if(this.markers){
            for (var i = 0; i < this.markers.length; i++) {
                 var UserNotExist = _.findIndex(this.markerarray, ['UserID', this.markers[i].id]);
                 if(UserNotExist == -1){
                    this.markers[i].setMap(map);
                    this.poly[i] = new google.maps.Polyline({ map: this.map });
                    this.markerarray.push({"UserID":userid,"UserPosition":[latlng],"Start":{"lat":latlng.lat(),"lon":latlng.lng()}});
                    this.path[i] = new google.maps.MVCArray();
                    this.path[i].push(latlng);
                    if(this.markerarray[i].UserPosition.length === 1) {
                        this.poly[i].setPath(this.path[i]);
                    }
                 }
            }  
        }
    }
    getHistoricalLocations(){
        var userInfo;
        try {
            userInfo = {"userId" : 1, "start" : Number(this.StartDate), "end" : Number(this.EndDate)};
            this.socket.emit('get history', userInfo);
        }
        catch(Exception){
        }
        finally {
        }
    }

    render() {
        let firstMapView = localStorage.getItem("currentMapView");
        if (!firstMapView) {
            firstMapView = messages.MAPTYPEID;
        }
        return (
            <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12 no-padding">
                    <main>
                        <div id="map" ref="map">
                            <Map google={this.props.google} clickableIcons={false} mapType={firstMapView} streetViewControl={false}>
                            </Map>
                        </div>
                        <div id="noMap" className="DisplayNone noInternet">
                            <center> {messages.NoInternetAvailable} </center>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

}
MapContainer.propTypes = {
    google: PropTypes.object,
    zoom: PropTypes.number,
    initialCenter: PropTypes.object,
    centerAroundCurrentLocation: PropTypes.bool
}
MapContainer.defaultProps = {
    zoom: messages.GOOGLEMAPZOOMLEVEL,
    // Honeywell, by default
    initialCenter: {
        lat: messages.DefaultLat,
        lng: messages.DefaultLong
    },
    centerAroundCurrentLocation: false
}
export default GoogleApiWrapper({
    apiKey: (messages.GOOGLEAPIKEY),
    // version: "3.33"
})(MapContainer)