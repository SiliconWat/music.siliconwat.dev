import template from './template.mjs';
import { state } from '/components/sw-body/state.mjs';

class SwPlayer extends HTMLElement {
    #min = 10;
    #max = 300;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.input = this.shadowRoot.querySelector('input');
        this.input.min = this.#min;
        this.input.max = this.#max;
        this.input.value = state.tempo;
    }

    connectedCallback() {
        ['play', 'pause', 'stop', 'copy', 'paste', 'delete', 'clear'].forEach(action => this.shadowRoot.getElementById(action).onclick = () => this.dispatchEvent(new CustomEvent("sw-player", { bubbles: true, composed: true, detail: { action }})));
        
        this.input.onkeyup = () => state.tempo = this.input.value;
        this.input.onchange = () => { 
            const tempo = parseInt(this.input.value);
            if (tempo < this.#min) state.tempo = this.#min
            else if (tempo > this.#max) state.tempo = this.#max
            else state.tempo = tempo;
        };
    }

    set tempo(value) {
        this.input.value = value;
        console.log(state.tempo);
    }
}

customElements.define("sw-player", SwPlayer);