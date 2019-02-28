class bear_bank_main extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = this.html_constructor();
    }
    
    // The constructor allows for composition and modularity, if the class is extended.
    html_constructor() {
        return `<div>Hello World!</div>`;
    }
}

customElements.define("bear-bank-main", bear_bank_main)