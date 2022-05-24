import { html, css } from 'lit';
import "@ucd-lib/theme-elements/brand/ucd-theme-search-form/ucd-theme-search-form";

export function styles() {
  const elementStyles = css`
    :host {
      display: block;
    }
  `;

  return [elementStyles];
}

export function render() { 
return html`
  <ucd-theme-search-form
    value=${this.keyword}
    @search=${this._onSearch}>
  </ucd-theme-search-form>


`;}