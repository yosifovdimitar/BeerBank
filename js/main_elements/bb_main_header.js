import { bb_nav_menu } from "./bb_nav_menu"


export class bb_main_header extends HTMLElement {

    constructor() {
        super();
        
        // Listens for the favorite button event, in order to change the view from Main to Favorites specific.
        document.addEventListener('bb-favorite-button', this.handle_mbox_message.bind(this), true);
        // Tracks the status of what is active at the moment.
        this.favorites_display = "hidden";
    }

    connectedCallback() {
        this.innerHTML = this.html_constructor();
        
        this.querySelector("#search-bar-input").addEventListener("input", event => this.input_changed() )
    }

    handle_mbox_message() {
        switch (event.detail.action) {
            case 'favorite-button-clicked':
                this.handle_favorite_button_clicked();
                break;

            default:
                break;
        }
    }

    // Shows or hides elements in order to change the view from Main to Favorites specific.
    handle_favorite_button_clicked() {
        if(this.favorites_display === "hidden"){
            this.favorites_display = "showing";
            this.querySelector("#search-bar-input").classList.remove("show-item");
            this.querySelector("#search-bar-input").classList.add("hide-item");
            this.querySelector("#beer-bank-title").classList.remove("show-item");
            this.querySelector("#beer-bank-title").classList.add("hide-item");
            this.querySelector("#beer-bank-subtitle").classList.remove("show-item");
            this.querySelector("#beer-bank-subtitle").classList.add("hide-item");

            this.querySelector("#favorites-list").classList.remove("hide-item");
            this.querySelector("#favorites-list").classList.add("show-item");
            this.querySelector("#favorites-subtitle").classList.remove("hide-item");
            this.querySelector("#favorites-subtitle").classList.add("show-item");
        } else {
            this.favorites_display = "hidden";            
            this.querySelector("#search-bar-input").classList.remove("hide-item");
            this.querySelector("#search-bar-input").classList.add("show-item");
            this.querySelector("#beer-bank-title").classList.remove("hide-item");
            this.querySelector("#beer-bank-title").classList.add("show-item");
            this.querySelector("#beer-bank-subtitle").classList.remove("hide-item");
            this.querySelector("#beer-bank-subtitle").classList.add("show-item");
            
            this.querySelector("#favorites-list").classList.remove("show-item");
            this.querySelector("#favorites-list").classList.add("hide-item");
            this.querySelector("#favorites-subtitle").classList.remove("show-item");
            this.querySelector("#favorites-subtitle").classList.add("hide-item");
        }
    }

    // Sends a message to the Main Container with the input value of the search box, in order for it to populate the list.
    input_changed() {
        this.dispatchEvent(new CustomEvent('bb-search-input',
        {
            detail: {
                input_value: this.querySelector("#search-bar-input").value.toString().toLowerCase(),
                action: "search"
            },
            bubble: true, composed: true
        }));
    }

    // Contains all header content    
    html_constructor() {
        return `<bb-nav-menu></bb-nav-menu>
        <div id="beer-bank-title" class="the-beer-bank-title">The Beer Bank</div>
        <div id="beer-bank-subtitle" class="the-beer-bank-subtitle">Find your favorite beer here</div>
        <input type="text" id="search-bar-input" class="bb-search-bar-input" placeholder="Search for beer name" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Search for beer name'">
        <div id="favorites-list" class="bb-favorites-list hide-item">Favorites List</div>
        <div id="favorites-subtitle" class="bb-favorites-subtitle hide-item">To add or remove items from your favorites list, please click on the star.</div>`;
    }
}

customElements.define("bb-main-header", bb_main_header);