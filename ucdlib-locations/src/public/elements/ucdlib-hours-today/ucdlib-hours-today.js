import { LitElement } from 'lit';
import {render, styles} from "./ucdlib-hours-today.tpl.js";
import { LocationsController } from '../../utils/locations-controller.js';

/**
 * @class UcdlibHoursToday
 * @classdesc Displays a UCD Library's hours for today\
 * @property {Number} location - The wordpress post id of the location to be displayed. Required.
 * @property {String} widgetTitle - Defaults to "Today's Hours"
 * @property {Boolean} showChildren - Will display child departments/services, if they exist.
 * @property {Boolean} onlyShowChildren - If showChildren is true, will hide the parent location's hours
 * @property {String} ctlTaskMode - When to retrieve data: ['interval', 'onConnected']. Defaults to 'interval'
 * @property {Number} refreshRate - How often to refresh data if ctlTaskMode=='interval'
 * @property {String} apiHost - API host to retrieve data from. Default loaded from controller.
 * @property {String} apiEndpoint - API endpoint to retrieve data from. Default loaded from controller.
 */
export default class UcdlibHoursToday extends LitElement {

  static get properties() {
    return {
      location: {type: Number},
      widgetTitle: {type: String, attribute: 'widget-title'},
      showChildren: {type: Boolean, attribute: 'show-children'},
      onlyShowChildren: {type: Boolean, attribute: 'only-show-children'},
      ctlTaskMode: {type: String, attribute: 'ctl-task-mode'},
      refreshRate: {type: Number, attribute: 'refresh-rate'},
      apiHost: {type: String, attribute: 'api-host'},
      apiEndpoint: {type: String, attribute: 'api-endpoint'},
      role: {type: String, reflect: true}
    }
  }

  static get styles() {
    return styles();
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.widgetTitle = "Today's Hours";
    this.showChildren = false;
    this.onlyShowChildren = false;
    this.useLocationId = true;
    this.getHours = 'today';
    this.role = "complementary";
    this.ctl = new LocationsController(this);

  }

  _processData(apiResult){
    const location = {
      hasHours: this.ctl.locationHasHours(apiResult),
    };
    if ( location.hasHours ) {
      location.hours = this.ctl.getDaysHours(apiResult.hoursToday.data);
    }
    return location;
  }

}

customElements.define('ucdlib-hours-today', UcdlibHoursToday);