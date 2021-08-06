import axios from "axios";

const api = 'http://localhost:3003';
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

const AddUser = (profile) => {
  return axios
    .post(`${api}/users/add/`, profile)
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

const AddProviderToUser = (body) => {
  return axios
    .put(`${api}/users/addto/`, body)
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
const RemoveProviderFromUser = (body) => {
  return axios
    .put(`${api}/users/removefrom/`, body)
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


const DeleteUser = userId => {
  return axios.delete(`${api}/users/` + userId);
};

export default {
  GetUsers,
  AddProviderToUser,
  UpdateUserProf,
  DeleteUser,
  AddUser,
  RemoveProviderFromUser
};
