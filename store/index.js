
    export const state = () => ({
        count: 0,
        lang:'ar'
    });
    
    export const mutations = {
        CHANGE_LANG: (state, payload) => {
            state.lang = payload;
        }
    };

    export const actions = {

    };

    export const getters = {

    };