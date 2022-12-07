import {Task} from '@lit-labs/task';
import {html, css, svg} from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { UcdlibLocation } from "./location-model";
import { DateTimeUtils } from './datetime';

import linkStyles from '@ucd-lib/theme-sass/1_base_html/_links.css';
import iconStyles from "@ucd-lib/theme-sass/4_component/_icons.css.js";
import headingsStyles from "@ucd-lib/theme-sass/1_base_html/_headings.css";
import headingClasses from "@ucd-lib/theme-sass/2_base_class/_headings.css";
import brandClasses from "@ucd-lib/theme-sass/4_component/_category-brand.css";
import spaceClasses from "@ucd-lib/theme-sass/6_utility/_u-space.css";


/**
 * @classdesc Controller for fetching location data from ucdlib wordpress API
 */
export class LocationsController{

    /**
     * @method constructor
     * @description Called on instantiation
     * @param {LitElement} host - Element
     */
    constructor(host){
      (this.host = host).addController(this);

      this.fetchTask = new Task(this.host, {task: async() => await this._getData(), autoRun: false});
      this.successfulInitialFetch = false;

      this._configValues = {
        host: {default: "https://library.ucdavis.edu", hostProp: 'apiHost'},
        endpoint: {default: "wp-json/ucdlib-locations/locations", hostProp: 'apiEndpoint'},
        hoursEndpoint: {default: "wp-json/ucdlib-locations/hours", hostProp: 'apiHoursEndpoint'},
        locationId: {default: 0, hostProp: 'location'},
        getChildren: {default: false, hostProp: 'showChildren'},
        nestChildren: {default: false, hostProp: 'nestChildren'},
        taskMode: {default: 'interval', hostProp: 'ctlTaskMode', enum: ['interval', 'onConnected', 'manual']},
        intervalLength: {default: 1000 * 60 * 15, hostProp: 'refreshRate'},
        useLocationId: {default: false, hostProp: 'useLocationId'},
        createHoursDateRange: {default: false, hostProp: 'createHoursDateRange'},
        getCurrentOccupancy: {default: true, hostProp: 'getCurrentOccupancy'},
        getHours: {default: true, hostProp: 'getHours'},
        loadingHeight: {default: '100px', hostProp: 'loadingHeight'},
        loadingIconSize: {default: '30px', hostProp: 'loadingIconSize'},
        errorHeight: {default: '100px', hostProp: 'errorHeight'},
        errorIconSize: {default: '30px', hostProp: 'errorIconSize'},
        errorText: {default: "An error has occurred. Try again later.", hostProp: 'errorText'}
      }
    }

    hostConnected(){
      
      const taskMode = this.getConfigValue('taskMode');
      if ( taskMode === 'onConnected' ){
        this.fetchTask.run();
      } else if (taskMode === 'interval'){
        this.fetchTask.run();
        this._interval = setInterval(() => this.fetchTask.run(), this.getConfigValue('intervalLength'));
      }
    }

    /**
     * @method getConfigValue
     * @description Returns a config value from the host or a default value defined here
     * @param {String} key - key of the config value
     * @returns the value
     */
    getConfigValue(key){
      if (!key) {
        console.warn("1 argument is required for 'getConfigValue' method.")
        return;
      }
      const value = this._configValues[key];
      if ( !value ) {
        console.warn(`${key} is not a recognized config parameter.`);
        return;
      }

      const hostValue = this.host[value.hostProp];
      return hostValue == null || hostValue === "" ? value.default : this.host[value.hostProp];
    }

    static get styles() {

      const customStyles = css`
        .appt-link {
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
        }
        .appt-link svg {
          display: inline-block;
          min-width: 1rem;
          min-height: .75rem;
          width: 1rem;
          height: .75rem;
          margin-right: 0.55rem;
          color: #73abdd;
        }
        a.icon--circle-arrow-right::before {
          color: var(--category-brand, #73abdd);
        }
        .center-content {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .loading-icon {
          -ms-animation: rotating 2s linear infinite;
          animation: rotating 2s linear infinite;
          height: 1em;
          width: 1em;
          min-height: 1em;
          min-width: 1em;
          line-height: 0;
        }
        .error-icon {
          height: 1em;
          width: 1em;
          min-height: 1em;
          min-width: 1em;
          line-height: 0;
          margin-right: 10px;
        }
        @keyframes rotating {
          from {
            -ms-transform: rotate(0deg);
            transform: rotate(0deg);
          }
          to {
            -ms-transform: rotate(360deg);
            transform: rotate(360deg);
          }
        }
        .global-alert {
          display: flex;
          align-items: center;
          font-weight: var(--font-weight--bold, 700);
        }
        .global-alert .exclamation-icon {
          width: 20px;
          height: 20px;
          min-width: 20px;
          min-height: 20px;
          margin-right: var(--spacer--small, .5rem);
        }
      `;

      return [
        linkStyles,
        iconStyles,
        headingsStyles,
        headingClasses,
        brandClasses,
        spaceClasses,
        customStyles
      ];
    }

