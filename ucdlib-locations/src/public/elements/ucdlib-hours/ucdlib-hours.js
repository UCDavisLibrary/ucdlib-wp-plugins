import { LitElement, html } from 'lit';
import * as Templates from "./ucdlib-hours.tpl";
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
      ariaLabel: {type: String, attribute: 'aria-label', reflect: true},
      _activeWeekPanel: {type: Number, state: true},
      _visibleServices: {type: Object, state: true}
    }
  }

  static get styles() {
    return Templates.styles();
  }

  constructor() {
    super();

    // bind render functions
    this.render = Templates.render.bind(this);
    this.renderComplete = Templates.renderComplete.bind(this);
    this._renderWeekPaginator = Templates._renderWeekPaginator.bind(this);
    this._renderWeekLabel = Templates._renderWeekLabel.bind(this);
    this._renderWeeklyHours = Templates._renderWeeklyHours.bind(this);
    this._renderChild = Templates._renderChild.bind(this);

    // set up controller w/ its config props
    this.showChildren = true;
    this.nestChildren = true;
    this.createHoursDateRange = true;
    this.ctl = new LocationsController(this);

    // non-controller properties
    this.ariaLabel = "Operating Hours for UC Davis Library Locations";
    this._activeWeekPanel = 0;
    this._visibleServices = {};
    
  }

  getActiveWeek(){
    return this.ctl.hoursDateRange.weeks[this._activeWeekPanel];
  }

  toggleServiceVisibility(locationId) {
    this._visibleServices[locationId] = !this._visibleServices[locationId];
    this.requestUpdate();
  }

  /**
   * @method _getAnimationClasses
   * @description Get classes to enable slide-in paging animation
   * @param {Number} i - Current index of page
   * @param {String} section - Where in element will classes be placed? Determines if any additional classes are needed
   * @returns {Object}
   */
  _getAnimationClasses(i, section){ 
    const classes = {}
    if ( section == 'label' ) {
      classes['week-label'] = true;
      classes['heading--highlight'] = true;
    } else if ( section == 'data') {
      classes['week-ctl'] = true;
    } 
    if ( i < this._activeWeekPanel ) {
      classes['inactive'] = true;
      classes['before'] = true;
    } else if ( i == this._activeWeekPanel ) {
      classes['active'] = true;
    } else {
      classes['inactive'] = true;
      classes['after'] = true;
    }

    return classes;
  }

  _onForwardClick(){
    if ( this._activeWeekPanel + 1 == this.ctl.hoursDateRange.weeks.length ) return;
    this._activeWeekPanel += 1;
  }

  _onBackwardClick(){
    if ( !this._activeWeekPanel ) return;
    this._activeWeekPanel -= 1;
  }

}

customElements.define('ucdlib-hours', UcdlibHours);