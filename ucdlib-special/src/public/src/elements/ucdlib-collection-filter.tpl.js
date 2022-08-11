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
          @input=${() => this.onSortInput('')} 
          type="radio" 
          id="subject" 
          name="age" 
          ?checked=${this.sort == ''}>
        <label for="subject">Subject</label><br>
      </div>
      <div>
        <input 
          @input=${() => this.onSortInput('az')} 
          type="radio" 
          id="a-z" 
          name="age" 
          ?checked=${this.sort == 'az'}>
        <label for="a-z">A - Z</label><br>
      </div>
    </div>
  </div>
`;}