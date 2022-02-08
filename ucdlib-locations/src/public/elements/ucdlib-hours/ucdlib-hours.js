import { LitElement, html } from 'lit';
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
      ariaLabel: {type: String, attribute: 'aria-label', reflect: true},
      _activeWeekPanel: {type: Number, state: true}
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
    this._activeWeekPanel = 0;
    
  }

  /**
   * @method _renderWeekPaginator
   * @description Renders the paginator that allows user to select a new week to display
   * @returns {TemplateResult}
   */
   _renderWeekPaginator(){
     const weeks = this.ctl.hoursDateRange.weeks;
      return html`
      <div class="paginator">
        <button 
          type="button" 
          ?disabled=${!this._activeWeekPanel}
          @click=${this._onBackwardClick}
          >&#xf002</button>
        <div class="week-label-container">
          ${weeks.map((week, i) => html`
            <div class="week-label heading--highlight ${i == this._activeWeekPanel ? 'active' : 'inactive'}">
              <span class="keep-together">${this.ctl.getWeekDayString(week, 0)}</span><span> to </span><span class="keep-together">${this.ctl.getWeekDayString(week, 6)}</span>
            </div>
          `)}
        </div>
        <button 
          type="button" 
          ?disabled=${this._activeWeekPanel + 1 == weeks.length}
          @click=${this._onForwardClick}>&#xf002</button>
      </div>
      `;
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