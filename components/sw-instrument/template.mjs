import { ORIGIN } from "../sw-body/library.mjs";
const template = document.createElement("template");

template.innerHTML = `
    <link rel="stylesheet" href="${ORIGIN}/components/sw-instrument/shadow.css">
    <ul>
        <li id="piano">🎹</li>
        <li id="keyboard">⌨️</li>
        <li id="midi">⎋</li>
        <li id="voice">🎙</li>
        <li id="speech">🎤</li>
        <li id="ASL">📷</li>
    </ul>
`;

export default template;