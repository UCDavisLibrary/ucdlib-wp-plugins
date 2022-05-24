import { LitElement } from 'lit';
import {render, styles} from "./ucdlib-search-filter.tpl.js";

export default class UcdlibSearchFilter extends LitElement {

  static get properties() {
    return {
      filterVar: {type: String, attribute: 'filter-var'},
      filters: {type: Array},
      url: {type: String},
      keyword: {type: String},
      keyKeyword: {type: String},
      keyFilters: {type: String}
    }
  }

  static get styles() {
    return styles();
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.filterVar = 'window.typeFacets';
    this.filters = [];
    this._checkIdPrefix = 'check-';
    this.url = "/";
    this.keyword = "";
    this.keyKeyword = "s";
    this.keyFilters = "type";
  }

  willUpdate(props){
    if ( props.has('filterVar') && this.filterVar ){
      let filters = eval(this.filterVar);
      if ( Array.isArray( filters )){
        filters.sort((a,b) => {
          const nameA = a.label.toUpperCase();
          const nameB = b.label.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        this.filters = filters;
      }
    }
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
    window.location = this.url + '?' + params.toString();
  }

}

customElements.define('ucdlib-search-filter', UcdlibSearchFilter);