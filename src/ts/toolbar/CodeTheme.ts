import {Constants} from "../constants";
import {getEventName} from "../util/compatibility";
import {MenuItem} from "./MenuItem";
import {hidePanel, toggleSubMenu} from "./setToolbar";
import {highlightRender} from "../markdown/highlightRender";

export const setCodeTheme = (vditor: IVditor, codeTheme: string) => {
    if (!codeTheme) {
        return;
    }
    vditor.options.preview.hljs.style = codeTheme;
    if (vditor.currentMode === "sv") {
        if (vditor.preview.element.style.display !== "none") {
            highlightRender({
                    enable: vditor.options.preview.hljs.enable,
                    lineNumber: vditor.options.preview.hljs.lineNumber,
                    style: vditor.options.preview.hljs.style,
                },
                vditor.preview.element, vditor.options.cdn);
        }
    } else {
        highlightRender({
                enable: true,
                lineNumber: vditor.options.preview.hljs.lineNumber,
                style: vditor.options.preview.hljs.style,
            },
            vditor[vditor.currentMode].element, vditor.options.cdn);
    }
};

export class CodeTheme extends MenuItem {
    public element: HTMLElement;

    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);

        const actionBtn = this.element.children[0] as HTMLElement;

        const panelElement = document.createElement("div");
        panelElement.className = `vditor-hint vditor-panel--${menuItem.level === 2 ? "side" : "arrow"}`;
        let innerHTML = "";
        Constants.CODE_THEME.forEach((theme) => {
            innerHTML += `<button>${theme}</button>`;
        });
        panelElement.innerHTML =
            `<div style="overflow: auto;max-height:${window.innerHeight / 2}px">${innerHTML}</div>`;
        panelElement.addEventListener(getEventName(), (event: MouseEvent & { target: HTMLElement }) => {
            if (event.target.tagName === "BUTTON") {
                hidePanel(vditor, ["subToolbar"]);
                setCodeTheme(vditor, event.target.textContent);
                event.preventDefault();
                event.stopPropagation();
            }
        });
        this.element.appendChild(panelElement);

        toggleSubMenu(vditor, panelElement, actionBtn, menuItem.level);
    }
}
