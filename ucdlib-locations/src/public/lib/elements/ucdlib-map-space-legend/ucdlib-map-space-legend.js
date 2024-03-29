import { LitElement } from 'lit';
import {render, styles} from "./ucdlib-map-space-legend.tpl.js";
import {MutationObserverController} from "@ucd-lib/theme-elements/utils/controllers";

export default class UcdlibMapSpaceLegend extends LitElement {

  static get properties() {
    return {
      propsSetFromScript: {state: true},
      spaces: {state: true},
      legendTitle: {state: true},
      toggleState: {state: true},
      switchLoadCount: {state: true}
    }
  }

  static get styles() {
    return styles();
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.propsSetFromScript = false;
    this.spaces = [];
    this.legendTitle = '';
    this.toggleState = {};
    this.switchLoadCount = 0;

    new MutationObserverController(this, {childList: true, subtree: false});
  }

  willUpdate(props) {
    if ( props.has('spaces') && this.spaces ) {
      this.dispatchEvent(new CustomEvent('spaces-update', {bubbles: true, composed: true, detail: {spaces: this.spaces}}));
      const toggleState = {};
      this.spaces.forEach(space => {
        toggleState[space.slug] = true;
      });
      this.toggleState = toggleState;
    }
  }

  /**
   * @description Enable the switches for the given slugs - disable all others
   * @param {Array} slugs - array of slugs to enable
   */
  enableSwitches(slugs=[]){
    this.spaces.forEach(space => {
      if ( slugs.includes(space.slug) ) {
        space.disabled = false;
      } else {
        space.disabled = true;
      }
    });
    this.requestUpdate();
  }


  /**
   * @description When the child list mutates, check if there is a script tag
   * and if so, parse the json and set element properties
   */
  _onChildListMutation(){
    const script = this.querySelector('script[type="application/json"]');
    if ( script && !this.propsSetFromScript ) {
      const data = JSON.parse(script.text);
      if ( Array.isArray(data.spaces) ) {
        this.spaces = data.spaces.map(space => {
          space.disabled = true;
          return space;
        });
      }
      if ( data.title ) this.legendTitle = data.title;
      this.propsSetFromScript = true;
    }
  }

  /**
   * @description When a space is toggled, update the toggle state and dispatch event with state for all toggled spaces
   * @param {*} e 
   */
  _onSpaceToggle(e) {
    this.toggleState[e.detail.slug] = e.detail.checked;
    const updated = [e.detail.slug];
    this.dispatchEvent(new CustomEvent('spaces-toggle', {bubbles: true, composed: true, detail: {spaces: this.toggleState, updated}}));
  }

  _onSwitchLoad(){
    this.switchLoadCount += 1;
    if ( this.switchLoadCount >= this.spaces.length ) {
      this.dispatchEvent(new CustomEvent('switches-loaded', {bubbles: true, composed: true}));
    }
  }

}

customElements.define('ucdlib-map-space-legend', UcdlibMapSpaceLegend);