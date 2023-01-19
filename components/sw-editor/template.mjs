import { ORIGIN } from "../sw-body/library.mjs";
const template = document.createElement("template");

template.innerHTML = `
    <link rel="stylesheet" href="${ORIGIN}/components/sw-editor/sheets.css">
    <link rel="stylesheet" href="${ORIGIN}/components/sw-editor/notes.css">
    <section>
        <!--<ol class="treble"></ol>
        <ol>
            <li>
                <div class="note whole C5">
                    <span class="sharp"></span>
                </div>
            </li>
            <li>
                <div class="note half C5 stem down">
                    <span class="natural"></span>
                </div>
            </li>
            <li>
                <div class="note quarter C4 stem up">
                    <span class="flat"></span>
                </div>
            </li>
            <li>
                <div class="note half C6 stem down">
                    <span class="sharp"></span>
                </div>
            </li>
        </ol>
        <ol>
            <li>
                <div class="rest whole"></div>
            </li>
            <li>
                <div class="rest half"></div>
            </li>
            <li>
                <div class="rest quarter"></div>
            </li>
            <li></li>
        </ol>
        <ol>
        </ol>
        <ol>
        </ol>
        <ol>
        </ol>
        <ol>
        </ol>
        <ol>
        </ol>
        <ol>
        </ol>
        <ol>
        </ol>
        <ol>
        </ol>
        <ol>
        </ol>-->
    </section>
`;

export default template;