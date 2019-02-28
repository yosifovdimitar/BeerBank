import { bb_item_element } from "./bb_item_element"

class bb_main_list_container extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = this.html_constructor();
    }
    
    // Contains the main list of items
    html_constructor() {
        return `<div class="bb-list-container">
        <div id="list-elements" class="bb-list-elements">
        <bb-item-element></bb-item-element>
        <bb-item-element></bb-item-element>
        <bb-item-element></bb-item-element>
        <bb-item-element></bb-item-element>
        <bb-item-element></bb-item-element>
        <bb-item-element></bb-item-element>
        </div>
        </div>`;
    }
}

customElements.define("bb-main-list-container", bb_main_list_container);