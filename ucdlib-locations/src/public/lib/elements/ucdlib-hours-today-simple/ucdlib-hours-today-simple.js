import { LitElement } from 'lit';
import * as Templates from "./ucdlib-hours-today-simple.tpl.js";
import { LocationsController } from '../../utils/locations-controller.js';

/**
 * @class UcdlibHoursTodaySimple
 * @classdesc Displays a UCD Library's hours for today in a simple display
 * @property {Number} location - The wordpress post id of the location to be displayed. Required.
 * @property {Boolean} hideAppointmentLink - Will not display link to appointment page, if applicable.
 * @property {String} ctlTaskMode - When to retrieve data: ['interval', 'onConnected']. Defaults to 'interval'
 * @property {Number} refreshRate - How often to refresh data if ctlTaskMode=='interval'
 * @property {String} apiHost - API host to retrieve data from. Default loaded from controller.
 * @property {String} apiEndpoint - API endpoint to retrieve data from. Default loaded from controller.
 */
export default class UcdlibHoursTodaySimple extends LitElement {

  static get properties() {
    return {
      location: {type: Number},
      hideAppointmentLink: {type: Boolean, attribute: 'hide-appointment-link'},
      ctlTaskMode: {type: String, attribute: 'ctl-task-mode'},
      refreshRate: {type: Number, attribute: 'refresh-rate'},
      apiHost: {type: String, attribute: 'api-host'},
      apiEndpoint: {type: String, attribute: 'api-endpoint'}
    }
  }

  static get styles() {
    return Templates.styles();
  }

  willUpdate(props){

    if ( this.ctl && this.ctl.data ) {
      ['location'].map(v => {
        if ( props.has(v) ) this.ctl.fetchTask.run();
      })
    }
  }

  constructor() {
    super();
    this.render = Templates.render.bind(this);
    this.renderComplete = Templates.renderComplete.bind(this);
    this.showChildren = false;
    this.useLocationId = true;
    this.getHours = 'today';
    this.loadingHeight = '65px';
    this.hideAppointmentLink = false;
    this.ctl = new LocationsController(this);
  }

}

customElements.define('ucdlib-hours-today-simple', UcdlibHoursTodaySimple);