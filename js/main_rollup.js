(function () {
    'use strict';

    class bb_nav_menu extends HTMLElement {

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

    class bb_main_header extends HTMLElement {

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

    class bb_item_element extends HTMLElement {

        constructor() {
            super();

            // Listens for and handles messages directed for any instance of the item.
            document.addEventListener(`bb-item-element`, this.handle_mbox_message.bind(this), true);
            document.addEventListener(`bb-item-highlight`, this.item_highlight.bind(this), true);
        }

        connectedCallback() {

            // Populate variables with element attributes.
            this.innerHTML = this.html_constructor();
            this.item_id = this.getAttribute('id');
            this.item_name = this.getAttribute('name');
            this.item_description = this.getAttribute('description');
            this.item_tagline = this.getAttribute('tagline');
            this.item_food_pairing = this.getAttribute('food-pairing');
            this.item_image = this.getAttribute('image-url');
            this.item_ibu = this.getAttribute('ibu');
            this.item_abv = this.getAttribute('abv');
            this.item_ebc = this.getAttribute('ebc');

            // Used to determine how clicking on the item behaves, if the item is a recommendation.
            this.item_mode = this.getAttribute('item-mode');

            this.item_selected = false;

            // Checks if the item is in localStorage, in order to set the Star icon state.
            this.check_if_favorite();

            // Set element properties.
            this.querySelector("#element-photo").setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.item_image);
            this.querySelector("#element-name").innerHTML = this.item_name;
            this.querySelector("#element-tagline").innerHTML = this.item_tagline;
            this.querySelector("#svg-star").addEventListener("pointerdown", event => this.favorite_button_clicked());
            this.querySelector("#element-container").addEventListener("pointerdown", event => this.element_clicked());
        }

        // Checks if the message is for this particular instance.
        handle_mbox_message(event) {
            if (event.detail.item_id === this.item_id) {
                this.process_message(event);
            }
        }


        // Carries out the action stored in the event. Changes the visuals of the Star icon.
        process_message(event) {
            switch (event.detail.action) {
                case "added-to-favorites":
                    this.querySelector("#svg-star").classList.remove("bb-svg-star");
                    this.querySelector("#svg-star").classList.add("bb-svg-star-selected");
                    break;

                case "removed-from-favorites":
                    this.querySelector("#svg-star").classList.remove("bb-svg-star-selected");
                    this.querySelector("#svg-star").classList.add("bb-svg-star");
                    break;
            }
        }

        // Checks if the item is stored in localStorage as favorite.
        check_if_favorite() {
            if (localStorage.getItem(this.item_id)) {
                this.querySelector("#svg-star").classList.remove("bb-svg-star");
                this.querySelector("#svg-star").classList.add("bb-svg-star-selected");
            }
        }

        // Highlights the item and displays detailed view.
        element_clicked() {
            console.log(this.item_mode);
            // Checks if item is a recommendation and disables detailed display.
            if(this.item_mode !== "recommendation") {
            this.dispatchEvent(new CustomEvent('bb-item-highlight',
                {
                    detail: {
                        item_id: this.item_id,
                        action: "element-clicked"
                    },
                    bubble: true, composed: true
                }));

                this.dispatchEvent(new CustomEvent('bb-detailed-display',
                {
                    detail: {
                        item_id: this.item_id,
                        item_name: this.item_name,
                        item_tagline: this.item_tagline,
                        item_description: this.item_description,
                        item_food_pairing: this.item_food_pairing,
                        item_image: this.item_image,
                        item_ibu: this.item_ibu,
                        item_abv: this.item_abv,
                        item_ebc: this.item_ebc,
                        action: "element-clicked"
                    },
                    bubble: true, composed: true
                }));
            } else {
                this.dispatchEvent(new CustomEvent('bb-item-highlight',
                {
                    detail: {
                        item_id: this.item_id,
                        action: "element-clicked"
                    },
                    bubble: true, composed: true
                }));

                this.dispatchEvent(new CustomEvent('bb-detailed-display',
                {
                    detail: {
                        item_id: this.item_id,
                        item_name: this.item_name,
                        item_tagline: this.item_tagline,
                        item_description: this.item_description,
                        item_food_pairing: this.item_food_pairing,
                        item_image: this.item_image,
                        item_ibu: this.item_ibu,
                        item_abv: this.item_abv,
                        item_ebc: this.item_ebc,
                        action: "element-clicked",
                        item_mode: "recommendation"
                    },
                    bubble: true, composed: true
                }));

            }
        }

        // Handles item highlighting
        item_highlight() {
            if (this.item_id === event.detail.item_id) {
                if (this.item_selected === true) {
                    this.classList.remove("bb-item-element-selected");
                    this.classList.add("bb-item-element-normal");
                    this.item_selected = false;
                } else {
                    this.classList.remove("bb-item-element-normal");
                    this.classList.add("bb-item-element-selected");
                    this.item_selected = true;
                }
            } else {
                this.classList.remove("bb-item-element-selected");
                this.classList.add("bb-item-element-normal");
                this.item_selected = false;
            }
        }

        // Saves or removes the item from localStorage. 
        // Sends a message to other instances of the item (different section) to change the Star icon appearance.
        // Sends a refresh Favorites list event, if the button is clicked on an item inside the Favorites list section.
        favorite_button_clicked() {
            if (!localStorage.getItem(this.item_id)) {
                localStorage.setItem(this.item_id, this.item_id);
                this.querySelector("#svg-star").classList.remove("bb-svg-star");
                this.querySelector("#svg-star").classList.add("bb-svg-star-selected");
                this.dispatchEvent(new CustomEvent('bb-item-element',
                    {
                        detail: {
                            item_id: this.item_id,
                            action: "added-to-favorites"
                        },
                        bubble: true, composed: true
                    }));

            } else {
                localStorage.removeItem(this.item_id);
                this.querySelector("#svg-star").classList.remove("bb-svg-star-selected");
                this.querySelector("#svg-star").classList.add("bb-svg-star");
                this.dispatchEvent(new CustomEvent('bb-item-element',
                    {
                        detail: {
                            item_id: this.item_id,
                            action: "removed-from-favorites"
                        },
                        bubble: true, composed: true
                    }));
                    
            }

            this.dispatchEvent(new CustomEvent('bb-favorite-refresh',
                {
                    detail: {
                        action: "refresh-favorite-list"
                    },
                    bubble: true, composed: true
                }));
        }

        // Composes the HTML.
        html_constructor() {
            return `<div id="element-container" class="bb-element-container">
        ${this.html_element_photo()}
        ${this.html_element_name()}
        ${this.html_element_tagline()}
        </div>
        ${this.html_favorite_button()}`;
        }

        html_favorite_button() {
            return `<div id="element-favorite-button" class="bb-element-favorite-button"><svg id="svg-star" class="bb-svg-star" width="210mm" height="297mm" version="1.1" viewBox="0 0 210 297" xmlns="http://www.w3.org/2000/svg">
        <path transform="rotate(.81368 -1152.9 3834)" d="m83.602 94.594-25.582-12.986-25.2 13.712 4.4448-28.343-20.829-19.73 28.329-4.5313 12.328-25.906 13.064 25.543 28.447 3.7189-20.255 20.317z"/>
       </svg></div>
        `;
        }

        html_element_photo() {
            return `<div class="list-element-photo-container">
        <svg class="svg-photo-display" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <image id="element-photo" class="submit-form-photo-display" width="100%" height="100%"/>
        </svg>
        </div>`;
        }

        html_element_name() {
            return `<div id="element-name" class="bb-element-name"></div>
        `;
        }

        html_element_tagline() {
            return `<div id="element-tagline" class="bb-element-tagline"></div>`;
        }

    }

    customElements.define("bb-item-element", bb_item_element);

    class bb_main_list_container extends HTMLElement {

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

    class bb_favorites_list extends bb_main_list_container {

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

    class bb_detailed_display extends HTMLElement {

        constructor() {
            super();

            // Listens for the event that triggers the element's visibility.
            document.addEventListener("bb-detailed-display", this.display_item_details.bind(this), true);
            this.hide_element();
            this.display_status = "hidden";
        }

        connectedCallback() {
            this.innerHTML = this.html_constructor();
            this.list_recommendations = this.querySelector("#item-recommendations-container");
            this.querySelector("#close-button").addEventListener("pointerdown", event => this.close_button_clicked());
        }

        close_button_clicked() {
            this.hide_element();
        }

        // Populates the display with data.
        display_item_details(event) {
            if (this.display_status === "hidden") {
                this.show_element();
            }

            this.querySelector("#item-name").innerHTML = event.detail.item_name;
            this.querySelector("#item-description").innerHTML = event.detail.item_description;
            this.querySelector("#item-tagline").innerHTML = event.detail.item_tagline;
            if(event.detail.item_mode !== "recommendation"){
            this.querySelector("#item-food-pairing").appendChild(this.create_list(event.detail.item_food_pairing));
            }
            this.querySelector("#element-photo").setAttributeNS('http://www.w3.org/1999/xlink', 'href', event.detail.item_image);
            this.querySelector("#item-ibu").innerHTML = event.detail.item_ibu;
            this.querySelector("#item-abv").innerHTML = event.detail.item_abv + "%";
            this.querySelector("#item-ebc").innerHTML = event.detail.item_ebc;
            if(event.detail.item_mode !== "recommendation"){
            this.provide_recommendations(event.detail.item_ebc);
            }
        }

        // Creates unordered list with proposed foods.
        create_list(data) {
            let data_list = data.split(",");
            let list_element = document.createElement("ul");
            for (let i = 0; i < data_list.length; i++) {
                let entry = document.createElement("li");
                entry.innerHTML = data_list[i];
                list_element.appendChild(entry);
            }
            return list_element;

        }

        // Fetches 3 items with similar EBC.
        provide_recommendations(ebc) {
            this.list_recommendations.innerHTML = "";
            fetch(`https://api.punkapi.com/v2/beers?ebc_gt=${ebc}&per_page=3`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (myJson) {
                    this.populate_list(myJson);
                }.bind(this));
        }

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
                new_element.setAttribute("item-mode", "recommendation");
            
                this.list_recommendations.appendChild(new_element);
            });
        }

        hide_element() {
            this.classList.remove("show-item-grid");
            this.classList.add("hide-item");
            this.display_status = "hidden";
        }

        show_element() {
            this.classList.remove("hide-item");
            this.classList.add("show-item-grid");
            this.display_status = "showing";
        }

        html_constructor() {
            return `<div class="bb-detailed-display-shadow">
        <div id="detailed-display-container" class="bb-detailed-display-container">
        <div id="close-button" class="bb-detailed-display-close">✖</div>
        <div class="bb-item-details-container">
        <div id="item-name" class="bb-detailed-item-name"></div>
        <div id="item-tagline" class="bb-detailed-item-tagline"></div>
        <div class="bb-detailed-separator-line"></div>
        <div class="bb-item-specifics">
        <div class="bb-item-ibu-container"><div class="bb-detailed-advanced-params">IBU:&nbsp;</div><div id="item-ibu" class="bb-detailed-item-ibu"></div></div>
        <div class="bb-item-abv-container"><div class="bb-detailed-advanced-params">ABV:&nbsp;</div><div id="item-abv" class="bb-detailed-item-abv"></div></div>
        <div class="bb-item-ebc-container"><div class="bb-detailed-advanced-params">EBC:&nbsp;</div><div id="item-ebc" class="bb-detailed-item-ebc"></div></div>
        </div>
        <div id="item-description" class="bb-detailed-item-description"></div>
        <div class="detailed-display-photo-container">
        <svg class="detailed-svg-photo-display" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <image id="element-photo" class="submit-form-photo-display" width="100%" height="100%"/>
        </svg>
        </div>
        <div class="bb-best-served-with">Best served with:</div>
        <div id="item-food-pairing" class="bb-detailed-item-food-pairing"></div>
        </div>
        <div class="bb-you-might-also-like">You might also like:</div>
        <div id="item-recommendations-container" class="bb-item-recommendations-container">
        </div>
        </div>
        </div>
        `;
        }
    }

    customElements.define("bb-detailed-display", bb_detailed_display);

    class beer_bank_main extends HTMLElement {

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

    customElements.define("beer-bank-main", beer_bank_main);

})();
