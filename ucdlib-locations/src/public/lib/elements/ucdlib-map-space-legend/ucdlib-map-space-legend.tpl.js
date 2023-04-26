import { html, css } from 'lit';

import headingStyles from '@ucd-lib/theme-sass/1_base_html/_headings.css.js';
import headingClasses from '@ucd-lib/theme-sass/2_base_class/_headings.css.js';

export function styles() {
  const elementStyles = css`
    :host {
      display: block;
    }
  `;

  return [
    headingStyles,
    headingClasses,
    elementStyles
  ];
}

export function render() { 
return html`
  <section>
    <h4>${this.legendTitle}</h4>
    <ucdlib-mdc-switch></ucdlib-mdc-switch>
  </section>

`;}