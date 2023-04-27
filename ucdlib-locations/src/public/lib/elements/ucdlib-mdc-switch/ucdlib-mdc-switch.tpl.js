import { html, css, unsafeCSS } from 'lit';
import mdcSwitchStyles from "@material/switch/dist/mdc.switch.min.css";

export function styles() {
  const elementStyles = css`
    :host {
      display: block;
    }
    .mdc-switch {
      --mdc-switch-selected-track-color: #B0D0ED;
      --mdc-switch-selected-hover-track-color: #B0D0ED;
      --mdc-switch-selected-pressed-track-color: #B0D0ED;
      --mdc-switch-selected-focus-track-color: #B0D0ED;
      --mdc-switch-selected-handle-color: #13639E;
      --mdc-switch-selected-hover-handle-color: #13639E;
      --mdc-switch-selected-pressed-handle-color: #13639E;
      --mdc-switch-selected-focus-handle-color: #13639E;
      --mdc-switch-selected-hover-state-layer-color: #ebf3fa;
      --mdc-switch-selected-focus-state-layer-color: #ebf3fa;
      --mdc-switch-selected-pressed-state-layer-color: #ebf3fa;
      --mdc-switch-unselected-track-color: #CCCCCC;
      --mdc-switch-unselected-hover-track-color: #CCCCCC;
      --mdc-switch-unselected-pressed-track-color: #CCCCCC;
      --mdc-switch-unselected-focus-track-color: #CCCCCC;
      --mdc-switch-unselected-handle-color: #FFFFFF;
      --mdc-switch-unselected-hover-handle-color: #FFFFFF;
      --mdc-switch-unselected-pressed-handle-color: #FFFFFF;
      --mdc-switch-unselected-focus-handle-color: #FFFFFF;
      --mdc-switch-unselected-hover-state-layer-color: #ebf3fa;
      --mdc-switch-unselected-focus-state-layer-color: #ebf3fa;
      --mdc-switch-unselected-pressed-state-layer-color: #ebf3fa;

    }
  `;

  return [
    elementStyles,
    unsafeCSS(mdcSwitchStyles)
  ];
}

export function render() { 
return html`
  <button id="selected-switch" @click=${this._onClick} class="mdc-switch mdc-switch--selected" type="button" role="switch" aria-checked="true" disabled>
    <div class="mdc-switch__track"></div>
    <div class="mdc-switch__handle-track">
      <div class="mdc-switch__handle">
        <div class="mdc-switch__shadow">
          <div class="mdc-elevation-overlay"></div>
        </div>
        <div class="mdc-switch__ripple"></div>
      </div>
    </div>
    <span class="mdc-switch__focus-ring-wrapper">
      <div class="mdc-switch__focus-ring"></div>
    </span>
  </button>
`;}