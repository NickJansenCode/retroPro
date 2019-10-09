import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import axios from "axios";
import landing from "../../img/landing.jpg"
import defaultProfilePicture from "../../img/defaultProfilePicture.png"
import base64 from "base64-img"
import { relative } from "path";

class Profile extends Component {
    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    constructor(){
        super();
        this.state = {
            "user": "",
        }
    }

    componentDidMount(){
        
        axios
        .get(`/api/users/getByName/${this.props.match.params.username}`)
        .then(res => {
            console.log(res);
            this.setState({
                "user" : res.data.user,
            });
        });
    }


    render() {
        const { user } = this.props.auth;
        return(
            <div className="container-fluid">
                <div className="row pt-3 align-items-end" style={{backgroundColor: "gray"}}>
                    <div className="col-2">
                        <img height="250px" style={{border: "2px solid black", borderRadius: "5px"}} src={this.state.user.profilepicture} alt="Profile Picture"/>
                    </div>
                    <div className="col-2">
                        <h1>{this.state.user.name}</h1>
                    </div>
                    <div className="col-8">
                        <ul className="nav nav-tabs float-right">
                            <li className="nav-item">
                                <a className="nav-link active" data-toggle="tab" href="#overview">Overview</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="tab" href="#collection">Collection</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="tab" href="#wishlist">Wishlist</a>
                           </li>
                           <li className="nav-item">
                                <a className="nav-link" data-toggle="tab" href="#comments">Comments</a>
                           </li>
                           <li className="nav-item">
                                <a className="nav-link" data-toggle="tab" href="#friends">Friends</a>
                           </li>
                        </ul>
                    </div>
                </div>
                <div className="container">
                <div className="row">
                    <div className="tab-content">
                        <div className="tab-pane container active" id="overview">
                            <h3>Overview Menu</h3>
                        </div>
                        <div className="tab-pane container fade" id="collection">
                            <h3>Collection Menu</h3>
                        </div>
                        <div className="tab-pane container fade" id="wishlist">
                            <h3>Wishlist Menu</h3>
                        </div>
                        <div className="tab-pane container fade" id="comments">
                            <h3>Comments Menu</h3>
                        </div>
                        <div className="tab-pane container fade" id="friends">
                            <h3>Friends Menu</h3>
                        </div>
                    </div>
                </div>
            </div>
            
            </div>
        );
    }
}

Profile.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(Profile);