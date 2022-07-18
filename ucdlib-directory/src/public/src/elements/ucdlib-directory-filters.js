import { LitElement } from 'lit';
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
      db: {state: true},
      keyword: {state: true},
      orderby: {state: true},
      library: {state: true},
      filterOptions: {state: true},
      dbName: {type: String, attribute: 'db-name'},
      dbStoreName: {type: String, attribute: 'db-store-name'},
      dbVersion: {type: Number, attribute: 'db-version'},
      showOnMobile: {type: Boolean, state: true}
    }
  }

  static get styles() {
    return styles();
  }

  constructor() {
    super();
    this.render = render.bind(this);

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

    // for remembering visibility on mobile
    this.showOnMobile = false;
    this.dbName = 'UCDLibSearchFilters';
    this.dbStoreName = 'props';
    this.dbVersion = 1;
    this.db = false;

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
    let urlArgs = ['keyKeyword', 'keyOrderby'];
    urlArgs = urlArgs.map(a => props.has(a) && this[a]).filter(v => v);
    if ( urlArgs.length ) this.parseLocation();
  }

  connectedCallback() {
    super.connectedCallback();

     this.getFilters();

    // connect to db, set up schema if necessary
    if ( window.indexedDB ) {
      let req = window.indexedDB.open(this.dbName, this.dbVersion);

      req.onsuccess = event => {
        this._setDb(event);
        let tx = this.db.transaction([this.dbStoreName]);
        let objectStore = tx.objectStore(this.dbStoreName);
        var request = objectStore.get('showOnMobile');
        request.onsuccess = event => {
          this.showOnMobile = request.result.value;
        };
      }
      req.onerror = event => {
        console.warn("Database error: " + event.target.errorCode);
      }

      req.onupgradeneeded = event => {
        this._setDb(event);
        let objectStore = this.db.createObjectStore(this.dbStoreName, { keyPath: "name" });

        // write initial data
        objectStore.transaction.oncomplete = event => {
          let tx = this.db.transaction(this.dbStoreName, 'readwrite').objectStore(this.dbStoreName);
          const props = [
            {name: 'showOnMobile', value: this.showOnMobile}
          ];
          props.forEach(p => {
            tx.add(p);
          })
        }
      }
    }
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

  _setDb(event){
    this.db = event.target.result;
    this.db.onerror = () => {
      console.warn("Database error: " + event.target.errorCode);
    }
  }

  setMobileVisibility(){
    this.showOnMobile = !this.showOnMobile;
    if ( this.db ){
      let tx = this.db.transaction(this.dbStoreName, 'readwrite').objectStore(this.dbStoreName);
      tx.put({name: 'showOnMobile', value: this.showOnMobile});
    }
  }

  _onVisibilityKeyUp(e){
    if (e.key === 'Enter' || e.keyCode === 13) {
      this.setMobileVisibility();
    }
  }

  _onVisibilityClick(){
    this.setMobileVisibility();
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