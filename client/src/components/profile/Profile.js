import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

class Profile extends Component {
    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };
    render() {
        const { user } = this.props.auth;
        return (
            <div className="container">
                <div className="row">
                    <div className="col-s-12 justify-content-center">
                        <h4>
                            <b>Hey there,</b> {user.name.split(" ")[0]}
                            <p className="flow-text grey-text text-darken-1">
                                You are logged into a full-stack{" "}
                                <span style={{ fontFamily: "monospace" }}>MERN</span> app 👏
              </p>
                        </h4>
                        <button
                            style={{
                                width: "150px",
                                borderRadius: "3px",
                                letterSpacing: "1.5px",
                                marginTop: "1rem"
                            }}
                            onClick={this.onLogoutClick}
                            className="btn btn-primary"
                        >
                            Logout
            </button>
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