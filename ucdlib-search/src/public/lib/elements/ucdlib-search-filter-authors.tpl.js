import { html, css } from 'lit';
import slimSelectStyles from "@ucd-lib/theme-sass/slim-select.css.js"
import selectStyles from "@ucd-lib/theme-sass/4_component/_slim-select.css.js";
import headerStyles from "@ucd-lib/theme-sass/1_base_html/_headings.css.js";

export function styles() {
  const elementStyles = css`
    :host {
      display: block;
    }
    [hidden] {
      display: none !important;
    }
    .container {
      display: flex;
      align-items: center;
    }
    .label {
      font-style: italic;
      white-space: nowrap;
      margin-right: .5rem;
    }
    .ss-main {
      border: none;
    }
    .ss-main .ss-multi-selected {
      padding-left: 0;
    }
    .ss-value-text {
      cursor: auto;
    }
  `;

  return [
    slimSelectStyles,
    headerStyles,
    selectStyles,
    elementStyles
  ];
}

export function render() { 
return html`
  <div class='container' ?hidden=${this.authors.length == 0}>
    <h5 class='label'>Content by: </h5>
    <div class='ss-main'>
      <div class='ss-multi-selected'>
        <div class='ss-values'>
          ${this.authors.map(author => html`
            <div class="ss-value">
              <span class="ss-value-text">${author.person ? `${author.person.nameFirst} ${author.person.nameLast}` : author.query}</span>
              <span class="ss-value-delete" @click=${() => this._onRemove(author.query)}>x</span>
            </div>
          `)}
        </div>
      </div>
    </div>

  </div>

`;}