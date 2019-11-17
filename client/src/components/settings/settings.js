import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logoutUser } from "../../actions/authActions";
import Select from 'react-select'
import Axios from "axios";

class Settings extends Component {

    constructor() {
        super()
        this.state = {
            privateAccount: false,
            tagInput: "",
            tags: [],
            editing: false,
        }
    }

    componentDidMount() {
        Axios.get("/api/users/getSettings/" + this.props.auth.user.id).then(res => {
            this.setState({
                privateAccount: res.data.privateAccount,
                tags: res.data.tags,
            })
        })
    }

    onChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        });
    };

    startEditing = e => {
        e.preventDefault()

        this.setState({
            editing: true
        })
    }

    saveSettings = e => {
        e.preventDefault()

        Axios.post("/api/users/saveSettings",
            {
                privateAccount: this.state.privateAccount,
                userID: this.props.auth.user.id
            })
            .then(res => {
                this.setState({
                    editing: false
                })
            })
    }

    togglePrivate = e => {
        let opposite = !this.state.privateAccount
        this.setState({
            privateAccount: opposite
        })
    }

    addTag = e => {
        e.preventDefault()
        if (this.state.tagInput.trim() == "") {
            this.setState({
                tagError: "Tag field is required!"
            })
        }
        else {
            Axios.post("/api/users/addTag", { userID: this.props.auth.user.id, tag: this.state.tagInput })
                .then(() => {
                    let newTag = [...this.state.tags, this.state.tagInput]
                    this.setState({
                        tagError: "",
                        tags: newTag,
                        tagInput: ""
                    })
                }

                )
        }
    }

    removeTag = tag => e => {
        e.preventDefault()

        Axios.post("/api/users/removeTag", { userID: this.props.auth.user.id, tag: tag })
            .then(() => {

                let newTag = this.state.tags.filter(word => word != tag)
                this.setState({
                    tags: newTag,
                })
            }

            )

    }

    render() {
        return (
            <div className="container">
                <h1>Settings</h1>
                <button className="btn btn-primary" disabled={this.state.editing} onClick={this.startEditing}><i className="fas fa-edit" /></button>
                <button className="btn btn-success ml-3" disabled={!this.state.editing} onClick={this.saveSettings}><i className="fas fa-check" /></button>
                <hr />

                <div className="row">
                    <div className="col-12">
                        <h2>Privacy</h2>
                        <hr />
                    </div>
                </div>


                <div class="form-group row">
                    <div className="col-xs-6 col-md-2"><h5>Private Account</h5></div>
                    <div className="col-xs-6 col-md-6">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="privateAccount" checked={this.state.privateAccount} onClick={this.togglePrivate} disabled={!this.state.editing} />
                        </div>
                    </div>
                </div>



                <div className="row">
                    <div className="col-12">
                        <h2>Tags</h2>
                        <hr />
                    </div>
                </div>

                <div className="form-group row">
                    <h5 className="col-xs-12 col-md-2">Tags</h5>
                    <input type="text" className="form-control col-xs-12 col-md-6" id="tagInput" value={this.state.tagInput} onChange={this.onChange} />
                    <button className="btn btn-success col-xs-12 col-md-2 ml-2" onClick={this.addTag}>Add Tag</button>
                    <span className="text-danger ml-2">
                        {this.state.tagError}
                    </span>
                </div>

                {this.state.tags.length == 0 &&
                    <p className="text-muted">
                        Add some tags!
                    </p>
                    ||
                    <ul>
                        {this.state.tags.map(tag => {
                            return (
                                <li className="mt-2">
                                    {tag} <button className="btn btn-danger" onClick={this.removeTag(tag)}>X</button>
                                </li>
                            )
                        })}
                    </ul>

                }

            </div >
        )
    }
}

Settings.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(withRouter(Settings));