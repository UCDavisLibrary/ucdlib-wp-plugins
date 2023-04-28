import { LitElement } from 'lit';
import {render, styles} from "./ucdlib-map-building.tpl.js";
import {MutationObserverController} from "@ucd-lib/theme-elements/utils/controllers";

export default class UcdlibMapBuilding extends LitElement {

  static get properties() {
    return {
      hasSpacesEle: {state: true},
      hideSpacesSlot: {state: true},
      hasLegendEle: {state: true},
      hideLegendSlot: {state: true},
      floors: {state: true},
      selectedFloorIndex: {state: true},
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
    this.floors = [];
    this.selectedFloorIndex = 0;

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

    const floorEles = Array.from(this.querySelectorAll('ucdlib-map-floor'));
    const floors = [];
    floorEles.forEach((floor, i) => {
      const slotName = `floor-${i}`;
      floor.setAttribute('slot', slotName);
      const d = {
        slotName,
        propIndex: i,
        ele: floor,
      };
      let floorProps = floor.querySelector('script[type="application/json"]');
      if ( floorProps ) {
        floorProps = JSON.parse(floorProps.text);
        if ( floorProps.navText ) {
          d.navText = floorProps.navText
        } else if ( floorProps.title ) {
          d.navText = floorProps.title[0];
        } else {
          d.navText = '?';
        };

        if ( floorProps.layers ){
          d.layers = floorProps.layers;
        } else {
          d.layers = [];
        }
      }
      floors.push(d);
    });
    this.floors = floors;
  }

  _onFloorSelect(floor){
    this.selectedFloorIndex = floor.propIndex

    // now enable/disable layer toggles
    console.log(floor.layers);
  }

  _onSpaceUpdate(detail) {
    this.hideSpacesSlot = detail.spaces.length === 0;
  }


  _onLegendUpdate(detail) {
    this.hideLegendSlot = detail.items.length === 0;
  }

}

customElements.define('ucdlib-map-building', UcdlibMapBuilding);