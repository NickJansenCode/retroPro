import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { promoteUser, banUser, deleteUser } from "../../actions/adminActions";
import axios from 'axios'

class Admin extends Component {

    constructor() {
        super();
        this.state = {
            errors: {},
            banRemoveName: "",
            promoteName: "",
            reports: [],
            submissions: []
        };
    }

    /**
     * On component mount, load active reports and active game submissions.
     */
    componentDidMount() {

        // If someone that isn't an admin tries to access this url, redirect them to the site home. //
        if (this.props.auth.user.role != "Admin") {
            this.props.history.push("/")
        }

        // Load active reports for viewing. //
        axios.get("/api/reports/getActiveReports")
            .then(res => {
                this.setState({
                    reports: res.data
                })
            })

        // Load active submissions for viewing. //
        axios.get("/api/games/getSubmissions")
            .then(res => {
                this.setState({
                    submissions: res.data
                })
            })
    }

    /**
     * If the page receives new error props from an API call, set the current state's errors
     * to be the new error values.
     * @param {*} nextProps The next props that the page is receiving.
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    };

    onChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    /**
     * Makes an API call to ban a user.
     */
    banUser = e => {
        e.preventDefault();
        this.props.banUser({ name: this.state.banRemoveName })
    }

    /**
     * Makes an API call to delete a user.
     */
    deleteUser = e => {
        e.preventDefault();
        this.props.deleteUser({ name: this.state.banRemoveName })
    }

    /**
     * Makes an API call to promote a user account to administrator.
     */
    promoteUser = e => {
        e.preventDefault();
        this.props.promoteUser({ name: this.state.promoteName })
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <h1>Administration</h1>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-s-6 col-md-3">
                        <div className="row">
                            <div className="col-12">
                                <h3>Reports</h3>
                                <hr />
                            </div>
                        </div>

                        {
                            this.state.reports.map(report => {
                                let dateString = report.timestamp.slice(0, report.timestamp.indexOf("T"))
                                return (
                                    <div className="row mt-2">
                                        <div className="col-s-12 col-md-4">
                                            <img height="75vh" src={report.reported.profilepicture} />
                                        </div>
                                        <div className="col-s-12 col-md-8">
                                            <div className="row">
                                                <h6 className="col-12">{report.reported.name}</h6>
                                            </div>
                                            <div className="row">
                                                <p className="text-muted col-12">Reported on {dateString} By: {report.reporter.name} for {report.reportCategory.name}</p>
                                            </div>
                                            <hr />
                                            <div className="row">
                                                <div className="col-12">
                                                    Report Text: {report.text.substring(0, 50)}
                                                    {report.text.length > 50 ? "..." : ""}
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="row">
                                                <Link className="btn btn-primary col-12" to={{
                                                    pathname: "/reviewreport",
                                                    state: {
                                                        reportID: report._id
                                                    }
                                                }}>
                                                    Review Report
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })

                        }


                    </div>
                    <div className="col-xs-12 col-s-6 col-md-3">
                        <div className="row">
                            <div className="col-12">
                                <h3>Submissions</h3>
                            </div>
                        </div>
                        {
                            this.state.submissions.map(submission => {
                                return (
                                    <div className="row mt-2">
                                        <div className="col-s-12 col-md-4">
                                            <img height="100vh" width="75vw" src={submission.coverart} />
                                        </div>
                                        <div className="col-s-12 col-md-8">
                                            <div className="row">
                                                <h6 className="col-12">{submission.name}</h6>
                                            </div>
                                            <hr />
                                            <div className="row">
                                                <div className="col-12">
                                                    {submission.description.substring(0, 50)}
                                                    {submission.description.length > 50 ? "..." : ""}
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="row">
                                                <Link className="btn btn-primary col-12" to={{
                                                    pathname: "/reviewsubmission",
                                                    state: {
                                                        gameID: submission._id
                                                    }
                                                }}>
                                                    Review Submission
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )

                            })
                        }
                    </div>
                    <div className="col-xs-12 col-s-6 col-md-3">
                        <div className="row">
                            <div className="col-12">
                                <h3>Ban/Remove Accounts</h3>
                            </div>
                        </div>

                        <div className="col-12 row mt-2">
                            <input type="text" className="form-control" id="banRemoveName" onChange={this.onChange} value={this.banRemoveName} placeholder="Enter a user name..." />
                            <span className="text-danger">
                                {this.state.errors.banRemoveName}
                            </span>
                        </div>

                        <div className="col-12 row">
                            <button className="btn btn-danger col-s-12 mt-2 col-md-5" onClick={this.banUser}>Ban User</button>
                            <button className="btn btn-danger col-s-12 mt-2 col-md-5 offset-md-2" onClick={this.deleteUser}>Delete User</button>
                        </div>

                    </div>
                    <div className="col-xs-12 col-s-6 col-md-3">
                        <div className="row">
                            <div className="col-12">
                                <h3>Promote Accounts</h3>
                            </div>
                        </div>

                        <div className="col-12 row mt-2">
                            <input type="text" className="form-control" id="promoteName" onChange={this.onChange} value={this.promoteName} placeholder="Enter a user name..." />
                            <span className="text-danger">
                                {this.state.errors.promoteName}
                            </span>
                        </div>

                        <div className="col-12 row">
                            <button className="btn btn-success mt-2 col-12" onClick={this.promoteUser}>Promote User</button>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

Admin.propTypes = {
    promoteUser: PropTypes.func.isRequired,
    banUser: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { promoteUser, banUser, deleteUser }
)(withRouter(Admin));