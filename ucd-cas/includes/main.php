<?php
require_once( __DIR__ . '/meta-data.php' );
require_once( __DIR__ . '/menu.php' );

class UCDPluginCAS {
  public function __construct(){
    $this->slug = "ucd-cas";
    $this->metaData = new UCDPluginCASMetaData();
    $this->menu = new UCDPluginCASMenu($this->slug);
    add_filter( 'timber/locations', array($this, 'add_timber_locations') );
  }

  /**
   * Adds twig files under the @ucd-cas namespace
   */
  public function add_timber_locations($paths){
    $paths[$this->slug] = array(WP_PLUGIN_DIR . "/" . $this->slug . '/views');
    return $paths;
  }
}