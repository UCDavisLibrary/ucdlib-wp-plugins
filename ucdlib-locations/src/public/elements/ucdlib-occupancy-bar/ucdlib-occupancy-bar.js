import { LitElement } from 'lit';
import {render, styles} from "./ucdlib-occupancy-bar.tpl.js";

export default class UcdlibOccupancyBar extends LitElement {

  static get properties() {
    return {
      current: {type: Number},
      max: {type: Number},
      level: {type: Number},
      hideText: {type: String, attribute: "hide-text"}
    }
  }

  static get styles() {
    return styles();
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.hideText = false;
    this.level = 0;
  }

  willUpdate(props){
    if ( props.has('current') || props.has('max') ){
      console.log('hello');
      if ( isNaN(props.current) || isNaN(props.max) ) {
        this.level = 0;
      }
    }
  }

}

customElements.define('ucdlib-occupancy-bar', UcdlibOccupancyBar);