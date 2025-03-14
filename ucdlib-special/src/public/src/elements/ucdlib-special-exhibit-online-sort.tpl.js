import { html, css } from 'lit';

import formStyles from "@ucd-lib/theme-sass/1_base_html/_forms.css.js";
import formsClassesStyles from "@ucd-lib/theme-sass/2_base_class/_forms.css.js";

export function styles() {
  const elementStyles = css`
    :host {
      display: block;
    }
    [hidden] {
      display: none !important;
    }
    .main {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
    }
    .radio {
      display: flex;
      align-items: center;
      margin: 10px 10px 10px 0;
    }
    .sort-title-container {
      margin-right: .5rem;
    }
    .radio label {
      padding-bottom: 0;
    }
    .sort-label {
      margin-right: .5rem;
      font-weight: 700;
    }
    .radio label::after {
      top: 14px;
      left: 8px;
    }
    select {
      background-color: #B0D0ED;
      color: #022851;
      font-weight: 700;
      border: none;
      font-size: 1rem;
      min-width: 250px;
      max-width: 250px;
    }
    select:focus {
      background-color: #b0d0ed;
      border: 1px solid #999;
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
    <div class='radio'>
      <div class='sort-label'>Sort by: </div>
      <div class='sort-title-container'>
        <input
          @input=${() => this.onSortInput('title')}
          id="sort-title" name="sort-title"
          type="radio"
          ?checked=${this.sort == 'title'}>
          <label for="sort-title">A - Z</label>
      </div>
      <div>
        <input
          @input=${() => this.onSortInput('date')}
          id="sort-date" name="sort-date"
          type="radio"
          ?checked=${this.sort == 'date'}>
          <label for="sort-date">Newest First</label>
      </div>
    </div>
    <div>
      <label for="curator" hidden>Curator</label>
      <select id="curator" @input=${this.onCuratorInput}>
        <option value='0' ?selected=${this.curator == 0}>All Curators</option>
        ${this.curatorOptions.map(curator => html`
          <option value=${curator.id} ?selected=${curator.id == this.curator}>${curator.name}</option>
        `)}
      </select>
    </div>
  </div>
`;}
