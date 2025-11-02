import { LitElement } from 'lit';
import { render, styles } from './ucdlib-directory-research-highlights.tpl.js';

/* 
  @classdesc Element to display research highlights for a 
  directory profile 
*/
export default class UcdlibDirectoryResearchHighlights extends LitElement {
  static get properties() {
    return {
      expertId: { type: String, attribute: 'expert-id' },
      res: { type: Array },
      dataLazy: { type: Boolean, attribute: 'data-lazy', reflect: true }
    };
  }

  static get styles() { return styles(); }

  constructor() {
    super();
    this.render = render.bind(this);
    this.res = [];
    this._loadedOnce = false;
  }

  /*
    * @description LitElement lifecycle called when element is added to DOM
    * @returns {void}
  */
  connectedCallback() {
    super.connectedCallback();
    if (this.hasAttribute('data-lazy')) {
      this.observeVisibility();
    } 
  }

  /*
    * @description Fetch research highlights data from API
    * @returns {void}
  */
  async fetchHighlights() {
    if (this._loadedOnce) return;  
    if (!this.expertId) return;

    this._loadedOnce = true;

    try {
      const response = await fetch(
        `/wp-json/ucdlib-directory/research-highlights/${encodeURIComponent(this.expertId)}`
      );

      if (response.ok) {
        const data = await response.json();
        this.res = this.formatResults(data);
      } else {
        console.warn('Error fetching research highlights:', response.statusText);
      }
    } catch (error) {
      console.warn('Error fetching research highlights:', error);
      this._loadedOnce = false; 
    }
  }

  /*
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

  /*
    * @description Format raw data from API into display-friendly format
    * @param {Array} data - Raw research highlights data from API
    * @returns {Array} Formatted research highlights
  */
  formatResults(data) {
    if (!data) return [];
    return data.map(item => ({
      id: item.id || '',
      title: item.title || '(untitled)',
      url: item.url || '',
      status: item.status || '',
      publication: item['publication'] || item['container-title'] || '',
      volume: item.volume || '',
      page: item.page || '',
      type: this.formatType(item.type),
      issuedDate: this.formatDate(item.issuedDate ? item.issuedDate : ''),
      author: this.formatAuthors(item.author),
      abstract: item.abstract || ''
    }));
  }

  /*
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

  /*
    * @description Helper to format date string into year
    * @param {String} dateStr - Raw date string from API
    * @returns {String} Formatted date string
  */
  formatDate(dateStr) {
    if (!dateStr) return '';
    return dateStr.split('-')[0] + ' • ';
  }

  /*
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
