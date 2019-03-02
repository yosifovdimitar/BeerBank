class bb_item_element extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = this.html_constructor();
        this.item_id = this.getAttribute('id');
        this.item_name = this.getAttribute('name');
        this.item_tagline = this.getAttribute('tagline');
        this.item_food_pairing = this.getAttribute('food-pairing');
        this.item_image = this.getAttribute('image-url');
        this.item_ibu = this.getAttribute('ibu');
        this.item_abv = this.getAttribute('abv');
        this.item_ebc = this.getAttribute('ebc');

        this.querySelector("#element-photo").setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.item_image);
        this.querySelector("#element-name").innerHTML = this.item_name;
        this.querySelector("#element-tagline").innerHTML = this.item_tagline;
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