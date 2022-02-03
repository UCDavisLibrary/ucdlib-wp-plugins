import {Task} from '@lit-labs/task';
import {html, css} from 'lit';
import { UcdlibLocation } from "./location-model";

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

      this._configValues = {
        host: {default: "https://library.ucdavis.edu", hostProp: 'apiHost'},
        endpoint: {default: "wp-json/ucdlib-locations/locations", hostProp: 'apiEndpoint'},
        locationId: {default: 0, hostProp: 'location'},
        getChildren: {default: false, hostProp: 'showChildren'},
        taskMode: {default: 'interval', hostProp: 'ctlTaskMode', enum: ['interval', 'onConnected', 'manual']},
        intervalLength: {default: 1000 * 60 * 15, hostProp: 'refreshRate'},
        useLocationId: {default: false, hostProp: 'useLocationId'},
        getCurrentOccupancy: {default: true, hostProp: 'getCurrentOccupancy'},
        getHours: {default: true, hostProp: 'getHours'}
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
          min-width: .75rem;
          min-height: .75rem;
          width: .75rem;
          height: .75rem;
          margin-right: 0.5rem;
          color: #73abdd;
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
      this.host.requestUpdate();
      return out;
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
        if ( this.getConfigValue('getChildren') ) params.children = true;
      }

  
      if ( this.getConfigValue('getCurrentOccupancy') ) fields.push('occupancy-now');
      const hours = this.getConfigValue('getHours');
      if ( hours == 'today' ) {
        fields.push('hours-today');
      } else if( hours ) {
        fields.push('hours');
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
      const defaultTemplates = {};
      defaultTemplates['initial'] = html`
        <p>Initial state</p>
      `;
      defaultTemplates['pending'] = html`
        <p>Pending state</p>
      `;
      defaultTemplates['error'] = html`
      <p>Error state</p>
      `;

      const out = defaultTemplates[status];
      if ( !out ) {
        console.warn(`'${status} is not a recognized Lit Task status`);
        return defaultTemplates['error'];
      }
      return out;
    }

  }