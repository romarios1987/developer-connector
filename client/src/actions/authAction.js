import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwtDecode from 'jwt-decode';
import {GET_ERRORS, SET_CURRENT_USER} from "./types";

// Register user
export const registerUser = (userData, history) => (dispatch) => {
  axios.post('/api/users/register', userData)
        .then(res => history.push('/login'))
        .catch(err =>
              dispatch({
                type: GET_ERRORS,
                payload: err.response.data
              })
        )
};


// login get user token
export const loginUser = (userData) => (dispatch) => {
  axios.post('/api/users/login', userData)
        .then(res => {
          // Save to localStorage
          const {token} = res.data;
          // Set token to localStorage
          localStorage.setItem('jwtToken', token);
          // Set token to Auth Header
          setAuthToken(token);
          // Decode token to get User Data
          const decoded = jwtDecode(token);
          // Set current User
          dispatch(setCurrentUser(decoded))
        })
        .catch(err =>
              dispatch({
                type: GET_ERRORS,
                payload: err.response.data
              })
        )
};

// Set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
};

// Log out user

export const logoutUser = () => (dispatch) => {
  // remove token from localStorage
  localStorage.removeItem('jwtToken');
  // Remove auth header for future requests
  setAuthToken(false);
  //set current user to {} which will set is isAuthenticated to false
  dispatch(setCurrentUser({}))
};