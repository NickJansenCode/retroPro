import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import StarRatingComponent from "react-star-rating-component";
import Axios from "axios";

class List extends Component {

    constructor() {
        super();
        this.state = {
            userName: "",
            listName: "",
            listDescription: "",
            items: [],
        };
    }

    componentDidMount() {
        const listID = this.props.location.state == undefined ? "" : this.props.location.state.listID
        const userName = this.props.location.state == undefined ? "" : this.props.location.state.userName

        if (listID !== "") {
            Axios.get("/api/users/getList/" + listID)
                .then(res => {
                    this.setState({
                        userName: userName,
                        listName: res.data.listName,
                        listDescription: res.data.listDescription,
                        items: res.data.items
                    })
                })
        }
        else {
            this.props.history.push("/")
        }
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <h1>View List</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <Link to={"/Profile/" + this.state.userName} className="btn btn-primary">Return To Profile</Link>
                        <hr />
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="form-group row">
                            <label className="col-xs-12 col-md-2 col-form-label">
                                List Name
                            </label>
                            <div className="col-xs-12 col-md-10">
                                {this.state.listName}
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-xs-12 col-md-2 col-form-label">
                                List Owner
                            </label>
                            <div className="col-xs-12 col-md-10">
                                {this.state.userName}
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-xs-12 col-md-2 col-form-label">
                                Description
                            </label>
                            <div className="col-xs-12 col-md-10">
                                {this.state.listDescription}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <h3>Items</h3>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    {
                        this.state.items.map(game => {
                            let gameLink = "/Game/" + game.name;
                            let gameAverage = Math.round((game.reviews.reduce((total, next) => total + next.rating, 0) / game.reviews.length) * 2) / 2;

                            return (
                                <div className="col-xs-12 col-sm-6 col-md-3 mt-3">
                                    <Link to={gameLink}>
                                        <div className="row justify-content-center">
                                            <img
                                                className="col-xs-12"
                                                height="150vh"
                                                src={game.coverart}
                                            ></img>
                                        </div>
                                        <div className="row text-center">
                                            <div className="col-12">
                                                {game.name}
                                            </div>
                                        </div>
                                    </Link>
                                    <div className="row justify-content-center">

                                        <StarRatingComponent
                                            name="gameRating"
                                            starCount={5}
                                            starColor="#ffb400"
                                            emptyStarColor="#ffb400"
                                            value={gameAverage}
                                            editing={false}
                                            renderStarIcon={(
                                                index,
                                                value
                                            ) => {
                                                return (
                                                    <span>
                                                        <i
                                                            className={
                                                                index <=
                                                                    value
                                                                    ? "fas fa-star"
                                                                    : "far fa-star"
                                                            }
                                                        />
                                                    </span>
                                                );
                                            }}
                                            renderStarIconHalf={() => {
                                                return (
                                                    <span>
                                                        <span style={{ position: "absolute" }}>
                                                            <i className="far fa-star" />
                                                        </span>
                                                        <span>
                                                            <i className="fas fa-star-half" />
                                                        </span>
                                                    </span>
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div >
        )
    }
}

List.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
)(withRouter(List));