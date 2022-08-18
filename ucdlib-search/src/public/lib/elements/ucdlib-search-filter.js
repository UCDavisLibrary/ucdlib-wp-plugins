import { LitElement } from 'lit';
import {render, styles} from "./ucdlib-search-filter.tpl.js";

export default class UcdlibSearchFilter extends LitElement {

  static get properties() {
    return {
      filterVar: {type: String, attribute: 'filter-var'},
      filters: {type: Array},
      sortVar: {type: String, attribute: 'sort-var'},
      sortOptions: {type: Array},
      url: {type: String},
      authors: {type: String},
      keyword: {type: String},
      keyKeyword: {type: String},
      keyFilters: {type: String},
      keySort: {type: String},
      db: {state: true},
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
    this.filterVar = 'window.typeFacets';
    this.sortVar = 'window.sortOptions';
    this.filters = [];
    this.sortOptions = [];
    this._checkIdPrefix = 'check-';
    this.url = "/";
    this.keyword = "";
    this.keyKeyword = "s";
    this.authors = '';
    this.keyAuthors = 'authors';
    this.keyFilters = "type";
    this.keySort = 'sortby';
    this.showOnMobile = false;
    this.dbName = 'UCDLibSearchFilters';
    this.dbStoreName = 'props';
    this.dbVersion = 1;
    this.db = false;
  }

  willUpdate(props){
    if ( props.has('filterVar') && this.filterVar ){
      let filters = eval(this.filterVar);
      if ( Array.isArray( filters )){
        filters.sort(this._sortByLabel);
        this.filters = filters;
      }
    }

    if ( props.has('sortVar') && this.sortVar ){
      let sortOptions = eval(this.sortVar);
      if ( Array.isArray( sortOptions )){
        sortOptions.sort(this._sortByLabel);
        this.sortOptions = sortOptions;
      }
    }
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

  _setDb(event){
    this.db = event.target.result;
    this.db.onerror = () => {
      console.warn("Database error: " + event.target.errorCode);
    }
  }

  _sortByLabel(a,b,){
    const nameA = a.label.toUpperCase();
    const nameB = b.label.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }

  toggleFilter(filterId){
    if ( !filterId ) return;
    this.filters.forEach(f => {
      if ( f.urlArg === filterId ) {
        f.isSelected = !f.isSelected;
      }
    });
    this.apply();
  }

  _onFilterInput(e){
    const filterId = e.target.id.slice(this._checkIdPrefix.length);
    this.toggleFilter(filterId);
  }

  _onFilterKeyUp(e){
    if (e.key === 'Enter' || e.keyCode === 13) {
      const filterId = e.target.id.slice(this._checkIdPrefix.length);
      this.toggleFilter(filterId);
    }
  }

  _onSortInput(e){
    const v = e.target.value;
    this.sortOptions.forEach(option => {
      option.isSelected = option.urlArg === v;
    })
    this.apply();
  }

  _onSubmit(e){
    e.preventDefault();
    e.stopPropagation();
    this.apply();
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

  apply(){
    const params = new URLSearchParams();
    params.append(this.keyKeyword, this.keyword);
    if ( this.authors ) {
      params.append(this.keyAuthors, this.authors);
    }
    let appliedFilters = this.filters.filter(f => f.isSelected).map(f => f.urlArg).join(",");
    if ( appliedFilters ) {
      params.append(this.keyFilters, appliedFilters);
    }
    let appliedSort = this.sortOptions.filter(f => f.isSelected);
    if ( appliedSort.length && !appliedSort[0].default ){
      params.append(this.keySort, appliedSort[0].urlArg);
    }
    window.location = this.url + '?' + params.toString();
  }

}

customElements.define('ucdlib-search-filter', UcdlibSearchFilter);