import { html, css } from 'lit';

import formStyles from "@ucd-lib/theme-sass/1_base_html/_forms.css.js";
import formsClassesStyles from "@ucd-lib/theme-sass/2_base_class/_forms.css.js";

export function styles() {
  const elementStyles = css`
    :host {
      display: block;
    }
    .alphaContainer {
      display: inline-block;   
      margin: 13px 0; 
      width:750px;

    }
    .box {
      color: #022851;
      background-color: #dbeaf7;
      width:50px;
      height:50px;
      margin: 5px 0;
      display: inline-block;
      vertical-align: middle;
      line-height: 50px;
      text-align:center;
    }
    .box:hover {
      color: white;
      background-color: #022851;   
    }

    .disabled {
      background-color: #ebf3fa;
      color: #A9A9A9;
      width:50px;
      height:50px;
      margin: 5 0;
      display: inline-block;
      vertical-align: middle;
      line-height: 50px;
      text-align:center;
    }

    .dotted {
      border-top:4.5px dotted #ffbf00;

    }

    @media (max-width: 850px) {
      .alphaContainer {
        display: inline-block;   
        margin: 13px 0; 
        width:320px;
      }
    } 
    
  `;

  return [
    formStyles,
    formsClassesStyles,
    elementStyles,
  ];
}

export function render() { 
return html`
    <hr class="dotted">
    <div class="alphaContainer">
        ${this.alpha.map((alp, i) => html`
            ${alp.exists ? html`
              <span @click=${() => this.onAlphaInput(alp.value)} class="box"><b>${alp.display}</b></span>
            `: html`
              <span class="disabled"><b>${alp.display}</b></span>
            `}
        `)}
    </div>
    <hr class="dotted">
`;}