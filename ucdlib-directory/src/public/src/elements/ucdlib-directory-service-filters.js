import { LitElement } from 'lit';
import { MobileVisibilityController } from '../controllers/mobile-visibility.js';
import {render, styles} from "./ucdlib-directory-service-filters.tpl.js";

export default class UcdlibDirectoryServiceFilters extends LitElement {

  static get properties() {
    return {
      widgetTitle: {type: String, attribute: 'widget-title'},
      keyKeyword: {type: String},
      keyLibrary: {type: String},
      keyServiceType: {type: String},
      keyword: {state: true},
      library: {state: true},
      serviceType: {state: true},
      url: {state: true},
      filterOptions: {state: true}
    }
  }

  static get styles() {
    return styles();
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.mobileVisibility = new MobileVisibilityController(this, 'UCDLibDirectoryServiceFilters');

    this.widgetTitle = 'Library Service Filters';

    // default url param keys
    this.keyKeyword = 'q';
    this.keyLibrary = 'library';
    this.keyServiceType = 'service-type';

    // input state
    this.keyword = '';
    this.library = [];
    this.serviceType = [];

    this.filterOptions = {
      library: [],
      'service-type': []
    };
    this.filterError = true;
  }

  willUpdate(props){
    let urlArgs = ['keyKeyword', 'keyLibrary', 'keyServiceType'];
    urlArgs = urlArgs.map(a => props.has(a) && this[a]).filter(v => v);
    if ( urlArgs.length ) this.parseLocation();
  }

  connectedCallback() {
    super.connectedCallback();
     this.getFilters();
  }

  async getFilters(){
    try {
      const request = await fetch('/wp-json/ucdlib-directory/service-filters');
      const data = await request.json();
      this.filterError = false;
      this.filterOptions = data;
    } catch (error) {
      this.filterError = true;
      this.library = [];
      this.serviceType = [];
      console.error(error);
    }
  }

  parseLocation() {
    this.url = window.location.origin + window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    this.keyword = params.get(this.keyKeyword) || '' ;

    if (  params.get(this.keyLibrary) ) {
      this.library = params.get(this.keyLibrary).split(',').map(id => parseInt(id));
    } else {
      this.library = [];
    }

    if (  params.get(this.keyServiceType) ) {
      this.serviceType = params.get(this.keyServiceType).split(',').map(id => parseInt(id));
    } else {
      this.serviceType = [];
    }
  }

  onSlimSelectChange(e, prop) {
    const values = e.detail;
    this[prop] = values.map(v => parseInt(v.value));
  }

  _onVisibilityKeyUp(e){
    if (e.key === 'Enter' || e.keyCode === 13) {
      this.mobileVisibility.toggle();
    }
  }

  _onVisibilityClick(){
    this.mobileVisibility.toggle();
  }

  _onSubmit(e){
    e.preventDefault();
    e.stopPropagation();
    this.apply();
  }

  apply(){
    const params = new URLSearchParams();
    if ( this.keyword ) {
      params.set(this.keyKeyword, this.keyword);
    }
    if ( this.library.length ){
      params.set(this.keyLibrary, this.library.join(','));
    }
    if ( this.serviceType.length ){
      params.set(this.keyServiceType, this.serviceType.join(','));
    }

    let queryString = params.toString();
    if ( queryString ) {
      window.location = this.url + '?' + params.toString();
    } else {
      window.location = this.url;
    }
    
  }

}

customElements.define('ucdlib-directory-service-filters', UcdlibDirectoryServiceFilters);