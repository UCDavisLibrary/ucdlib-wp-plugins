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
      keyword: {type: String},
      keyKeyword: {type: String},
      keyFilters: {type: String},
      keySort: {type: String}
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
    this.keyFilters = "type";
    this.keySort = 'sortby';
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

  apply(){
    const params = new URLSearchParams();
    params.append(this.keyKeyword, this.keyword);
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