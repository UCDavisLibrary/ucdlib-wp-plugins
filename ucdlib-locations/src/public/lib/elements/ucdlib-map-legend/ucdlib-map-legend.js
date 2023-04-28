import { LitElement } from 'lit';
import {render, styles} from "./ucdlib-map-legend.tpl.js";
import {MutationObserverController} from "@ucd-lib/theme-elements/utils/controllers";

export default class UcdlibMapLegend extends LitElement {

  static get properties() {
    return {
      propsSetFromScript: {state: true},
      items: {state: true},
      legendTitle: {state: true}
    }
  }

  static get styles() {
    return styles();
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.propsSetFromScript = false;
    this.items = [];
    this.legendTitle = '';

    new MutationObserverController(this, {childList: true, subtree: false});
  }

  willUpdate(props) {
    if ( props.has('items') ) {
      this.dispatchEvent(new CustomEvent('items-update', {bubbles: true, composed: true, detail: {items: this.items}}));
    }
  }


  /**
   * @description When the child list mutates, check if there is a script tag
   * and if so, parse the json and set element properties
   */
  _onChildListMutation(){
    const script = this.querySelector('script[type="application/json"]');
    if ( script && !this.propsSetFromScript ) {
      const data = JSON.parse(script.text);
      if ( Array.isArray(data.items) ) this.items = data.items;
      if ( data.title ) this.legendTitle = data.title;
      this.propsSetFromScript = true;
    }
  }

}

customElements.define('ucdlib-map-legend', UcdlibMapLegend);