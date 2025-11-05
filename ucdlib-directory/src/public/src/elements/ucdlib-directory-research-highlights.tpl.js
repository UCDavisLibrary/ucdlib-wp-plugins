import { html } from 'lit';

export function render() {
  return html`
    <h2 class="heading--auxiliary">Research Highlights</h2>

    ${this.loading
      ? html`<p><em>Loading research highlights...</em></p>`
      : this.error ? html`<p class="alert" style="color: var(--ucd-theme-alert, red);"> ${this.error}</p>`
      : this.res?.length ? html`
        <ul style="margin-bottom:1.2rem;" class="list--bordered">
            ${this.res.map((r, i) => html`
            <li>
                ${r?.url
                ? html`<a style="font-weight: bold;font-size: 1.188rem;text-decoration: none;" href="${r.url}">${r.title || '(untitled)'}</a>`
                : html`<span>${r.title || '(untitled)'}</span>`}
                <br />
                <span style="font-size: 1rem;">
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
        ` : html`<p><em>No Research Highlights added.</em></p>`
    }`
}
