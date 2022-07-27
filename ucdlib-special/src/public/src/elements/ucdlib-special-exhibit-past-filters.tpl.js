import { html, css } from 'lit';

import formStyles from "@ucd-lib/theme-sass/1_base_html/_forms.css.js";
import formsClassesStyles from "@ucd-lib/theme-sass/2_base_class/_forms.css.js";

export function styles() {
  const elementStyles = css`
    :host {
      display: block;
    }
    .row-label {
      margin-right: 1rem;
      font-weight: 700;
    }
    select {
      background-color: #B0D0ED;
      color: #022851;
      font-weight: 700;
      border: none;
      font-size: 1rem;
      margin: 10px 0;
    }
    select:focus {
      background-color: #b0d0ed;
      border: 1px solid #999;
    }

    @media (min-width: 480px) {
      .main {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
      }
      select {
        max-width: 200px;
        margin: 0;
      }
      .year-container {
        margin-right: 1rem;
      }
    }
  `;

  return [
    formStyles,
    formsClassesStyles,
    elementStyles
  ];
}

export function render() { 
return html`
  <div class='main'>
  <div class='row-label'>Display: </div>
    <div class='year-container'>
        <select id="year" @input=${this.onYearInput} role="link">
          <option value='0' ?selected=${this.year == 0}>All Years</option>
          ${this.yearOptions.map(year => html`
            <option value=${year} ?selected=${year == this.year}>${year}</option>
          `)}
        </select>
      </div>
    <div>
      <select id="curator" @input=${this.onCuratorInput} role="link">
        <option value='0' ?selected=${this.curator == 0}>All Curators</option>
        ${this.curatorOptions.map(curator => html`
          <option value=${curator.id} ?selected=${curator.id == this.curator}>${curator.name}</option>
        `)}
      </select>
    </div>
  </div>

`;}