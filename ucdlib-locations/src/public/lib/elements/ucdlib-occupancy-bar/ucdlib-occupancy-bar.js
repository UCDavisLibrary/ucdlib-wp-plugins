import { LitElement, svg } from 'lit';
import {render, styles} from "./ucdlib-occupancy-bar.tpl.js";

/**
 * @class UcdlibOccupancyBar
 * @classdesc Renders a simple graphic denoting current occupancy on a 1-5 scale
 * @property {Number} current - The current occupancy. Used with 'max' to calculate 'level'
 * @property {Number} max - The max occupancy/capacity. Used with 'current' to calculate 'level'
 * @property {Number} level - The occupancy level. Must be int on 1-5 scale. 
 *  Attribute can be directly set, if not using 'current' and 'max' attributes
 * @property {String} hideText - Will hide the status text that displays next to the graphic.
 * 
 */
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
    this.textOptions = [
      "Currently not busy",
      "Currently a little busy",
      "Currently busy",
      "Currently very busy",
      "Currently as busy as it gets"
    ]
  }

  willUpdate(props){
    if ( props.has('current') || props.has('max') ){
      this._setOccupancyLevel();
    }

    // validate if user sets level property directly
    if ( props.has('level') && this.level ){
      if ( this.level > 5 ) {
        this.level = 5;
      } else if ( this.level < 0 ) {
        this.level = 0;
      } else {
        this.level = parseInt(this.level);
      }
    }
  }

  /**
   * @method _setOccupancyLevel
   * @description Sets occupancy level based on the current and max properties
   */
  _setOccupancyLevel(){
    let level;
    if ( isNaN(this.current) || isNaN(this.max) ) {
      level = 0;
    } else if ( this.current > this.max ){
      level = 5;
    } else {
      let cut = parseInt(this.max / 4);
      for (let l = 1; l < 6; l++) {
        if ( this.current < cut * l ) {
          level = l;
          break;
        }
      }
    }
    this.level = level;
    //console.log(this.current, this.max, this.level);
    
    return;
  }

  /**
   * @method _renderUserSvg
   * @description Renders a single avatar svg
   * @param {Boolean} inactive - Assigns inactive class, which makes svg look faded.
   * @returns {SVGTemplateResult}
   */
  _renderUserSvg(inactive){
    return svg`
    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class=${inactive ? 'inactive' : 'active'}>
      <path fill="currentcolor" d="M12,12A6,6,0,1,0,6,6,6,6,0,0,0,12,12Zm4.2,1.5h-.78a8.17,8.17,0,0,1-6.84,0H7.8a6.3,6.3,0,0,0-6.3,6.3v1.95A2.25,2.25,0,0,0,3.75,24h16.5a2.25,2.25,0,0,0,2.25-2.25V19.8A6.3,6.3,0,0,0,16.2,13.5Z"/>
    </svg>
    `;
  }

}

customElements.define('ucdlib-occupancy-bar', UcdlibOccupancyBar);