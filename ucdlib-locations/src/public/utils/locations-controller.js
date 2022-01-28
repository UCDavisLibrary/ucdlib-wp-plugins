import {Task} from '@lit-labs/task';
import {html} from 'lit';

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
        intervalLength: {default: 1000 * 60 * 5, hostProp: 'refreshRate'},
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

    async _getData(){
      const url = this.makeAPIUrl();
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Non 200 response');
      }  
      const result = await response.json();
      this._data = result;
      this.host.requestUpdate();
      return result;
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

    locationHasHours(location){
      if ( !location ) return false;
      for (const field of ['hoursToday', 'hours']) {
        if ( location[field] && location[field]['data'] ) return true;
      }
      return false;
    }

    getDaysHours(day){
      const out = {
        status: day.status
      }
      if (day.hours && Array.isArray(day.hours) ) {
        out['hours'] = day.hours[0];
      }
      return out;
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

    renderRedText(text){
      return html`<span class="double-decker">${text}</span>`;
    }
  }