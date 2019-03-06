import { bb_item_element } from "./bb_item_element"

export class bb_main_list_container extends HTMLElement {

    constructor() {
        super();

        // Listens for the search event, in order to populate the list with search matches.
        document.addEventListener('bb-search-input', this.handle_mbox_message.bind(this), true);
        // Listens for the favorite button event, in order to hide and allow the Favorite container to display instead.
        document.addEventListener('bb-favorite-button', this.handle_mbox_message.bind(this), true);
        // Initiates the page count for infinite scrolling.
        this.page_count = 1;
        // Tracks the status of the search box, in order to prevent infinite scrolling when search results are displayed.
        this.search_mode = false;
        // Tracks the display status, in order to allow for the Favorites container to display.
        this.display_status = "showing";
    }

    connectedCallback() {
        this.innerHTML = this.html_constructor();
        this.list_elements = this.querySelector("#list-elements");
        // Tracks the scroll status in order to load more items for infinite scrolling.
        this.addEventListener('scroll', event => this.load_more());
        // Gets initial list of items.
        this.get_initial_list_of_20_items();
    }

    // Handles messages meant to change the status of the element or display items.
    handle_mbox_message(event) {
        switch (event.detail.action) {
            case 'search':
                this.handle_search_action(event);
                break;

            case 'advanced-search':
                this.handle_advanced_search_action(event);
                break;

            case 'favorite-button-clicked':
                this.handle_favorite_button_clicked();
                break;

            default:
                break;
        }
    }

    // Shows or Hides the element, in order to allow for the Favorites container to display.
    handle_favorite_button_clicked() {
        if (this.display_status === "showing") {
            this.hide_element();
            this.display_status = "hidden";
        } else {
            this.show_element();
            this.display_status = "showing";
        }
    }

    hide_element() {
        this.classList.remove("show-item");
        this.classList.add("hide-item");
    }

    show_element() {
        this.classList.remove("hide-item");
        this.classList.add("show-item");
    }

    // Partially matches item names and populates the list.
    handle_search_action(event) {
        if (event.detail.beer_name !== '') {
            this.search_mode = true;
            fetch(`https://api.punkapi.com/v2/beers?beer_name=${event.detail.beer_name.toString().toLowerCase().split(' ').join('_')}`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (myJson) {
                    this.clear_the_list();
                    this.populate_list(myJson);
                }.bind(this));
        } else {
            this.search_mode = false;
            this.clear_the_list();
            this.get_initial_list_of_20_items();
        }
    }
    
    // Checks if inputs are empty and restores initial list of items, or performs the search.
    handle_advanced_search_action(event) {
        if (event.detail.beer_name === '' &&
            event.detail.ibu_lt === '' &&
            event.detail.ibu_gt === '' &&
            event.detail.abv_lt === '' &&
            event.detail.abv_gt === '' &&
            event.detail.ebc_lt === '' &&
            event.detail.ebc_gt === '' &&
            event.detail.brewed_before === '' &&
            event.detail.brewed_after === '') {
            this.search_mode = false;
            this.clear_the_list();
            this.get_initial_list_of_20_items();
        } else {
            this.search_mode = true;
            fetch(`https://api.punkapi.com/v2/beers?${this.compose_advanced_query(event)}`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (myJson) {
                    this.clear_the_list();
                    this.populate_list(myJson);
                }.bind(this));
        }
    }

    compose_advanced_query(event) {
        let event_data = event.detail;
        let composed_query = new String();

        for(let key in event_data) {
            if (event_data[key] !== "" && key !== "action") {
                if(key === "beer_name") {
                    composed_query += `${key}=${event_data[key].toString().toLowerCase().split(' ').join('_')}&`;
                } else {
                composed_query += `${key}=${event_data[key]}&`;
                }
            }
        }
        return composed_query.slice(0, -1);
    }

    get_initial_list_of_20_items() {
        fetch(`https://api.punkapi.com/v2/beers?page=${this.page_count}&per_page=20`)
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                this.populate_list(myJson);
            }.bind(this));
    }

    // Loads the next batch of 20 items when the scroll reaches the bottom of the page.
    load_more() {
        if (!this.search_mode && Math.round(this.scrollTop + this.clientHeight) >= Math.round(this.scrollHeight)) {
            this.get_20_more_items();
        }
    }

    get_20_more_items() {
        this.page_count++;
        fetch(`https://api.punkapi.com/v2/beers?page=${this.page_count}&per_page=20`)
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                this.populate_list(myJson);
            }.bind(this));
    }

    // Clears the list in order for it to be prepared for populating.
    clear_the_list() {
        this.list_elements.innerHTML = "";
    }

    // Populates the list with items from the query result.
    populate_list(result) {
        result.forEach(element => {
            let new_element = document.createElement("bb-item-element");
            new_element.setAttribute("id", element.id);
            new_element.setAttribute("name", element.name);
            new_element.setAttribute("description", element.description);
            new_element.setAttribute("tagline", element.tagline);
            new_element.setAttribute("food-pairing", element.food_pairing);
            new_element.setAttribute("image-url", element.image_url);
            new_element.setAttribute("ibu", element.ibu);
            new_element.setAttribute("abv", element.abv);
            new_element.setAttribute("ebc", element.ebc);

            this.list_elements.appendChild(new_element);
        });
    }

    // Contains the main list of items
    html_constructor() {
        return `<div id="list-container" class="bb-list-container">
        <div id="list-elements" class="bb-list-elements">
        </div>
        </div>`;
    }
}

customElements.define("bb-main-list-container", bb_main_list_container);