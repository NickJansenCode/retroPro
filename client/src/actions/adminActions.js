import axios from "axios";

import {
    GET_ERRORS,

} from "./types";


export const promoteUser = (userData, history) => dispatch => {
    axios
        .post("/api/users/promoteUser", userData)
        .then(res => window.location.reload())
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }));
}
