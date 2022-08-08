import { html, css } from 'lit';

import formStyles from "@ucd-lib/theme-sass/1_base_html/_forms.css.js";
import formsClassesStyles from "@ucd-lib/theme-sass/2_base_class/_forms.css.js";

export function styles() {
  const elementStyles = css`
    :host {
      display: block;
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

`;}