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
            comments: [],
            reviews: [],
            commentText: "",
            errors: {}
        };
    }

    componentDidMount(){
        console.log(this.props.auth.user)
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
                    gameInWishlist: res.data.gameInWishlist,
                    comments: res.data.game.comments,
                    reviews: res.data.game.reviews
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

    submitComment = e => {
        e.preventDefault()

        if (this.state.commentText == ""){
            this.setState({
                errors: {
                    comment: "Comment text field is required."
                }
            })
            return
        }
        else{
            let postData = {
                userId: this.props.auth.user.id,
                comment: this.state.commentText,
                gameId: this.state.game._id,
                timestamp: new Date()
            }
            axios.post("/api/games/addComment", postData)
                .then(res => {
                    this.setState({
                        commentText: "",
                        comments: res.data,
                        errors: {

                        }
                    })
                })
        }

    }

    onChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        });
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
                                <div className="row mt-2">
                                    <form className="col-2" onSubmit={this.submitComment}>
                                        <div className="form-group">
                                            <img src={this.props.auth.user.profilePicture} height="125px"></img>
                                            <button type="submit" className="btn btn-primary mt-1">
                                                Submit Comment
                                            </button>
                                        </div>
                                    </form>
                                    <div className="col-10">
                                        <textarea id="commentText" placeholder="Comment Text..." type="text" rows="6" value={this.state.commentText} onChange={this.onChange} className="form-control"></textarea>
                                        <span className="text-danger">
                                            {this.state.errors.comment}
                                        </span>                                    
                                    </div>
                                </div>
                                <hr/>
                                {
                                    this.state.comments.length == 0 &&
                                    <p class="text-muted">This game has no comments! Be the first to add a comment.</p>
                                    ||
                                    this.state.comments.sort((a, b) => (a.timestamp < b.timestamp) ? 1 : -1).map(comment => {
                                        let timeString = comment.timestamp.slice(0, comment.timestamp.indexOf("T"))
                                        return (
                                            <div className="row mt-2">
                                                <div className="col-2 no-gutters p-0">
                                                    <img src={comment.commenter.profilepicture} height="100px"/>
                                                </div>
                                                <div className="col-3">
                                                    <h5>{comment.commenter.name}</h5>
                                                    <p class="text-muted">{timeString}</p>
                                                </div>
                                                <div className="col-7 overflow-auto">
                                                    <p>{comment.text}</p>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="tab-pane container-fluid fade" id="reviews">
                                {
                                    this.state.reviews.length == 0 &&
                                    <p class="text-muted">This game has no reviews! Be the first to add a review.</p>
                                }
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