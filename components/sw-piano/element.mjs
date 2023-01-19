import template from './template.mjs';
import { MusicLibrary } from "../sw-body/library.mjs";
import * as instrumentProperties from "./instruments/instrument.mjs";
import * as keyboardProperties from "./instruments/keyboard.mjs";
import * as speechProperties from "./instruments/speech.mjs";

class SwPiano extends HTMLElement {
    static #musicLibrary = new MusicLibrary(440);
    static #treble = ['C4', 'C4♯', 'D4', 'D4♯', 'E4', 'F4', 'F4♯', 'G4', 'G4♯', 'A4', 'A4♯', 'B4', 'C5', 'C5♯', 'D5', 'D5♯', 'E5', 'F5', 'F5♯', 'G5', 'G5♯', 'A5', 'A5♯', 'B5', 'C6'];
    static #bass = ['C2', 'D2♭', 'D2', 'E2♭', 'E2', 'F2', 'G2♭', 'G2', 'A2♭', 'A2', 'B2♭', 'B2', 'C3', 'D3♭', 'D3', 'E3♭', 'E3', 'F3', 'G3♭', 'G3', 'A3♭', 'A3', 'B3♭', 'B3', 'C4'];
    
    static #pitch(key) {
        const pitch = {};
        pitch.octave = key[1];
        pitch.noteClass = key[0];
        pitch.accidental = key[2] || "";
        pitch.note = pitch.noteClass + pitch.accidental;
        pitch.audio = SwPiano.#musicLibrary.audio(pitch.octave, pitch.note, this.volume);
        pitch.synth = SwPiano.#musicLibrary.synth(pitch.octave, pitch.note, this.volume, this.synth);
        return pitch;
    }

    static #clef = {
        treble: SwPiano.#treble.map(key => SwPiano.#pitch(key)),
        bass: SwPiano.#bass.map(key => SwPiano.#pitch(key)),
    }

    static get observedAttributes() {
        return ['instrument', 'clef'];
    }

    host;
    listening;
    instruments = {
        piano: {
            treble: SwPiano.#treble,
            bass: SwPiano.#bass
        },
        speech: {
            treble: SwPiano.#treble,
            bass: SwPiano.#bass
        },
        keyboard: {
            treble: ['z', 's', 'x', 'd', 'c', 'v', 'g', 'b', 'h', 'n', 'j', 'm', 'q<br>,', '2<br>l', 'w<br>.', '3<br>;', 'e<br>/', 'r', '5', 't', '6', 'y', '7', 'u', 'i'],
            bass: ['z', 's', 'x', 'd', 'c', 'v', 'g', 'b', 'h', 'n', 'j', 'm', 'q<br>,', '2<br>l', 'w<br>.', '3<br>;', 'e<br>/', 'r', '5', 't', '6', 'y', '7', 'u', 'i']
        },
        midi: {
            treble: ['60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84'],
            bass: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60']
        },
        voice: { 
            treble: SwPiano.#clef.treble.map(pitch => [SwPiano.#musicLibrary.solfege(pitch.octave, pitch.note), Math.round(SwPiano.#musicLibrary.frequency(pitch.octave, pitch.note))]),
            bass: SwPiano.#clef.bass.map(pitch => [SwPiano.#musicLibrary.solfege(pitch.octave, pitch.note), Math.round(SwPiano.#musicLibrary.frequency(pitch.octave, pitch.note))])
        },
        ASL: {
            treble: SwPiano.#clef.treble.map(pitch => SwPiano.#musicLibrary.asl(pitch.octave, pitch.noteClass)),
            bass: SwPiano.#clef.bass.map(pitch => SwPiano.#musicLibrary.asl(pitch.octave, pitch.noteClass))
        }
    }

    constructor() {
        const host = super();
        this.host = host; //TODO: remove
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        if (!this.instrument && !this.clef) this.render('piano', 'treble');
        this.recognition = this.speech();
    }

    render(instrument, clef) {
        const ul = this.shadowRoot.querySelector('ul');
        ul.replaceChildren();
        this.instruments[instrument][clef].forEach((key, index) => {
            const li = document.createElement('li');
            li.onclick = () => this.dispatch(instrument, clef, key, index);
            const span = document.createElement('span');

            switch (instrument) {
                case "piano":
                    span.textContent = key; // innerHTML required for html entities
                    break;
                case "keyboard":
                    span.innerHTML = key;
                    break;
                case "midi":
                    span.appendChild(document.createTextNode(key));
                    break;
                case "voice":
                    span.append(key[0], document.createElement('br'), key[1]);
                    break;
                case "speech":
                    span.textContent = key;
                    break;
                case "ASL":
                    const img = document.createElement('img');
                    img.src = key;
                    span.append(img);
                    break;
            }

            li.append(span);
            ul.append(li);
        });
    }

    dispatch(instrument, clef, key, index) {
        const pitch = eval(`SwPiano.#${clef}`)[index];
        const { audio, synth } = SwPiano.#pitch(pitch);
        if (this.audible) this.synth ? synth.play() : audio.play();
        this.dispatchEvent(new CustomEvent("sw-piano", { bubbles: true, composed: true, detail: { instrument, clef, key, pitch, audio, synth }}));
    }

    get instrument() {
        return this.getAttribute('instrument');
    }

    set instrument(value) {
        this.setAttribute('instrument', value);
    }

    get clef() {
        return this.getAttribute('clef');
    }

    set clef(value) {
        this.setAttribute('clef', value);
    }

    get synth() {
        return this.getAttribute('synth');
    }

    set synth(value) {
        this.setAttribute('synth', value);
    }

    get volume() {
        return parseFloat(this.getAttribute('volume'));
    }

    set volume(value) {
        this.setAttribute('volume', value);
    }

    get audible() {
        return this.hasAttribute('audible');
    }

    set audible(value) {
        Boolean(value) ? this.setAttribute('audible', '') : this.removeAttribute('audible');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'instrument') this.onInstrumentChange(oldValue, newValue);
        if (newValue !== oldValue) this.render(this.instrument || "piano", this.clef || "treble");
    }

}

Object.assign(SwPiano.prototype, instrumentProperties, keyboardProperties, speechProperties);
customElements.define("sw-piano", SwPiano);