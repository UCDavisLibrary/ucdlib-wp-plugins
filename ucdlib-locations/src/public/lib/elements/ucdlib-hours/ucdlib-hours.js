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
      surfaceChildren: {type: String, attribute: 'surface-children'},
      ariaLabel: {type: String, attribute: 'aria-label', reflect: true},
      _activeWeekPanel: {type: Number, state: true},
      _visibleServices: {type: Object, state: true},
      _surfaceChildren: {type: Array, state: true}
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
    this._renderNavigation = Templates._renderNavigation.bind(this);
    this._renderMonthNav = Templates._renderMonthNav.bind(this);
    this._renderWeekLabel = Templates._renderWeekLabel.bind(this);
    this._renderWeeklyHours = Templates._renderWeeklyHours.bind(this);
    this._renderChild = Templates._renderChild.bind(this);

    // set up controller w/ its config props
    this.showChildren = true;
    this.nestChildren = true;
    this.createHoursDateRange = true;
    this.ctlTaskMode = 'onConnected';
    this.ctl = new LocationsController(this);

    // non-controller properties
    this.ariaLabel = "Operating Hours for UC Davis Library Locations";
    this._activeWeekPanel = 0
    this._activeMonthIndex = 0
    this._visibleServices = {};
    this.surfaceChildren = '';
    
  }

  willUpdate(props){
    if ( props.has('surfaceChildren') ) {
      this._surfaceChildren = this.surfaceChildren.split(',').map(x => parseInt(x))
    }

    // set active month when week changes
    if ( props.has('_activeWeekPanel') ){
      if ( this._activeWeekPanel == 0 ){
        this._activeMonthIndex = 0;
      } else if (this.ctl && this.ctl.successfulInitialFetch) {
        const activeWeek = this.getActiveWeek();
        let UTCMonth = 0;
        const firstOfMonth = activeWeek.filter(x => x.dayOfMonth == 1);
        if ( firstOfMonth.length ) {
          UTCMonth = firstOfMonth[0].date.getUTCMonth();
        } else if (activeWeek.length) {
          UTCMonth = activeWeek[0].date.getUTCMonth();
        }
        const months = this.ctl.hoursDateRange.months;
        for (let i = 0; i < months.length; i++) {
          if ( months[i].UTCMonth == UTCMonth ){
            this._activeMonthIndex = i;
            break;
          }
        }
      }
    }
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

  async _onForwardClick(){
    if ( this._activeWeekPanel + 1 == this.ctl.hoursDateRange.weeks.length ) return;
    const weekIndex = this._activeWeekPanel + 1;
    if ( !this.ctl.hoursDateRange.weeksFetched.includes(weekIndex) ){
      await this.ctl.getAdditionalHours(weekIndex);
    }
    this._activeWeekPanel = weekIndex;
  }

  async _onBackwardClick(){
    if ( !this._activeWeekPanel ) return;
    const weekIndex = this._activeWeekPanel - 1;
    if ( !this.ctl.hoursDateRange.weeksFetched.includes(weekIndex) ){
      await this.ctl.getAdditionalHours(weekIndex);
    }
    this._activeWeekPanel = weekIndex;
  }

  async _onMonthClick(i){
    const weekIndex = this.ctl.hoursDateRange.months[i].weekIndex;
    if ( !this.ctl.hoursDateRange.weeksFetched.includes(weekIndex) ){
      await this.ctl.getAdditionalHours(weekIndex);
    }
    this._activeWeekPanel = weekIndex;
  }

}

customElements.define('ucdlib-hours', UcdlibHours);