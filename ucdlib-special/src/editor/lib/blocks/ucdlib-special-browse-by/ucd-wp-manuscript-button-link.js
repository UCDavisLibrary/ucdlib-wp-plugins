import { LitElement } from 'lit';
import {render, styles} from "./ucd-wp-manuscript-button-link.tpl.js";
import { MainComponentElement, Mixin } from "@ucd-lib/brand-theme-editor/lib/utils";
// import "../../block-components/ucd-wp-inline-input/ucd-wp-inline-input";

export default class UcdWpManuscriptButtonLink extends Mixin(LitElement)
.with(MainComponentElement) {

  static get properties() {
    return {
      text: {type: String},
      altStyle: {type: String, attribute: 'alt-style'}
    };
  }

  static get styles() {
    return styles();
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.text = "";
    this.altStyle = "alt3";
  }

  _getClasses(){
    let base = "btn";
    let classes = {};
    classes[base] = true;
  
    classes[`${base}--alt3`] = !this.altStyle;
    classes[`${base}--${this.altStyle}`] = this.altStyle;

    return classes;
  }

  // updated(props){
  // }

  // willUpdate() {
  // }

}

customElements.define('ucd-wp-manuscript-button-link', UcdWpManuscriptButtonLink);