import { html, css } from 'lit';

import headingStyles from '@ucd-lib/theme-sass/1_base_html/_headings.css.js';
import headingClasses from '@ucd-lib/theme-sass/2_base_class/_headings.css.js';

export function styles() {
  const elementStyles = css`
    :host {
      display: block;
    }
    [hidden] {
      display: none !important;
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
  <div>
    <h2 ?hidden=${!this.floorTitle}>${this.floorTitle}</h2>
    <h3 ?hidden=${!this.subTitle} class="heading--auxiliary">${this.subTitle}</h3>
  </div>

`;}