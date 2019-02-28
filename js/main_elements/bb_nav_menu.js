class bb_nav_menu extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = this.html_constructor();
    }
    
    // Navigation menu
    html_constructor() {
        return `<div class="bb-nav-menu-container">
        <div id="home-button" class="bb-home-button">HOME</div>
        <div id="favorite-button" class="bb-favorite-button">FAVORITE</div>`;
    }
}

customElements.define("bb-nav-menu", bb_nav_menu);