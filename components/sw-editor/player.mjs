export async function updateFromPlayer(action) {
    switch (action) {
        case "play":
            this.play();
            break;
        case "pause":
            this.pause();
            break;
        case "stop":
            this.stop();
            break;
        case "copy":
            await this.copy();
            break;
        case "paste":
            await this.paste();
            break;
        case "delete":
            this.remove();
            break;
        case "clear":
            this.clear();
            break;
    };
}

export async function copy() {
    if (this.staff.pointer) await navigator.clipboard.writeText(JSON.stringify(this.score[this.clef].notes[this.staff.pointer[0]][this.staff.pointer[1]]));
}

export async function paste() {
    if (this.staff.pointer) {
        const note = JSON.parse(await navigator.clipboard.readText());
        const li = this.shadowRoot.getElementById(`sw-${this.staff.pointer[0]}-${this.staff.pointer[1]}`);
        this.score[this.clef].notes[this.staff.pointer[0]][this.staff.pointer[1]] = note;
        this.renderNote(li, note);
    }
}

export function remove() {
    if (this.staff.pointer) {
        const li = this.shadowRoot.getElementById(`sw-${this.staff.pointer[0]}-${this.staff.pointer[1]}`);
        this.score[this.clef].notes[this.staff.pointer[0]][this.staff.pointer[1]] = {};
        this.renderNote(li, {});
    }
}

export function clear() {
    if (window.confirm("Are you sure you want to delete this entire score?")) {
        this.score[this.clef].notes = [];
        this.render();
    }
}

export function play() {
    if (this.player) {
        this.player.context.resume();
    } else {
        let time = 0;
        this.player = this.musicLibrary.player(this.volume);
        this.score[this.clef].notes.forEach((measure, m) => {
            measure.forEach((note, n) => {
                if (note.pitch) {
                    const duration = this.getDuration(note);
                    //todo: pointer follows note being played...
                    setTimeout(() => this.player.play2(this.getPitch(note), duration), time*1000);
                    //this.player.play(this.getPitch(note), duration, time);
                    time += duration;
                }
            });
        });
    }
}

export function pause() {
    if (this.player) this.player.context.suspend();
}

export function stop() {
    if (this.player) {
        this.player.context.close();
        this.player = null;
    }
}

export function getPitch(note) {
    if (note.pitch === 'rest') {
        return 0;
    } else {
        const accidentals = { sharp: "♯", flat: "♭" };
        const octave = note.pitch[1];
        const accidental = accidentals[note.accidental] || "";
        return this.musicLibrary.frequency(octave, note.pitch[0] + accidental);
    }
}

export function getDuration(note) {
    const beat = this.tempo/60;
    const durations = { whole: beat*4, half: beat*2, quarter: beat };
    return durations[note.duration];
}

export function speak(text, rate=1, pitch=1, voice=11) {
    const synth = window.speechSynthesis;
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = rate;
    speech.pitch = pitch;
    speech.voice = synth.getVoices()[voice];
    console.log(speech.voice)
    synth.speak(speech);
}