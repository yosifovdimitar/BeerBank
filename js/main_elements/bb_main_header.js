import { bb_nav_menu } from "./bb_nav_menu"


class bb_main_header extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = this.html_constructor();
    }

    // Contains all header content    
    html_constructor() {
        return `<bb-nav-menu></bb-nav-menu>
        <div class="the-beer-bank-title">The Beer Bank</div>
        <div class="the-beer-bank-subtitle">Find your favorite beer here</div>
        <input type="text" class="search-bar-input" placeholder="Search for beer name" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Search for beer name'">`;
    }
}

customElements.define("bb-main-header", bb_main_header);