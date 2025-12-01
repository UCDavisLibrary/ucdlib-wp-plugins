import { LitElement } from 'lit';
import { render } from './ucdlib-directory-research-highlights.tpl.js';
import { Mixin } from '@ucd-lib/cork-app-utils';
import { MainDomElement } from "@ucd-lib/theme-elements/utils/mixins/main-dom-element.js";

/**  
  @classdesc Element to display research highlights for a 
  directory profile 
*/
export default class UcdlibDirectoryResearchHighlights extends Mixin(LitElement) 
  .with(MainDomElement) {
  static get properties() {
    return {
      expertId: { type: String, attribute: 'expert-id' },
      res: { type: Array },
      dataLazy: { type: Boolean, attribute: 'data-lazy', reflect: true },
      loading: { type: Boolean, state: true },
      error: { type: String, state: true }
    };
  }
   
  constructor() {
    super();
    this.render = render.bind(this);
    this.res = [];
    this.loading = false;
    this.error = '';
    this._loadedOnce = false;
  }


  /**  
    * @description LitElement lifecycle called when element is added to DOM
    * @returns {void}
  */
  connectedCallback() {
    super.connectedCallback();
    if (this.hasAttribute('data-lazy')) {
      this.observeVisibility();
    } 
  }

  /**  
    * @description Fetch research highlights data from API
    * @returns {void}
  */
  async fetchHighlights() {
    if (this._loadedOnce) return;  
    if (!this.expertId) return;

    this._loadedOnce = true;
    this.loading = true;
    this.error = '';
    this.res = [];

    try {
      const url = `https://experts.ucdavis.edu/api/expert/${this.expertId}`;

      const body = {
        "is-visible": true,
        "expert": { "include": false },
        "grants": { "include": false },
        "works": {
          "include": true,
          "page": 1,
          "size": 3,
          "includeMisformatted": false,
          "favouriteWorksFirst": true
        }
      };
      const response = await fetch(url, {
        method: 'POST', // POST is used only to send filter data — not to add/modify anything
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const raw = await response.text();
        const data = JSON.parse(raw); 
        this.res = this.formatResults(data);
      } else {
        if (response.status === 404) {
          this.error = `Expert ${this.expertId} not found (404).`;
        } else if (response.status === 500) {
          this.error = `Server error while fetching expert ${this.expertId}.`;
        } else {
          this.error = `Failed with status ${response.status}: ${response.statusText}`;
        }
        console.warn(this.error);
      }

    } catch (error) {
      this.error = 'Error while fetching results for Research Highlights.';
      this._loadedOnce = false; 
      console.warn(this.error);
    } finally {
      this.loading = false;
    }

    this.requestUpdate();
  }

  /**  
    * @description Set up IntersectionObserver to lazy load data when element is visible
    * @returns {void}
  */
  observeVisibility() {
    // Fallback for browsers that do not support IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      console.warn('IntersectionObserver not supported, loading research highlights immediately');
      this.fetchHighlights();
      return;
    }

    // Set up IntersectionObserver to load data when element is visible
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          observer.unobserve(this);
          this.fetchHighlights();
        }
      });
    }, { threshold: 0.25 });

    observer.observe(this);
}

  /**  
    * @description Format raw data from API into display-friendly format
    * @param {Array} data - Raw research highlights data from API
    * @returns {Array} Formatted research highlights
  */
  formatResults(data) {
    if (!data) return [];

    let resp = data;

    // assumes resp is a JS object (from JSON.parse)
    const graphUnfiltered = Array.isArray(resp?.['@graph'])
      ? resp['@graph']
      : (Array.isArray(resp?.['@graph']) ? resp['@graph'] : (resp?.['@graph'] || []));

    // Filter: keep only items whose @type includes "Work"
    const graph = (graphUnfiltered || []).filter(item => {
      const types = Array.isArray(item?.['@type']) ? item['@type'] : [item?.['@type']];
      return types.some(t => typeof t === 'string' && t.toLowerCase() === 'work');
    });

    const out = (graph || []).map(i => ({
      id: i?.['@id'] || '',
      title: i?.title || '(untitled)',
      url: i?.url || `https://experts.ucdavis.edu/work/${i?.['@id']}`,
      status: i?.status || '',
      publication: i?.hasPublicationVenue?.name || i?.publication || i?.['container-title'] || '',
      volume: i?.volume || '',
      page: i?.page || '',
      type: this.formatType(i?.type),
      issuedDate: this.formatDate(i?.issued || i?.issuedDate || ''),
      author: i?.author ? this.formatAuthors(i?.author): '',
      abstract: i?.abstract || ''
    }));

    return out;
  }

  /**
    * @description Helper to format type into human-readable string
    * @param {String} type - Raw type string from API
    * @returns {String} Formatted type string
  */
  formatType(type) {
    let readableType = type;
    switch (type) {
      case 'article-journal': readableType = 'Journal Article'; break;
      case 'paper-conference': readableType = 'Conference Paper'; break;
      case 'article-magazine': readableType = 'Magazine Article'; break;
      case 'article-newspaper': readableType = 'Newspaper Article'; break;
      case 'entry-dictionary': readableType = 'Dictionary Entry'; break;
      case 'entry-encyclopedia': readableType = 'Encyclopedia Entry'; break;
      case 'post-weblog': readableType = 'Weblog Post'; break;
      case 'review-book': readableType = 'Book Review'; break;
      case 'motion_picture': readableType = 'Motion Picture'; break;
      case 'musical_score': readableType = 'Musical Score'; break;
      default: break;
    }
    return (readableType || '') + (readableType ? ' • ' : '');
  }

  /**
    * @description Helper to format date string into year
    * @param {String} dateStr - Raw date string from API
    * @returns {String} Formatted date string
  */
  formatDate(dateStr) {
    if (!dateStr || dateStr == '') return '';
    return dateStr.split('-')[0] + ' • ';
  }

  /**
    * @description Helper to format authors array into string
    * @param {Array|Object} authors - Raw authors data from API
    * @returns {String} Formatted authors string
  */
  formatAuthors(authors) {
    if (!authors) return '';
    if (!Array.isArray(authors)) authors = [authors];

    const formatted = authors.map(author => {
      const last = author?.family || '';
      const given = author?.given || '';
      const parts = given.split(' ').filter(Boolean);
      const first = parts[0]?.charAt(0) || '';
      const middle = parts[1]?.charAt(0) || '';
      return `${last}, ${first}.${middle ? ` ${middle}.` : '.'} `;
    });

    return formatted.join(', ');
  }
}

customElements.define('ucdlib-directory-research-highlights', UcdlibDirectoryResearchHighlights);
