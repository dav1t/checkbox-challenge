/*
  @Props - value {[string]: boolean}[]
  @Attr - value {[string]: boolean}[] 
  @Events - 'value-changed' Event fired when checking/unchecking any checkbox

  checkbox list is generated based on value
 */
class CheckboxList extends HTMLElement {
  static get observedAttributes() {
    return ["value"];
  }

  private _fieldset: HTMLFieldSetElement;
  private _value!: Record<string, boolean>[];

  public set value(value: Record<string, boolean>[]) {
    if (!Array.isArray(value)) {
      console.error("value should be array!");
      return;
    }

    const valueIsValid = !value.find((el) => {
      if (typeof el !== "object") {
        return true;
      }

      return !!Object.entries(el).find(([key, value]) => {
        return typeof key !== "string" || typeof value !== "boolean";
      });
    });

    if (!valueIsValid) {
      console.warn("Invalid Value!");
      return;
    }

    this._value = value;
    this._fieldset.innerHTML = "";
    this._fieldset.append(...value.map(this.generateCheckboxItem));
  }

  public get value() {
    return this._value;
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    this._fieldset = document.createElement("fieldset");

    this._fieldset.addEventListener("change", () => {
      const event = new CustomEvent("value-changed", {
        detail: {
          value: [...this._fieldset.querySelectorAll("input")].map((el) => ({
            [el.name]: el.checked,
          })),
        },
      });
      this.dispatchEvent(event);
    });

    shadow.appendChild(this._fieldset);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "value") {
      try {
        this.value = JSON.parse(newValue);
      } catch (e) {
        console.error("Incorrect value! value should be valid JSON");
      }
    }
  }

  private generateCheckboxItem(item: Record<string, boolean>, index: number) {
    const [name, value] = Object.entries(item)[0];

    const id = `${name}_${index}`;
    const wrapper = document.createElement("div");
    const input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.setAttribute("name", name);
    input.setAttribute("id", id);
    input.checked = value;

    const label = document.createElement("label");
    label.setAttribute("for", id);
    label.textContent = name;
    wrapper.appendChild(input);
    wrapper.appendChild(label);

    return wrapper;
  }
}

customElements.define("checkbox-list", CheckboxList);
