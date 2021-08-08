import UserService from "src/services/user.service";
const state = {
  users: [],
  userProviders: []
};

const getters = {
  getUsers(state) {
    return state.users
  },
  getUserProviders(state) {
    return state.userProviders
  }
};
const actions = {
  setUsers({commit}, users) {
    commit('setUsers', users);
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
  addUserProviders(state, provider) {
    let exist = state.userProviders.some(el => el._id === provider._id)
    if (!exist) {
      this.$store.commit('pushProvider', provider)
    } else {
      this.$store.commit('pullProvider', provider)
    }
    state.userProviders = user.providers
  },
  setUserProviders(state, user) {
    state.userProviders = user.providers
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
