import { html, css } from 'lit';

import formStyles from "@ucd-lib/theme-sass/1_base_html/_forms.css.js";
import headerStyles from "@ucd-lib/theme-sass/1_base_html/_headings.css.js";
import listStyles from "@ucd-lib/theme-sass/1_base_html/_lists.css.js";
import listClassesStyles from "@ucd-lib/theme-sass/2_base_class/_lists.css.js";
import formsClassesStyles from "@ucd-lib/theme-sass/2_base_class/_forms.css.js";
import panelStyles from "@ucd-lib/theme-sass/4_component/_panel.css.js";
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
      margin-bottom: .5rem;
    }
    .section-header svg {
      height: 1em;
      width: 1em;
      min-width: 1em;
      min-height: 1em;
      margin-right: .5rem;
      fill: currentColor;
    }
    h5 label {
      padding-bottom: inherit;
      color: inherit;
      font-weight: inherit;
    }
    select {
      background-color: #b0d0ed;
      color: #022851;
      font-weight: 700;
      border: none;
    }
    select:focus {
      background-color: #b0d0ed;
      border: 1px solid #999;
    }
    .show {
      display: block;
    }
    .hide {
      display: none;
    }
    .panel--mobile-collapse .panel__title:focus {
      background-color: #13639e;
      color: #fff;
      text-decoration: none;
    }
    @media (min-width: 992px) {
      .main {
        display: block;
      }
      .toggle-button {
        display: none;
      }
    }
  `;

  return [
    formStyles,
    headerStyles,
    listStyles,
    listClassesStyles,
    formsClassesStyles,
    oBox,
    panelStyles,
    brandStyles,
    elementStyles
  ];
}

export function render() { 
return html`
  <div 
    class="panel--mobile-collapse o-box toggle-button" 
    tabindex="0" 
    role="button" 
    @click=${this._onVisibilityClick}
    @keyup=${this._onVisibilityKeyUp}
    aria-label="Toggle result filters"
    aria-expanded=${this.showOnMobile ? 'true' : 'false'}>
    <h2 class="panel__title">Filter Results</h2>
  </div>
  <div class="o-box light-blue main ${this.showOnMobile ? 'show': 'hide'}">
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
              aria-label="Apply filter"
              @input=${this._onFilterInput} 
              @keyup=${this._onFilterKeyUp}
              id=${this._checkIdPrefix+f.urlArg} 
              name=${f.urlArg} type="checkbox" 
              ?checked=${f.isSelected}>
            <label class="primary" for=${this._checkIdPrefix+f.urlArg}>${f.labelPlural}</label>
          </li>`)}
      </ul>

      <h5 class="section-header">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M416 288h-95.1c-17.67 0-32 14.33-32 32s14.33 32 32 32H416c17.67 0 32-14.33 32-32S433.7 288 416 288zM544 32h-223.1c-17.67 0-32 14.33-32 32s14.33 32 32 32H544c17.67 0 32-14.33 32-32S561.7 32 544 32zM352 416h-32c-17.67 0-32 14.33-32 32s14.33 32 32 32h32c17.67 0 31.1-14.33 31.1-32S369.7 416 352 416zM480 160h-159.1c-17.67 0-32 14.33-32 32s14.33 32 32 32H480c17.67 0 32-14.33 32-32S497.7 160 480 160zM192.4 330.7L160 366.1V64.03C160 46.33 145.7 32 128 32S96 46.33 96 64.03v302L63.6 330.7c-6.312-6.883-14.94-10.38-23.61-10.38c-7.719 0-15.47 2.781-21.61 8.414c-13.03 11.95-13.9 32.22-1.969 45.27l87.1 96.09c12.12 13.26 35.06 13.26 47.19 0l87.1-96.09c11.94-13.05 11.06-33.31-1.969-45.27C224.6 316.8 204.4 317.7 192.4 330.7z"/></svg>
        <label for="sort">Sort By</label>
      </h5>
      <select id="sort" @input=${this._onSortInput} role="link">
          ${this.sortOptions.map(option => html`
            <option value=${option.urlArg} ?selected=${option.isSelected}>${option.label}</option>
          `)}
        </select>
    </form>
  </div>

`;}