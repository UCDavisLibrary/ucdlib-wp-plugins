import { LitElement } from 'lit';
import {render, styles} from "./ucdlib-search-filter-authors.tpl.js";

export default class UcdlibSearchFilterAuthors extends LitElement {

  static get properties() {
    return {
      url: {type: String},
      keyKeyword: {type: String},
      keyFilters: {type: String},
      keyAuthors: {type: String},
      keySort: {type: String},
      apiUrl: {state: true},
      authors: {state: true}
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
    this.keySort = 'sortby';
    this.keyAuthors = 'authors';
    this.apiUrl = '/wp-json/ucdlib-directory/person';

    this.locationParams = new URLSearchParams(window.location.search);
    this.setAuthors();

  }

  async setAuthors(){
    this.authors = [];
    const authors = [];
    const authorsQuery = this.locationParams.get(this.keyAuthors);
    if ( !authorsQuery ) return;

    for (let email of authorsQuery.split(',')) {
      const data = {query: email};
      if ( !email.includes('@') ) email += '@ucdavis.edu';
      try {
        const response = await fetch(`${this.apiUrl}/${email}`);
        if ( response.ok ) {
          const person = await response.json();
          data.person = person;
        }
      } catch (error) {
        console.warn(`could not retrieve ${email}`);
      }
      authors.push(data);
      
    }

    this.authors = authors;
  }

  _onRemove(author){
    const params = new URLSearchParams();
    const authors = this.authors.filter(a => a.query != author).map(a => a.query);
    if ( authors.length ){
      params.set(this.keyAuthors, authors.join(','));
    }
    if ( this.locationParams.has(this.keyFilters)  ){
      params.append(this.keyFilters, this.locationParams.get(this.keyFilters));
    }
    if ( this.locationParams.has(this.keySort)  ){
      params.append(this.keySort, this.locationParams.get(this.keySort));
    }
    if ( this.locationParams.has(this.keyKeyword)  ){
      params.append(this.keyKeyword, this.locationParams.get(this.keyKeyword));
    }
    window.location = this.url + '?' + params.toString();
  }

}

customElements.define('ucdlib-search-filter-authors', UcdlibSearchFilterAuthors);