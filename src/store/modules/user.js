import UserService from "src/services/user.service";
const state = {
  users: [],
  activeUser: null
};

const getters = {
  getUsers(state) {
    return state.users
  }
};
const actions = {
  setUsers({commit}, users) {
    commit('setUsers', users);
  },
  setActiveProviders({commit}, user) {
    commit('setActiveProviders', user);
  },
  setActiveUser({commit}, user) {
    commit('setActiveUser', user);
  },
  fetchUsers({commit}) {
    UserService.GetUsers()
        .then(users => {
          commit('setUsers', users);
    })
  }
};
const mutations = {
  setUsers(state, users) {
    state.users = users
  },
  setActiveUser(state, user) {
    state.activeUser = user
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
