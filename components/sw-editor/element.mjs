import template from './template.mjs';
import { state } from '/components/sw-body/state.mjs';
import { MusicLibrary } from "../sw-body/library.mjs";
import * as noteProperties from './note.mjs';
import * as playerProperties from "./player.mjs";

class SwEditor extends HTMLElement {
    static get observedAttributes() {
        return ['clef', 'tempo'];
    }

    staff = JSON.parse(localStorage.getItem('staff')) || { pointer: null, keySignature: "CM", timeSignature: [4, 4] };
    score = JSON.parse(localStorage.getItem('score')) || {
        treble: {
            scale: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6'],
            notes: []
        },
        bass: {
            scale: ['C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2', 'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4'],
            notes: []
        }
    };
    
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.musicLibrary = new MusicLibrary(432);
        this.player = null;        
    }

    connectedCallback() {
        if (!this.hasAttribute('clef')) this.render();

        this.shadowRoot.querySelector('section').onclick = () => {
            this.dispatchEvent(new CustomEvent('sw-editor', { bubbles: true, composed: true, detail: { answer: true } }));
        }
    }

    render() {
        const section = this.shadowRoot.querySelector('section');
        section.replaceChildren();
        
        const ol = document.createElement('ol');
        ol.classList.add(this.clef);
        section.append(ol);

        this.score[this.clef].notes.forEach((measure, m) => {
            const ol = document.createElement('ol');
            measure.forEach((note, n) => {
                const li = document.createElement('li');
                if (this.staff.pointer && this.staff.pointer[0] === m && this.staff.pointer[1] === n) li.classList.add('pointer');
                li.id = `sw-${m}-${n}`;
                li.onclick = () => this.setPointer(m, n);
                ol.append(li);
                this.renderNote(li, note);
            });
            section.append(ol);
        });
    }

    renderNote(li, note) {
        li.replaceChildren();
        if (note.pitch) {
            const div = document.createElement('div');
            div.classList.add(note.duration)

            if (note.pitch === 'rest') div.classList.add('rest');
            else { 
                div.classList.add('note', note.pitch);
                if (note.duration !== 'whole') div.classList.add('stem', this.score[this.clef].scale.indexOf(note.pitch) < 6 ? 'up' : 'down');
            }

            if (note.accidental) {
                const span = document.createElement('span');
                span.classList.add(note.accidental);
                div.append(span);
            }

            li.append(div);
        }
        localStorage.setItem('score', JSON.stringify(this.score));
    }

    setPointer(measure, note) {
        if (this.staff.pointer) this.shadowRoot.getElementById(`sw-${this.staff.pointer[0]}-${this.staff.pointer[1]}`).classList.remove('pointer');
        this.shadowRoot.getElementById(`sw-${measure}-${note}`).classList.add('pointer');
        this.staff.pointer = [measure, note];
        localStorage.setItem('staff', JSON.stringify(this.staff));
    }

    get clef() {
        return this.getAttribute('clef');
    }

    set clef(value) {
        this.setAttribute('clef', value);
    }

    get tempo() {
        return parseInt(this.getAttribute('tempo'));
    }

    set tempo(value) {
        this.setAttribute('tempo', value);
    }

    get volume() {
        return parseFloat(this.getAttribute('volume'));
    }

    set volume(value) {
        this.setAttribute('volume', value);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue !== oldValue) {
            if (name === 'tempo') {
                if ((!oldValue && !state.tempo) || oldValue) {
                    state.tempo = parseInt(newValue);
                    console.log(state.tempo);
                }
            } else {
                this.staff[name] = newValue;
                this.render();
            }
        }
    }
    
}

//SwEditor.prototype.updateFromPlayer = updateFromPlayer;
Object.assign(SwEditor.prototype, noteProperties, playerProperties);
customElements.define("sw-editor", SwEditor);

// DATA MODEL
// notes: [
//     [{pitch: 'C5', duration: 'whole', accidental: null}, 
//         {pitch: 'C5', duration: 'half', accidental: 'natural'},
//         {pitch: 'C4', duration: 'quarter', accidental: 'flat'},
//         {pitch: 'C6', duration: 'half', accidental: 'sharp'}],
//     [{pitch: 'rest', duration: 'whole'},
//         {pitch: 'rest', duration: 'half'},
//         {pitch: 'rest', duration: 'quarter'},
//         {}],
//         [{}, {}, {}, {}]
// ]