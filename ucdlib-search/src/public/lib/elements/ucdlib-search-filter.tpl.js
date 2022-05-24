import { html, css } from 'lit';

import formStyles from "@ucd-lib/theme-sass/1_base_html/_forms.css.js";
import headerStyles from "@ucd-lib/theme-sass/1_base_html/_headings.css.js";
import listStyles from "@ucd-lib/theme-sass/1_base_html/_lists.css.js";
import listClassesStyles from "@ucd-lib/theme-sass/2_base_class/_lists.css.js";
import formsClassesStyles from "@ucd-lib/theme-sass/2_base_class/_forms.css.js";
import oBox from "@ucd-lib/theme-sass/3_objects/_index.css";
import brandStyles from "@ucd-lib/theme-sass/4_component/_category-brand.css.js";

export function styles() {
  const elementStyles = css`
    :host {
      display: block;
    }
    .light-blue {
      background-color: #ebf3fa;
    }
    .checkbox label {
      color: #022851;
    }
    .section-header {
      display: flex;
      align-items: center;
    }
    .section-header svg {
      height: 1em;
      width: 1em;
      min-width: 1em;
      min-height: 1em;
      margin-right: .5rem;
      fill: currentColor;
    }
  `;

  return [
    formStyles,
    headerStyles,
    listStyles,
    listClassesStyles,
    formsClassesStyles,
    oBox,
    brandStyles,
    elementStyles
  ];
}

export function render() { 
return html`
  <div class="o-box o-box--large light-blue">
    <form @submit="${this._onSubmit}">
      <h5 class="section-header">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M3.853 54.87C10.47 40.9 24.54 32 40 32H472C487.5 32 501.5 40.9 508.1 54.87C514.8 68.84 512.7 85.37 502.1 97.33L320 320.9V448C320 460.1 313.2 471.2 302.3 476.6C291.5 482 278.5 480.9 268.8 473.6L204.8 425.6C196.7 419.6 192 410.1 192 400V320.9L9.042 97.33C-.745 85.37-2.765 68.84 3.854 54.87L3.853 54.87z"/></svg>
        <span>Search Filters</span>
      </h5>
      
      <ul class="list--reset checkbox">
        ${this.filters.map(f => html`
          <li>
            <input 
              role="link"
              @input=${this._onFilterInput} 
              @keyup=${this._onFilterKeyUp}
              id=${this._checkIdPrefix+f.urlArg} 
              name=${f.urlArg} type="checkbox" 
              ?checked=${f.isSelected}>
            <label class="primary" for=${this._checkIdPrefix+f.urlArg}>${f.labelPlural}</label>
          </li>`)}
      </ul>
    </form>
  </div>

`;}