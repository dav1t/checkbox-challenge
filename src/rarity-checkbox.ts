import "./checkbox";

/*
 @Events - 'value-changed' Event fired on when any checkbox in the list is changed
*/
class RarityCheckbox extends HTMLElement {
  value: Record<string, boolean> = {};

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    this.fetchData().then((response) => {
      response.forEach((el: string[]) => {
        const checkbox = document.createElement("custom-checkbox");
        const [name, color] = el;

        checkbox.setAttribute("name", name);
        checkbox.setAttribute("color", color);

        this.value[name] = false;

        this.bindCheckboxEvents(checkbox);

        shadow.appendChild(checkbox);
      });
    });
  }

  async fetchData() {
    return (await (
      await fetch("http://reshade.io:1234/")
    ).json()) as string[][];
  }

  bindCheckboxEvents(checkbox: HTMLElement) {
    checkbox.addEventListener("value-changed", (e: any) => {
      this.value[e.detail.name] = e.detail.value;
      this.dispatchEvent(
        new CustomEvent("value-changed", {
          detail: {
            value: this.value,
          },
        })
      );
    });
  }
}

customElements.define("rarity-checkbox", RarityCheckbox);
