import { html, css } from 'lit';
import classStyles from "@ucd-lib/theme-sass/2_base_class/_index.css.js";
import baseStyles from "@ucd-lib/theme-sass/1_base_html/_index.css.js";
import objectsStyles from "@ucd-lib/theme-sass/3_objects/_index.css.js";
import componentClassesStyles from "@ucd-lib/theme-sass/4_component/_index.css.js";
import layoutStyles from "@ucd-lib/theme-sass/5_layout/_index.css.js";
import utilityStyles from "@ucd-lib/theme-sass/6_utility/_index.css.js";

export function styles() {
  const elementStyles = css`
    :host { display: block; }
    .title {
      font-weight: bold;
      font-size: 1.188rem;
      text-decoration: none;
    }
    .info {
      font-size: 1rem;
    }

  `;
  return [
      classStyles,
      baseStyles,
      objectsStyles,
      componentClassesStyles,
      layoutStyles,
      utilityStyles,
      elementStyles
    ];
}

export function render() {
  return html`
    <h2 class="heading--auxiliary">Research Highlights</h2>
        ${this.res?.length ? html`
        <ul style="margin-bottom:1.2rem;" class="list--bordered">
            ${this.res.map((r, i) => html`
            <li>
                ${r?.url
                ? html`<a class="title" href="${r.url}">${r.title || '(untitled)'}</a>`
                : html`<span>${r.title || '(untitled)'}</span>`}
                <br />
                <span class="info">
                ${r?.type ?? ''} 
                ${r?.issuedDate ?? ''} 
                ${r?.author ?? ''} 
                ${r?.publication ? html`<em>${r.publication}</em>, ` : ''}
                ${r?.volume ? `${r.volume}.` : ''}
                ${r?.page ? ` ${r.page}.` : ''}
                </span>
            </li>
            `)}
        </ul>
        <a style="margin-left:.75rem;" href="${this.expertId ? `https://experts.ucdavis.edu/expert/${this.expertId}` : '#'}">More research</a>
        ` : html`<p><em>No Research Highlights added.</em></p>`}
  `;
}
