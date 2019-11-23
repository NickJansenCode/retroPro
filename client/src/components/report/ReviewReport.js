import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { submitReport } from "../../actions/submitReportActions";
import axios from 'axios'

class ReviewReport extends Component {

    constructor() {
        super();
        this.state = {
            reportedName: "",
            reportedPicture: "",
            reporterName: "",
            category: "",
            date: "",
            text: "",
        };
    }

    componentDidMount() {
        const reportID = this.props.location.state == undefined ? "" : this.props.location.state.reportID

        if (reportID != "") {

            // Call API to get report information. //
            axios.get("/api/reports/getReport/" + reportID)
                .then(res => {
                    this.setState({
                        reportedName: res.data.reportedName,
                        reportedPicture: res.data.reportedPicture,
                        reporterName: res.data.reporterName,
                        category: res.data.category,
                        date: res.data.timestamp,
                        text: res.data.text
                    })
                })
        }
        else {
            this.props.history.push("/admin")
        }
    }

    banUser = e => {
        e.preventDefault();

        axios.post("/api/reports/banUser", { name: this.state.reportedName })
            .then(res => {
                this.props.history.push("/admin");
            })
    }

    dismissReport = e => {
        e.preventDefault();

        axios.post("/api/reports/dismissReport", { reportID: this.props.location.state.reportID })
            .then(res => {
                this.props.history.push("/admin");
            })
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <h1>Review User Report</h1>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <h3>{this.state.reportedName}</h3>
                        <img src={this.state.reportedPicture} height="100vh" />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <p className="text-muted">Reported by {this.state.reporterName} on {this.state.date.slice(0, this.state.date.indexOf("T"))} for {this.state.category} </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <h2>Report Text</h2>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        {this.state.text}
                    </div>
                    <hr />
                </div>
                <div className="col-12 row">
                    <button className="btn btn-danger col-s-12 mt-2 col-md-5" onClick={this.banUser}>Ban User</button>
                    <button className="btn btn-primary col-s-12 mt-2 col-md-5 offset-md-2" onClick={this.dismissReport}>Dismiss Report</button>
                </div>

            </div >
        )
    }
}

ReviewReport.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
)(withRouter(ReviewReport));