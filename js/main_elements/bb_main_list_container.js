import { bb_item_element } from "./bb_item_element"

class bb_main_list_container extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = this.html_constructor();
        this.list_elements = this.querySelector("#list-elements");
        this.get_initial_list_of_beers();
    }

    get_initial_list_of_beers() {
        fetch('https://api.punkapi.com/v2/beers?page=1&per_page=80')
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                this.populate_initial_items(myJson);
            }.bind(this));
    }

    populate_initial_items(result) {
        result.forEach(element => {
            let new_element = document.createElement("bb-item-element");
            new_element.setAttribute("id", element.id);
            new_element.setAttribute("name", element.name);
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
        return `<div class="bb-list-container">
        <div id="list-elements" class="bb-list-elements">
        </div>
        </div>`;
    }
}

customElements.define("bb-main-list-container", bb_main_list_container);