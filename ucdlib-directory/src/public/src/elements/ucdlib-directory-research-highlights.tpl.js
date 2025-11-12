import { html } from 'lit';

export function render() {
  return html`
    <style>
      .research-highlight-url {
        font-weight: bold;
        font-size: 1.188rem;
        text-decoration: none;
      }

      .research-highlight-info{
        font-size: 1rem;
      }

      .research-highlight-more {
        margin-left: 1rem;
      }

      .research-highlight-alert {
        margin: 0 0 1rem;
        padding: 2rem;
        background-color: #dff4fb;
        color: #022851;
        font-size: 1rem;
        font-style: italic;
        color: var(--ucd-theme-alert, red);
      }
    </style>
    <h2 class="heading--auxiliary">Research Highlights</h2>

    ${this.loading
      ? html`<p><em>Loading research highlights...</em></p>`
      : this.error ? html`<p class="research-highlight-alert"> ${this.error}</p>`
      : this.res?.length ? html`
        <ul class="list--bordered">
            ${this.res.map((r, i) => html`
            <li>
                ${r?.url
                ? html`<a class="research-highlight-url" href="${r.url}">${r.title || '(untitled)'}</a>`
                : html`<span>${r.title || '(untitled)'}</span>`}
                <br />
                <span class="research-highlight-info">
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
        <br />
        <a class="research-highlight-more" href="${this.expertId ? `https://experts.ucdavis.edu/expert/${this.expertId}` : '#'}">More research</a>
        ` : html`<p><em>No Research Highlights added.</em></p>`
    }`
}
