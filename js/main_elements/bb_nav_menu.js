export class bb_nav_menu extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = this.html_constructor();
        this.querySelector("#home-button").addEventListener("pointerdown", event => this.home_button_clicked());
        this.querySelector("#favorite-button").addEventListener("pointerdown", event => this.favorite_button_clicked());
    }


    home_button_clicked() {
        location.reload(true);
    }
    
    // Sends a message in order to hide or show different elements and transform the view to Favorites page.
    favorite_button_clicked() {
        this.dispatchEvent(new CustomEvent('bb-favorite-button',
        {
            detail: {
                action: "favorite-button-clicked"
            },
            bubble: true, composed: true
        }));
    }

    // Navigation menu
    html_constructor() {
        return `<div class="bb-nav-menu-container">
        <div id="home-button" class="bb-home-button">HOME</div>
        <div id="favorite-button" class="bb-favorite-button">FAVORITE</div>`;
    }
}

customElements.define("bb-nav-menu", bb_nav_menu);