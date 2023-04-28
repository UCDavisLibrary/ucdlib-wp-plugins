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
    .row {
      display: flex;
      align-items: center;
    }
    .row ucdlib-icon {
      margin-right: 1rem;
    }
    .item-label {
      flex-grow: 1;
      margin: .5rem 0;
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
  <section ?hidden=${!this.items.length}>
    <h4>${this.legendTitle}</h4>
    <div class='rows'>
      ${this.items.map(item => html`
        <div class='row'>
          <ucdlib-icon icon=${item.icon}></ucdlib-icon>
          <div class='item-label'>${item.label}</div>
        </div>
      `)}
    </div>
  </section>


`;}