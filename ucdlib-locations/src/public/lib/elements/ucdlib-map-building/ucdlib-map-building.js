import { LitElement } from 'lit';
import {render, styles} from "./ucdlib-map-building.tpl.js";
import {MutationObserverController} from "@ucd-lib/theme-elements/utils/controllers";

export default class UcdlibMapBuilding extends LitElement {

  static get properties() {
    return {
      hasSpacesEle: {state: true},
      hideSpacesSlot: {state: true},
      hasLegendEle: {state: true},
      hideLegendSlot: {state: true}
    }
  }

  static get styles() {
    return styles();
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.hasSpacesEle = false;
    this.hideSpacesSlot = false;
    this.hasLegendEle = false;
    this.hideLegendSlot = false;

    new MutationObserverController(this, {childList: true, subtree: false});
  }

  _onChildListMutation(){
    const spaces = this.querySelector('ucdlib-map-space-legend');
    if ( spaces && !this.hasSpacesEle ) {
      spaces.setAttribute('slot', 'spaces');
      this.hasSpacesEle = true;
      if ( !spaces.spaces ) this.hideSpacesSlot = true;
    }
    const legend = this.querySelector('ucdlib-map-legend');
    if ( legend && !this.hasLegendEle ) {
      legend.setAttribute('slot', 'legend');
      this.hasLegendEle = true;
      if ( !legend.items ) this.hideLegendSlot = true;
    }
  }

  _onSpaceUpdate(detail) {
    this.hideSpacesSlot = detail.spaces.length === 0;
  }


  _onLegendUpdate(detail) {
    this.hideLegendSlot = detail.items.length === 0;
  }

}

customElements.define('ucdlib-map-building', UcdlibMapBuilding);