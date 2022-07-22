import { html, css } from 'lit';
import '@ucd-lib/theme-elements/brand/ucd-theme-slim-select/ucd-theme-slim-select.js'

import buttonStyles from "@ucd-lib/theme-sass/2_base_class/_buttons.css.js";
import formStyles from "@ucd-lib/theme-sass/1_base_html/_forms.css.js";
import headerStyles from "@ucd-lib/theme-sass/1_base_html/_headings.css.js";
import formsClassesStyles from "@ucd-lib/theme-sass/2_base_class/_forms.css.js";
import panelStyles from "@ucd-lib/theme-sass/4_component/_panel.css.js";
import oBox from "@ucd-lib/theme-sass/3_objects/_index.css";
import brandStyles from "@ucd-lib/theme-sass/4_component/_category-brand.css.js";

export function styles() {
  const elementStyles = css`
    :host {
      display: block;
    }
    .main {
      padding: 1rem;
    }
    input {
      padding-top: 0;
      padding-bottom: 0;
    }
    .btn--primary-input {
      font-size: 1rem;
    }
    .section-header {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
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
    .show {
      display: block;
    }
    .hide {
      display: none;
    }
    .flex {
      display: flex;
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
    buttonStyles,
    formStyles,
    headerStyles,
    formsClassesStyles,
    panelStyles,
    oBox,
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
    aria-expanded=${this.mobileVisibility.showOnMobile ? 'true' : 'false'}>
    <h2 class="panel__title">${this.mobileVisibility.showOnMobile ? `Hide ${this.widgetTitle}` : this.widgetTitle} </h2>
  </div>
  <div class="main ${this.mobileVisibility.showOnMobile ? 'show': 'hide'}">
    <form @submit="${this._onSubmit}">
      <h5 class="section-header">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M3.853 54.87C10.47 40.9 24.54 32 40 32H472C487.5 32 501.5 40.9 508.1 54.87C514.8 68.84 512.7 85.37 502.1 97.33L320 320.9V448C320 460.1 313.2 471.2 302.3 476.6C291.5 482 278.5 480.9 268.8 473.6L204.8 425.6C196.7 419.6 192 410.1 192 400V320.9L9.042 97.33C-.745 85.37-2.765 68.84 3.854 54.87L3.853 54.87z"/></svg>
        <span>${this.widgetTitle}</span>
      </h5>
      <div class="field-container">
        <label for="keyword">Name or Keyword</label>
        <div class='flex'>
          <input id='keyword' .value=${this.keyword} type="text" @input=${e => this.keyword = e.target.value}>
        </div>
      </div>
      <div class="${this.filterError ? 'hide' : ''}">
        <div class="field-container">
          <label for="library">Library</label>
          <ucd-theme-slim-select class='flex' @change=${e => this.onSlimSelectChange(e, 'library')}>
            <select id='library' multiple>
              <option data-placeholder="true">Select Library</option>
              ${this.filterOptions.library.map(opt => html`
                <option ?selected=${this.library.includes(opt.id)} value=${opt.id}>${opt.name}</option>
              `)}
            </select>
          </ucd-theme-slim-select>
        </div>
        <div class="field-container">
          <label for="service-type">Service Type</label>
          <ucd-theme-slim-select class='flex' @change=${e => this.onSlimSelectChange(e, 'serviceType')}>
            <select id='service-type' multiple>
              <option data-placeholder="true">Select Service Type</option>
              ${this.filterOptions['service-type'].map(opt => html`
                <option ?selected=${this.serviceType.includes(opt.id)} value=${opt.id}>${opt.name}</option>
              `)}
            </select>
          </ucd-theme-slim-select>
        </div>
      </div>
      <input type="submit" class="btn btn--primary-input btn--block" value="Apply Filter">
    </form>
  </div>

`;}