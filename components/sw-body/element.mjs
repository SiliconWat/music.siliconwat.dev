import { onStateChange } from '/components/sw-body/state.mjs';

class SwBody extends HTMLBodyElement {
    constructor() {
        super();

        this.SwPlayer = this.querySelector('sw-player');
        this.SwEditor = this.querySelector('sw-editor');
        this.SwPiano = this.querySelector('sw-piano');

        onStateChange.set = this.onStateChange.bind(this);
    }

    connectedCallback() {
        this.addEventListener('sw-nav', event => this.SwEditor.updateFromNav(event.detail));
        this.addEventListener('sw-player', event => this.SwEditor.updateFromPlayer(event.detail.action));
        this.addEventListener('sw-instrument', event => {
            this.SwPiano.instrument = event.detail.instrument;
            this.SwPiano.audible = ['piano', 'keyboard', 'ASL'].includes(event.detail.instrument);
        });
        this.addEventListener('sw-piano', event => this.SwEditor.updateFromPiano(event.detail));
    }

    onStateChange(state, property, value) {
        if (state[property] !== value) {
            state[property] = value;
            this.SwPlayer.tempo = value;
            this.SwEditor.tempo = value;
            localStorage.setItem('state', JSON.stringify(state));
        }
        return true;
    }
}

customElements.define('sw-body', SwBody, { extends: 'body' });