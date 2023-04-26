import { LitElement } from 'lit';
import {render, styles} from "./ucdlib-mdc-switch.tpl.js";
import {MDCSwitch} from '@material/switch';

export default class UcdlibMdcSwitch extends LitElement {

  static get properties() {
    return {
      switch: {state: true}
    }
  }

  static get styles() {
    return styles();
  }

  constructor() {
    super();
    this.render = render.bind(this);
  }

  firstUpdated(){
    const ele = this.renderRoot.querySelector('#selected-switch');
    if ( ele ) this.switch = new MDCSwitch(ele);
  }

}

customElements.define('ucdlib-mdc-switch', UcdlibMdcSwitch);