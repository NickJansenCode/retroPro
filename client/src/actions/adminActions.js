import axios from "axios";

import {
    GET_ERRORS,

} from "./types";


export const promoteUser = (userData) => dispatch => {
    axios
        .post("/api/users/promoteUser", userData)
        .then(res => window.location.reload())
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }));
}

export const banUser = (userData) => dispatch => {
    axios
        .post("/api/users/banUser", userData)
        .then(res => window.location.reload())
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }));
}

export const deleteUser = (userData) => dispatch => {
    axios
        .post("/api/users/deleteUser", userData)
        .then(res => window.location.reload())
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }));
}