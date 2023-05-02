import { html, css } from 'lit';

import headingStyles from '@ucd-lib/theme-sass/1_base_html/_headings.css.js';
import headingClasses from '@ucd-lib/theme-sass/2_base_class/_headings.css.js';
import layoutStyles from '@ucd-lib/theme-sass/5_layout/_l-basic.css.js';
import containerStyles from '@ucd-lib/theme-sass/5_layout/_l-container.css.js';
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
    .nav-buttons {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .nav {
      border-bottom: 4px dashed #FFBF00;
      padding-bottom: 1.5rem;
      margin-bottom: 2rem !important;
    }
    .nav h4 {
      margin-right: 1rem;
    }
    .navButton {
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #13639E;
      margin: .5rem 0.5rem;
      width: 3.5rem;
      height: 3.5rem;
      min-height: 3.5rem;
      min-width: 3.5rem;
      cursor: pointer;
      background-color: #E5E5E5;
      border: 4px solid #E5E5E5;
    }
    .navButton h2 {
      margin: 0;
      padding: 0;
    }
    .navButton.selected {
      border-color: #FFBF00;
    }
    .navButton:hover {
      border-color: #3375BC;
    }
    .navButton.selected:hover {
      border-color: #FFBF00;
    }
    @media screen and (min-width: 480px) {
      .nav {
        display: flex;
        align-items: center;
      }
      .nav-buttons {
        justify-content: unset;
      }
    }
  `;

  return [
    elementStyles,
    containerStyles,
    headingStyles,
    headingClasses,
    layoutStyles,
    gridStyles,
    oBoxStyles,
    spaceUtils
  ];
}

export function render() { 
return html`
  <div>
    <div class='nav l-container' ?hidden=${this.floors.length < 2}>
      <h4>Level:</h4>
      <div class='nav-buttons'>
        ${this.floors.map(floor => html`
          <a @click=${e => this._onFloorSelect(floor)} class='navButton ${this.selectedFloorIndex == floor.propIndex ? "selected" : ""}'>
            <h2>${floor.navText}</h2>
          </a>
        `)}
      </div>
    </div>
    <div class='l-container' ?hidden=${!this.floorTitle && !this.floorSubTitle}>
      <h2 ?hidden=${!this.floorTitle}>${this.floorTitle}</h2>
      <h3 ?hidden=${!this.floorSubTitle} class="heading--auxiliary">${this.floorSubTitle}</h3>
    </div>
    <div class="l-basic--flipped">
      <div class="l-content o-box">
        <div>
          ${this.floors.map(floor => html`
            <div ?hidden=${this.selectedFloorIndex != floor.propIndex}>
              <slot name="${floor.slotName}"></slot>
            </div>
          `)}
        </div>
      </div>
      <div 
        class="l-sidebar-second">
        <div 
          class='o-box u-space-mb'
          ?hidden=${this.hideSpacesSlot} 
          @spaces-update=${e => this._onSpaceUpdate(e.detail)} 
          @switches-loaded=${e => this._onSlottedEleReady('spaces-legend')}
          @spaces-toggle=${e => this._onSpacesToggle(e.detail)}>
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