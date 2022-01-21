<?php

require_once( __DIR__ . '/location.php' );

// Sets up all Timber-related functionality
class UCDLibPluginLocationsTimber {

  public function __construct( $config ){
    $this->config = $config;
    add_filter( 'timber/locations', array($this, 'add_timber_locations') );
    add_filter( 'timber/post/classmap', array($this, 'extend_post') );
  }

  /**
   * Adds twig files under the @ucdlib-locations namespace
   */
  public function add_timber_locations($paths){
    $paths[$this->config['slug']] = array(WP_PLUGIN_DIR . "/" . $this->config['slug'] . '/views');
    return $paths;
  }

  public function extend_post($classmap) {
    $custom_classmap = array(
      'location' => UCDLibPluginLocationsLocation::class,
    );

    return array_merge( $classmap, $custom_classmap );
  }

  
}