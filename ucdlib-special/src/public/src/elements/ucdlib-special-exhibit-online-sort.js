import { LitElement } from 'lit';
import {render, styles} from "./ucdlib-special-exhibit-online-sort.tpl.js";

export default class UcdlibSpecialExhibitOnlineSort extends LitElement {

  static get properties() {
    return {
      keySort: {state: true},
      keyCurator: {state: true},
      sort: {state: true},
      curator: {state: true},
      urlParams: {state: true},
      url: {state: true},
      curatorOptions: {state: true}
    }
  }

  static get styles() {
    return styles();
  }

  constructor() {
    super();
    this.render = render.bind(this);
    
    this.keySort = 'orderby';
    this.defaultSort = 'title';
    this.sort = this.defaultSort;

    this.keyCurator = 'curator';
    this.defaultCurator = 0;
    this.curator = this.defaultCurator;
    this.curatorOptions = [];
  
    this.parseLocation();
    this.getFilters();
  }

  parseLocation() {
    this.url = window.location.origin + window.location.pathname;
    this.urlParams = new URLSearchParams(window.location.search);
    this.sort = this.urlParams.get(this.keySort) || this.defaultSort;
    this.curator = this.urlParams.get(this.keyCurator) || this.defaultCurator ;
  }

  onSortInput(v) {
    this.sort = v;
    this.updateUrlParams(this.defaultSort, this.keySort, v);
    this.updateLocation();
  }

  onCuratorInput(e){
    this.curator = e.target.value;
    this.updateUrlParams(this.defaultCurator, this.keyCurator, this.curator);
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

  async getFilters(){
    const request = await fetch('/wp-json/ucdlib-special/exhibit-filters');
    const data = await request.json();
    this.curatorOptions = data.curator;
  }

}

customElements.define('ucdlib-special-exhibit-online-sort', UcdlibSpecialExhibitOnlineSort);