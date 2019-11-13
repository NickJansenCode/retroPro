import React, { Component } from "react";
import axios from "axios";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Game extends Component{
    constructor(){
        super();
        this.state = {
            game: "",
            platform: "",
            gamePlayed: "",
            gameInCollection: "",
            gameInWishlist: "",
        };
    }

    componentDidMount(){
        
        let user = this.props.auth.user;
        let game = this.props.match.params.name;
        let postData = {
            user: user,
            game: game,
        } 

        axios.post(`/api/games/loadGamePageData`, postData)
            .then(res => {
                console.log(res)
                this.setState({
                    game: res.data.game,
                    platform: res.data.game.platform.name,
                    gamePlayed: res.data.gamePlayed,
                    gameInCollection: res.data.gameInCollection,
                    gameInWishlist: res.data.gameInWishlist
                })
            })
    }

    toggleGamePlayed = e => {
        e.preventDefault()

        let user = this.props.auth.user;
        let game = this.props.match.params.name;
        let postData = {
            user: user,
            game: game,
            played: this.state.gamePlayed
        } 

        axios.post('/api/games/toggleGamePlayed', postData)
            .then(res => {
                this.setState({
                    gamePlayed: res.data
                })
            })
    }

    toggleGameInCollection = e => {
        e.preventDefault()

        let user = this.props.auth.user;
        let game = this.props.match.params.name;
        let postData = {
            user: user,
            game: game,
            inCollection: this.state.gameInCollection
        }      
        
        axios.post('/api/games/toggleGameInCollection', postData)
            .then(res => {
                this.setState({
                    gameInCollection: res.data
                })
            })
    }

    toggleGameInWishlist = e => {
        e.preventDefault()

        let user = this.props.auth.user;
        let game = this.props.match.params.name;
        let postData = {
            user: user,
            game: game,
            inWishlist: this.state.gameInWishlist
        }      
        
        axios.post('/api/games/toggleGameInWishlist', postData)
            .then(res => {
                this.setState({
                    gameInWishlist: res.data
                })
            })
    }

    render(){
        return(
            <div className="container-fluid mt-2">
                <div className="row">
                    <div className="col-md-4 text-center">
                        <img style={{border: "2px solid black", width: "100%"}} src={this.state.game.coverart} alt="Game Cover Art"/>
                        <h3>{this.state.game.name}</h3>
                        <span>{this.state.platform}, {this.state.game.year}</span>
                        <div className="mt-2">
                            {this.state.gamePlayed == false
                            && <button onClick={this.toggleGamePlayed} className="btn btn-primary btn-large">I Have Played This Game</button>
                            || <button onClick={this.toggleGamePlayed} className="btn btn-danger btn-large">I Have Not Played This Game</button> 
                            }
                        </div>
                        <div className="mt-2">
                            {this.state.gameInCollection == false && 
                                <button onClick={this.toggleGameInCollection} className="btn btn-primary btn-large">Add Game To Collection</button>
                                || 
                                <button onClick={this.toggleGameInCollection} className="btn btn-danger btn-large">Remove Game From Collection</button>
                            }
                        </div>
                        <div className="mt-2">

                            {this.state.gameInWishlist == false && 
                                <button onClick={this.toggleGameInWishlist} className="btn btn-primary btn-large">Add Game To Wishlist</button>
                                || 
                                <button onClick={this.toggleGameInWishlist} className="btn btn-danger btn-large">Remove Game From Wishlist</button>
                            }
                        </div>
                    </div>
                    <div className="col-md-8">                   
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <a className="nav-link active" data-toggle="tab" href="#overview">Overview</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="tab" href="#comments">Comments</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="tab" href="#reviews">Reviews</a>
                           </li>
                        </ul>

                        <div className="tab-content">
                            <div className="tab-pane container-fluid active" id="overview">
                                {this.state.game.description}
                            </div>
                            <div className="tab-pane container-fluid fade" id="comments">
                                <h3>Comments Menu</h3>
                            </div>
                            <div className="tab-pane container-fluid fade" id="reviews">
                                <h3>Reviews Menu</h3>
                            </div>
                        </div>    
                    </div>
                </div>
            </div>
        )
    }
}

Game.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
)(Game);