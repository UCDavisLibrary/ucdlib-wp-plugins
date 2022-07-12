<?php
require_once( __DIR__ . '/acf.php' );
require_once( __DIR__ . '/admin.php' );
require_once( __DIR__ . '/blocks.php' );
require_once( __DIR__ . '/collection.php' );
require_once( __DIR__ . '/config.php' );
require_once( __DIR__ . '/exhibit.php' );

// primary class for special collections plugin
// all actions and filters are applied here
class UCDLibPluginSpecial {
  public function __construct(){

    // config values. slugs and what not.
    $this->config = new UCDLibPluginSpecialConfig();

    // advanced custom fields config. handles plugin settings menu
    $this->acf = new UCDLibPluginSpecialACF( $this->config );

    // generic customizations to wordpress admin menu
    $this->admin = new UCDLibPluginSpecialAdmin( $this->config );

    // custom server-side "dynamic" blocks
    $this->blocks = new UCDLibPluginSpecialBlocks( $this->config );

    // 'special-collection' post type
    $this->collection = new UCDLibPluginSpecialCollections( $this->config );

    // 'exhibit' post type
    $this->collection = new UCDLibPluginSpecialExhibits( $this->config );

    add_filter( 'timber/locations', array($this, 'add_timber_locations') );

  }

  /**
   * Adds twig files under the @ucdlib-special namespace
   */
  public function add_timber_locations($paths){
    $paths[$this->config->slug] = array(WP_PLUGIN_DIR . "/" . $this->config->slug . '/views');
    return $paths;
  }

}