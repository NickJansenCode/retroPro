import React, { Component } from "react";
import styles from "../css/register.module.css";
import PropTypes from "prop-types";
import axios from "axios";
import { Link, withRouter } from "react-router-dom";
import landing from "../../img/landing.jpg";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";

class PasswordRecovery extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            errors: {},
            foundUser: false,
            answersCorrect: false,
            questions: [],
            question1Answer: "",
            question2Answer: "",
            password: "",
            password2: ""
        };
    }

    onChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        });
    };

    onSubmitEmail = e => {
        e.preventDefault();

        const email = this.state.email;

        axios
            .get("/api/users/getForPasswordRecovery/" + email)
            .then(res => {
                this.setState({
                    foundUser: true,
                    questions: res.data,
                    errors: {}
                });
            })
            .catch(err => {
                this.setState({
                    errors: {
                        email: "User not found."
                    }
                });
            });
    };

    onSubmitQuestions = e => {
        e.preventDefault();

        let question1Correct =
            this.state.question1Answer == this.state.questions[0].answer;
        let question2Correct =
            this.state.question2Answer == this.state.questions[1].answer;

        if (question1Correct && question2Correct) {
            this.setState({
                errors: {},
                answersCorrect: true
            });
        } else {
            let newErrors = {};
            if (!question1Correct) {
                newErrors.question1Error = "Incorrect Answer";
            }

            if (!question2Correct) {
                newErrors.question2Error = "Incorrect Answer";
            }

            this.setState({
                errors: newErrors
            });
        }
    };

    onSubmitNewPassword = e => {
        e.preventDefault()

        let newErrors = {}
        let passwordEmpty = this.state.password == ""
        let password2Empty = this.state.password2 == ""


        if (passwordEmpty) {
            newErrors.password = "Password field is required"
        }

        if (password2Empty) {
            newErrors.password2 = "Password confirmation field is required"
        }

        if (!passwordEmpty && !password2Empty) {
            let passwordLength = this.state.password.length >= 6
            let passwordsMatch = this.state.password == this.state.password2

            if (!passwordLength) {
                newErrors.password = "Password must be at least 6 characters."
            }
            else {
                if (!passwordsMatch) {
                    newErrors.password2 = "Passwords must match"
                }
                else {
                    let data = {
                        email: this.state.email,
                        password: this.state.password
                    }
                    axios.post("/api/users/updatePassword", data)
                        .then(res => this.props.history.push("/login"))
                }
            }
        }

        this.setState({
            errors: newErrors
        })
    }

    componentDidMount() {
        // If logged in and user navigates to Password Recovery page, should redirect them to dashboard. //
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/profile/" + this.props.auth.user.name);
        }
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className={styles.registerForm}>
                        <h1 className="text-center mb-4">Password Recovery</h1>

                        {(!this.state.foundUser && (
                            <form onSubmit={this.onSubmitEmail}>
                                <div className="form-group">
                                    <input
                                        onChange={this.onChange}
                                        value={this.state.email}
                                        error={this.state.errors.email}
                                        id="email"
                                        type="email"
                                        placeholder="Enter an email address"
                                        className="form-control"
                                    />
                                    <span className={styles.redtext}>
                                        {this.state.errors.email}
                                    </span>
                                </div>
                                <div className="form-group">
                                    <button
                                        className="btn btn-primary w-100 form-control mt-3"
                                        type="submit"
                                    >
                                        Reset Password
                                    </button>
                                </div>
                            </form>
                        )) ||
                            !this.state.answersCorrect && (
                                <form onSubmit={this.onSubmitQuestions}>
                                    <div className="form-group">
                                        <h5>{this.state.questions[0].text}</h5>
                                        <input
                                            onChange={this.onChange}
                                            value={this.state.question1Answer}
                                            error={this.state.errors.question1Error}
                                            id="question1Answer"
                                            type="text"
                                            placeholder="Answer to question 1"
                                            className="form-control"
                                        />
                                        <span className={styles.redtext}>
                                            {this.state.errors.question1Error}
                                        </span>
                                    </div>
                                    <div className="form-group">
                                        <h5>{this.state.questions[1].text}</h5>
                                        <input
                                            onChange={this.onChange}
                                            value={this.state.question2Answer}
                                            error={this.state.errors.question2Error}
                                            id="question2Answer"
                                            type="text"
                                            placeholder="Answer to question 2"
                                            className="form-control"
                                        />
                                        <span className={styles.redtext}>
                                            {this.state.errors.question2Error}
                                        </span>
                                    </div>
                                    <div className="form-group">
                                        <button
                                            className="btn btn-primary w-100 form-control mt-3"
                                            type="submit"
                                        >
                                            Reset Password
                                        </button>
                                    </div>
                                </form>
                            ) || (
                                <form onSubmit={this.onSubmitNewPassword}>
                                    <div className="form-group">
                                        <input
                                            onChange={this.onChange}
                                            value={this.state.password}
                                            error={this.state.errors.password}
                                            id="password"
                                            type="password"
                                            placeholder="Enter a password"
                                            className="form-control"
                                        />
                                        <span className={styles.redtext}>
                                            {this.state.errors.password}
                                        </span>
                                    </div>

                                    <div className="form-group">
                                        <input
                                            onChange={this.onChange}
                                            value={this.state.password2}
                                            error={this.state.errors.password2}
                                            id="password2"
                                            type="password"
                                            placeholder="Confirm password"
                                            className="form-control"
                                        />
                                        <span className={styles.redtext}>
                                            {this.state.errors.password2}
                                        </span>
                                    </div>
                                    <div className="form-group">
                                        <button
                                            className="btn btn-primary w-100 form-control mt-3"
                                            type="submit"
                                        >
                                            Submit Answers
                                        </button>
                                    </div>
                                </form>
                            )}
                    </div>
                </div>
            </div>
        );
    }
}

PasswordRecovery.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps, { registerUser })(
    withRouter(PasswordRecovery)
);
