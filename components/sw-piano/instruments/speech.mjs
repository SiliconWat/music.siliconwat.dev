export function speech() {
    const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
    const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
    //const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

    const colors = [ 'red' , 'orange' , 'yellow', 'green', 'blue', 'indigo', 'violet' ];
    const grammar = `#JSGF V1.0; grammar colors; public <color> = ${colors.join(' | ')};`

    const recognition = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList();
    
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        this.listening = true;
    }

    recognition.onend = () => {
        this.listening ? recognition.start() : recognition.abort();
    };

    recognition.onresult = event => {
        console.log(event.results[0][0].transcript, event.results[0][0].confidence);
    };

    recognition.onerror = event => {
        console.log(event.error);
    };

    return recognition;
}