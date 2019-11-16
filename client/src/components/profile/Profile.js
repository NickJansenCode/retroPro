import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import axios from "axios";
import StarRatingComponent from "react-star-rating-component";

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
            commentText: "",
			errors: {}
		};
	}

	componentDidMount() {
		axios
			.get(`/api/users/getByName/${this.props.match.params.username}`)
			.then(res => {
				console.log(res);
				this.setState({
					user: res.data.user,
					gameCollection: res.data.user.gameCollection,
					wishlist: res.data.user.wishlist,
					highlights: res.data.user.highlights,
					comments: res.data.user.profileComments,
					lists: res.data.user.lists
				});
			});
	}

	componentWillReceiveProps(newProps) {
		window.location.reload();
    }
    
    onChange = e => {
        this.setState({
          [e.target.id]: e.target.value
        });
    };

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

	render() {
		const { user } = this.props.auth;
		return (
			<div className="container-fluid">
				<div
					className="row pt-3 align-items-end"
					style={{ backgroundColor: "gray" }}
				>
					<div className="col-xs-6 col-md-2">
						<img
							height="250px"
							style={{
								border: "2px solid black",
								borderRadius: "5px"
							}}
							src={this.state.user.profilepicture}
							alt="Profile Picture"
						/>
					</div>
					<div className="col-xs-6 col-md-2">
						<h1>{this.state.user.name}</h1>
					</div>
					<div className="col-xs-12 col-md-8">
						<ul className="nav nav-tabs float-right">
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

								<div className="row">
									{(this.state.highlights.length != 0 &&
										this.state.highlights.map(
											item => {}
										)) || (
										<p className="col-12">
											This user has not selected any
											highlights!
										</p>
									)}
								</div>
							</div>
							<div className="col-xs-12 col-md-3">
								<div className="row">
									<h2 className="col-12">Lists</h2>
								</div>
								<div className="row">
									{(this.state.lists.length != 0 &&
										this.state.lists.map(item => {})) || (
										<p className="col-12">
											This user has not selected any
											lists!
										</p>
									)}
								</div>
							</div>
							<div className="col-xs-12 col-md-3">
								<div className="row">
									<button
										onClick={this.sendFriendRequest}
										className="btn btn-primary btn-large col-12 w-100"
									>
										Add As A Friend
									</button>
								</div>
								<div className="row mt-2">
									<button
										onClick={this.sendReport}
										className="btn btn-danger btn-large col-12 w-100"
									>
										Report User
									</button>
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
											{this.props.auth.user.name ==
												this.props.match.params
													.username && (
												<div className="row justify-content-center">
													<button className="btn btn-primary">
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
											{this.props.auth.user.name ==
												this.props.match.params
													.username && (
												<div className="row justify-content-center">
													<button className="btn btn-danger">
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
									<img
										src={
											this.props.auth.user.profilePicture
										}
										height="150vh"
									/>
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
                            <br/>
							{(this.state.comments.length == 0 && (
								<div className="row">
									<p class="text-muted">
										This user doesn't have any comments on
										their profile... :'(
									</p>
								</div>
							)) ||
								this.state.comments
									.sort((a, b) =>
										a.timestamp < b.timestamp ? 1 : -1
									)
									.map(comment => {
										let timeString = comment.timestamp.slice(
											0,
											comment.timestamp.indexOf("T")
										);
										let profileLink = `/Profile/${comment.commenter.name}`;
										return (
											<div className="row mt-2">
												<div className="col-sm-4 col-md-2 no-gutters p-0">
													<img
														src={
															comment.commenter
																.profilepicture
														}
														height="100px"
													/>
												</div>
												<div className="col-sm-8 col-md-3">
													<Link to={profileLink}>
														<h5>
															{
																comment
																	.commenter
																	.name
															}
														</h5>
													</Link>
													<p class="text-muted">
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
						<h3>Friends Menu</h3>
					</div>
				</div>
			</div>
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
