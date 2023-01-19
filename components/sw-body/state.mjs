const STATE = JSON.parse(localStorage.getItem('state')) || {};

export const onStateChange = {
    set(state, property, value) {
        state[property] = value;
        return true;
    }
};

export const state = new Proxy(STATE, onStateChange);