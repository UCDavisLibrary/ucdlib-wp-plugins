import { html, css } from 'lit';

import layoutStyles from '@ucd-lib/theme-sass/5_layout/_l-basic.css.js';
import gridStyles from '@ucd-lib/theme-sass/5_layout/_l-grid-regions.css.js';
import oBoxStyles from '@ucd-lib/theme-sass/3_objects/_index.css.js';
import spaceUtils from "@ucd-lib/theme-sass/6_utility/_u-space.css.js";

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
    elementStyles,
    layoutStyles,
    gridStyles,
    oBoxStyles,
    spaceUtils
  ];
}

export function render() { 
return html`
  <div>
    <div class="l-basic--flipped">
      <div class="l-content o-box">
        Content
      </div>
      <div 
        class="l-sidebar-second">
        <div 
          class='o-box u-space-mb'
          ?hidden=${this.hideSpacesSlot} 
          @spaces-update=${e => this._onSpaceUpdate(e.detail)} 
          @space-toggle=${e => console.log(e.detail)}>
          <slot name="spaces"></slot>
        </div>
        <div 
          class='o-box u-space-mb'
          ?hidden=${this.hideLegendSlot} 
          @items-update=${e => this._onLegendUpdate(e.detail)}>
          <slot name="legend"></slot>
        </div>
        
      </div>
    </div>
    
  </div>

`;}