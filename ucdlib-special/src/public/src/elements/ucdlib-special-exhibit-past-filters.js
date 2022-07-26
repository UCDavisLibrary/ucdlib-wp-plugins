import { LitElement } from 'lit';
import {render, styles} from "./ucdlib-special-exhibit-past-filters.tpl.js";

export default class UcdlibSpecialExhibitPastFilters extends LitElement {

  static get properties() {
    return {
      keyCurator: {state: true},
      keyYear: {state: true},
      year: {state: true},
      curator: {state: true},
      urlParams: {state: true},
      url: {state: true},
      curatorOptions: {state: true},
      yearOptions: {state: true}
    }
  }

  static get styles() {
    return styles();
  }

  constructor() {
    super();
    this.render = render.bind(this);

    this.keyCurator = 'curator';
    this.defaultCurator = 0;
    this.curator = this.defaultCurator;
    this.curatorOptions = [];

    this.keyYear = 'exhibit_start';
    this.defaultYear = 0;
    this.year = this.defaultYear;
    this.yearOptions = [];
  
    this.parseLocation();
    this.getFilters();
  }

  parseLocation() {
    this.url = window.location.origin + window.location.pathname.replace(/page\/([0-9])*/, '');
    this.urlParams = new URLSearchParams(window.location.search);
    this.curator = this.urlParams.get(this.keyCurator) || this.defaultCurator ;
    this.year = this.urlParams.get(this.keyYear) || this.defaultYear ;
  }

  onCuratorInput(e){
    this.curator = e.target.value;
    this.updateUrlParams(this.defaultCurator, this.keyCurator, this.curator);
    this.updateLocation();
  }

  onYearInput(e){
    this.year = e.target.value;
    this.updateUrlParams(this.defaultYear, this.keyYear, this.year);
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
    this.yearOptions = data.exhibit_start;
  }

}

customElements.define('ucdlib-special-exhibit-past-filters', UcdlibSpecialExhibitPastFilters);