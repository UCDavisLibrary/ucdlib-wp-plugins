<?php
require_once( __DIR__ . '/post-types.php' );
require_once( __DIR__ . '/acf.php' );
require_once( __DIR__ . '/api.php' );

class UCDLibPluginLocations {
  public function __construct(){
    $this->slug = "ucdlib-locations";

    $config = array(
      'slug' => $this->slug,
      'postTypeSlug' => 'location'
    );

    $this->postTypes = new UCDLibPluginLocationsPostTypes($config);
    $this->acf = new UCDLibPluginLocationsACF($config);
    $this->api = new UCDLibPluginLocationsAPI($config);

    //add_filter( 'timber/locations', array($this, 'add_timber_locations') );
  }

  /**
   * Adds twig files under the @ucdlib-locations namespace
   */
  public function add_timber_locations($paths){
    $paths[$this->slug] = array(WP_PLUGIN_DIR . "/" . $this->slug . '/views');
    return $paths;
  }

}