import { bb_main_list_container } from "./bb_main_list_container"

export class bb_favorites_list extends bb_main_list_container {

    constructor() {
        super();
        document.addEventListener(`bb-favorite-refresh`, this.handle_mbox_message.bind(this), true);
    }

    connectedCallback() {
        this.innerHTML = this.html_constructor();
        this.list_elements = this.querySelector("#list-elements");
        this.display_status = "hidden";
        this.hide_element();
    }

    handle_mbox_message(event) {
        switch (event.detail.action) {
            // Favorites list is refreshed every time an item is removed while in Favorites Page view.
            case "refresh-favorite-list":
                if (this.display_status !== "hidden") {
                    this.list_favorites();
                }
                break;
            // When the navigational Favorites button is clicked
            case "favorite-button-clicked":
                this.handle_favorite_button_clicked();
                break;

            default:
                break;
        }
    }

    // Shows or hides the entire element, depending on past state. Also renders the Favorites list.
    handle_favorite_button_clicked() {
        if (this.display_status === "showing") {
            this.hide_element();
            this.display_status = "hidden";
        } else {
            this.show_element();
            this.list_favorites();
            this.display_status = "showing";
        }
    }

    // Displays a message, if no items are stored, or fetches the items in localStorage.
    list_favorites() {
        this.item_ids_list = "";
        if (localStorage.length === 0) {
            let notification = document.createElement("div");
            notification.innerHTML = "The are no favorites at the moment.";
            notification.setAttribute("class", "no-favorites-text");
            this.clear_the_list();
            this.querySelector("#list-elements").appendChild(notification);
        } else {
            for (let i = 0, len = localStorage.length; i < len; ++i) {
                this.item_ids_list += localStorage.getItem(localStorage.key(i)) + "|";
            }
            fetch(`https://api.punkapi.com/v2/beers?ids=${this.item_ids_list.slice(0, -1)}`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (myJson) {
                    this.clear_the_list();
                    this.populate_list(myJson);
                }.bind(this));
        }
    }

    html_constructor() {
        return `<div id="list-container" class="bb-list-container">
        <div id="list-elements" class="bb-list-elements">
        </div>
        </div>`;
    }
}

customElements.define("bb-favorites-list", bb_favorites_list);