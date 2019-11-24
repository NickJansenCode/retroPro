import axios from "axios";

import {
    GET_ERRORS,

} from "./types";


export const createList = (listData, history) => dispatch => {
    axios
        .post("/api/users/createList", listData)
        .then(res => history.push("/profile/" + listData.userName))
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }));
}

export const editList = (listData, history) => dispatch => {
    axios
        .post("/api/users/editList", listData)
        .then(res => history.push("/profile/" + listData.userName))
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }));
}