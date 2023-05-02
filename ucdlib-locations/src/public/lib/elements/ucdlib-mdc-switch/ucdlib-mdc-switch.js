import { LitElement } from 'lit';
import {render, styles} from "./ucdlib-mdc-switch.tpl.js";
import {MDCSwitch} from '@material/switch';

export default class UcdlibMdcSwitch extends LitElement {

  static get properties() {
    return {
      switch: {state: true},
      slug: {type: String},
      disabled: {type: Boolean}
    }
  }

  static get styles() {
    return styles();
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.slug = '';
    this.disabled = false;
  }

  willUpdate(props){
    if ( props.has('disabled') ) {
      if ( this.disabled ) this.disable();
      else this.enable();
    }
  }

  disable(){
    if ( !this.isLoaded() ) return;
    this.switch.disabled = true;
  }

  enable(){
    if ( !this.isLoaded() ) return;
    this.switch.disabled = false;
  }

  isLoaded(){
    return this.switch !== undefined;
  }

  async _onClick(){
    if ( !this.isLoaded() ) return;

    // wait for the switch to update
    await new Promise(resolve => setTimeout(resolve, 100));

    // fire toggle event
    const event = new CustomEvent('space-toggle', {bubbles: true, composed: true, detail: {slug: this.slug, checked: this.switch.selected}});
    this.dispatchEvent(event);
  }

  firstUpdated(){
    const ele = this.renderRoot.querySelector('#selected-switch');
    if ( ele ) this.switch = new MDCSwitch(ele);
    this.dispatchEvent(new CustomEvent('switch-loaded', {bubbles: true, composed: true}));
  }

}

customElements.define('ucdlib-mdc-switch', UcdlibMdcSwitch);