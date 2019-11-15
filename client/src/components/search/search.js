import React, { Component } from 'react';
import {withRouter, Link} from 'react-router-dom'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import axios from 'axios';
import StarRatingComponent from "react-star-rating-component"

class Search extends Component {

    constructor() {
        super();
        this.state = {
            userResults: [],
            gameResults: [],
            noQuery: false
        };
    }

    componentDidMount(){
        axios
          .get(`/api/users/search/${this.props.match.params.searchQuery}`)
          .then(res => {
            this.setState({
                userResults: res.data
            })
            
          });

        axios
        .get(`/api/games/search/${this.props.match.params.searchQuery}`)
        .then(res => {
            this.setState({
                gameResults: res.data
            })
        })
    }

    componentWillReceiveProps(newProps) {
        axios
          .get(`/api/users/search/${newProps.match.params.searchQuery}`)
          .then(res => {
            this.setState({
                userResults: res.data
            })
            
          });

        axios
        .get(`/api/games/search/${newProps.match.params.searchQuery}`)
        .then(res => {
            this.setState({
                gameResults: res.data
            })
        })
    }

    render() {
        return (
            <div className="container ml-5">
                <h1>Search Results For {this.props.match.params.searchQuery}</h1>
                <div className="row">
                    <div className="col-4">
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <a className="nav-link active"
                                   data-toggle="tab"
                                   href="#games">
                                       Games: {this.state.gameResults.length}
                                   </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link"
                                    data-toggle="tab"
                                    href="#users">
                                    Users: {this.state.userResults.length}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div className="tab-content container">
                    <div className="tab-pane active" id="games">
                        {this.state.gameResults.length == 0 &&
                        <p className="text-muted mt-3">No game results found for {this.props.match.params.searchQuery}</p>
                        
                        ||

                        this.state.gameResults.map(game => {
                            let gameLink = `/Game/${game.name}`
                            let gameAverage = Math.round((game.reviews.reduce((total, next) => total + next.rating, 0) / game.reviews.length) *2 ) / 2 
                            return (
                                <Link to={gameLink}>
                                    <div className="row mt-3">
                                        <div className="col-4">
                                            <img height="auto" width="100%" src={game.coverart}></img>
                                        </div>
                                    
                                        <div className="col-8 container">
                                            <div className="row">
                                                <h3>{game.name}</h3>
                                            </div>
                                            <div className="row">
                                            <StarRatingComponent
                                                name="gameRating"
                                                starCount={5}
                                                starColor="#ffb400"
                                                emptyStarColor="#ffb400"
                                                value={gameAverage}
                                                editing={false}
                                                renderStarIcon={(index, value) => {
                                                    return (
                                                    <span>
                                                        <i
                                                        className={
                                                            index <= value
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
                                            <div className="row">
                                                <p className="text-muted">
                                                    {game.description.substring(0, 250)}
                                                    {game.description.length > 200 ? "..." : ""}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })
                        }
                    </div>
                    <div className="tab-pane" id="users">
                        {this.state.userResults.length == 0 &&
                        <p className="text-muted mt-3">No user results found for {this.props.match.params.searchQuery}</p>
                        
                        ||
                        
                        this.state.userResults.map(user => {
                            let profileName = `/Profile/${user.name}`
                            return (
                            <Link to={profileName} className="navbar-link">
                                
                                <div className="row mt-2">
                                
                                    <div className="col-2">
                                        <img height="100px" src={user.profilepicture}></img>
                                    </div>
                                
                                    <div className="col-10">
                                        <div className="row">
                                            <h3>{user.name}</h3>
                                        </div>
                                        <div className="row">
                                            <p className="text-muted">
                                                {user.about}
                                                {user.about.length > 200 ? "..." : ""}
                                            </p>
                                        </div>
                                    </div>
                                
                                </div>
                            </Link>
                            )
                        })}
                    </div>
                </div>
                
            </div>
        );
    }
}

Search.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(withRouter(Search));
