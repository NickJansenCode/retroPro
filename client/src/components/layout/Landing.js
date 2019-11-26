import React, { Component } from "react";
import { Link } from "react-router-dom";
import landing from "../../img/retroProLogo.png";
import styles from "../css/landing.module.css"

export default class Landing extends Component {
    render() {
        return (
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className={styles.centerImage} className="col-md-6">
                        <img src={landing}></img>
                    </div>
                </div>
                <div className="row justify-content-center mt-3">
                    <div className="col-md-6">
                        <p>
                            Welcome to retroPro! retroPro is a web application that allows you
                            to make the most of your game collection. Collect games, and create
                            lists and highlights of your collection all in one convenient, centralized place.
                        </p>
                    </div>
                </div>
                <div className="row justify-content-center mt-3">
                    <div className="col-6">

                        <Link className="btn btn-primary" to="/About">
                            Learn More
                        </Link>

                        <Link className="btn btn-primary float-right" to="/Register">
                            Sign Up
                        </Link>

                    </div>
                </div>
            </div>
        )
    }
}