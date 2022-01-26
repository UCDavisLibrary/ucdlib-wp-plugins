import { LitElement } from 'lit';
import {render, styles} from "./ucdlib-hours-today.tpl.js";
import { LocationsController } from '../../utils/locations-controller.js';

export default class UcdlibHoursToday extends LitElement {

  static get properties() {
    return {
      apiHost: {type: String, attribute: 'api-host'}
    }
  }

  static get styles() {
    return styles();
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.apiHost = "";
    this.LocationsController = new LocationsController(this);

  }

}

customElements.define('ucdlib-hours-today', UcdlibHoursToday);