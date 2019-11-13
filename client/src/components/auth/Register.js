import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import styles from '../css/register.module.css';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import Select from 'react-select'
import axios from 'axios'
import classnames from "classnames";

class Register extends Component {

    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            password2: "",
            question1ID: "",
            question1Answer: "",
            question2ID: "",
            question2Answer: "",
            recoveryQuestions: [],
            errors: {}
        };
    }

    componentDidMount() {
        // If logged in and user navigates to Register page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
          this.props.history.push("/profile");
        }

        axios.get("api/recoveryQuestions")
        .then(res => {
            let options = res.data.map(item => {
                return {value: item._id, label: item.text}
            })
            this.setState({
                recoveryQuestions: options
            })
        })

      }

    componentWillReceiveProps(nextProps){
        if (nextProps.errors){
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

    onChangeRecovery1 = e => {
        this.setState({
            question1ID: e.value
        })
    }

    onChangeRecovery2 = e => {
        this.setState({
            question2ID: e.value
        })
    }

    onSubmit = e => {
        e.preventDefault();

        const newUserData = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2,
            recoveryQuestion1ID: this.state.question1ID,
            recoveryQuestion2ID: this.state.question2ID,
            recoveryQuestion1Answer: this.state.question1Answer,
            recoveryQuestion2Answer: this.state.question2Answer
        };

        this.props.registerUser(newUserData, this.props.history);
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className={styles.registerForm}>
                        <h1 className="text-center mb-4">Register</h1>
                        <form onSubmit={this.onSubmit}>

                            <div className="form-group">
                                <input onChange={this.onChange}
                                    value={this.state.name}
                                    error={this.state.errors.name}
                                    id="name"
                                    type="text"
                                    placeholder="Enter a username"
                                    className="form-control"
                                />
                                <span className={styles.redtext}>
                                    {this.state.errors.name}
                                </span>
                            </div>

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
                                </span>
                            </div>

                            <div className="form-group">
                                <input onChange={this.onChange}
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
                            <h4>Recovery Question 1</h4>
                                <Select onChange={this.onChangeRecovery1} inputId="question1ID" options={this.state.recoveryQuestions}/>
                                <span className={styles.redtext}>
                                    {this.state.errors.recoveryQuestion1ID}
                                </span>
                            </div>

                            <div className="form-group">
                                <input onChange={this.onChange}
                                    value={this.state.question1Answer}
                                    error={this.state.errors.recoveryQuestion1Answer}
                                    id="question1Answer"
                                    type="text"
                                    placeholder="Answer for recovery question 1"
                                    className="form-control"
                                />
                                <span className={styles.redtext}>
                                    {this.state.errors.recoveryQuestion1Answer}
                                </span>
                            </div>

                            <div className="form-group">
                                <h4>Recovery Question 2</h4>
                                <Select onChange={this.onChangeRecovery2} inputId="question2ID" options={this.state.recoveryQuestions}/>
                                <span className={styles.redtext}>
                                    {this.state.errors.recoveryQuestion2ID}
                                </span>
                            </div>

                            <div className="form-group">
                                <input onChange={this.onChange}
                                    value={this.state.question2Answer}
                                    error={this.state.errors.recoveryQuestion2Answer}
                                    id="question2Answer"
                                    type="text"
                                    placeholder="Answer for recovery question 2"
                                    className="form-control"
                                />
                                <span className={styles.redtext}>
                                    {this.state.errors.recoveryQuestion2Answer}
                                </span>
                            </div>

                            
                            <div className="form-group">
                                <button className="btn btn-primary w-100 form-control mt-3"
                                        type="submit"
                                >
                                    Register
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { registerUser }
)(withRouter(Register));