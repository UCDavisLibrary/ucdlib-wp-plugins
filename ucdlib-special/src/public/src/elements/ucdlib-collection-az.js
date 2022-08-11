import { LitElement } from 'lit';
import {render, styles} from "./ucdlib-collection-az.tpl.js";

export default class UcdlibCollectionAZ extends LitElement {

  static get properties() {
    return {
        url: {type: String},
        keySort: {type: String},
        noResult: {type: String},
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
    this.alpha = [
        {display: 'A', value: 'a', exists: true},
        {display: 'B', value: 'b', exists: true},
        {display: 'C', value: 'c', exists: true},
        {display: 'D', value: 'd', exists: true},
        {display: 'E', value: 'e', exists: true},
        {display: 'F', value: 'f', exists: true},
        {display: 'G', value: 'g', exists: true},
        {display: 'H', value: 'h', exists: true},
        {display: 'I', value: 'i', exists: true},
        {display: 'J', value: 'j', exists: true},
        {display: 'K', value: 'k', exists: true},
        {display: 'L', value: 'l', exists: true},
        {display: 'M', value: 'm', exists: true},
        {display: 'N', value: 'n', exists: true},
        {display: 'O', value: 'o', exists: true},
        {display: 'P', value: 'p', exists: true},
        {display: 'Q', value: 'q', exists: true},
        {display: 'R', value: 'r', exists: true},
        {display: 'S', value: 's', exists: true},
        {display: 'T', value: 't', exists: true},
        {display: 'U', value: 'u', exists: true},
        {display: 'V', value: 'v', exists: true},
        {display: 'W', value: 'w', exists: true},
        {display: 'X', value: 'x', exists: true},
        {display: 'Y', value: 'y', exists: true},
        {display: 'Z', value: 'z', exists: true}

    ];
    this.keySort = 'collection-az';
    this.defaultSort = 'a';
    this.sort = this.defaultSort;
    
    this.parseLocation();

  }

  firstUpdated(changedProperties){
    this.checksExist();
    this.requestUpdate();
  }

  
  checksExist(){
    let emptyArray = this.noResult.split(",");
    for(let x of emptyArray) {
      this.alpha.find(o => o.value === x)["exists"] = false;
    }  
  }

  parseLocation() {
    this.url = window.location.origin + window.location.pathname;
    this.urlParams = new URLSearchParams(window.location.search);
    this.sort = this.urlParams.get(this.keySort) || this.defaultSort;
    this.url = this.url + "?collection-tax=az&"
  }
  
  onAlphaInput(v) {
    this.sort = v;
    this.updateUrlParams(this.defaultSort, this.keySort, v);
    this.updateLocation();
  }



  updateLocation(){
    let queryString = this.urlParams.toString();
    if ( queryString ) {
      window.location = this.url + this.urlParams.toString();
    } else {
      window.location = this.url;
    }
  }

  updateUrlParams(defaultValue, key, value){
    if ( value != defaultValue ){
      this.urlParams.set(key, value);
    }
    else if ( value == defaultValue && this.urlParams.get(key)) {
      this.urlParams.delete(key);
    }
  }

}

customElements.define('ucdlib-collection-az', UcdlibCollectionAZ);