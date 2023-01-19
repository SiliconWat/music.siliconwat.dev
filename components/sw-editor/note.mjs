export function updateFromNav(nav) {
    switch (nav.menu) {
        case "Measure":
            this.updateMeasure(nav.submenu);
            break;
        case "Note":
            this.updateNote(nav.submenu.toLowerCase());
            break;
        case "Accidental":
            this.updateAccidental(nav.submenu.toLowerCase());
            break;
        case "Rest":
            this.updateRest(nav.submenu.toLowerCase());
            break;
    }
}

export function updateMeasure(action) {
    const measure = this.staff.pointer ? this.staff.pointer[0] : this.score[this.clef].notes.length - 1;

    switch (action) {
        case "Add":
            this.score[this.clef].notes.splice(measure + 1, 0, [{}, {}, {}, {}]);
            break;
        case "Remove":
            this.score[this.clef].notes.splice(measure, 1);
            break;
    }

    this.staff.pointer = null; //todo later: reset pointer to new position?
    this.render(); //todo later: render only the measure? prob not bc li#id
}

export function updateNote(duration) {
    if (this.staff.pointer) {
        const note = this.score[this.clef].notes[this.staff.pointer[0]][this.staff.pointer[1]];
        const li = this.shadowRoot.getElementById(`sw-${this.staff.pointer[0]}-${this.staff.pointer[1]}`);
        
        note.pitch = note.pitch || "C4";
        note.duration = duration;

        this.renderNote(li, note);
    }
}

export function updateAccidental(accidental) {
    if (this.staff.pointer) {
        const note = this.score[this.clef].notes[this.staff.pointer[0]][this.staff.pointer[1]];
        const li = this.shadowRoot.getElementById(`sw-${this.staff.pointer[0]}-${this.staff.pointer[1]}`);
        
        note.pitch = note.pitch || "C4";
        note.duration = note.duration || 'whole';
        note.accidental = accidental === note.accidental ? null : accidental;

        this.renderNote(li, note);
    }
}

export function updateRest(duration) {
    if (this.staff.pointer) {
        const note = this.score[this.clef].notes[this.staff.pointer[0]][this.staff.pointer[1]];
        const li = this.shadowRoot.getElementById(`sw-${this.staff.pointer[0]}-${this.staff.pointer[1]}`);
        
        note.pitch = "rest";
        note.duration = duration;
        note.accidental = null;

        this.renderNote(li, note);
    }
}

export function updateFromPiano(piano) {
    //piano.synth.play();
    if (this.staff.pointer) {
        const pitch = piano.pitch.substring(0, 2);
        const accidentals = {"♯": "sharp", "♭": "flat", "♮": "natural"};
        const accidental = accidentals[piano.pitch[2]] || null;
        
        const note = this.score[this.clef].notes[this.staff.pointer[0]][this.staff.pointer[1]];
        const li = this.shadowRoot.getElementById(`sw-${this.staff.pointer[0]}-${this.staff.pointer[1]}`);
        
        note.pitch = pitch;
        note.accidental = accidental;
        note.duration = note.duration || 'whole';

        this.renderNote(li, note);
        //this.setPitch(pitch);
        //this.setAccidental(accidental);
    }
}

//deprecated
export function setPitch(pitch) {
    const note = this.score[this.clef].notes[this.staff.pointer[0]][this.staff.pointer[1]];
    const li = this.shadowRoot.getElementById(`sw-${this.staff.pointer[0]}-${this.staff.pointer[1]}`);
    
    if (li.firstElementChild) {
        li.firstElementChild.classList.replace(note.pitch, pitch);
        note.pitch = pitch;
    } else  {
        note.pitch = pitch;
        note.duration = 'whote';
        const div = document.createElement('div');
        div.classList.add('note', 'whole', pitch);
        li.append(div);
    }
}

//deprecated
export function setAccidental(accidental) {
    const note = this.score[this.clef].notes[this.staff.pointer[0]][this.staff.pointer[1]];
    note.accidental = accidental;
    const li = this.shadowRoot.getElementById(`sw-${this.staff.pointer[0]}-${this.staff.pointer[1]}`);

    if (accidental) {
        if (li.firstElementChild.firstElementChild) {
            li.firstElementChild.firstElementChild.classList.replace(note.accidental, accidental);
        } else {
            const span = document.createElement('span');
            span.classList.add(accidental);
            li.firstElementChild.append(span);
        }  
    } else {
        if (li.firstElementChild.firstElementChild) {
            li.firstElementChild.replaceChildren();
        }   
    }
}