export function onInstrumentChange(oldValue, newValue) {
    if (oldValue === newValue) {
        this.host.parentElement.style.display = this.host.parentElement.style.display === 'block' ? 'none' : 'block';
        switch (newValue) {
            case "piano":
                break;
            case "keyboard":
                window.onkeyup ? this.unbindInstrument('keyboard') : this.bindInstrument('keyboard');
                break;
            case "midi":
                break;
            case "voice":
                break;
            case "speech":
                if (this.listening) {
                    this.listening = false;
                    this.unbindInstrument('speech');
                } else this.bindInstrument('speech');
                break;
            case "ASL":
                break;
        }
    } else {
        this.host.parentElement.style.display = 'block';
        if (oldValue === 'speech') this.listening = false;
        this.unbindInstrument(oldValue);
        this.bindInstrument(newValue);
    }
}

export function bindInstrument(instrument) {
    switch (instrument) {
        case "piano":
            break;
        case "keyboard":
            window.onkeyup = this.keyboard.bind(this);
            break;
        case "midi":
            break;
        case "voice":
            break;
        case "speech":
            this.recognition.start();
            break;
        case "ASL":
            break;
    }
}

export function unbindInstrument(instrument) {
    switch (instrument) {
        case "piano":
            break;
        case "keyboard":
            window.onkeyup = null;
            break;
        case "midi":
            break;
        case "voice":
            break;
        case "speech":
            this.recognition.stop();
            break;
        case "ASL":
            break;
    }
}