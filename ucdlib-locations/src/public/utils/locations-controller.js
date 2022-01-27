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
        endpoint: {default: "wp-json/ucdlib-locations/locations", hostProp: 'apiEndpoint'},
        getChildren: {default: false, hostProp: 'showChildren'}
      }
    }

    hostConnected(){
      console.log( this.makeAPIUrl() );
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