import { bb_nav_menu } from "./bb_nav_menu"


export class bb_main_header extends HTMLElement {

    constructor() {
        super();

        // Listens for the favorite button event, in order to change the view from Main to Favorites specific.
        document.addEventListener('bb-favorite-button', this.handle_mbox_message.bind(this), true);
        // Tracks the status of what is active at the moment.
        this.favorites_display = "hidden";
        this.search_display = "hidden";
    }

    connectedCallback() {
        this.innerHTML = this.html_constructor();
        this.querySelector("#advanced-inputs-container").classList.add("hide-item");
        this.querySelector("#clear-values").classList.add("hide-item");

        this.querySelector("#search-bar-input").addEventListener("input", event => this.input_changed());
        this.querySelector("#max-ibu-input").addEventListener("input", event => this.input_changed());
        this.querySelector("#min-ibu-input").addEventListener("input", event => this.input_changed());
        this.querySelector("#max-abv-input").addEventListener("input", event => this.input_changed());
        this.querySelector("#min-abv-input").addEventListener("input", event => this.input_changed());
        this.querySelector("#max-ebc-input").addEventListener("input", event => this.input_changed());
        this.querySelector("#min-ebc-input").addEventListener("input", event => this.input_changed());
        this.querySelector("#year-before-input").addEventListener("input", event => this.input_changed());
        this.querySelector("#year-after-input").addEventListener("input", event => this.input_changed());

        this.querySelector("#advanced-search").addEventListener("pointerdown", event => this.advanced_search_display());
        this.querySelector("#clear-values").addEventListener("pointerdown", event => this.clear_advanced_input());
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

    // Displays or hides the advanced search options.
    advanced_search_display() {
        if (this.search_display === "hidden") {
            this.querySelector("#advanced-inputs-container").classList.remove("hide-item");
            this.querySelector("#advanced-inputs-container").classList.add("show-item-flex");
            this.querySelector("#clear-values").classList.remove("hide-item");
            this.querySelector("#clear-values").classList.add("show-item");
            this.search_display = "showing";
        } else {
            this.querySelector("#advanced-inputs-container").classList.remove("show-item-flex");
            this.querySelector("#advanced-inputs-container").classList.add("hide-item");
            this.querySelector("#clear-values").classList.remove("show-item");
            this.querySelector("#clear-values").classList.add("hide-item");
            this.search_display = "hidden";
        }
    }

    // Clears all inputs and triggers the initial list.
    clear_advanced_input() {
        this.querySelector("#max-ibu-input").value = '';
        this.querySelector("#min-ibu-input").value = '';
        this.querySelector("#max-abv-input").value = '';
        this.querySelector("#min-abv-input").value = '';
        this.querySelector("#max-ebc-input").value = '';
        this.querySelector("#min-ebc-input").value = '';
        this.querySelector("#year-before-input").value = '';
        this.querySelector("#year-after-input").value = '';
        this.querySelector("#search-bar-input").value = '';
        this.querySelector("#search-bar-input").dispatchEvent(new Event('input'));
    }

    // Shows or hides elements in order to change the view from Main to Favorites specific.
    handle_favorite_button_clicked() {
        if (this.favorites_display === "hidden") {
            this.favorites_display = "showing";
            this.querySelector("#search-bar-input").classList.remove("show-item");
            this.querySelector("#search-bar-input").classList.add("hide-item");
            this.querySelector("#beer-bank-title").classList.remove("show-item");
            this.querySelector("#beer-bank-title").classList.add("hide-item");
            this.querySelector("#beer-bank-subtitle").classList.remove("show-item");
            this.querySelector("#beer-bank-subtitle").classList.add("hide-item");
            this.querySelector("#advanced-search").classList.remove("show-item");
            this.querySelector("#advanced-search").classList.add("hide-item");
            this.querySelector("#clear-values").classList.remove("show-item");
            this.querySelector("#clear-values").classList.add("hide-item");

            if (this.search_display === "showing") {
                this.restore_search_display = true;
                this.advanced_search_display();
            } else {
                this.restore_search_display = false;
            }

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
            this.querySelector("#advanced-search").classList.remove("hide-item");
            this.querySelector("#advanced-search").classList.add("show-item");
            if (this.restore_search_display === true) {
                this.advanced_search_display();
            }

            this.querySelector("#favorites-list").classList.remove("show-item");
            this.querySelector("#favorites-list").classList.add("hide-item");
            this.querySelector("#favorites-subtitle").classList.remove("show-item");
            this.querySelector("#favorites-subtitle").classList.add("hide-item");
        }
    }

    // Sends a message to the Main Container with the input value of the search box.
    // Sends advanced parameters if the advanced search is showing.
    input_changed() {
        if (this.search_display === "hidden") {
            this.dispatchEvent(new CustomEvent('bb-search-input',
                {
                    detail: {
                        beer_name: this.querySelector("#search-bar-input").value.toString().toLowerCase(),
                        action: "search"
                    },
                    bubble: true, composed: true
                }));
        } else {
            this.dispatchEvent(new CustomEvent('bb-search-input',
                {
                    detail: {
                        beer_name: this.querySelector("#search-bar-input").value.toString().toLowerCase(),
                        ibu_lt: this.querySelector("#max-ibu-input").value,
                        ibu_gt: this.querySelector("#min-ibu-input").value,
                        abv_lt: this.querySelector("#max-abv-input").value,
                        abv_gt: this.querySelector("#min-abv-input").value,
                        ebc_lt: this.querySelector("#max-ebc-input").value,
                        ebc_gt: this.querySelector("#min-ebc-input").value,
                        brewed_before: this.querySelector("#year-before-input").value.split("-").reverse().join("-"),
                        brewed_after: this.querySelector("#year-after-input").value.split("-").reverse().join("-"),
                        action: "advanced-search"
                    },
                    bubble: true, composed: true
                }));
        }
    }

    // Contains all header content    
    html_constructor() {
        return `<bb-nav-menu></bb-nav-menu>
        <div id="beer-bank-title" class="the-beer-bank-title">The Beer Bank</div>
        <div id="beer-bank-subtitle" class="the-beer-bank-subtitle">Find your favorite beer here</div>
        <input type="text" id="search-bar-input" class="bb-search-bar-input" placeholder="Search for beer name" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Search for beer name'">
        <div id="advanced-search" class="bb-advanced-search">Advanced Search</div>
        ${this.advanced_inputs()}
        <div class="bb-clear-values-container">
        <div id="clear-values">Clear Values</div>
        </div>
        <div id="favorites-list" class="bb-favorites-list hide-item">Favorites List</div>
        <div id="favorites-subtitle" class="bb-favorites-subtitle hide-item">To add or remove items from your favorites list, please click on the star.</div>`;
    }

    advanced_inputs() {
        return `<div id="advanced-inputs-container" class="bb-advanced-inputs-container">
        <div class="bb-input-container">
        <div id="max-ibu-text" class="bb-advanced-input-text">Max IBU</div>
        <input id="max-ibu-input" class="bb-max-ibu-input" type="number" min="0" max="100" step="1">
        <div id="min-ibu-text" class="bb-advanced-input-text">Min IBU</div>
        <input id="min-ibu-input" class="bb-min-ibu-input" type="number" min="0" max="100" step="1">
        </div>
        <div class="bb-input-container">
        <div id="max-abv-text" class="bb-advanced-input-text">Max ABV</div>
        <input id="max-abv-input" class="bb-max-abv-input" type="number" min="0" max="900" step="1">
        <div id="min-abv-text" class="bb-advanced-input-text">Min ABV</div>
        <input id="min-abv-input" class="bb-min-abv-input" type="number" min="0" max="900" step="1">
        </div>
        <div class="bb-input-container">
        <div id="max-ebc-text" class="bb-advanced-input-text">Max EBC</div>
        <input id="max-ebc-input" class="bb-max-ebc-input" type="number" min="0" max="900" step="1">
        <div id="min-ebc-text" class="bb-advanced-input-text">Min EBC</div>
        <input id="min-ebc-input" class="bb-min-ebc-input" type="number" min="0" max="900" step="1">
        </div>
        <div class="bb-input-container">
        <div id="year-before-text" class="bb-advanced-input-text">Year before</div>
        <input id="year-before-input" class="bb-year-before-input" type="month">
        <div id="year-after-text" class="bb-advanced-input-text">Year after</div>
        <input id="year-after-input" class="bb-year-after-input" type="month">
        </div>
        </div>`;
    }
}

customElements.define("bb-main-header", bb_main_header);