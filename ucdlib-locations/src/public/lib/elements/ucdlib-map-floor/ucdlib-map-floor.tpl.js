import { html, css } from 'lit';

export function styles() {
  const elementStyles = css`
    :host {
      display: block;
    }
    [hidden] {
      display: none !important;
    }
    .map {
      position: relative;
    }
    .bottom-layer {
      width: 100%;
    }
    .layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }
    .layer.can-hide {
      transition: opacity 0.25s ease-in-out;
    }
  `;

  return [
    elementStyles
  ];
}

export function render() { 
return html`
  <div>
    ${this.bottomSrc ? html`
      <div class='map'>
        <img class='bottom-layer' src=${this.bottomSrc} style='opacity: ${this.bottomOpacity};'>
        ${this.layers.map((layer, i) => html`
          <img class='layer can-hide' src=${layer.src} style='z-index: ${i+1};opacity:${layer.visible ? '1' : '0'}'>
        `)}
        ${this.topLayer ? html`
          <img class='layer' src=${this.topLayer} style='z-index: ${this.layers.length + 1};'>
        ` : html``}
      </div>
    ` : html``}
  </div>


`;}