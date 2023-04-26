import { LitElement } from 'lit';
import {render, styles} from "./ucdlib-map-building.tpl.js";
import {MutationObserverController} from "@ucd-lib/theme-elements/utils/controllers";

export default class UcdlibMapBuilding extends LitElement {

  static get properties() {
    return {
      hasSpaces: {state: true}
    }
  }

  static get styles() {
    return styles();
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.hasSpaces = false;

    new MutationObserverController(this, {childList: true, subtree: false});
  }

  _onChildListMutation(){
    const spaces = this.querySelector('ucdlib-map-space-legend');
    if ( spaces && !this.hasSpaces ) {
      spaces.setAttribute('slot', 'spaces');
      this.hasSpaces = true;
    }
  }

}

customElements.define('ucdlib-map-building', UcdlibMapBuilding);