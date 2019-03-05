export class bb_item_element extends HTMLElement {

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

        // Used to determine how clicking on the item behaves, if the items is a recommendation.
        this.item_mode = this.getAttribute('mode');

        this.item_selected = false;

        // Checks if the item is in localStorage, in order to set the Star icon state.
        this.check_if_favorite();

        // Set element properties.
        this.querySelector("#element-photo").setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.item_image);
        this.querySelector("#element-name").innerHTML = this.item_name;
        this.querySelector("#element-tagline").innerHTML = this.item_tagline;
        this.querySelector("#element-favorite-button").addEventListener("pointerdown", event => this.favorite_button_clicked());
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

            default:
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
        return `
        ${this.html_favorite_button()}
        <div id="element-container" class="bb-element-container">
        ${this.html_element_photo()}
        ${this.html_element_name()}
        ${this.html_element_tagline()}
        </div>`;
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