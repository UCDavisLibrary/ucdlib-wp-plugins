import { LitElement } from 'lit';
import {render, styles} from "./ucdlib-collection-filter.tpl.js";

export default class UcdlibCollectionFilter extends LitElement {

  static get properties() {
    return {
        sort: {state: true},
        urlParams: {state: true}
    }
  }

  static get styles() {
    return styles();
  }

  constructor() {
    super();
    this.render = render.bind(this);
    
    this.keySort = 'collection-tax';
    this.defaultSort = '';
    this.sort = this.defaultSort;
  
    this.parseLocation();
  }

  parseLocation() {
    this.url = window.location.origin + window.location.pathname;
    this.urlParams = new URLSearchParams(window.location.search);
    this.sort = this.urlParams.get(this.keySort) || this.defaultSort;
  }

  onSortInput(v) {
    this.sort = v;
    this.updateUrlParams(this.defaultSort, this.keySort, v);
    this.updateLocation();
  }



  updateLocation(){
    let queryString = this.urlParams.toString();
    if ( queryString ) {
      window.location = this.url + '?' + this.urlParams.toString();
    } else {
      window.location = this.url;
    }
  }

  updateUrlParams(defaultValue, key, value){
    if ( value != defaultValue ){
      this.urlParams.set(key, value);
    }
    else if ( value == defaultValue && this.urlParams.get(key)) {
      this.urlParams.delete(key);
    }
  }


}

customElements.define('ucdlib-collection-filter', UcdlibCollectionFilter);