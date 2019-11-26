import React, { Component } from "react";
import { Link } from "react-router-dom";
import landing from "../../img/retroProLogo.png";

export default class Register extends Component {
    render() {
        return (
            <div className="container">
                <div className="row mt-3">
                    <div className="col-12">
                        <h1>About</h1>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-6">
                        <p>
                            retroPro is a web application that is dedicated to getting you
                            the most out of your game collection. With a focus on retro gaming,
                            dive in and start tracking your game collection today!
                        </p>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-3">
                        <img src={landing}></img>
                    </div>
                    <div className="col-3">
                        <img src={landing}></img>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-6">
                        <p>
                            When you sign up for retroPro, you can highlight your favourite items,
                            organize your collection into lists, create your wishlist, and find a
                            place to buy games in your city all in one convenient, centralized place.
                        </p>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-6">
                        <Link className="btn btn-primary w-50" to="/Register">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}