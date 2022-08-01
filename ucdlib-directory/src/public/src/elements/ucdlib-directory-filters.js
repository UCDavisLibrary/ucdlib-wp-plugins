import { LitElement } from 'lit';
import { MobileVisibilityController } from '../controllers/mobile-visibility.js';
import {render, styles} from "./ucdlib-directory-filters.tpl.js";

export default class UcdlibDirectoryFilters extends LitElement {

  static get properties() {
    return {
      widgetTitle: {type: String, attribute: 'widget-title'},
      keyKeyword: {type: String},
      keyOrderby: {type: String},
      keyLibrary: {type: String},
      keyDepartment: {type: String},
      keyDirectoryTag: {type: String},
      url: {state: true},
      keyword: {state: true},
      orderby: {state: true},
      library: {state: true},
      filterOptions: {state: true},
    }
  }

  static get styles() {
    return styles();
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.mobileVisibility = new MobileVisibilityController(this, 'UCDLibDirectoryFilters');

    this.widgetTitle = 'Directory Filters';

    // default url param keys
    this.keyKeyword = 'q';
    this.keyOrderby = 'orderby';
    this.keyLibrary = 'library';
    this.keyDepartment = 'department';
    this.keyDirectoryTag = 'directory-tag';

    // input state
    this.keyword = '';
    this.orderby = '';
    this.library = [];
    this.department = [];
    this.directoryTag = [];

    this.filterOptions = {
      library: [],
      department: [],
      'directory-tag': {
        subjectArea : [],
        tag: []
      }
    };
    this.filterError = true;
  }

  willUpdate(props){
    let urlArgs = ['keyKeyword', 'keyOrderby', 'keyLibrary', 'keyDepartment', 'keyDirectoryTag'];
    urlArgs = urlArgs.map(a => props.has(a) && this[a]).filter(v => v);
    if ( urlArgs.length ) this.parseLocation();
  }

  connectedCallback() {
    super.connectedCallback();
     this.getFilters();
  }

  parseLocation() {
    this.url = window.location.origin + window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    this.keyword = params.get(this.keyKeyword) || '' ;
    this.orderby = params.get(this.keyOrderby) || '' ;

    if (  params.get(this.keyLibrary) ) {
      this.library = params.get(this.keyLibrary).split(',').map(id => parseInt(id));
    } else {
      this.library = [];
    }

    if (  params.get(this.keyDepartment) ) {
      this.department = params.get(this.keyDepartment).split(',').map(id => parseInt(id));
    } else {
      this.department = [];
    }

    if (  params.get(this.keyDirectoryTag) ) {
      this.directoryTag = params.get(this.keyDirectoryTag).split(',').map(id => parseInt(id));
    } else {
      this.directoryTag = [];
    }
  }

  onSlimSelectChange(e, prop) {
    const values = e.detail;
    this[prop] = values.map(v => parseInt(v.value));
  }

  async getFilters(){
    try {
      const request = await fetch('/wp-json/ucdlib-directory/filters');
      const data = await request.json();
      this.filterError = false;
      this.filterOptions = data;
    } catch (error) {
      this.filterError = true;
      this.library = [];
      this.department = [];
      this.directoryTag = [];
      console.error(error);
    }
    
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
    if ( this.orderby ) {
      params.set(this.keyOrderby, this.orderby);
    }
    if ( this.library.length ){
      params.set(this.keyLibrary, this.library.join(','));
    }
    if ( this.department.length ){
      params.set(this.keyDepartment, this.department.join(','));
    }

    if ( this.directoryTag.length ){
      params.set(this.keyDirectoryTag, this.directoryTag.join(','));
    }

    //console.log(this.url + '?' + params.toString());
    let queryString = params.toString();
    if ( queryString ) {
      window.location = this.url + '?' + params.toString();
    } else {
      window.location = this.url;
    }
    
  }

}

customElements.define('ucdlib-directory-filters', UcdlibDirectoryFilters);