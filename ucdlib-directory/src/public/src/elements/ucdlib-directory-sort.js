import { LitElement } from 'lit';
import {render, styles} from "./ucdlib-directory-sort.tpl.js";

export default class UcdlibDirectorySort extends LitElement {

  static get properties() {
    return {
      keySort: {type: String},
      sort: {state: true},
      urlParams: {state: true}
    }
  }

  static get styles() {
    return styles();
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.default = 'department';
    this.keySort = 'orderby';
    this.sort = this.default;
  }

  willUpdate(props){
    let urlArgs = ['keySort'];
    urlArgs = urlArgs.map(a => props.has(a) && this[a]).filter(v => v);
    if ( urlArgs.length ) this.parseLocation();
  }

  parseLocation() {
    this.url = window.location.origin + window.location.pathname;
    this.urlParams = new URLSearchParams(window.location.search);
    this.sort = this.urlParams.get(this.keySort) || this.default ;
  }
  
  onInput(v) {
    if ( v != this.default ){
      this.urlParams.set(this.keySort, v);
    }
    else if ( v == this.default && this.urlParams.get(this.keySort)) {
      this.urlParams.delete(this.keySort);
    }

    let queryString = this.urlParams.toString();
    if ( queryString ) {
      window.location = this.url + '?' + this.urlParams.toString();
    } else {
      window.location = this.url;
    }
  }

}

customElements.define('ucdlib-directory-sort', UcdlibDirectorySort);