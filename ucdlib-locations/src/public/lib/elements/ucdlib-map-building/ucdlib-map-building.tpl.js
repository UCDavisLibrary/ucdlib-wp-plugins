import { html, css } from 'lit';

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
  <div>
    <p>hi there</p>
    <slot name="spaces"></slot>
  </div>

`;}