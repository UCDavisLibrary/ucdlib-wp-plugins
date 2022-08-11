import { LitElement } from 'lit';
import {render, styles, renderComplete} from "./ucdlib-hours-today.tpl.js";
import { LocationsController } from '../../utils/locations-controller.js';

/**
 * @class UcdlibHoursToday
 * @classdesc Displays a UCD Library's hours for today
 * @property {Number} location - The wordpress post id of the location to be displayed. Required.
 * @property {String} widgetTitle - Defaults to "Today's Hours"
 * @property {Boolean} showChildren - Will display child departments/services, if they exist.
 * @property {Boolean} onlyShowChildren - If showChildren is true, will hide the parent location's hours
 * @property {String} childFilter - Only shows selected children. Takes comma-separated list of location ids.
 * @property {String} seeMoreText - Defaults to "See all library hours"
 * @property {Boolean} hideSeeMore - Hide see more link at bottom of widget
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
      hideTitle: {type: Boolean, attribute: 'hide-title'},
      showChildren: {type: Boolean, attribute: 'show-children'},
      onlyShowChildren: {type: Boolean, attribute: 'only-show-children'},
      childFilter: {type: String, attribute: 'child-filter'},
      seeMoreText: {type: String, attribute: 'see-more-text'},
      hideSeeMore: {type: Boolean, attribute: 'hide-see-more'},
      _childFilter: {state: true},
      hideCurrentOccupancy: {type: Boolean, attribute: 'hide-current-occupancy'},
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

  willUpdate(props){
    this.getCurrentOccupancy = !this.hideCurrentOccupancy;
    if ( !this.showChildren ) {
      this.loadingHeight = "130px";
    } else {
      this.loadingHeight = "300px";
    }

    if ( this.ctl && this.ctl.data ) {
      ['showChildren', 'location'].map(v => {
        if ( props.has(v) ) this.ctl.fetchTask.run();
      })
    }

    if ( props.has('childFilter') ){
      this._childFilter = this.childFilter.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
    }
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.renderComplete = renderComplete.bind(this);
    this.widgetTitle = "Today's Hours";
    this.hideTitle = false;
    this.showChildren = false;
    this.onlyShowChildren = false;
    this.useLocationId = true;
    this.childFilter = '';
    this._childFilter = [];
    this.seeMoreText = 'See all library hours';
    this.hideSeeMore = false;
    this.getHours = 'today';
    this.role = "complementary";
    this.ctl = new LocationsController(this);

  }

}

customElements.define('ucdlib-hours-today', UcdlibHoursToday);