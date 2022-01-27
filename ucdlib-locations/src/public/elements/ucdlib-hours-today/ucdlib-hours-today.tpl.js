import { html, css } from 'lit';
import headingsStyles from "@ucd-lib/theme-sass/1_base_html/_headings.css";
import headingClasses from "@ucd-lib/theme-sass/2_base_class/_headings.css";

export function styles() {
  const elementStyles = css`
    :host {
      display: block;
    }
  `;

  return [
    headingsStyles,
    headingClasses,
    elementStyles
  ];
}

export function render() { 
return html`
  <h2 class="heading--underline">${this.widgetTitle}</h2>
  <p>${this.ctl.makeAPIUrl()}</p>
`;}