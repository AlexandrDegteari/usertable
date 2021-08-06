import ProviderService from "src/services/provider.service";

const state = {
  providers: []
};

const getters = {
  getProviders(state) {
    return state.providers
  }
};
const actions = {
  setProviders({commit}, providers) {
    commit('setProviders', providers);
  },
  fetchProviders({commit}) {
    ProviderService.GetAll()
        .then(providers => {
          commit('setProviders', providers);
    })
  },
};
const mutations = {
  setProviders(state, providers) {
    state.providers = providers
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
