import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { submitReport } from "../../actions/submitReportActions";
import axios from 'axios'

class ReportUser extends Component {

    constructor() {
        super();
        this.state = {
            name: "",
            category: "",
            text: "",
            fromProfile: false,
            categoryOptions: [],
            errors: {}
        };
    }

    componentDidMount() {
        const name = this.props.location.state == undefined ? "" : this.props.location.state.name

        if (name != "") {
            this.setState({
                name: name,
                fromProfile: true
            })
        }

        axios.get("/api/reports/getCategories")
            .then(res => {
                let categories = res.data.map(category => {
                    return { value: category._id, label: category.name }
                })

                this.setState({
                    category: categories[0].value,
                    categoryOptions: categories
                })
            })
    }

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

    submitReport = e => {
        e.preventDefault()

        let newReportData = {
            reporter: this.props.auth.user.id,
            reported: this.state.name,
            category: this.state.category,
            timestamp: new Date(),
            text: this.state.text
        }

        this.props.submitReport(newReportData, this.props.history);
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <h1>Report User</h1>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-md-9">
                        <form>
                            <div className="form-group row">
                                <label className="col-xs-12 col-md-2 col-form-label">
                                    User Name
                                </label>
                                <div className="col-xs-12 col-md-10">
                                    <input type="text" className="form-control" id="name" value={this.state.name} disabled={this.state.fromProfile} onChange={this.onChange} />
                                    <span className="text-danger">
                                        {this.state.errors.name}
                                    </span>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xs-12 col-md-2 col-form-label">
                                    Report Category
                                </label>
                                <div className="col-xs-12 col-md-10">
                                    <select className="form-control" value={this.state.category} id="category" onChange={this.onChange}>
                                        {
                                            this.state.categoryOptions.map(category => {
                                                return (<option value={category.value} label={category.label} />)
                                            })
                                        }
                                    </select>
                                    <span className="text-danger">
                                        {this.state.errors.category}
                                    </span>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xs-12 col-md-2 col-form-label">
                                    Report Text
                                </label>
                                <div className="col-xs-12 col-md-10">
                                    <textarea rows="10" className="form-control" id="text" value={this.state.text} onChange={this.onChange} placeholder="Enter a Description..." required />
                                    <span className="text-danger">
                                        {this.state.errors.text}
                                    </span>
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-10 offset-md-2">
                                    <button className="btn btn-primary btn-lg" onClick={this.submitReport}>
                                        Submit Report
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

            </div >
        )
    }
}

ReportUser.propTypes = {
    submitReport: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { submitReport }
)(withRouter(ReportUser));