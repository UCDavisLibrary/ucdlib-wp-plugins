import { LitElement } from 'lit';
import {render, styles} from "./ucdlib-collection-az.tpl.js";

export default class UcdlibCollectionAZ extends LitElement {

  static get properties() {
    return {
        urlParams: {state: true},
        url: {type: String},
        keySort: {type: String},
    }
  }

  static get styles() {
    return styles();
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.alpha = [
        {display: 'A', value: 'a'},
        {display: 'B', value: 'b'},
        {display: 'C', value: 'c'},
        {display: 'D', value: 'd'},
        {display: 'E', value: 'e'},
        {display: 'F', value: 'f'},
        {display: 'G', value: 'g'},
        {display: 'H', value: 'h'},
        {display: 'I', value: 'i'},
        {display: 'J', value: 'j'},
        {display: 'K', value: 'k'},
        {display: 'L', value: 'l'},
        {display: 'M', value: 'm'},
        {display: 'N', value: 'n'},
        {display: 'O', value: 'o'},
        {display: 'P', value: 'p'},
        {display: 'Q', value: 'q'},
        {display: 'R', value: 'r'},
        {display: 'S', value: 's'},
        {display: 'T', value: 't'},
        {display: 'U', value: 'u'},
        {display: 'V', value: 'v'},
        {display: 'W', value: 'w'},
        {display: 'X', value: 'x'},
        {display: 'Y', value: 'y'},
        {display: 'Z', value: 'z'}

    ];

  }

  onFilter(v, e) {
    console.log("E:",e);

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

customElements.define('ucdlib-collection-az', UcdlibCollectionAZ);