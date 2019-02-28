import { bb_main_header } from "./main_elements/bb_main_header"
import { bb_main_list } from "./main_elements/bb_main_list_container"


class bear_bank_main extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = this.html_constructor();
    }
    
    // The HTML constructor allows for composition and modularity when the class is extended.
    html_constructor() {
        return `<bb-main-header></bb-main-header>
        <bb-main-list-container></bb-main-list-container>`;
    }
}

customElements.define("bear-bank-main", bear_bank_main);