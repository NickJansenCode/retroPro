import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import GoogleMapReact from "google-map-react"
import { connect } from "react-redux";


class FindStore extends Component {

    constructor(props) {
        super(props);
        this.state = {
            query: "",
            userLat: 43.2387,
            userLong: -79.8881,
            mapsLoaded: false,
            show: false,
            markers: [],
            errors: {}
        };
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            position => {
                this.setState({ userLat: position.coords.latitude, userLong: position.coords.longitude });
            },
            error => console.log(error)
        );
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    };

    apiHasLoaded = (({ map, maps }) => {
        this.setState({
            mapsLoaded: true,
            map,
            maps,
            infowindow: new maps.InfoWindow(),
            placesService: new maps.places.PlacesService(map),
        });

        var address = { lat: this.state.userLat, lng: this.state.userLong };
        var service = this.state.placesService

        service.nearbySearch({
            location: address,
            radius: 10000,
            types: ['store'],
            keyword: 'video game'
        }, this.callback);
    });

    onChange = ({ center }) => {
        if (this.state.mapsLoaded) {
            var address = { lat: center.lat, lng: center.lng };
            var service = this.state.placesService

            service.nearbySearch({
                location: address,
                radius: 10000,
                types: ['store'],
                keyword: 'video games'
            }, this.callback);
        }
    }

    callback = (results, status) => {
        for (var i = 0; i < this.state.markers.length; i++) {
            this.state.markers[i].setMap(null)
        }

        this.state.markers = []
        for (var i = 0; i < results.length; i++) {
            this.renderMarkers(results[i]);
        }
    }

    renderMarkers = (place) => {
        let marker = new this.state.maps.Marker({
            position: { lat: parseFloat(place.geometry.location.lat()), lng: parseFloat(place.geometry.location.lng()) },
            map: this.state.map,
            title: place.name
        });

        marker.addListener('click', () => {
            this.state.infowindow.setContent(
                `
                <div className="row justify-content-center">
                    <h6>${place.name}</h6>
                </div>
                <div className="row">
                    <div className="col-12">
                        ${place.rating}/5 (${place.user_ratings_total} reviews)
                    </div>    
                </div>
                <div className="row">
                    <div className="col-12">
                        ${place.vicinity}
                    </div>    
                </div>
                `
            );
            this.state.infowindow.open(this.state.map, marker);
        });

        let markers = this.state.markers
        markers.push(marker)

        this.setState({
            markers: markers
        })
    }

    onChangeQuery = e => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    search = e => {
        e.preventDefault()
        const map = this.state.map;

        let coords = this.state.placesService.findPlaceFromQuery({ query: this.state.query, fields: ['name', 'geometry'] }, function (results, status) {
            if (status === "OK") {
                map.setCenter(results[0].geometry.location);
            }
        });
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <h1>Find A Store</h1>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 col-md-11">
                        <input type="text" onChange={this.onChangeQuery} value={this.state.query} id="query" className="form-control" placeholder="Enter a city name..." />
                    </div>
                    <div className="col-sm-12 col-md-1">
                        <button className="btn btn-success w-100" onClick={this.search}> Search</button>
                    </div>
                </div>
                <div className="row mt-5" style={{ height: "75vh" }}>
                    <div className="col-12">
                        <GoogleMapReact
                            bootstrapURLKeys={{ key: "AIzaSyAKGIZPThkBnKucrtImaO9Yf8rd4PVNksE", libraries: ['places'] }}
                            defaultCenter={{
                                lat: this.state.userLat,
                                lng: this.state.userLong
                            }}
                            defaultZoom={12}
                            onGoogleApiLoaded={this.apiHasLoaded}
                            onChange={this.onChange}
                            places={this.state.markers}
                            yesIWantToUseGoogleMapApiInternals
                        />
                    </div>

                </div>
            </div >
        )
    }
}

FindStore.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
)(withRouter(FindStore));