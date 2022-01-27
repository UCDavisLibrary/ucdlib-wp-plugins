import { LitElement } from 'lit';
import {render, styles} from "./ucdlib-hours-today.tpl.js";
import { LocationsController } from '../../utils/locations-controller.js';

/**
 * @class UcdlibHoursToday
 * @classdesc Displays a UCD Library's hours for today
 * @property {String} widgetTitle - Defaults to "Today's Hours"
 * @property {Boolean} showChildren - Will display child departments/services, if they exist.
 * @property {Boolean} onlyShowChildren - If showChildren is true, will hide the parent location's hours
 * @property {String} apiHost - API host to retrieve data from. Default loaded from controller.
 * @property {String} apiHost - API endpoint to retrieve data from. Default loaded from controller.
 */
export default class UcdlibHoursToday extends LitElement {

  static get properties() {
    return {
      widgetTitle: {type: String, attribute: 'widget-title'},
      showChildren: {type: Boolean, attribute: 'show-children'},
      onlyShowChildren: {type: Boolean, attribute: 'only-show-children'},
      apiHost: {type: String, attribute: 'api-host'},
      apiEndpoint: {type: String, attribute: 'api-endpoint'}
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
    this.ctl = new LocationsController(this);

  }

}

customElements.define('ucdlib-hours-today', UcdlibHoursToday);