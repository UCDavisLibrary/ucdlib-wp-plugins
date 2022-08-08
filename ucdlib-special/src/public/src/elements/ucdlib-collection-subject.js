import { LitElement } from 'lit';
import {render, styles} from "./ucdlib-collection-subject.tpl.js";

export default class UcdlibCollectionSubject extends LitElement {

  static get properties() {
    return {

    }
  }

  static get styles() {
    return styles();
  }

  constructor() {
    super();
    this.render = render.bind(this);
    
    this.keySort = 'orderby';
    this.sort = this.defaultSort;

  }


}

customElements.define('ucdlib-collection-subject', UcdlibCollectionSubject);