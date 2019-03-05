import { bb_main_header } from "./main_elements/bb_main_header"
import { bb_main_list_container } from "./main_elements/bb_main_list_container"
import { bb_favorites_list } from "./main_elements/bb_favorites_list"
import { bb_detailed_display } from "./main_elements/bb_detailed_display"


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
        <bb-main-list-container></bb-main-list-container>
        <bb-favorites-list></bb-favorites-list>
        <bb-detailed-display></bb-detailed-display>`;
    }
}

customElements.define("bear-bank-main", bear_bank_main);