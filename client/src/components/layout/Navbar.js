import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import styles from '../css/navbar.module.css';
import PropTypes from "prop-types";
import { logoutUser } from "../../actions/authActions";

class Navbar extends Component {

    constructor() {
        super();
        this.state = {
            searchQuery: "",
            emptySearch: false,
        }
    }

    onChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        });
    };

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    onSearch = e => {
        e.preventDefault()
        if (!this.state.searchQuery == "") {
            this.props.history.push("/search/" + this.state.searchQuery);
        }
    }

    render() {
        let profileLink = `/Profile/${this.props.auth.user.name}`
        return (
            <nav className="navbar navbar-dark navbar-expand-md bg-primary">
                <a className="navbar-brand" href="/">
                    retroPro Logo Here
                </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    {this.props.auth.isAuthenticated &&
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className={styles.navLink} to="/" style={{ color: "white" }}>Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={styles.navLink} to="/About" style={{ color: "white" }}>About</Link>
                            </li>
                        </ul>
                        ||
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link className={styles.navLink} to="/" style={{ color: "white" }}>Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={styles.navLink} to="/About" style={{ color: "white" }}>About</Link>
                            </li>


                            <li className="nav-item">
                                <Link className={styles.navLink} to="/Login" style={{ color: "white" }}>Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={styles.navLink} to="/Register" style={{ color: "white" }}>Register</Link>
                            </li>
                        </ul>
                    }
                    {this.props.auth.isAuthenticated &&
                        <form className="navbar-form form-inline w-75 m-auto" role="search" onSubmit={this.onSearch}>
                            <input type="text" id="searchQuery" onChange={this.onChange} value={this.state.searchQuery} className="form-control w-75" placeholder="Search For A Game Or User" />
                            <button className="btn my-2 my-sm-0 border-secondary bg-success" type="submit">Search</button>
                        </form>
                    }
                </div>
                {this.props.auth.isAuthenticated &&
                    <ul className="navbar-nav navbar-right">
                        <li className="nav-item dropdown">
                            <div id="navbarDropdown" role="button" data-toggle="dropdown"
                                aria-haspopup="true" className="dropdown-toggle"
                                className={styles.navLink}>
                                Logged in as {this.props.auth.user.name}
                            </div>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <Link className="dropdown-item" to={profileLink}>Profile</Link>
                                <Link className="dropdown-item" to="/FindStore">Find A Store</Link>
                                <Link className="dropdown-item" to="/Settings">Settings</Link>
                                <Link className="dropdown-item" to="/Submit">Submit A Game</Link>
                                {this.props.auth.user.role == "Admin" &&
                                    <Link className="dropdown-item" to="/Admin">Admin Dashboard</Link>
                                }
                                <Link className="dropdown-item" to="/" onClick={this.onLogoutClick}>
                                    Log Out
                                </Link>
                            </div>
                        </li>
                    </ul>
                }

            </nav>
        )
    }
}

Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(withRouter(Navbar));