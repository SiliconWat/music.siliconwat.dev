import { ORIGIN } from "../sw-body/library.mjs";
const template = document.createElement("template");

template.innerHTML = `
    <link rel="stylesheet" href="${ORIGIN}/components/sw-menubar/shadow.css">
    <slot></slot>
`;

export default template;