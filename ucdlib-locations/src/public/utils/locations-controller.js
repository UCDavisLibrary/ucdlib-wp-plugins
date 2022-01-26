export class LocationsController{

    /**
     * @method constructor
     * @description Called on instantiation
     * @param {LitElement} host - Element
     */
    constructor(host){
      (this.host = host).addController(this);

      this._configValues = {
        host: {default: "https://library.ucdavis.edu", hostProp: 'apiHost'},
        endpoint: {default: "wp-json/ucdlib-locations/locations", hostProp: 'apiEndpoint'}
      }
    }

    /**
     * @method getConfigValue
     * @description Returns a config value from the host or a default value defined here
     * @param {String} key - key of the config value
     * @returns the value
     */
    getConfigValue(key){
      if (!key) return;
      const value = this._configValues[key];
      if ( !value ) return;
      return this.host[value.hostProp] ? this.host[value.hostProp] : value.default;
    }

    makeAPIUrl(locationId=false, params={}){
      let host = this.getConfigValue('host');
      let endpoint = this.getConfigValue('endpoint');
      let url = `${host}/${endpoint}`;
      if ( locationId ) url += `/${locationId}`;
      if ( Object.keys(params).length ){
        params = new URLSearchParams(params);
        url += `?${params.toString()}`
      }
      return url;
    }
  }