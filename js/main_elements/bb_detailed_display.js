import { bb_item_element } from "./bb_item_element"

export class bb_detailed_display extends HTMLElement {

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
        } else {
            this.hide_element();
        }

        this.querySelector("#item-name").innerHTML = event.detail.item_name;
        this.querySelector("#item-description").innerHTML = event.detail.item_description;
        this.querySelector("#item-tagline").innerHTML = event.detail.item_tagline;
        this.querySelector("#item-food-pairing").appendChild(this.create_list(event.detail.item_food_pairing));
        this.querySelector("#element-photo").setAttributeNS('http://www.w3.org/1999/xlink', 'href', event.detail.item_image);
        this.querySelector("#item-ibu").innerHTML = event.detail.item_ibu;
        this.querySelector("#item-abv").innerHTML = event.detail.item_abv + "%";
        this.querySelector("#item-ebc").innerHTML = event.detail.item_ebc;

        this.provide_recommendations(event.detail.item_ebc);
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
            new_element.setAttribute("mode", "recommendation");
        
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
        <div class="bb-item-ibu-container">IBU:&nbsp;<div id="item-ibu" class="bb-detailed-item-ibu"></div></div>
        <div class="bb-item-abv-container">ABV:&nbsp; <div id="item-abv" class="bb-detailed-item-abv"></div></div>
        <div class="bb-item-ebc-container">EBC:&nbsp;<div id="item-ebc" class="bb-detailed-item-ebc"></div></div>
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