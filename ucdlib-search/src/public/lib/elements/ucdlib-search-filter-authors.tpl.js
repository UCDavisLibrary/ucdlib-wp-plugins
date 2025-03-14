import { html, css } from 'lit';
import slimSelectStyles from "@ucd-lib/theme-sass/slim-select.css.js"
import selectStyles from "@ucd-lib/theme-sass/4_component/_slim-select.css.js";
import headerStyles from "@ucd-lib/theme-sass/1_base_html/_headings.css.js";

export function styles() {
  const elementStyles = css`
    :host {
      display: block;
    }
    .h5 {
      margin: 0.75em 0 0.25em;
      padding: 0;
      color: var(--forced-contrast-heading-primary, #022851);
      font-size: 1rem;
      font-style: normal;
      font-weight: 800;
      line-height: 1.2;
      font-size: 1rem;
    }
    :where(:not([class*=block-field-])) > .h5:first-child {
      margin-top: 0;
    }
    .h5 a {
      color: var(--forced-contrast, #022851);
      text-decoration: underline;
    }
    .h5 a:hover, .h5 a:focus {
      color: var(--forced-contrast, #022851);
      text-decoration: none;
    }
    @media (min-width: 768px) {
      .h5 {
        font-size: 1.207rem;
      }
    }
    [hidden] {
      display: none !important;
    }
    .container {
      display: block;
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

    @media (min-width: 480px) {
      .container {
        display: flex;
        align-items: center;
    }
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
    <div class='h5 label'>Content by: </div>
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
