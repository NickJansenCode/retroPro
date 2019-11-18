import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { submitGame } from "../../actions/submitGameActions";
import axios from 'axios'
import IsImageUrl from "is-image-url";

class SubmitGame extends Component {

    constructor() {
        super();
        this.state = {
            name: "",
            platform: "",
            coverArt: "",
            description: "",
            platformOptions: [],
            errors: {},
        };
    }

    componentDidMount() {
        axios.get("/api/platforms")
            .then(res => {
                let platforms = res.data.map(platform => {
                    return { value: platform._id, label: platform.name }
                })

                this.setState({
                    platform: platforms[0].value,
                    platformOptions: platforms
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

    submitGame = e => {
        e.preventDefault()

        let newGameData = {
            year: this.state.year,
            name: this.state.name,
            description: this.state.description,
            coverart: this.state.coverArt,
            platform: this.state.platform,
        }

        this.props.submitGame(newGameData, this.props.history);
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <h1>Submit New Game</h1>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-md-3">
                        {
                            IsImageUrl(this.state.coverArt) &&
                            (
                                <img src={this.state.coverArt} />
                            )
                            ||
                            <img src="https://cdn.shortpixel.ai/client/q_glossy,ret_img,w_768/https://www.testingxperts.com/wp-content/uploads/2019/02/placeholder-img-768x576.jpg" />
                        }
                    </div>
                    <div className="col-xs-12 col-md-9">
                        <form>
                            <div className="form-group row">
                                <label className="col-xs-12 col-md-2 col-form-label">
                                    Game Name
                                </label>
                                <div className="col-xs-12 col-md-10">
                                    <input type="text" className="form-control" id="name" value={this.state.name} onChange={this.onChange} placeholder="Enter a name..." />
                                    <span className="text-danger">
                                        {this.state.errors.name}
                                    </span>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xs-12 col-md-2 col-form-label">
                                    Cover Art URL
                                </label>
                                <div className="col-xs-12 col-md-10">
                                    <input type="text" className="form-control" id="coverArt" value={this.state.coverArt} onChange={this.onChange} placeholder="Enter a cover art url..." />
                                    <span className="text-danger">
                                        {this.state.errors.coverart}
                                    </span>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xs-12 col-md-2 col-form-label">
                                    Year
                                </label>
                                <div className="col-xs-12 col-md-10">
                                    <input type="number" className="form-control" id="year" value={this.state.year} onChange={this.onChange} placeholder="Enter a release year..." />
                                    <span className="text-danger">
                                        {this.state.errors.year}
                                    </span>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xs-12 col-md-2 col-form-label">
                                    Platform
                                </label>
                                <div className="col-xs-12 col-md-10">
                                    <select className="form-control" value={this.state.platform} id="platform" onChange={this.onChange}>
                                        {
                                            this.state.platformOptions.map(platform => {
                                                return (<option value={platform.value} label={platform.label} />)
                                            })
                                        }
                                    </select>
                                    <span className="text-danger">
                                        {this.state.errors.platform}
                                    </span>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xs-12 col-md-2 col-form-label">
                                    Description
                                </label>
                                <div className="col-xs-12 col-md-10">
                                    <textarea rows="10" className="form-control" id="description" value={this.state.description} onChange={this.onChange} placeholder="Enter a Description..." required />
                                    <span className="text-danger">
                                        {this.state.errors.description}
                                    </span>
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-10 offset-md-2">
                                    <button className="btn btn-primary btn-lg" onClick={this.submitGame}>
                                        Submit New Game
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

SubmitGame.propTypes = {
    submitGame: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { submitGame }
)(withRouter(SubmitGame));