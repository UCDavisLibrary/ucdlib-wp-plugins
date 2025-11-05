import { LitElement } from 'lit';
import { render } from './ucdlib-directory-research-highlights.tpl.js';

/**  
  @classdesc Element to display research highlights for a 
  directory profile 
*/
export default class UcdlibDirectoryResearchHighlights extends LitElement {
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

  createRenderRoot() {
    return this;
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
      let url = 'https://experts.ucdavis.edu/api/expert/' + this.expertId;
      const response = await fetch(url, { headers: { Accept: 'application/json' }});

      if (response.ok) {
        const raw = await response.text();
        const data = JSON.parse(raw); 
        this.res = this.formatResults(data);
      } else {
        console.warn('Research highlight requested does not exist:', response.statusText);
      }
    } catch (error) {
      this.error = 'Network error while fetching research highlights. Please try again later.';
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

    // Filter: keep only "favourite" works
    let favourites = graph.filter(item => {
      if (!item || typeof item !== 'object') return false;

      // direct favourite
      if (item['ucdlib:favourite'] === true) return true;

      const related = item.relatedBy;
      if (!Array.isArray(related) && typeof related !== 'object') return false;

      // single object with ucdlib:favourite
      if (related && related['ucdlib:favourite'] === true) return true;

      // array of relations
      if (Array.isArray(related)) {
        for (const rel of related) {
          if (rel && rel['ucdlib:favourite'] === true) return true;
        }
      }

      return false;
    });

    // default to first 3 works if no favourites
    if (favourites.length === 0) {
      favourites = graph.slice(0, 3);
    } else {
      favourites = favourites.slice(0, 3);
    }

    const out = (favourites || []).map(i => ({
      id: i?.['@id'] || '',
      title: i?.title || '(untitled)',
      url: i?.url || '',
      status: i?.status || '',
      publication: i?.hasPublicationVenue?.name || i?.publication || i?.['container-title'] || '',
      volume: i?.volume || '',
      page: i?.page || '',
      type: this.formatType(i?.type),
      issuedDate: this.formatDate(i?.issued || i?.issuedDate || ''),
      author: this.formatAuthors(i?.author),
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
    if (!dateStr) return '';
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
