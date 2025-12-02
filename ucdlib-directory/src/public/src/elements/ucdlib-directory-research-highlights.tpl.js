import { html } from 'lit';


export function render() {
  return html`
    <style>
      .research-highlight-more {
        margin-left: 1rem;
        margin-top: 1rem;
        margin-bottom:1.5rem;
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

      ucdlib-directory-research-highlights a.icon-ucdlib, ucdlib-directory-research-highlights span.icon-ucdlib {
       display: flex;
      }
    </style>
    <h2 class="heading--auxiliary">Research Highlights</h2>

    ${this.loading
      ? html`<p><em>Loading research highlights...</em></p>`
      : this.error ? html`<p class="research-highlight-alert"> ${this.error}</p>`
      : this.res?.length ? html`
        ${this.res.map((r, i) => html`
          <div class='ucd-link-list-item'>
            <span class='icon-ucdlib category-brand--secondary'>
              <ucdlib-icon icon="ucd-public:fa-circle-chevron-right"></ucdlib-icon>
              <span>
                ${r?.url 
                  ? html`<a class='ucd-link-list-item--title' href="${r.url}">${r.title || '(untitled)'}</a>`
                  : html`<span class='ucd-link-list-item--title'>${r.title || '(untitled)'}</span>`
                }
                <span class='ucd-link-list-item--excerpt'>
                  ${r?.type ?? ''} 
                  ${r?.issuedDate ?? ''} 
                  ${r?.author ?? ''} 
                  ${r?.publication ? html`<em>${r.publication}</em>, ` : ''}
                  ${r?.volume ? `${r.volume}.` : ''}
                  ${r?.page ? ` ${r.page}.` : ''}
                </span>
              </span>
            </span>
          </div>
        `)}

        <div class="research-highlight-more">
          <a href="${this.expertId ? `https://experts.ucdavis.edu/expert/${this.expertId}` : '#'}">More research</a>
        </div>
        ` : html`<p><em>No Research Highlights added.</em></p>`
    }`
}
