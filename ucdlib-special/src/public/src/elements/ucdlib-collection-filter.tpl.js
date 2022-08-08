import { html, css } from 'lit';

import formStyles from "@ucd-lib/theme-sass/1_base_html/_forms.css.js";
import formsClassesStyles from "@ucd-lib/theme-sass/2_base_class/_forms.css.js";

export function styles() {
  const elementStyles = css`
    :host {
      display: block;
    }
    .main {
      display: flex;
      align-items: center;
    }
    .container {
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

  `;

  return [
    formStyles,
    formsClassesStyles,
    elementStyles
  ];
}

export function render() { 
return html`
  <div class='main radio'>
    <div class='sort-label'>Browse by: </div>
    <div class='container'>
      <input 
        @input=${() => this.onSortInput('subject')} 
        id="subject" name="filter-subject" 
        type="radio" 
        class="radio" 
        ?checked=${this.sort == 'subject'}>
        <label for="filter-subject">Subject</label>
    </div>
    <div>
      <input 
        @input=${() => this.onSortInput('a-z')} 
        id="a-z" name="filter-a-z" 
        type="radio" 
        class="radio" 
        ?checked=${this.sort == 'a-z'}>
        <label for="filter-a-z">A - Z</label>
    </div>
  </div>
`;}