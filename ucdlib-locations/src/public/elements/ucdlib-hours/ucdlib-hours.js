import { LitElement } from 'lit';
import {render, styles, renderComplete} from "./ucdlib-hours.tpl.js";
import { LocationsController } from '../../utils/locations-controller.js';

/**
 * @class UcdlibHours
 * @classdesc Displays all UC Davis Library location hours
 * @property {String} ctlTaskMode - When to retrieve data: ['interval', 'onConnected']. Defaults to 'interval'
 * @property {Number} refreshRate - How often to refresh data if ctlTaskMode=='interval'
 * @property {String} apiHost - API host to retrieve data from. Default loaded from controller.
 * @property {String} apiEndpoint - API endpoint to retrieve data from. Default loaded from controller.
 */
export default class UcdlibHours extends LitElement {

  static get properties() {
    return {
      ctlTaskMode: {type: String, attribute: 'ctl-task-mode'},
      refreshRate: {type: Number, attribute: 'refresh-rate'},
      apiHost: {type: String, attribute: 'api-host'},
      apiEndpoint: {type: String, attribute: 'api-endpoint'},
      ariaLabel: {type: String, attribute: 'aria-label', reflect: true}
    }
  }

  static get styles() {
    return styles();
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.renderComplete = renderComplete.bind(this);

    // set up controller w/ its config props
    this.showChildren = true;
    this.nestChildren = true;
    this.createHoursDateRange = true;
    this.ctl = new LocationsController(this);

    // non-controller properties
    this.ariaLabel = "Operating Hours for UC Davis Library Locations";
    
  }

}

customElements.define('ucdlib-hours', UcdlibHours);