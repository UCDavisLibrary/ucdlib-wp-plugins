import { html, css } from 'lit';

export function styles() {
  const elementStyles = css`
    :host {
      display: block;
    }
    .alphaContainer {
      display: flex;
      flex-wrap: wrap;
      max-width: 800px;
    }
    .box {
      color: #022851;
      background-color: #dbeaf7;
      width:50px;
      height:50px;
      margin: 5px 5px;
      display: inline-block;
      vertical-align: middle;
      line-height: 50px;
      text-align:center;
      cursor: pointer;
    }
    .box:hover {
      color: white;
      background-color: #022851;   
    }

    .box.disabled {
      background-color: #ebf3fa;
      color: #A9A9A9;
      cursor: auto;
    }

    .box.disabled:hover {
      background-color: #ebf3fa;
      color: #A9A9A9;
    }
    
  `;

  return [
    elementStyles,
  ];
}

export function render() { 
return html`
    <div class="alphaContainer">
      ${this.alpha.map((alp, i) => html`
          ${alp.exists ? html`
            <span @click=${() => this.onAlphaInput(alp.value)} class="box"><b>${alp.display}</b></span>
          `: html`
            <span class="box disabled"><b>${alp.display}</b></span>
          `}
      `)}
    </div>
`;}