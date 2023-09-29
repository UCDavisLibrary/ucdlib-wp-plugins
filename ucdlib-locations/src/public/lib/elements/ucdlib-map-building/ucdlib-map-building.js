import { LitElement } from 'lit';
import {render, styles} from "./ucdlib-map-building.tpl.js";
import {MutationObserverController} from "@ucd-lib/theme-elements/utils/controllers";

export default class UcdlibMapBuilding extends LitElement {

  static get properties() {
    return {
      spacesEle: {state: true},
      hideSpacesSlot: {state: true},
      spacesEleLoaded: {state: true},
      legendEle: {state: true},
      hideLegendSlot: {state: true},
      floors: {state: true},
      floorElesLoaded: {state: true},
      isReady: {state: true},
      selectedFloorIndex: {state: true},
      floorTitle: {state: true},
      floorSubTitle: {state: true}
    }
  }

  static get styles() {
    return styles();
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.spacesEle = undefined;
    this.hideSpacesSlot = false;
    this.spacesEleLoaded = false;
    this.floorElesLoaded = false;
    this.isReady = false;
    this.legendEle = undefined;
    this.hideLegendSlot = false;
    this.floors = [];
    this.selectedFloorIndex = 0;
    this.floorTitle = '';
    this.floorSubTitle = '';

    new MutationObserverController(this, {childList: true, subtree: false});
  }

  willUpdate(props){
    if (props.has('floors') && this.floors.length ){
      this._onSlottedEleReady('floor');
    }
    if ( props.has('isReady') && this.isReady) {
      const requestedFloor = this.getFloorFromUrlParam();
      if ( requestedFloor ) {
        this._onFloorSelect(requestedFloor);
      }
    }
  }

  getFloorFromUrlParam(){
    const urlParams = new URLSearchParams(window.location.search);
    let floorParam = urlParams.get('floor');
    if ( !floorParam ) return;
    floorParam = floorParam.toLowerCase();
    const floor = this.floors.find(f => f.navText.toLowerCase() === floorParam);
    if ( !floor ) return;
    return floor;
  }

  updateActiveFloorLayers(layers){
    const floor = this.floors[this.selectedFloorIndex];
    if ( !floor ) return;
    if ( !floor.ele ) return;
    floor.ele.showLayers(layers);
  }

  _onChildListMutation(){
    const spaces = this.querySelector('ucdlib-map-space-legend');
    if ( spaces && !this.spacesEle ) {
      spaces.setAttribute('slot', 'spaces');
      this.spacesEle = spaces;
      let spacesProps = spaces.querySelector('script[type="application/json"]');
      if ( spacesProps ) {
        spacesProps = JSON.parse(spacesProps.text);
        if ( !Array.isArray(spacesProps.spaces) || !spacesProps.spaces.length ){
          this.hideSpacesSlot = true;
        }
      } else {
        this.hideSpacesSlot = true;
      }
    }

    const legend = this.querySelector('ucdlib-map-legend');
    if ( legend && !this.legendEle ) {
      legend.setAttribute('slot', 'legend');
      this.legendEle = legend;
      let legendProps = legend.querySelector('script[type="application/json"]');
      if ( legendProps ) {
        legendProps = JSON.parse(legendProps.text);
        if ( !Array.isArray(legendProps.items) || !legendProps.items.length ){
          this.hideLegendSlot = true;
        }
      } else {
        this.hideLegendSlot = true;
      }
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
        d.title = floorProps.title || '';
        d.subTitle = floorProps.subTitle || '';

        if ( floorProps.layers ){
          d.layers = floorProps.layers;
        } else {
          d.layers = [];
        }

        if ( floorProps.showOnLoad ) this.selectedFloorIndex = i;
      }
      floors.push(d);
    });
    this.floors = floors;
  }

  _onFloorSelect(floor, args={}){
    if ( !this.isReady ) return;
    this.selectedFloorIndex = floor.propIndex
    this.floorTitle = floor.title;
    this.floorSubTitle = floor.subTitle;

    this.spacesEle.enableSwitches(floor.layers.map(l => l.slug));

    // tell floor what layers to show
    const slugs = Object.keys(this.spacesEle.toggleState)
      .map(k => this.spacesEle.toggleState[k] ? k : null)
      .filter(k => k)
    this.updateActiveFloorLayers(slugs);

    if ( !args.noUrlUpdate ) {
      this.updateFloorUrlParam(floor);
    }
  }

  updateFloorUrlParam(floor){
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('floor', floor.navText.toUpperCase());
    window.history.replaceState({}, null, `${window.location.pathname}?${urlParams.toString()}`);
  }

  _onSpacesToggle(detail){
    if ( !this.isReady ) return;
    const slugs = Object.keys(detail.spaces)
    .map(k => detail.spaces[k] ? k : null)
    .filter(k => k)
    this.updateActiveFloorLayers(slugs);
  }

  _onSlottedEleReady(eleSlug){
    if ( eleSlug === 'spaces-legend' ){
      this.spacesEleLoaded = true;
    }
    if ( eleSlug === 'floor' ){
      this.floorElesLoaded = true;
    }
    if ( this.spacesEleLoaded && this.floorElesLoaded ) {
      this.isReady = true;
      this._onFloorSelect(this.floors[this.selectedFloorIndex], {noUrlUpdate: true});
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
