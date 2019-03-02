class bb_item_element extends HTMLElement {

    constructor() {
        super();
        document.addEventListener(`bb-search-input`, this.handle_mbox_message.bind(this), true);
    }

    connectedCallback() {

        // Populate variables with element attributes.
        this.innerHTML = this.html_constructor();
        this.item_id = this.getAttribute('id');
        this.item_name = this.getAttribute('name');
        this.item_tagline = this.getAttribute('tagline');
        this.item_food_pairing = this.getAttribute('food-pairing');
        this.item_image = this.getAttribute('image-url');
        this.item_ibu = this.getAttribute('ibu');
        this.item_abv = this.getAttribute('abv');
        this.item_ebc = this.getAttribute('ebc');

        // Set element properties.
        this.querySelector("#element-photo").setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.item_image);
        this.querySelector("#element-name").innerHTML = this.item_name;
        this.querySelector("#element-tagline").innerHTML = this.item_tagline;
        this.querySelector("#element-favorite-button").addEventListener("pointerdown", event => this.favorite_button_clicked());
    }

    handle_mbox_message(event) {
        if (this.item_name.toLowerCase().indexOf(event.detail.input_value) >= 0) {
            this.show_item();
        } else {
            this.hide_item();
        }
    }

    show_item() {
        this.classList.add('show-item-grid');
        this.classList.remove('hide-item');
    }

    hide_item() {
        this.classList.remove('show-item-grid');
        this.classList.add('hide-item');
    }


    favorite_button_clicked() {

    }

    html_constructor() {
        return `
        ${this.html_favorite_button()}
        <div class="bb-element-container">
        ${this.html_element_photo()}
        ${this.html_element_name()}
        ${this.html_element_tagline()}
        </div>`;
    }

    html_favorite_button() {
        return `<div id="element-favorite-button" class="bb-element-favorite-button">☆</div>
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