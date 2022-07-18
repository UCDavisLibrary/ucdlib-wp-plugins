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
    .dept-container {
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
    <div class='sort-label'>Sort by: </div>
    <div class='dept-container'>
      <input 
        @input=${() => this.onInput('department')} 
        id="department" name="radio" 
        type="radio" 
        class="radio" 
        ?checked=${this.sort == 'department'}>
        <label for="department">Department</label>
    </div>
    <div>
      <input 
        @input=${() => this.onInput('name')} 
        id="name" name="radio" 
        type="radio" 
        class="radio" 
        ?checked=${this.sort == 'name'}>
        <label for="name">Last Name</label>
    </div>
  </div>

`;}