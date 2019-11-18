import axios from "axios";

import {
    GET_ERRORS,

} from "./types";


export const submitGame = (gameData, history) => dispatch => {
    axios
        .post("/api/games/submit", gameData)
        .then(res => history.push("/"))
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }));
}