    async _getData(){
      const url = this.makeAPIUrl();
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Non 200 response');
      }  
      const result = await response.json();
      this._data = result;
      let out;
      if ( Array.isArray( result ) ){
        out = result.map(loc => new UcdlibLocation(loc) )
      } else {
        out = new UcdlibLocation(result);
      }
      this._data = result;
      this.data = out;
      if ( this.getConfigValue('createHoursDateRange') ){
        this._setHoursDateRange();
      }
      this.successfulInitialFetch = true;
      this.host.requestUpdate();
      return out;
    }

    /**
     * @method getAdditionalHours
     * @description Fetches and saves hours data for specified week
     * @param {Number} weekIndex 
     * @returns {Boolean} true if successful
     */
    async getAdditionalHours(weekIndex){
      this.fetchTask.status = 1;
      this.host.requestUpdate();
      await this.host.updateComplete;

      const host = this.getConfigValue('host');
      const endpoint = this.getConfigValue('hoursEndpoint');
      const week = this.hoursDateRange.weeks[weekIndex];
      if ( !week || !week.length ){
        console.error(`Week '${weekIndex}' is undefined or empty`);
        this.fetchTask.status = 3;
        this.host.requestUpdate();
        await this.host.updateComplete;
        return false;
      }
      const from = week[0].isoKey;
      const to = week[week.length - 1].isoKey;
      const url = `${host}/${endpoint}?from=${from}&to=${to}`;
      try {
        const response = await fetch(url);
        const results = await response.json();
        if (!response.ok) {
          throw new Error('Non 200 response');
        } 
        for (const location of results) {
          this.addHours(location);
        }
        this.fetchTask.status = 2;
      } catch (error) {
        console.error(error);
        this.fetchTask.status = 3;
      }
      this.host.requestUpdate();
      await this.host.updateComplete;
      this.hoursDateRange.weeksFetched.push(weekIndex);
      return true;
    }

    /**
     * @method addHours
     * @description Adds additional hours to a location
     * @param {Object} newHours 
     * @returns 
     */
    addHours(newHours){
      if ( 
        !newHours.id || 
        !newHours.data || 
        typeof newHours.data !== 'object' ||
        Array.isArray(newHours.data)
        ) {
        return;
      }
      for (const location of this.data ) {
        if ( location.id == newHours.id ){
          location.addHours(newHours.data, newHours.tzOffset);
          return;
        }
        for (const child of location.children) {
          if ( child.id == newHours.id ){
            child.addHours(newHours.data, newHours.tzOffset);
            return;
          }
        }
      }
      
    }

    stopInterval(){
      if ( this._interval ) clearInterval(this._interval);
    }

    makeAPIUrl(){
      let host = this.getConfigValue('host');
      let endpoint = this.getConfigValue('endpoint');
      let url = `${host}/${endpoint}`;
      let params = {};
      let fields = [];

      let locationId = this.getConfigValue('useLocationId') ? this.getConfigValue('locationId') : 0;
      if ( locationId ) {
        url += `/${locationId}`;
        if ( this.getConfigValue('getChildren') || this.host.onlyShowChildren ) params.children = true;
      }

  
      if ( this.getConfigValue('getCurrentOccupancy') ) fields.push('occupancy-now');
      const hours = this.getConfigValue('getHours');
      if ( hours == 'today' ) {
        fields.push('hours-today');
      } else if( hours ) {
        fields.push('hours');
        if ( this.getConfigValue('nestChildren') ) params.format = 'nested';
      }
      if ( fields.length ) params.fields = fields.join(",");
      
      if ( Object.keys(params).length ){
        params = new URLSearchParams(params);
        url += `?${params.toString()}`
      }

      return url;
    }

    render(renderFunctions) {
      return this.fetchTask.render(renderFunctions);
    }

    renderStatus(status){
      if ( status === 'pending') {
        const containerStyles = {};
        const iconStyles = {};
        containerStyles.height = this.getConfigValue('loadingHeight');
        containerStyles.minHeight = this.getConfigValue('loadingHeight');
        iconStyles.fontSize = this.getConfigValue('loadingIconSize');
        return html`
          <div class="loading center-content" style=${styleMap(containerStyles)}>
            <div class="loading-icon secondary" style=${styleMap(iconStyles)}>
              ${svg`
              <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z"></path></svg>
              `}
            </div>
          </div>
        `;

      } else if ( status === 'initial') {
        return html`
          <p>initial state</p>
        `
      } else if ( status === 'error') {
        const containerStyles = {};
        const iconStyles = {};
        containerStyles.height = this.getConfigValue('errorHeight');
        containerStyles.minHeight = this.getConfigValue('errorHeight');
        iconStyles.fontSize = this.getConfigValue('errorIconSize');
        const text = this.getConfigValue('errorText');
        return html`
          <div class="error center-content" style=${styleMap(containerStyles)}>
            <div class="center-content">
              <div class="error-icon double-decker" style=${styleMap(iconStyles)}>
                ${svg`
                <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path></svg>
                `}
              </div>
              <div>${text}</div>
            </div>
          </div>
        `
      } else {
        console.warn(`'${status} is not a recognized Lit Task status`);
        return html``;
      }
    }

    /**
     * @method getWeekDayString
     * @description Get formatted string of a day in a week
     * @param {Array} week a week array (from this.hoursDateRange.weeks)
     * @param {Number} index the day index within the week
     * @returns 
     */
    getWeekDayString(week, index){
      if ( !week || !week[index] ) return '';
      return `${week[index].month} ${week[index].dayOfMonth}`;
    }

    /**
     * @method _setHoursDateRange
     * @description Sets date range for which we have hours data
     */
    _setHoursDateRange(){
      const range = {
        from: false, 
        to: false, 
        weeks: [], 
        months: [],
        weeksFetched: []};
      let dataFetchedThrough = false;
      const ranges = [];
      const locations = Array.isArray(this.data) ? this.data : [this.data];
      let monthsToDisplay = 4;
      for (const location of locations) {
        monthsToDisplay = location.monthsToDisplay;
        ranges.push(location.hoursDateRange);

        for (const child of location.children ) {
          ranges.push(child.hoursDateRange);
        }
      }
      for (const r of ranges){
        if ( r.from ) {
          if ( ! range.from ) {
            range.from = r.from
          } else if (r.from < range.from ) {
            range.from = r.from;
          }
        }
        if ( r.to ) {
          if ( ! dataFetchedThrough ) {
            dataFetchedThrough = r.to
          } else if (r.to > dataFetchedThrough ) {
            dataFetchedThrough = r.to;
          }
        }
      }

      if ( !range.from ){
        throw new Error('Unable to construct hours date range');
      }

      // set last day of date range based on number of months to display
      let toMonth = range.from.getUTCMonth() + monthsToDisplay - 1;
      let toYear = range.from.getUTCFullYear();
      if ( toMonth >= 12 ) {
        toYear += 1;
        toMonth -= 12;
      }
      let toDate = new Date(toYear, toMonth + 1, 0);
      const dayOfWeek = toDate.getUTCDay()
      if ( dayOfWeek != 6 ) {
        toDate = new Date(toYear, toMonth + 1, 6 - dayOfWeek);
      }
      range.to = toDate;

      let d = new Date(range.from.getTime());
      let weekIndex = 0;
      range.weeksFetched.push(weekIndex);
      range.weeks.push([]);
      while ( d <= range.to ) {
        if ( range.weeks[weekIndex].length >= 7 ){
          weekIndex += 1;
          range.weeks.push([]);
          if ( d < dataFetchedThrough ){
            range.weeksFetched.push(weekIndex);
          }
        }
        if ( 
          !range.months.length ||
          range.months[range.months.length - 1].UTCMonth != d.getUTCMonth()) {
          range.months.push({
            UTCMonth: d.getUTCMonth(), 
            label: DateTimeUtils.labels().months[d.getUTCMonth()],
            weekIndex: weekIndex
          });
        }
        range.weeks[weekIndex].push({
          date: new Date(d.getTime()),
          isoKey: d.toISOString().split('T')[0],
          day: DateTimeUtils.labels().days[d.getUTCDay()],
          month: DateTimeUtils.labels().months[d.getUTCMonth()],
          dayOfMonth: d.getUTCDate(),
          year: d.getUTCFullYear()
        })
        d.setDate(d.getDate() + 1);
      }

      if ( range.months.length > monthsToDisplay ){
        range.months.pop();
      }

      this.hoursDateRange = range;
    }

  }