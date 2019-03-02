import { bb_nav_menu } from "./bb_nav_menu"


class bb_main_header extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = this.html_constructor();
        
        this.querySelector("#search-bar-input").addEventListener("input", event => this.input_changed() )
    }

    input_changed() {
        this.dispatchEvent(new CustomEvent('bb-search-input',
        {
            detail: {
                input_value: this.querySelector("#search-bar-input").value.toString().toLowerCase()
            },
            bubble: true, composed: true
        }));
    }

    // Contains all header content    
    html_constructor() {
        return `<bb-nav-menu></bb-nav-menu>
        <div class="the-beer-bank-title">The Beer Bank</div>
        <div class="the-beer-bank-subtitle">Find your favorite beer here</div>
        <input type="text" id="search-bar-input" class="bb-search-bar-input" placeholder="Search for beer name" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Search for beer name'">`;
    }
}

customElements.define("bb-main-header", bb_main_header);