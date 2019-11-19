import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";
import styles from '../css/register.module.css';

class Login extends Component {

    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            errors: {}
        };
    }

    componentDidMount() {
        // If logged in and user navigates to Register page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
            let username = this.props.auth.user.name
            this.props.history.push(`/profile/` + username);
        }
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.auth.isAuthenticated) {
            let username = nextProps.auth.user.name
            this.props.history.push("/profile/" + username);
        }

        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    onChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    onSubmit = e => {
        e.preventDefault();

        const userData = {
            email: this.state.email,
            password: this.state.password
        };

        console.log("Logging in as: " + userData);
        this.props.loginUser(userData);
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className={styles.registerForm}>
                        <h1 className="text-center mb-4">Log In</h1>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <input onChange={this.onChange}
                                    value={this.state.email}
                                    error={this.state.errors.email}
                                    id="email"
                                    type="email"
                                    placeholder="Enter an email address"
                                    className="form-control"
                                />
                                <span className={styles.redtext}>
                                    {this.state.errors.email}
                                    {this.state.errors.emailnotfound}
                                </span>
                            </div>
                            <div className="form-group">
                                <input onChange={this.onChange}
                                    value={this.state.password}
                                    error={this.state.errors.password}
                                    id="password"
                                    type="password"
                                    placeholder="Enter a password"
                                    className="form-control"
                                />
                                <span className={styles.redtext}>
                                    {this.state.errors.password}
                                    {this.state.errors.passwordincorrect}
                                </span>
                            </div>
                            <span className={styles.redtext}>
                                {this.state.errors.banned}
                            </span>
                            <div className="form-group">
                                <button className="btn btn-primary w-100 form-control mt-3"
                                    type="submit"
                                >
                                    Log In
                                </button>
                            </div>
                        </form>
                        <div className="text-center">
                            <Link to="/Register">Don't have an account?</Link>
                        </div>
                        <div className="text-center">
                            <Link to="/PasswordRecovery">Forgot your password?</Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { loginUser }
)(Login);