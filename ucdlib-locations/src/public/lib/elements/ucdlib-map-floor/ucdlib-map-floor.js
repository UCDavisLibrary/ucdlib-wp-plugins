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
      topLayer: {state: true},
      bottomLayer: {state: true},
      bottomSrc: {state: true},
      bottomOpacity: {state: true},
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
    this.topLayer = '';
    this.bottomLayer = '';
    this.bottomSrc = '';
    this.bottomOpacity = 0;

    new MutationObserverController(this, {childList: true, subtree: false});
  }

  willUpdate(props) {
    if ( props.has('bottomLayer') || props.has('layers') || props.has('topLayer')) {
      if ( this.bottomLayer ){
        this.bottomSrc = this.bottomLayer;
        this.bottomOpacity = 1;
      } else if ( this.layers.length ) {
        this.bottomSrc = this.layers[0].src;
        this.bottomOpacity = 0;
      } else if (this.topLayer) {
        this.bottomSrc = this.topLayer;
        this.bottomOpacity = 0;
      }
      else {
        this.bottomSrc = '';
        this.bottomOpacity = 0;
      }
    }
  }

  _onChildListMutation(){
    const script = this.querySelector('script[type="application/json"]');
    if ( script && !this.propsSetFromScript ) {
      const data = JSON.parse(script.text);
      if ( Array.isArray(data.layers) ) {
        this.layers = data.layers.map(layer => {
          layer.visible = true;
          return layer;
        });
      };
      if ( data.title ) this.floorTitle = data.title;
      if ( data.subTitle ) this.subTitle = data.subTitle;
      if ( data.topLayer ) this.topLayer = data.topLayer;
      if ( data.bottomLayer ) this.bottomLayer = data.bottomLayer;
      if ( data.navText ) {
        this.navText = data.navText
      } else if(this.floorTitle) {
        this.navText = this.floorTitle[0];
      };

      this.propsSetFromScript = true;
      this.dispatchEvent(new CustomEvent('props-loaded', {bubbles: true, composed: true}));
    }
  }

  showLayers(slugs=[]){
    this.layers.forEach(layer => {
      layer.visible = slugs.includes(layer.slug);
    });
    this.requestUpdate();

  }

}

customElements.define('ucdlib-map-floor', UcdlibMapFloor);