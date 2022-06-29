import { LitElement} from 'lit';
import {render, styles} from "./special.tpl.js";
import {ApiController} from '../utils/controller.js';

/**
 * @class SpecialCollection
 * @description This component allows you to easily add individual objects from
 * the UC SILS catalog into your webpage.
 * @property {String} almakey - Pointer to the permalink
 *
 * <special-collection almakey="D-123"/></special-collection>
 */

export default class SpecialCollection extends LitElement {
  static get properties() {
    return {
      results : {type: Object, attribute:false},
      almakey : {type: String},
    };
  }

  static get styles() {
    return styles();
  }

  constructor() {
    super();
    this.PENDING = false;
    this.LOADING = false;
    this.COMPLETE = false;
    this.ERROR = false;
    this.results = {};
    this.loading = false;
    this.url = "wp-json/ucdlib-special/collection_pnx/"

    this.errorMessage = 'Href is not a api endpoint.';
    this.render=render.bind(this);
    console.log("here");


  }
  
    /**
   * @method firstUpdated
   * 
   * @description updated when the page first renders
   * 
   * @param {Object} changedProperties 
   * 
   */  
  firstUpdated(changedProperties){
    if(this.almakey != ''){
       this.perma = await new ApiController(this, this._requestUrl());
       console.log("Perma:", this.perma);

       this.requestUpdate();
    }
  }


  _onPending(){
    this.PENDING = true;
  }
 

  _onError(e){
    this.ERROR = true;
    console.log("Error:", e);
  }


  _onComplete(results){

    /* Note:
    ISBN has multiple options so later address which items to pick and whether
    to use default thumbnail
    */ 

    this.COMPLETE = true;
    this.PENDING = false;
    this.LOADING = false;

    /* Add configuration here */
    
    console.log(results);
    /* Bubble up the results variable to wordpress block component */
    const options = {
        detail: {results},
        bubbles: true,
        composed: true,
      };
    this.dispatchEvent(new CustomEvent('postResults', options));
    this.results = results;
   

  }

  validationLink(url){
    return url;
  }


  _requestUrl(){
    let url = this.url + String(this.almakey);
    let validate = this.validationLink(url);
    this.requestUpdate();
    
    return validate;
  }

  _onLoading(){
    this.LOADING = true;
  }


}

customElements.define('special-collection',SpecialCollection);
