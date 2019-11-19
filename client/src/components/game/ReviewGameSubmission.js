import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { approveSubmission, rejectSubmission } from "../../actions/adminActions";
import axios from 'axios'

class ReviewGameSubmission extends Component {

    constructor() {
        super();
        this.state = {
            name: "",
            category: "",
            text: "",
        };
    }

    componentDidMount() {
        const gameID = this.props.location.state == undefined ? "" : this.props.location.state.gameID

        if (gameID != "") {

            // Call API to get report information. //
            axios.get("/api/games/getSubmission/" + gameID)
                .then(res => {
                    this.setState({
                        coverart: res.data.coverart,
                        name: res.data.name,
                        platform: res.data.platform,
                        year: res.data.year,
                        description: res.data.description
                    })
                })
        }
        else {
            this.props.history.push("/admin")
        }
    }

    rejectSubmission = e => {
        e.preventDefault()
        this.props.rejectSubmission(this.props.location.state.gameID, this.props.history)
    }

    approveSubmission = e => {
        e.preventDefault()
        //this.props.approveSubmission(this.props.location.state.gameID, this.props.history)
        this.props.approveSubmission(this.props.location.state.gameID, this.props.history)
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <h1>Review Game Submission</h1>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <div className="col-s-12 col-md-4 text-center">
                        <img
                            style={{ border: "2px solid black", height: "300px" }}
                            src={this.state.coverart}
                            alt="Game Cover Art"
                        />
                        <h3>{this.state.name}</h3>
                        <span>
                            {this.state.platform}, {this.state.year}
                        </span>
                        <div className="mt-2">
                            <button onClick={this.approveSubmission} className="btn btn-primary">Approve Submission</button>
                        </div>
                        <div className="mt-2">
                            <button onClick={this.rejectSubmission} className="btn btn-danger">Reject Submission</button>
                        </div>
                    </div>
                    <div className="col-s-12 col-md-8">
                        <div className="row">
                            <div className="col-12">
                                <h3>Description</h3>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                {this.state.description}
                            </div>
                        </div>
                    </div>
                </div>

            </div >
        )
    }
}

ReviewGameSubmission.propTypes = {
    rejectSubmission: PropTypes.func.isRequired,
    approveSubmission: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { rejectSubmission, approveSubmission }
)(withRouter(ReviewGameSubmission));