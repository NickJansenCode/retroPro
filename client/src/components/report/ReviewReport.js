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
            name: "",
            category: "",
            text: "",
        };
    }

    componentDidMount() {
        const reportID = this.props.location.state == undefined ? "" : this.props.location.state.reportID

        if (reportID != "") {

            // Call API to get report information. //

        }
        else {
            this.props.history.push("/admin")
        }
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
                    <div className="col-xs-12 col-md-9">

                    </div>
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