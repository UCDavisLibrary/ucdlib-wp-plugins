import { LitElement } from 'lit';
import {render, styles} from "./ucdlib-map-floor.tpl.js";
import {MutationObserverController} from "@ucd-lib/theme-elements/utils/controllers";

export default class UcdlibMapFloor extends LitElement {

  static get properties() {
    return {
      propsSetFromScript: {state: true},
      floorTitle: {state: true},
      subTitle: {state: true},
      navText: {state: true},
      layers: {state: true},
    }
  }

  static get styles() {
    return styles();
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.propsSetFromScript = false;
    this.floorTitle = '';
    this.subTitle = '';
    this.navText = '';
    this.layers = [];

    new MutationObserverController(this, {childList: true, subtree: false});
  }

  _onChildListMutation(){
    const script = this.querySelector('script[type="application/json"]');
    if ( script && !this.propsSetFromScript ) {
      const data = JSON.parse(script.text);
      if ( Array.isArray(data.layers) ) this.layers = data.layers;
      if ( data.title ) this.floorTitle = data.title;
      if ( data.subTitle ) this.subTitle = data.subTitle;
      if ( data.navText ) {
        this.navText = data.navText
      } else if(this.floorTitle) {
        this.navText = this.floorTitle[0];
      };

      this.propsSetFromScript = true;
    }
  }

}

customElements.define('ucdlib-map-floor', UcdlibMapFloor);