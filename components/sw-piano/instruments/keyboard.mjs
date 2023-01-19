const keyCodes = {
    81: [12, "q"],
    188: [12, ","],
    50: [13, 2],
    76: [13, "l"],
    87: [14, "w"],
    190: [14, "."],
    51: [15, 3],
    186: [15, ";"],
    69: [16, "e"],
    191: [16, "/"]
}

export function keyboard(event) {
    let index, key;
    if (keyCodes[event.keyCode]) {
        [ index, key ] = keyCodes[event.keyCode];
    } else {
        key = String.fromCharCode(event.keyCode).toLowerCase();
        index = this.instruments.keyboard[this.clef].indexOf(key);
    }
    if (index !== -1) this.dispatch("keyboard", this.clef, key, index);
}