import { LitElement } from 'lit';
import {render, styles} from "./ucdlib-search-filter.tpl.js";

export default class UcdlibSearchFilter extends LitElement {

  static get properties() {
    return {
      filterVar: {type: String, attribute: 'filter-var'},
      filters: {type: Array}
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

  _onFilterChange(e){
    const filterId = e.target.id.slice(this._checkIdPrefix.length);
    this.filters.forEach(f => {
      if ( f.urlArg === filterId ) {
        f.isSelected = !f.isSelected;
      }
    });
    this.apply();
  }

  _onSubmit(e){
    e.preventDefault();
    e.stopPropagation();
    this.apply();
  }

  apply(){
    console.log(this.filters);
  }

}

customElements.define('ucdlib-search-filter', UcdlibSearchFilter);