import { LitElement } from 'lit';
import {render, styles} from "./ucdlib-directory-filters.tpl.js";

export default class UcdlibDirectoryFilters extends LitElement {

  static get properties() {
    return {
      widgetTitle: {type: String, attribute: 'widget-title'},
      keyKeyword: {type: String},
      keyOrderby: {type: String},
      url: {state: true},
      db: {state: true},
      keyword: {state: true},
      orderby: {state: true},
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

    // input state
    this.keyword = '';
    this.orderby = '';

    // for remembering visibility on mobile
    this.showOnMobile = false;
    this.dbName = 'UCDLibSearchFilters';
    this.dbStoreName = 'props';
    this.dbVersion = 1;
    this.db = false;
  }

  willUpdate(props){
    let urlArgs = ['keyKeyword', 'keyOrderby'];
    urlArgs = urlArgs.map(a => props.has(a) && this[a]).filter(v => v);
    if ( urlArgs.length ) this.parseLocation();
  }

  connectedCallback() {
    super.connectedCallback();

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

    //console.log(this.url + '?' + params.toString());
    window.location = this.url + '?' + params.toString();
  }

}

customElements.define('ucdlib-directory-filters', UcdlibDirectoryFilters);