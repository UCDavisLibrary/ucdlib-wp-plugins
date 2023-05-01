import { html, css } from 'lit';

import headingStyles from '@ucd-lib/theme-sass/1_base_html/_headings.css.js';
import headingClasses from '@ucd-lib/theme-sass/2_base_class/_headings.css.js';
import colorClasses from '@ucd-lib/theme-sass/4_component/_category-brand.css.js';

export function styles() {
  const elementStyles = css`
    :host {
      display: block;
    }
    [hidden] {
      display: none !important;
    }
    .row {
      display: flex;
      align-items: center;
    }
    .row ucdlib-icon {
      margin-right: 1rem;
    }
    .row ucdlib-mdc-switch {
      margin-left: 1rem;
    }
    .row:not(:last-child) {
      border-bottom: 1px solid #DBEAF7;
    }
    .space-label {
      font-weight: 700;
      flex-grow: 1;
      margin: .75rem 0;
    }
    
  `;

  return [
    headingStyles,
    headingClasses,
    colorClasses,
    elementStyles
  ];
}

export function render() { 
return html`
  <section ?hidden=${!this.spaces.length}>
    <h4>${this.legendTitle}</h4>
    <div class='rows'>
      ${this.spaces.map(space => html`
        <div class='row'>
          <ucdlib-icon icon=${space.icon} class=${space.color}></ucdlib-icon>
          <div class='space-label'>${space.label}</div>
          <ucdlib-mdc-switch slug=${space.slug} @space-toggle=${this._onSpaceToggle}></ucdlib-mdc-switch>
        </div>
      `)}
    </div>
    
  </section>

`;}