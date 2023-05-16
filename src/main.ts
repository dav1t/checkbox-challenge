import "./style.css";
import "./checkbox";

import "./rarity-checkbox";

const checkbox = document.querySelector("rarity-checkbox");
checkbox?.addEventListener("value-changed", (e) => console.log(e.detail.value));
