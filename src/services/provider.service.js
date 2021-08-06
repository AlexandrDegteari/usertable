import axios from "axios";

const api = 'http://localhost:3003';
const GetAll = () => {
  return axios
    .get(`${api}/providers/`)
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

const AddProvider = (name) => {
  return axios
    .post(`${api}/providers/add/`, {name: name})
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
const UpdateProviderProf = (profile, providerId) => {
  return axios
    .put(`${api}/providers/put/` + providerId, profile)
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


const DeleteProvider = providerId => {
  return axios.delete(`${api}/providers/` + providerId);
};

export default {
  GetAll,
  UpdateProviderProf,
  DeleteProvider,
  AddProvider
};
