import { html, css } from 'lit';

import layoutStyles from '@ucd-lib/theme-sass/5_layout/_l-basic.css.js';
import gridStyles from '@ucd-lib/theme-sass/5_layout/_l-grid-regions.css.js';
import oBoxStyles from '@ucd-lib/theme-sass/3_objects/_index.css.js';

export function styles() {
  const elementStyles = css`
    :host {
      display: block;
    }
  `;

  return [
    elementStyles,
    layoutStyles,
    gridStyles,
    oBoxStyles
  ];
}

export function render() { 
return html`
  <div>
    <div class="l-basic--flipped">
      <div class="l-content o-box">
        Content
      </div>
      <div class="l-sidebar-second o-box" @space-toggle=${e => console.log(e.detail)}>
        <slot name="spaces"></slot>
      </div>
    </div>
    
  </div>

`;}