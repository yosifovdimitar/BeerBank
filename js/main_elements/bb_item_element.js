class bb_item_element extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = this.html_constructor();
    }

    // Individual item element
    html_constructor() {
        return `<div></div>`;
    }
}

customElements.define("bb-item-element", bb_item_element);