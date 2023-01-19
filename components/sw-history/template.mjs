import { ORIGIN } from "../sw-body/library.mjs";
const template = document.createElement("template");

template.innerHTML = `
    <link rel="stylesheet" href="${ORIGIN}/components/sw-history/shadow.css">
    <ul>
        <li>
            <select>
                <option>File 1</option>
                <option>File 2</option>
            </select>
        </li>
        <li id="undo">↩️</li>
        <li id="redo">↪️</li>
        <li id="rename">🔤</li>
        <li id="remove">🚮</li>
        <li id="new">🆕</li>
        <li id="logout">🛂</li>
    </ul>
`;

export default template;