import "@ucd-lib/brand-theme";
import './lib/editoria11y-shims.js';

class DynamicScriptLoader {
  
  constructor() {
    this.loaded = {};
    this.registration = [
      {
        name: 'locations',
        cssQuery: [
          'ucdlib-hours', 
          'ucdlib-hours-today', 
          'ucdlib-hours-today-simple', 
          'ucdlib-hours-today-sign', 
          'ucdlib-map-building',
          'ucdlib-map-space-legend'
        ]
      },
      {
        name: 'search',
        cssQuery: ['ucdlib-search-filter', 'ucdlib-search-input', 'ucdlib-search-filter-authors']
      },
      {
        name: 'directory',
        cssQuery: ['ucdlib-directory-filters', 'ucdlib-directory-sort', 'ucdlib-directory-service-filters', 'ucdlib-directory-research-highlights']
      },
      {
        name: 'special',
        cssQuery: [
          'ucdlib-special-exhibit-online-sort', 
          'ucdlib-special-exhibit-past-filters', 
          'ucdlib-collection-az',
          'ucdlib-collection-filter'
        ]
      }
    ];
  }

  get isWpAdmin(){
    try {
      if ( window?.location?.pathname?.includes('/wp-admin/') ) return true;
      if ( window?.parent?.location?.pathname?.includes('/wp-admin/') ) return true;
    } catch(e) {
      // cross-origin, assume not admin
    }
    return false;
  }
    
    
  async load() {
    // If we're in the WP Admin, go ahead and just load all bundles since we don't know which blocks will be used
    if ( this.isWpAdmin ){
      this.registration.forEach(bundle => this.loadWidgetBundle(bundle.name));
      return;
    }

    for( let bundle of this.registration ) {
      if( bundle.cssQuery ) {
        if ( !Array.isArray(bundle.cssQuery) ){
          bundle.cssQuery = [bundle.cssQuery];
        }
        for (const q of bundle.cssQuery) {
          if ( document.querySelector(q) ){
            this.loadWidgetBundle(bundle.name);
          }
        }
      }
    }
  }
  
  loadWidgetBundle(bundleName) {
    if( typeof bundleName !== 'string' ) return;
    if( this.loaded[bundleName] ) return this.loaded[bundleName];

    if ( bundleName == 'locations' ){
      this.loaded[bundleName] = import(/* webpackChunkName: "locations" */ '@ucd-lib/plugin-locations-public');
    } else if ( bundleName == 'search' ) {
      this.loaded[bundleName] = import(/* webpackChunkName: "search" */ '@ucd-lib/plugin-search-public');
    } else if ( bundleName == 'directory' ) {
      this.loaded[bundleName] = import(/* webpackChunkName: "directory" */ '@ucd-lib/plugin-directory-public');
    } else if ( bundleName == 'special' ) {
      this.loaded[bundleName] = import(/* webpackChunkName: "special" */ '@ucd-lib/plugin-special-public');
    }
    
    return this.loaded[bundleName]
  }
  
}
    
let loaderInstance = new DynamicScriptLoader();
if( document.readyState === 'complete' ) {
  loaderInstance.load();
} else {
  window.addEventListener('load', () => {
    loaderInstance.load();
  });
}