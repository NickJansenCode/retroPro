import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createList } from "../../actions/listActions"
import Axios from "axios";

class CreateList extends Component {

    constructor() {
        super();
        this.state = {
            name: "",
            description: "",
            selectedGames: [],
            collection: [],
            errors: {},
        };
    }

    componentDidMount() {
        const userID = this.props.location.state == undefined ? "" : this.props.location.state.userID

        if (userID !== "") {
            Axios.get("/api/users/loadCollection/" + userID)
                .then(res => {
                    this.setState({
                        collection: res.data
                    })
                })
        }
        else {
            this.props.history.push("/")
        }
    }

    onChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    };

    addToList = (id) => e => {
        e.preventDefault()

        let selectedGames = this.state.selectedGames;
        let collection = this.state.collection;

        selectedGames.push(collection.filter(game => {
            return game._id == id
        })[0])

        collection = collection.filter(game => {
            return game._id != id
        })


        this.setState({
            selectedGames: selectedGames,
            collection: collection
        })
    }

    removeFromList = (id) => e => {
        e.preventDefault()

        let selectedGames = this.state.selectedGames;
        let collection = this.state.collection;

        collection.push(selectedGames.filter(game => {
            return game._id == id
        })[0])

        selectedGames = selectedGames.filter(game => {
            return game._id != id
        })


        this.setState({
            selectedGames: selectedGames,
            collection: collection
        })
    }

    saveList = e => {
        e.preventDefault()

        let listData = {
            listName: this.state.name,
            listDescription: this.state.description,
            gameIDs: this.state.selectedGames.map(game => {
                return game._id
            }),
            userID: this.props.auth.user.id
        }

        this.props.createList(listData, this.props.history);
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-6">
                        <h1>Create New List</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <button className="btn btn-primary" onClick={this.saveList}>Save List</button>
                        <hr />
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12 col-md-6">
                        <div className="form-group row">
                            <label className="col-xs-12 col-md-2 col-form-label">
                                List Name
                            </label>
                            <div className="col-xs-12 col-md-10">
                                <input type="text" id="name" onChange={this.onChange} value={this.name} className="form-control" placeholder="Enter a name..." />
                                <span className="text-danger">
                                    {this.state.errors.name}
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
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <div className="row">
                            <h4 className="col-12">Selected Games <hr /></h4>
                        </div>
                        <div className="row">
                            {
                                this.state.selectedGames.length == 0 &&
                                <p className="text-muted col-12">
                                    You haven't selected any games!
                                </p>
                                ||
                                this.state.selectedGames.map(game => {
                                    let gameLink = "/Game/" + game.name;

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
                                                <button className="btn btn-danger" onClick={this.removeFromList(game._id)}>
                                                    Remove From List
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                            <span className="text-danger col-12">
                                {this.state.errors.games}
                            </span>
                        </div>
                    </div>

                </div>


                <div className="row">
                    <h4 className="col-12">Collection <hr /></h4>
                    {this.state.collection.length == 0 &&
                        <p className="text-muted col-12">
                            No games to add!
                        </p>
                        ||
                        this.state.collection.map(game => {
                            let gameLink = "/Game/" + game.name;

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
                                        <button className="btn btn-primary" onClick={this.addToList(game._id)}>
                                            Add To List
                                        </button>
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

CreateList.propTypes = {
    createList: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { createList }
)(withRouter(CreateList));