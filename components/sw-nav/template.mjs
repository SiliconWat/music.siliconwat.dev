import { ORIGIN } from "../sw-body/library.mjs";
const template = document.createElement("template");

template.innerHTML = `
    <link rel="stylesheet" href="${ORIGIN}/components/sw-nav/shadow.css">
    <ul>
        <!--<li>
            <slot name="menu1"></slot>
            <nav>
                <slot name="menu1-sub1"></slot>
                <slot name="menu1-sub2"></slot>
            </nav>
        </li>
        <li>
        <slot name="menu2"></slot>
            <nav>
                <slot name="menu2-sub1"></slot>
                <slot name="menu2-sub2"></slot>
                <slot name="menu2-sub3"></slot>
            </nav>
        </li>
        <li>
            <h3>Accidental</h3>
            <nav>
                <span>Sharp</span>
                <span>Flat</span>
                <span>Natural</span>
            </nav>
        </li>
        <li>
            <h3>Rest</h3>
            <nav>
                <span>Whole</span>
                <span>Half</span>
                <span>Quarter</span>
            </nav>
        </li>
        <li>
            <h3>Learn</h3>
            <nav>
                <span>Piano Playing</span>
                <span>Sight Reading</span>
                <span>Ear Training</span>
                <span>Rhythm Training</span>
            </nav>
        </li>-->
    </ul>
`;

export default template;