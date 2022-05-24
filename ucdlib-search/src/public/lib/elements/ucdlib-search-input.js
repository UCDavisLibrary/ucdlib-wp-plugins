import { LitElement } from 'lit';
import {render, styles} from "./ucdlib-search-input.tpl.js";

export default class UcdlibSearchInput extends LitElement {

  static get properties() {
    return {
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

    this.keyword = "";
    this.url = "/";
    this.keyKeyword = "s";
    this.keyFilters = "type";

    this.locationParams = new URLSearchParams(window.location.search);
  }

  _onSearch(e){
    const params = new URLSearchParams();
    params.append(this.keyKeyword, e.detail.searchTerm);
    if ( this.locationParams.has(this.keyFilters)  ){
      params.append(this.keyFilters, this.locationParams.get(this.keyFilters));
    }
    window.location = this.url + '?' + params.toString();
  }

}

customElements.define('ucdlib-search-input', UcdlibSearchInput);