import { DEFAULT_LINK } from "./constants";

export class PotterAPI {
  constructor() {
    this.characterList = document.querySelector("#character-list");
    this.characterActions = document.querySelector("#character-actions");
    this.form = document.querySelector("#form");
    this.charactersData = [];
    this.links = {};
  }

  async getCharacters(url = DEFAULT_LINK) {
    const rawResult = await fetch(url);
    const result = await rawResult.json();
    this.charactersData = result.data;
    this.links = result.links;
    this.renderList();
    this.renderActions();
  }

  static createTextItem(field, text) {
    const textElement = document.createElement("p");
    textElement.innerText = `${field}: ${text ?? "unknown"}`;
    return textElement;
  }

  renderList() {
    this.characterList.innerHTML = "";
    this.charactersData.forEach(({ attributes }) => {
      const li = document.createElement("li");
      li.classList.add("character-item");

      const imgContainer = document.createElement("div");
      imgContainer.classList.add("character-item__image-container");
      const img = document.createElement("img");
      img.setAttribute("src", attributes?.image ?? "/stub.png");
      img.classList.add("character-item__image");
      img.setAttribute("alt", attributes.name);
      imgContainer.appendChild(img);

      const title = document.createElement("h3");
      title.classList.add("character-item__title");
      title.setAttribute("title", attributes.name);
      title.innerText = attributes.name;

      const gender = PotterAPI.createTextItem("gender", attributes.gender);
      const species = PotterAPI.createTextItem("species", attributes.species);
      const house = PotterAPI.createTextItem("house", attributes.house);
      const patronus = PotterAPI.createTextItem(
        "patronus",
        attributes.patronus
      );
      const boggart = PotterAPI.createTextItem("boggart", attributes.boggart);

      li.appendChild(imgContainer);
      li.appendChild(title);
      li.appendChild(gender);
      li.appendChild(species);
      li.appendChild(house);
      li.appendChild(patronus);
      li.appendChild(boggart);

      this.characterList.appendChild(li);
    });
  }

  createAction(link, text) {
    const button = document.createElement("button");
    button.innerText = text;
    button.addEventListener("click", () => {
      this.getCharacters(link);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    return button;
  }

  renderActions() {
    this.characterActions.innerHTML = "";
    if (this.links.first) {
      const firstButton = this.createAction(this.links.first, "First");
      this.characterActions.appendChild(firstButton);
    }
    if (this.links.prev) {
      const prevButton = this.createAction(this.links.prev, "Prev");
      this.characterActions.appendChild(prevButton);
    }
    if (this.links.next) {
      const nextButton = this.createAction(this.links.next, "Next");
      this.characterActions.appendChild(nextButton);
    }
  }

  initSearch() {
    this.form.addEventListener("submit", (evt) => {
      evt.preventDefault();
      const input = evt.target.querySelector("input");
      const { value } = input;
      const trimmedValue = value.trim();
      if (trimmedValue) {
        this.getCharacters(`${DEFAULT_LINK}&filter[name_cont]=${trimmedValue}`);
      }
    });
    const resetButton = this.form.querySelector("#form__reset");
    resetButton.addEventListener("click", () => {
      this.getCharacters();
    });
  }
}
