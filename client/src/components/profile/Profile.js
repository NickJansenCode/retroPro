import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import axios from "axios";
import StarRatingComponent from "react-star-rating-component";
import IsImageUrl from "is-image-url";

class Profile extends Component {
    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    constructor() {
        super();
        this.state = {
            user: "",
            gameCollection: [],
            wishlist: [],
            highlights: [],
            comments: [],
            lists: [],
            friends: [],
            commentText: "",
            profilePictureLink: "",
            headerImageLink: "",
            userAbout: "",
            editMode: false,
            authUserProfilePicture: "",
            friendshipStatus: "",
            errors: {}
        };
    }

    componentDidMount() {
        axios
            .post(`/api/users/getByName`, { name: this.props.match.params.username, authID: this.props.auth.user.id })
            .then(res => {
                this.setState({
                    user: res.data.user,
                    profilePictureLink: res.data.user.profilepicture,
                    headerImageLink: res.data.user.headerpicture || "",
                    userAbout: res.data.user.about,
                    gameCollection: res.data.user.gameCollection,
                    wishlist: res.data.user.wishlist,
                    highlights: res.data.user.highlights,
                    comments: res.data.user.profileComments,
                    lists: res.data.user.lists,
                    friendshipStatus: res.data.friendshipStatus,
                    friends: res.data.friends || [],
                });
            })
            .catch(err => {
                console.log(err)
            })

        axios.get("/api/users/getAuthUserProfilePicture/" + this.props.auth.user.id)
            .then(res => {
                this.setState({
                    authUserProfilePicture: res.data
                })
            })
    }

    componentWillReceiveProps(newProps) {
        window.location.reload();
    }

    onChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        });
    };

    toggleEditMode = e => {
        e.preventDefault()
        let editMode = !this.state.editMode;

        this.setState({
            editMode: editMode
        })
    }

    saveEdits = e => {
        e.preventDefault()
        let errors = {}

        if (this.state.userAbout == "") {
            errors.userAbout = "About field is required!"
        }

        if (this.state.profilePictureLink == "") {
            errors.profilePictureLink = "Profile Picture URL is required!"
        }
        else if (!IsImageUrl(this.state.profilePictureLink)) {
            errors.profilePictureLink = "Profile Picture URL must be an image URL!"
        }

        if (this.state.headerImageLink != "") {
            if (!IsImageUrl(this.state.headerImageLink)) {
                errors.headerImageLink = "Header Image URL must be an image URL!"
            }
        }

        this.setState({ errors: errors })

        if (!(errors.userAbout || errors.profilePictureLink || errors.headerImageLink)) {
            let postData = {
                userId: this.props.auth.user.id,
                about: this.state.userAbout,
                profilePictureURL: this.state.profilePictureLink,
                headerImageURL: this.state.headerImageLink
            }

            axios.post("/api/users/updateUser", postData).then(res => {
                this.setState({
                    user: res.data.user,
                    authUserProfilePicture: res.data.user.profilepicture,
                    profilePictureLink: res.data.user.profilepicture,
                    headerImageLink: res.data.user.headerpicture || "",
                    userAbout: res.data.user.about,
                    gameCollection: res.data.user.gameCollection,
                    wishlist: res.data.user.wishlist,
                    highlights: res.data.user.highlights,
                    comments: res.data.user.profileComments,
                    lists: res.data.user.lists,
                    editMode: false,
                });
            })
        }
    }

    submitComment = e => {
        e.preventDefault();

        if (this.state.commentText == "") {
            this.setState({
                errors: {
                    comment: "Comment text field is required."
                }
            });
        } else {
            let postData = {
                commenterId: this.props.auth.user.id,
                commentReceiverId: this.state.user._id,
                comment: this.state.commentText,
                timestamp: new Date()
            };

            axios.post("/api/users/addComment", postData).then(res => {
                this.setState({
                    commentText: "",
                    comments: res.data,
                    errors: {}
                });
            });
        }
    };

    addToHighlights = id => e => {
        e.preventDefault()

        axios.post("/api/users/addGameToHighlights", { gameID: id, userID: this.state.user._id })
            .then(res => {
                this.setState({
                    highlights: res.data
                })
            })
    }

    removeFromHighlights = id => e => {
        e.preventDefault()

        axios.post("/api/users/removeGameFromHighlights", { gameID: id, userID: this.state.user._id })
            .then(res => {
                this.setState({
                    highlights: res.data
                })
            })
    }

    removeFromWishlist = id => e => {
        e.preventDefault()

        axios.post("/api/users/removeGameFromWishlist", { gameID: id, userID: this.state.user._id })
            .then(res => {
                this.setState({
                    wishlist: res.data
                })
            })
    }

    sendFriendRequest = e => {
        e.preventDefault();

        axios.post("/api/users/sendFriendRequest", { requesterID: this.props.auth.user.id, requestedID: this.state.user._id })
            .then(() => {
                window.location.reload()
            })
    }

    acceptFriendRequest = e => {
        e.preventDefault();

        // Accept friend request and then update user's friends list and friendship status. //
        axios.post("/api/users/acceptFriendRequest", { requesterID: this.state.user._id, requestedID: this.props.auth.user.id })
            .then(() => {
                window.location.reload()
            })
    }

    rejectFriendRequest = e => {
        e.preventDefault();

        axios.post("/api/users/rejectFriendRequest", { requesterID: this.state.user._id, requestedID: this.props.auth.user.id })
            .then(() => {
                window.location.reload()
            })
    }

    removeFromFriends = e => {
        e.preventDefault();

        // Remove from friends and then update user's friends list and friendship status. //
        axios.post("/api/users/removeFromFriends", { friendA: this.state.user._id, friendB: this.props.auth.user.id })
            .then(() => {
                window.location.reload()
            })

    }

    removeFromFriends = id => e => {
        e.preventDefault();

        // Remove from friends and then update user's friends list and friendship status. //
        axios.post("/api/users/removeFromFriends", { friendA: id, friendB: this.props.auth.user.id })
            .then(() => {
                window.location.reload()
            })

    }

    render() {

        if (this.state.user.private && this.state.friendshipStatus != "Friends" && this.state.user._id != this.props.auth.user.id) {
            return (
                <div className="container">
                    <div className="row">
                        <h1>{this.state.user.name}</h1>
                    </div>
                    <div className="row">
                        <p className="text-muted">This user has a private profile!</p>
                    </div>
                    <div className="row">
                        {
                            this.state.friendshipStatus == "Pending" &&
                            <button className="btn btn-primary" disabled>Friendship Pending</button>
                            ||
                            <button className="btn btn-primary" onClick={this.sendFriendRequest}>Add As A Friend</button>
                        }
                    </div>
                </div>
            )
        }

        let imageLink = encodeURI(this.state.user.headerpicture)
        let headerStyle = this.state.user.headerpicture == "" ?
            { backgroundColor: "gray" } :
            { background: "linear-gradient(rgba(255, 255, 255, .1), rgba(255, 255, 255, .1)), url('" + imageLink + "')" };
        return (
            <div className="container-fluid" >
                <div className="row pt-3 align-items-end headerImageCover" style={headerStyle}>
                    <div className="col-xs-6 col-md-2">
                        <img
                            height="250px"
                            style={{
                                border: "2px solid black",
                                backgroundColor: "white",
                                borderRadius: "5px",
                                color: "black",
                                zIndex: "1",
                                boxShadow: "10px 5px"
                            }}
                            src={this.state.user.profilepicture}
                            alt="Profile Picture"
                        />
                    </div>
                    <div className="col-xs-6 col-md-4" style={{ backgroundColor: "white", boxShadow: "10px 5px", borderRadius: "5px", borderRadius: "5px", border: "2px solid black" }}>
                        <h1>{this.state.user.name}</h1>
                    </div>
                    <div className="col-xs-12 col-md-6">
                        <ul className="nav nav-tabs float-right" style={{ border: "2px solid black", borderRadius: "5px", boxShadow: "10px 5px", backgroundColor: "white" }}>
                            <li className="nav-item">
                                <a
                                    className="nav-link active"
                                    data-toggle="tab"
                                    href="#overview"
                                >
                                    Overview
								</a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    data-toggle="tab"
                                    href="#collection"
                                >
                                    Collection
								</a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    data-toggle="tab"
                                    href="#wishlist"
                                >
                                    Wishlist
								</a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    data-toggle="tab"
                                    href="#comments"
                                >
                                    Comments
								</a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    data-toggle="tab"
                                    href="#friends"
                                >
                                    Friends
								</a>
                            </li>
                            {
                                this.props.auth.user.name == this.props.match.params.username &&
                                <li className="nav-item">
                                    <a className="nav-link" data-toggle="tab" href="#settings">Settings</a>
                                </li>
                            }
                        </ul>
                    </div>
                </div>

                <div className="tab-content container-fluid mt-3">
                    <div className="tab-pane active" id="overview">
                        <div className="row">
                            <div className="col-xs-12 col-md-3">
                                <div className="row">
                                    <h2 className="col-12">About</h2>
                                </div>
                                <div className="row">
                                    <p className="col-12">
                                        {this.state.user.about}
                                    </p>
                                </div>
                            </div>
                            <div className="col-xs-12 col-md-3">
                                <div className="row">
                                    <h2 className="col-12">Highlights</h2>
                                </div>

                                {(this.state.highlights.length != 0 &&
                                    this.state.highlights.map(
                                        item => {
                                            let gameLink = `/Game/${item.name}`
                                            return (
                                                <Link to={gameLink}>
                                                    <div className="row mt-2">
                                                        <div className="col-md-4">
                                                            <img src={item.coverart} height="100vh" />
                                                        </div>
                                                        <div className="col-md-8">
                                                            <div className="row">
                                                                <h6>{item.name}</h6>
                                                            </div>
                                                            <div className="row">
                                                                {item.year}, {item.platform.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            )
                                        }
                                    )) || (
                                        <div className="row">
                                            <p className="col-12">
                                                This user has not selected any
                                                highlights!
										    </p>
                                        </div>

                                    )}
                            </div>
                            <div className="col-xs-12 col-md-3">
                                <div className="row">
                                    <h2 className="col-12">Lists</h2>
                                </div>
                                <div className="row">
                                    {(this.state.lists.length != 0 &&
                                        this.state.lists.map(item => { })) || (
                                            <p className="col-12">
                                                This user has not created any
                                                lists!
										</p>
                                        )}
                                </div>
                            </div>
                            <div className="col-xs-12 col-md-3">
                                {
                                    // Can't add yourself as a friend. //
                                    this.props.auth.user.name == this.props.match.params.username &&
                                    <div className="row">
                                        <button
                                            className="btn btn-primary btn-large col-12 w-100"
                                            disabled>
                                            Add As A Friend
                                            </button>
                                    </div>

                                    // If you are friends, you can choose to remove them. //
                                    || this.state.friendshipStatus == "Friends" &&
                                    <div className="row">
                                        <button
                                            onClick={this.removeFromFriends}
                                            className="btn btn-warning btn-large w-100">
                                            Remove From Friends
                                        </button>
                                    </div>


                                    // If you've sent them a friend request and they haven't accepted. //
                                    || this.state.friendshipStatus == "Pending" &&
                                    <div className="row">
                                        <button
                                            className="btn btn-primary btn-large w-100"
                                            disabled>
                                            Friend Request Pending..
                                        </button>
                                    </div>


                                    // If they have sent you a friend request and you haven't accepted. //
                                    || this.state.friendshipStatus == "PendingAccept" &&
                                    <div className="row">
                                        <button
                                            className="btn btn-primary btn-large w-100"
                                            onClick={this.acceptFriendRequest}
                                        >
                                            Accept Friend Request
                                            </button>
                                        <button className="btn btn-danger btn-large w-100 mt-2" onClick={this.rejectFriendRequest}>
                                            Reject Friend Request
                                            </button>
                                    </div>

                                    ||
                                    <div className="row">
                                        <button
                                            onClick={this.sendFriendRequest}
                                            className="btn btn-primary btn-large col-12 w-100">
                                            Add As A Friend
									    </button>
                                    </div>

                                }

                                <div className="row mt-2">
                                    <Link className="btn btn-danger btn-large w-100" to={{
                                        pathname: "/report",
                                        state: {
                                            name: this.state.user.name
                                        }
                                    }}>
                                        Report User
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tab-pane fade" id="collection">
                        {(this.state.gameCollection.length == 0 && (
                            <div className="justify-content-center">
                                <p className="text-muted">
                                    This user doesn't have any items in their
                                    collection... :'(
								</p>
                            </div>
                        )) || (
                                <div className="row">
                                    {this.state.gameCollection.map(game => {
                                        let gameLink = "/Game/" + game.name;
                                        let gameAverage =
                                            Math.round(
                                                (game.reviews.reduce(
                                                    (total, next) =>
                                                        total + next.rating,
                                                    0
                                                ) /
                                                    game.reviews.length) *
                                                2
                                            ) / 2;

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
                                                <div className="row text-center">
                                                    <div className="col-12">
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
                                                                        <span
                                                                            style={{
                                                                                position:
                                                                                    "absolute"
                                                                            }}
                                                                        >
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
                                                {this.props.auth.user.name == this.props.match.params.username && (

                                                    this.state.highlights.filter(e => e._id == game._id).length > 0 &&

                                                    <div className="row justify-content-center">
                                                        <button className="btn btn-danger" onClick={this.removeFromHighlights(game._id)}>
                                                            Remove From Highlights
                                                        </button>
                                                    </div>
                                                    ||
                                                    <div className="row justify-content-center">
                                                        <button className="btn btn-primary" onClick={this.addToHighlights(game._id)}>
                                                            Add To Highlights
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                    </div>
                    <div className="tab-pane fade" id="wishlist">
                        {(this.state.wishlist.length == 0 && (
                            <div className="justify-content-center">
                                <p className="text-muted">
                                    This user doesn't have any items in their
                                    wishlist... :'(
								</p>
                            </div>
                        )) || (
                                <div className="row">
                                    {this.state.wishlist.map(game => {
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
                                                <div className="row text-center">
                                                    <div className="col-12">
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
                                                {this.props.auth.user.name == this.props.match.params.username && (
                                                    <div className="row justify-content-center">
                                                        <button className="btn btn-danger" onClick={this.removeFromWishlist(game._id)}>
                                                            Remove From Wishlist
													        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                    </div>
                    <div className="tab-pane fade" id="comments">
                        <div className="container">
                            <div className="row">
                                <div className="col-xs-12 col-sm-4 col-md-2 no-gutters">
                                    <img src={this.state.authUserProfilePicture} height="150vh" />
                                </div>
                                <div className="col-xs-12 col-sm-8 col-md-8">
                                    <textarea
                                        id="commentText"
                                        placeholder="Comment Text..."
                                        type="text"
                                        rows="6"
                                        value={this.state.commentText}
                                        onChange={this.onChange}
                                        className="form-control"
                                    />
                                    <span className="text-danger">
                                        {this.state.errors.comment}
                                    </span>
                                </div>
                                <div className="col-xs-12 col-md-2">
                                    <button className="btn btn-primary w-100" onClick={this.submitComment}>
                                        Submit
									</button>
                                </div>
                            </div>
                            <br />
                            {(this.state.comments.length == 0 && (
                                <div className="row">
                                    <p className="text-muted">
                                        This user doesn't have any comments on
                                        their profile... :'(
									</p>
                                </div>
                            )) ||
                                this.state.comments.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1).map(comment => {
                                    let timeString = comment.timestamp.slice(0, comment.timestamp.indexOf("T"));
                                    let profileLink = `/Profile/${comment.commenter.name}`;
                                    return (
                                        <div className="row mt-2">
                                            <div className="col-sm-4 col-md-2 no-gutters p-0">
                                                <img src={comment.commenter.profilepicture} height="100px" />
                                            </div>
                                            <div className="col-sm-8 col-md-3">
                                                <Link to={profileLink}>
                                                    <h5>
                                                        {comment.commenter.name}
                                                    </h5>
                                                </Link>
                                                <p className="text-muted">
                                                    {timeString}
                                                </p>
                                            </div>
                                            <div className="col-sm-12 col-md-7 overflow-auto">
                                                <p>{comment.text}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                    <div className="tab-pane fade" id="friends">
                        {
                            this.state.friends.length == 0 &&
                            <div className="row">
                                <p className="text-muted">
                                    This user doesn't have any friends... :( Be the first to add them!
                                </p>
                            </div>
                            ||
                            <div className="row">
                                {
                                    this.state.friends.map(friendship => {
                                        let user = friendship.friendA._id == this.state.user._id ? friendship.friendB : friendship.friendA;
                                        let userLink = `/Profile/${user.name}`
                                        return (
                                            <div className="col-xs-12 col-sm-6 col-md-3 mt-3" >
                                                <Link to={userLink}>
                                                    <div className="row justify-content-center">
                                                        <img
                                                            className="col-xs-12"
                                                            height="150vh"
                                                            src={user.profilepicture}
                                                        ></img>
                                                    </div>
                                                    <div className="row text-center">
                                                        <div className="col-12">
                                                            {user.name}
                                                        </div>
                                                    </div>
                                                </Link>
                                                {this.state.user._id == this.props.auth.user.id &&

                                                    (
                                                        <div className="row justify-content-center">
                                                            <button className="btn btn-danger" onClick={this.removeFromFriends(user._id)}>Remove From Friends</button>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        )
                                    })}
                            </div>
                        }


                    </div>
                    <div className="tab-pane fade container" id="settings">
                        <div className="row">
                            <h3>Settings</h3>
                            <button className="btn btn-primary ml-3" disabled={this.state.editMode} onClick={this.toggleEditMode}><i className="fas fa-edit" /></button>
                            <button className="btn btn-success ml-3" disabled={!this.state.editMode} onClick={this.saveEdits}><i className="fas fa-check" /></button>
                        </div>

                        <div className="row mt-3">
                            <div className="col-xs-12 col-md-4">
                                <h4>About</h4>
                            </div>
                            <div className="col-xs-12 col-md-8">
                                <input className="form-control" type="text" value={this.state.userAbout} id="userAbout" onChange={this.onChange} disabled={!this.state.editMode} />
                                <span className="text-danger">
                                    {this.state.errors.userAbout}
                                </span>
                            </div>
                        </div>

                        <div className="row mt-3">
                            <div className="col-xs-12 col-md-4">
                                <h4>Profile Picture URL</h4>
                            </div>
                            <div className="col-xs-12 col-md-8">
                                <input className="form-control" type="text" value={this.state.profilePictureLink} id="profilePictureLink" onChange={this.onChange} disabled={!this.state.editMode} />
                                <span className="text-danger">
                                    {this.state.errors.profilePictureLink}
                                </span>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-xs-12 col-md-4">
                                <h4>Header Image URL</h4>
                            </div>
                            <div className="col-xs-12 col-md-8">
                                <input className="form-control" type="text" value={this.state.headerImageLink} id="headerImageLink" onChange={this.onChange} disabled={!this.state.editMode} />
                                <span className="text-danger">
                                    {this.state.errors.headerImageLink}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

Profile.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logoutUser })(Profile);
