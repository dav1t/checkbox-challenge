class Checkbox extends HTMLElement {
  private inputEl: HTMLInputElement;
  private labelEl: HTMLLabelElement;

  value = false;

  attributUpdater: { [key: string]: (newValue: string) => void } = {
    name: (newValue: string) => {
      this.inputEl.setAttribute("name", newValue);
      this.labelEl.textContent = newValue;
    },
    color: (newValue: string) => {
      this.labelEl.style.color = `#${newValue}`;
    },
    value: (newValue: string) => {
      this.value = newValue ? newValue === "true" : false;
      this.inputEl.checked = this.value;
    },
  };

  static get observedAttributes() {
    return ["name", "color", "value"];
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <style>

      .checkbox {
        margin-block: 0.4em;
      }

      [type="checkbox"]:not(:checked),
      [type="checkbox"]:checked {
      position: absolute;
      opacity: 0;
    }
    [type="checkbox"]:not(:checked) + label,
    [type="checkbox"]:checked + label {
      position: relative;
      padding-left: 1.5em;
      cursor: pointer;
    }

    /* checkbox aspect */
    [type="checkbox"]:not(:checked) + label:before,
    [type="checkbox"]:checked + label:before {
      content: '';
      position: absolute;
      left: 0 ;
      top: 50%;
      transform: translateY(-50%);
      width: 1em;
      height: 1em;
      outline: 0.3px solid gray;
      border-radius: .2em;
    }

    [type="checkbox"]:not(:checked) + label:after,
    [type="checkbox"]:checked + label:after {
      content: '';
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 0;
      background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxNCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01LjI4NDkxIDcuNzIxMDFMMTIuMTA3MiAwLjc5NDk5MUMxMi4zNzY0IDAuNTIxNzY3IDEyLjgxMjcgMC41MjE3NjcgMTMuMDgxOSAwLjc5NDk5MUMxMy4zNTEgMS4wNjgyMSAxMy4zNTEgMS41MTEyIDEzLjA4MTkgMS43ODQ0Mkw1Ljc3MjIyIDkuMjA1MTZDNS41MDMwOCA5LjQ3ODM4IDUuMDY2NzMgOS40NzgzOCA0Ljc5NzYgOS4yMDUxNkwwLjg5OTExNiA1LjI0NzQzQzAuNjI5OTgyIDQuOTc0MjEgMC42Mjk5ODIgNC41MzEyMiAwLjg5OTExNiA0LjI1OEMxLjE2ODI1IDMuOTg0NzggMS42MDQ2IDMuOTg0NzggMS44NzM3NCA0LjI1OEw1LjI4NDkxIDcuNzIxMDFaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K") no-repeat center;
      background-size: 70%;
      border-radius: .2em;
      width: 1em;
      height: 1em;
    }

    /* checked mark aspect changes */
    [type="checkbox"]:not(:checked) + label:after {
      opacity: 0;
    }

  [type="checkbox"]:checked + label:before {
      background: linear-gradient(rgb(62, 174, 255) -4.13%, rgb(60, 244, 200) 97.72%);
      outline: unset;
    }

      </style>
    `;

    const name = this.getAttribute("name") ?? "";
    const valueAttribute = this.getAttribute("value");
    this.value = valueAttribute ? valueAttribute === "true" : false;

    const id = `${name}_${Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)}`;

    const wrapper = document.createElement("div");
    this.inputEl = document.createElement("input");
    this.labelEl = document.createElement("label");

    this.inputEl.setAttribute("type", "checkbox");
    this.inputEl.setAttribute("name", name);
    this.inputEl.setAttribute("id", id);
    this.inputEl.checked = this.value;

    this.inputEl.addEventListener("change", (e: Event) => {
      this.value = this.inputEl.checked;
      this.dispatchEvent(
        new CustomEvent("value-changed", {
          detail: {
            name: this.inputEl.name,
            value: this.inputEl.checked,
          },
          bubbles: true,
        })
      );
    });

    this.labelEl.setAttribute("for", id);
    this.labelEl.textContent = name;

    wrapper.appendChild(this.inputEl);
    wrapper.appendChild(this.labelEl);
    wrapper.classList.add("checkbox");

    shadow.appendChild(wrapper);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    const updater = this.attributUpdater[name];
    updater ? updater(newValue) : null;
  }
}

customElements.define("custom-checkbox", Checkbox);
