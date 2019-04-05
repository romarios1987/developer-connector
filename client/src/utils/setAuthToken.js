import axios from 'axios';

const setAuthToken = (token) => {
  if (token) {
    // Apple to every request
    axios.defaults.headers.common['Authorization'] = token;
  } else {
    // Delete auth header
    delete axios.defaults.common['Authorization']
  }
};

export default setAuthToken;