import axios from "axios";
import jwt_decode from "jwt-decode";

const api = 'http://localhost:3003';
  axios.defaults.headers.common["Authorization"] = localStorage.getItem(
    "access_token"
  );
const GetUserInfo = () => {
  return axios
    .get(`${api}/users/current`)
    .then(response => {
      if (response.data) {
        return response.data;
      }
      return false;
    })
    .catch(error => {
      return {error};
    });
};

const GetUsers = (limit = 0, skip = 0) => {
  return axios
    .get(`${api}/users/?limit=${limit}&skip=${skip}`)
    .then(response => {
      if (response.data) {
        return response.data;
      }
      return false;
    })
    .catch(error => {
      return {error};
    });
};
const GetUserById = userId => {
  return axios
    .get(`${api}/users/get/` + userId)
    .then(response => {
      if (response.data) {
        return response.data;
      }
      return false;
    })
    .catch(error => {
      return {error};
    });
};

const GetUserByName = name => {
  return axios
    .put(`${api}/users/name`, name)
    .then(response => {
      if (response.data) {
        return response.data;
      }
      return false;
    })
    .catch(error => {
      return {error};
    });
};

const UpdateProfile = profile => {
  let userId = jwt_decode(localStorage.getItem("access_token")).sub;
  return axios
    .put(`${api}/users/put/` + userId, profile)
    .then(response => {
      if (response.data) {
        return response.data;
      }
      return false;
    })
    .catch(error => {
      return {error};
    });
};
const UpdateUserProf = (profile, userId) => {
  return axios
    .put(`${api}/users/put/` + userId, profile)
    .then(response => {
      if (response.data) {
        return response.data;
      }
      return false;
    })
    .catch(error => {
      return {error};
    });
};

const UpdatePassword = password => {
  let userId = jwt_decode(localStorage.getItem("access_token")).sub;
  return axios.put(`${api}/users/` + userId, password);
};

const UpdateUserPass = (password, userId) => {
  return axios.put(`${api}/users/` + userId, password);
};


const Upload = file => {
  return axios
    .post(`https://api.qmenu.me/users/upload`, file,{
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'multipart/form-data',
        Accept: "multipart/form-data",
      }})
    .then(response => {
      if (response.data) {
        return response.data;
      }
      return false;
    })
    .catch(error => {
      return {error};
    });
};



const DeleteUser = userId => {
  return axios.delete(`${api}/users/` + userId);
};

export default {
  GetUserInfo,
  GetUsers,
  UpdateProfile,
  UpdatePassword,
  UpdateUserProf,
  UpdateUserPass,
  GetUserById,
  GetUserByName,
  Upload,
  DeleteUser
};
