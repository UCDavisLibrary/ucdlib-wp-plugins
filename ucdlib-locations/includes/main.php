<?php
require_once( __DIR__ . '/post-types.php' );
require_once( __DIR__ . '/acf.php' );
require_once( __DIR__ . '/api.php' );
require_once( __DIR__ . '/timber.php' );

class UCDLibPluginLocations {
  public function __construct(){
    $this->slug = "ucdlib-locations";

    $config = array(
      'slug' => $this->slug,
      'postTypeSlug' => 'location'
    );

    $config['api_credentials'] = $this->get_third_party_api_credentials($config['postTypeSlug']);

    // register 'location' post type
    $this->postTypes = new UCDLibPluginLocationsPostTypes($config);

    // register settings menu and other ACF functionality
    $this->acf = new UCDLibPluginLocationsACF($config);

    // register our API endpoints at /wp-json/ucdlib-locations
    $this->api = new UCDLibPluginLocationsAPI($config);

    // register location views and custom Timber class
    $this->timber = new UCDLibPluginLocationsTimber($config);

  }

  // Retrieves third-party api credentials entered by an admin in an ACF menu
  public function get_third_party_api_credentials( $menu_slug ){
    $out = array();

    return $out;
  }

}