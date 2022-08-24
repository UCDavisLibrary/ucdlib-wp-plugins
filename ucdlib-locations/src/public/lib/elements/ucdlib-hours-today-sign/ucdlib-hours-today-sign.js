import { LitElement } from 'lit';
import {render, styles, renderComplete} from "./ucdlib-hours-today-sign.tpl.js";
import { LocationsController } from '../../utils/locations-controller.js';

export default class UcdlibHoursTodaySign extends LitElement {

  static get properties() {
    return {
      location: {type: Number},
      apiHost: {type: String, attribute: 'api-host'},
      refreshRate: {type: Number, attribute: 'refresh-rate'}
    }
  }

  static get styles() {
    return styles();
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.renderComplete = renderComplete.bind(this);
    this.showChildren = false;
    this.useLocationId = true;
    this.getHours = 'today';
    this.location = 0;
    this.errorText = 'Error!';
    this.loadingIconSize = '1em';
    this.errorIconSize = '1em';
    this.ctl = new LocationsController(this);
  }

}

customElements.define('ucdlib-hours-today-sign', UcdlibHoursTodaySign);