import React, { Component } from "react";
import axios from "axios";


export default class Game extends Component{
    constructor(){
        super();
        this.state = {
            "game": "",
            "platform": ""
        };
    }

    componentDidMount(){
        
        axios.get(`/api/games/getByName/${this.props.match.params.name}`)
        .then(res => {
            console.log(res);
            this.setState({
                "game" : res.data,
                "platform": res.data.platform.name
            });
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
                            <button className="btn btn-primary btn-large">I Have Played This Game</button>
                        </div>
                        <div className="mt-2">
                            <button className="btn btn-primary btn-large">Add Game To Collection</button>
                        </div>
                        <div className="mt-2">
                            <button className="btn btn-primary btn-large">Add Game to Wishlist</button>
                        </div>
                        <div className="mt-2">
                            <button className="btn btn-primary btn-large">Share Game</button>
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