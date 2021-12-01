<?php
require_once( __DIR__ . '/meta-data.php' );
require_once( __DIR__ . '/menu.php' );

class UCDPluginCAS {
  public function __construct(){
    $this->metaData = new UCDPluginCASMetaData();
    $this->menu = new UCDPluginCASMenu();
    add_filter( 'timber/locations', array($this, 'add_timber_locations') );
  }

  /**
   * Adds twig files under the @ucd-cas namespace
   */
  public function add_timber_locations($paths){
    $paths['ucd-cas'] = array(WP_PLUGIN_DIR . '/ucd-cas/views');
    return $paths;
  }
}